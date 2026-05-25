import { useState, useMemo, useCallback, useEffect } from "react";
import { sampleRecords, type ValidationRecord, type ValidationAttribute } from "@/data/hitl-validation-data";
import {
  buildSourceRefsForAttribute,
  resolveWorkflowIdsFromLabels,
} from "@/data/workflow-sources";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import QCSummaryCards from "./hitl/QCSummaryCards";
import ValidationQueueTable from "./hitl/ValidationQueueTable";
import BulkActionToolbar from "./hitl/BulkActionToolbar";
import RecordDetailPanel from "./hitl/RecordDetailPanel";
import RecordReviewView from "./hitl/RecordReviewView";
import SamplingModal from "./hitl/SamplingModal";
import DistributeModal from "./hitl/DistributeModal";
import { toast } from "sonner";

/** Detect a "company website" column in user-supplied input headers. */
function findWebsiteColumnIndex(columns: string[]): number {
  return columns.findIndex((c) => {
    const k = String(c || "").trim().toLowerCase();
    return (
      k === "website" ||
      k === "url" ||
      k === "domain" ||
      k === "company website" ||
      k === "company url" ||
      k === "company domain" ||
      k === "homepage" ||
      k === "site"
    );
  });
}

/** Normalize a user-supplied website value into a fully-qualified https URL. */
function normalizeWebsiteUrl(raw: string): string {
  const v = (raw || "").trim();
  if (!v || v.toUpperCase() === "N/A") return "";
  if (/^https?:\/\//i.test(v)) return v;
  // Strip any leading slashes / "www." duplication and prefix https://
  const cleaned = v.replace(/^\/+/, "").replace(/^www\./i, "");
  if (!/\./.test(cleaned)) return "";
  return `https://${cleaned}`;
}

function convertJobsToValidationRecords(jobs: any[]): ValidationRecord[] {
  const records: ValidationRecord[] = [];
  for (const job of jobs) {
    const columns: string[] = job.csv_columns || [];
    const rows: string[][] = job.csv_rows || [];
    if (columns.length === 0 || rows.length === 0) continue;

    // columns[0] is "Company" (entity identifier), rest are attributes
    const attrNames = columns.slice(1);
    const websiteColIdx = findWebsiteColumnIndex(columns);

    // Resolve which workflows ran for this job from job.tier (comma-joined labels)
    const workflowLabels: string[] = (job.tier || "")
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);
    const selectedWorkflowIds = resolveWorkflowIdsFromLabels(workflowLabels);

    rows.forEach((row: string[], rowIdx: number) => {
      const companyName = row[0] || `Entity ${rowIdx + 1}`;
      // Per-row company website provided by the user in the input file (if any).
      const userWebsiteUrl = websiteColIdx >= 0
        ? normalizeWebsiteUrl(String(row[websiteColIdx] ?? ""))
        : "";

      const attributes: ValidationAttribute[] = attrNames.map((attr, i) => {
        // Build the canonical source refs for this attribute given the workflows
        // that actually ran. Then, if the user supplied a website URL in the input
        // file, override the auto-built "Company Website" URL with it so the LHS
        // and the "Live" button point to the real site.
        const refs = buildSourceRefsForAttribute(attr, selectedWorkflowIds, companyName);
        const refsWithUserWebsite = userWebsiteUrl
          ? refs.map((r) =>
              /company website/i.test(r.name) ? { ...r, url: userWebsiteUrl } : r,
            )
          : refs;
        return {
          name: attr,
          extractedValue: row[i + 1] || "",
          currentValue: row[i + 1] || "",
          status: "pending" as const,
          qcFlag: false,
          // Only show source refs that correspond to the workflows the user
          // actually selected when running the job.
          sourceRefs: refsWithUserWebsite,
        };
      });

      // Compute a pseudo confidence score based on how many attrs have values
      const filledCount = attributes.filter(a => a.extractedValue && a.extractedValue !== "N/A" && a.extractedValue !== "").length;
      const confidence = attributes.length > 0 ? Math.round(70 + (filledCount / attributes.length) * 25) : 0;

      // Top-level `sources` (used as the LHS fallback URL).
      // Prefer the user-supplied company website when available, then fall back
      // to the first selected workflow's auto-built URL.
      const fallbackUrl = userWebsiteUrl
        || (selectedWorkflowIds.length > 0
          ? buildSourceRefsForAttribute(attrNames[0] || "Legal Name", selectedWorkflowIds, companyName)[0]?.url
              || buildSourceRefsForAttribute("Legal Name", selectedWorkflowIds, companyName)[0]?.url
              || ""
          : "");
      const fallbackSources = fallbackUrl
        ? [{
            url: fallbackUrl,
            type: "Website" as const,
            snippet: userWebsiteUrl
              ? `Company website provided in input file`
              : `Extracted via ${workflowLabels.join(", ")}`,
            highlightedText: companyName,
          }]
        : [{
            url: "#",
            type: "API" as const,
            snippet: `Extracted via job ${job.job_id}`,
            highlightedText: companyName,
          }];

      records.push({
        id: `${job.job_id}-R${String(rowIdx + 1).padStart(3, "0")}`,
        companyName,
        attributeType: "Extracted",
        status: "pending",
        completionPct: 0,
        confidenceScore: confidence,
        sourceList: workflowLabels.length > 0 ? workflowLabels : [job.name || "Job Extraction"],
        lastUpdated: new Date(job.updated_at || job.created_at).toLocaleString("en-US", {
          year: "numeric", month: "2-digit", day: "2-digit",
          hour: "2-digit", minute: "2-digit", hour12: false,
        }),
        existingValue: "",
        suggestedValue: attributes[0]?.extractedValue || "",
        attributes,
        sources: fallbackSources,
      });
    });
  }
  return records;
}

export default function HITLReviewScreen() {
  const { session } = useAuth();
  const [records, setRecords] = useState<ValidationRecord[]>(sampleRecords);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeRecordId, setActiveRecordId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [samplingOpen, setSamplingOpen] = useState(false);
  const [reviewingRecordId, setReviewingRecordId] = useState<string | null>(null);
  const [distributeOpen, setDistributeOpen] = useState(false);

  // Load completed jobs from Supabase and convert to validation records
  useEffect(() => {
    if (!session?.user?.id) return;
    const loadCompletedJobs = async () => {
      const { data } = await supabase
        .from("jobs")
        .select("*")
        .eq("status", "Completed")
        .order("created_at", { ascending: false });
      if (data && data.length > 0) {
        const jobRecords = convertJobsToValidationRecords(data);
        if (jobRecords.length > 0) {
          // Merge: job records first, then sample records as fallback
          setRecords([...jobRecords, ...sampleRecords]);
        }
      }
    };
    loadCompletedJobs();
  }, [session?.user?.id]);

  const filtered = useMemo(() => {
    return records.filter(r => {
      if (r.status === "approved") return false;
      if (search && !r.companyName.toLowerCase().includes(search.toLowerCase()) && !r.id.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      return true;
    });
  }, [records, search, statusFilter]);

  const activeRecord = activeRecordId ? records.find(r => r.id === activeRecordId) : null;
  const reviewingRecord = reviewingRecordId ? records.find(r => r.id === reviewingRecordId) : null;

  const metrics = useMemo(() => ({
    total: records.length,
    pending: records.filter(r => r.status === "pending" || r.status === "in_review").length,
    approved: records.filter(r => r.status === "approved").length,
    rejected: records.filter(r => r.status === "rejected").length,
    preHitlScore: 82,
  }), [records]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedIds(prev => prev.length === filtered.length ? [] : filtered.map(r => r.id));
  }, [filtered]);

  const handleReview = useCallback((id: string) => {
    setActiveRecordId(id);
  }, []);

  const updateAttribute = useCallback((recordId: string, attrIndex: number, attr: ValidationAttribute) => {
    setRecords(prev => prev.map(r => {
      if (r.id !== recordId) return r;
      const newAttrs = [...r.attributes];
      if (attrIndex >= 0 && attrIndex < newAttrs.length) newAttrs[attrIndex] = attr;
      else newAttrs.push(attr);
      const validated = newAttrs.filter(a => a.status === "validated" || a.status === "edited").length;
      const nextCompanyName = attr.name === "Company Name" && attr.currentValue.trim()
        ? attr.currentValue.trim()
        : r.companyName;
      return {
        ...r,
        companyName: nextCompanyName,
        attributes: newAttrs,
        completionPct: Math.round((validated / newAttrs.length) * 100),
      };
    }));
  }, []);

  const approveRecord = useCallback((id: string) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: "approved" as const, completionPct: 100 } : r));
    toast.success(`Record ${id} approved`);
  }, []);

  const rejectRecord = useCallback((id: string) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: "rejected" as const } : r));
    toast.error(`Record ${id} rejected`);
  }, []);

  const bulkApprove = useCallback(() => {
    setRecords(prev => prev.map(r => selectedIds.includes(r.id) ? { ...r, status: "approved" as const, completionPct: 100 } : r));
    toast.success(`${selectedIds.length} records approved`);
    setSelectedIds([]);
  }, [selectedIds]);

  const bulkReject = useCallback(() => {
    setRecords(prev => prev.map(r => selectedIds.includes(r.id) ? { ...r, status: "rejected" as const } : r));
    toast.error(`${selectedIds.length} records rejected`);
    setSelectedIds([]);
  }, [selectedIds]);

  const handleSample = useCallback((method: string, value: number) => {
    toast.success(`Sampling complete: ${method === "percentage" ? `${value}% sampled` : method === "random" ? `${value} records sampled` : "Category-based sampling done"}`);
  }, []);

  const handleDistribute = useCallback(() => {
    setDistributeOpen(true);
  }, []);

  const handleOpenReview = useCallback((id: string) => {
    setReviewingRecordId(id);
  }, []);

  const handleCloseReview = useCallback(() => {
    setReviewingRecordId(null);
  }, []);

  return (
    <div className="flex flex-col h-full -m-3 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
      {/* Top Metrics - collapse when reviewing */}
      {!reviewingRecord && (
        <div className="px-3 pt-3 pb-2">
          <QCSummaryCards
            totalRecords={metrics.total}
            pendingReview={metrics.pending}
            approvedToday={metrics.approved}
            rejected={metrics.rejected}
            preHitlScore={metrics.preHitlScore}
            onSample={() => setSamplingOpen(true)}
            onDistribute={handleDistribute}
          />
        </div>
      )}

      {/* Main Content - either queue+detail or review view */}
      {reviewingRecord ? (
        <div className="flex-1 px-3 pb-3 overflow-hidden min-h-0">
          <RecordReviewView
            record={reviewingRecord}
            records={filtered}
            onClose={handleCloseReview}
            onUpdateAttribute={updateAttribute}
            onApprove={approveRecord}
            onReject={rejectRecord}
            onNavigate={(id) => setReviewingRecordId(id)}
          />
        </div>
      ) : (
        <div className="flex-1 flex gap-2.5 px-3 pb-3 overflow-hidden min-h-0">
          {/* Left Pane: Queue */}
          <div className="w-1/2 flex flex-col gap-2 overflow-hidden min-w-0">
            <BulkActionToolbar
              selectedCount={selectedIds.length}
              onBulkApprove={bulkApprove}
              onBulkReject={bulkReject}
            />
            <div className="flex-1 overflow-hidden">
              <ValidationQueueTable
                records={filtered}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                onToggleAll={toggleAll}
                onReview={handleReview}
                activeRecordId={activeRecordId}
                search={search}
                onSearchChange={setSearch}
                statusFilter={statusFilter}
                onStatusFilter={setStatusFilter}
              />
            </div>
          </div>

          {/* Right Pane: Record Detail */}
          <div className="w-1/2 overflow-hidden">
            {activeRecord ? (
              <RecordDetailPanel
                record={activeRecord}
                onClose={() => setActiveRecordId(null)}
                onUpdateAttribute={updateAttribute}
                onApprove={approveRecord}
                onReject={rejectRecord}
                onReview={handleOpenReview}
              />
            ) : (
              <div className="bg-card border border-border rounded-lg flex items-center justify-center h-full">
                <p className="text-[12px] text-muted-foreground">Select a record to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      <SamplingModal
        open={samplingOpen}
        onClose={() => setSamplingOpen(false)}
        onSample={handleSample}
        totalRecords={metrics.total}
      />
      <DistributeModal
        open={distributeOpen}
        onClose={() => setDistributeOpen(false)}
        onConfirm={() => toast.success("Records distributed to reviewers")}
        totalPending={metrics.pending}
      />
      </div>
    </div>
  );
}
