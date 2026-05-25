import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ExternalLink, Eye, Check, Edit2, Save, X, ChevronDown, ChevronRight, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

/* ── types ───────────────────────────────────────────── */

export interface HITLRecord {
  id: string;
  company: string;
  tier: string;
  workflow: string;
  source: string;
  status: "Pending" | "Flagged" | "Reviewed";
  flagReason?: string;
}

/* ── snapshot mapping per source type ────────────────── */

const sourceSnapshots: Record<string, { snapshot: string; liveUrl: string; title: string }> = {
  "SEC EDGAR (10-K/Q)": {
    snapshot: "/snapshots/sec-edgar.html",
    liveUrl: "https://www.sec.gov/cgi-bin/browse-edgar",
    title: "EDGAR | Company Filings",
  },
  NYSE: {
    snapshot: "/snapshots/nyse.html",
    liveUrl: "https://www.nyse.com/listings",
    title: "NYSE Listed Company",
  },
};

const defaultSource = {
  snapshot: "/snapshots/generic.html",
  liveUrl: "https://source.example.com",
  title: "Source Document Viewer",
};

/* ── confidence helpers ──────────────────────────────── */

function confidenceColor(c: number) {
  if (c >= 75) return "text-emerald-600 dark:text-emerald-400";
  if (c >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

/* ── data field type ─────────────────────────────────── */

interface DataField {
  key: string;
  label: string;
  value: string;
  confidence: number;
}

/* ── review fields (focused) ─────────────────────────── */

function getReviewFields(record: HITLRecord): DataField[] {
  const base: DataField[] = [
    { key: "companyName", label: "Company Name", value: record.company, confidence: 77 },
    { key: "documentType", label: "Document Type", value: "Data Pack", confidence: 75 },
    { key: "reportingPeriod", label: "Reporting Period", value: "Q2 2025", confidence: 72 },
  ];
  if (record.status === "Flagged") {
    base.push({ key: "flagField", label: record.flagReason ?? "Flagged Field", value: "—", confidence: 45 });
  }
  return base;
}

/* ── profile data groups ─────────────────────────────── */

function getBasicDataFields(record: HITLRecord): DataField[] {
  return [
    { key: "legalName", label: "Legal Name", value: record.company, confidence: 77 },
    { key: "tradeName", label: "Trade Name", value: record.company.split(" ")[0] + " Corp", confidence: 68 },
    { key: "registrationId", label: "Registration ID(s)", value: "REG-2024-00847", confidence: 82 },
    { key: "country", label: "Country", value: "United States", confidence: 91 },
    { key: "address", label: "Address", value: "123 Main St, New York, NY 10001", confidence: 74 },
    { key: "city", label: "City", value: "New York", confidence: 88 },
    { key: "state", label: "State", value: "NY", confidence: 88 },
    { key: "postalCode", label: "Postal Code", value: "10001", confidence: 85 },
    { key: "website", label: "Website", value: "https://example.com", confidence: 62 },
    { key: "email", label: "Email", value: "info@example.com", confidence: 57 },
    { key: "phone", label: "Phone", value: "+1 (212) 555-0100", confidence: 71 },
    { key: "fax", label: "Fax", value: "+1 (212) 555-0101", confidence: 48 },
    { key: "orgType", label: "Organizational Type", value: "Public Corporation", confidence: 83 },
    { key: "foundationYear", label: "Foundation Year", value: "1998", confidence: 76 },
    { key: "numEmployees", label: "Number of Employees", value: "12,400", confidence: 59 },
    { key: "description", label: "Business Description", value: "Technology & data services provider", confidence: 56 },
    { key: "naicsSic", label: "NAICS/SIC Codes", value: "7372 / 5112", confidence: 72 },
    { key: "socialMedia", label: "Social Media Profiles", value: "LinkedIn, Twitter", confidence: 44 },
    { key: "entityStatus", label: "Status", value: "Active", confidence: 92 },
    { key: "ticker", label: "Ticker Symbol", value: record.tier === "Tier 1" ? "ACM" : "—", confidence: 85 },
    { key: "exchange", label: "Stock Exchange", value: record.source.includes("NYSE") ? "NYSE" : record.source.includes("NASDAQ") ? "NASDAQ" : "—", confidence: 80 },
  ];
}

function getFinancialDataFields(): DataField[] {
  return [
    { key: "revenue", label: "Revenue (USD-normalized)", value: "$4.2B", confidence: 68 },
    { key: "assets", label: "Assets", value: "$12.8B", confidence: 72 },
    { key: "liabilities", label: "Liabilities", value: "$7.1B", confidence: 65 },
    { key: "netIncome", label: "Net Income", value: "$890M", confidence: 58 },
    { key: "fiscalYearEnd", label: "Fiscal Year End", value: "December 31", confidence: 88 },
  ];
}

function getHierarchyDataFields(record: HITLRecord): DataField[] {
  return [
    { key: "ultimateParent", label: "Ultimate Parent", value: record.company + " Holdings plc", confidence: 59 },
    { key: "subsidiary", label: "Subsidiary Company", value: record.company + " consolidated inco", confidence: 62 },
    { key: "entityType", label: "Entity Type", value: "Operating Subsidiary", confidence: 77 },
    { key: "hierarchyLevel", label: "Hierarchy Level", value: "2", confidence: 79 },
    { key: "hierCountry", label: "Country", value: "United States", confidence: 91 },
    { key: "relationshipType", label: "Relationship Type", value: "Wholly Owned", confidence: 67 },
    { key: "perfExpectation", label: "Performance Expectation", value: "Above Average", confidence: 50 },
  ];
}

/* ── RHS mode type ───────────────────────────────────── */

type RHSMode = "review" | "profile";

/* ── confidence filter ───────────────────────────────── */

const confidenceFilters = [
  { label: "All", value: "all" },
  { label: "Medium (51 - 80%), Low (0 - 50%)", value: "medium-low" },
  { label: "Low (0 - 50%)", value: "low" },
];

/* ── component ───────────────────────────────────────── */

interface Props {
  record: HITLRecord;
  onBack: () => void;
}

export default function HITLRecordReview({ record, onBack }: Props) {
  const src = sourceSnapshots[record.source] ?? defaultSource;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [snapshotReady, setSnapshotReady] = useState(false);
  const [activeFieldKey, setActiveFieldKey] = useState<string | null>(null);
  const [reviewFields, setReviewFields] = useState(() => getReviewFields(record));
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [rhsMode, setRHSMode] = useState<RHSMode>("review");

  const [basicFields, setBasicFields] = useState(() => getBasicDataFields(record));
  const [financialFields, setFinancialFields] = useState(() => getFinancialDataFields());
  const [hierarchyFields, setHierarchyFields] = useState(() => getHierarchyDataFields(record));

  const [basicOpen, setBasicOpen] = useState(true);
  const [financialOpen, setFinancialOpen] = useState(true);
  const [hierarchyOpen, setHierarchyOpen] = useState(true);

  const [basicFilter, setBasicFilter] = useState("all");
  const [financialFilter, setFinancialFilter] = useState("all");
  const [hierarchyFilter, setHierarchyFilter] = useState("all");

  /* personalize snapshot when iframe loads */
  const personalizeSnapshot = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    const ticker = record.tier === "Tier 1" ? "ACM" : record.company.slice(0, 3).toUpperCase();
    const shortName = record.company.split(" ")[0];
    doc.body.innerHTML = doc.body.innerHTML
      .split("__COMPANY__").join(record.company)
      .split("__SHORT__").join(shortName)
      .split("__TICKER__").join(ticker);

    if (!doc.getElementById("__hl_styles__")) {
      const style = doc.createElement("style");
      style.id = "__hl_styles__";
      style.textContent = `
        .__xdas_hl__ {
          background: #fef08a !important;
          box-shadow: 0 0 0 3px #facc15, 0 0 0 6px rgba(250, 204, 21, 0.35) !important;
          border-radius: 3px;
          transition: background 0.3s, box-shadow 0.3s;
          scroll-margin-top: 80px;
        }
        .__xdas_hl_pulse__ { animation: __xdas_pulse__ 1.2s ease-out 2; }
        @keyframes __xdas_pulse__ {
          0%,100% { box-shadow: 0 0 0 3px #facc15, 0 0 0 6px rgba(250, 204, 21, 0.35); }
          50%     { box-shadow: 0 0 0 5px #f59e0b, 0 0 0 12px rgba(245, 158, 11, 0.45); }
        }
      `;
      doc.head.appendChild(style);
    }
    setSnapshotReady(true);
  };

  /* apply highlight whenever active field changes */
  useEffect(() => {
    if (!snapshotReady) return;
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    doc.querySelectorAll(".__xdas_hl__").forEach((el) => {
      el.classList.remove("__xdas_hl__", "__xdas_hl_pulse__");
    });
    if (!activeFieldKey) return;
    const targets = doc.querySelectorAll(`[data-field="${activeFieldKey}"]`);
    targets.forEach((el) => el.classList.add("__xdas_hl__", "__xdas_hl_pulse__"));
    const first = targets[0] as HTMLElement | undefined;
    if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeFieldKey, snapshotReady]);


  const startEdit = (f: DataField, e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    setEditingKey(f.key);
    setEditValue(f.value === "N/A" || f.value === "—" ? "" : f.value);
  };

  const saveEdit = (key: string, setter: React.Dispatch<React.SetStateAction<DataField[]>>, e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    setter((prev) => prev.map((f) => (f.key === key ? { ...f, value: editValue || f.value } : f)));
    setEditingKey(null);
  };

  const filterFields = (fields: DataField[], filter: string) => {
    if (filter === "all") return fields;
    if (filter === "medium-low") return fields.filter((f) => f.confidence <= 80);
    if (filter === "low") return fields.filter((f) => f.confidence <= 50);
    return fields;
  };

  const isBlankValue = (val: string) => !val || val.trim() === "" || val === "N/A" || val === "—";

  const renderField = (f: DataField, setter: React.Dispatch<React.SetStateAction<DataField[]>>) => {
    const blank = isBlankValue(f.value);
    const borderClass = blank
      ? "border-amber-300 bg-amber-50/20 dark:border-amber-800 dark:bg-amber-950/20"
      : f.confidence < 50
        ? "border-red-300 bg-red-50/20 dark:border-red-800 dark:bg-red-950/20"
        : f.confidence < 75
          ? "border-amber-300 bg-amber-50/20 dark:border-amber-800 dark:bg-amber-950/20"
          : "border-border bg-card";

    const isActive = activeFieldKey === f.key;
    return (
      <div
        key={f.key}
        onClick={() => setActiveFieldKey(f.key)}
        className={`rounded-md border p-3 cursor-pointer transition-shadow ${borderClass} ${isActive ? "ring-2 ring-amber-400 ring-offset-1" : "hover:shadow-sm"}`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-medium text-muted-foreground max-w-[60%]">
            {f.label}
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] font-bold ${confidenceColor(f.confidence)}`}>
              {f.confidence}%
            </span>
            <button className="text-muted-foreground hover:text-foreground" onClick={(e) => e.stopPropagation()}>
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {editingKey === f.key ? (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="h-8 text-[13px]"
              placeholder={`Enter ${f.label.toLowerCase()}...`}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit(f.key, setter);
                if (e.key === "Escape") setEditingKey(null);
              }}
            />
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={(e) => saveEdit(f.key, setter, e)}>
              <Save className="w-3.5 h-3.5 text-brand" />
            </Button>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={(e) => { e.stopPropagation(); setEditingKey(null); }}>
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </Button>
          </div>
        ) : blank ? (
          <div className="flex items-center justify-between">
            <Input
              value={f.value || ""}
              readOnly
              placeholder="Click to add value..."
              className="h-8 text-[13px] text-muted-foreground bg-muted/30 border-dashed cursor-pointer flex-1 mr-2"
              onClick={(e) => startEdit(f, e)}
            />
            <div className="flex items-center gap-1 shrink-0">
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={(e) => startEdit(f, e)}>
                <Edit2 className="w-3.5 h-3.5 text-primary" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-normal text-foreground break-words max-w-[70%]">{f.value}</span>
            <div className="flex items-center gap-1">
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={(e) => startEdit(f, e)}>
                <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
              </Button>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={(e) => e.stopPropagation()}>
                <Check className="w-3.5 h-3.5 text-brand" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderGroup = (
    title: string,
    fields: DataField[],
    setter: React.Dispatch<React.SetStateAction<DataField[]>>,
    open: boolean,
    setOpen: (v: boolean) => void,
    filter: string,
    setFilter: (v: string) => void,
    color: string,
  ) => {
    const filteredFields = filterFields(fields, filter);

    return (
      <Collapsible open={open} onOpenChange={setOpen} className="border border-border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30 border-b border-border">
          <CollapsibleTrigger className="flex items-center gap-2 group">
            {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            <span className={`text-[13px] font-semibold ${color}`}>{title}</span>
          </CollapsibleTrigger>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="h-7 text-[11px] w-[200px] border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {confidenceFilters.map((cf) => (
                  <SelectItem key={cf.value} value={cf.value} className="text-[11px]">
                    {cf.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <CollapsibleContent>
          <div className="p-4 grid grid-cols-3 gap-3">
            {filteredFields.map((f) => renderField(f, setter))}
          </div>
          <div className="px-4 pb-3 flex justify-end">
            <Button size="sm" variant="outline" className="h-7 w-7 p-0 rounded-full border-primary text-primary">
              <span className="text-lg leading-none">+</span>
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary hover:text-primary/80 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Review Queue
      </button>

      <div className="bg-card rounded-lg border border-border shadow-card px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[13px] text-muted-foreground">{record.id}</span>
          <span className="text-[14px] font-semibold text-foreground">{record.company}</span>
          <Badge variant="outline" className="text-[11px]">{record.tier}</Badge>
          <Badge variant="secondary" className="text-[11px]">{record.workflow}</Badge>
        </div>
        <div className="flex items-center gap-2">
          {rhsMode === "profile" ? (
            <Button variant="outline" size="sm" className="text-[12px] h-8" onClick={() => setRHSMode("review")}>
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Back to Review
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="text-[12px] h-8" onClick={() => setRHSMode("profile")}>
              <Eye className="w-3.5 h-3.5 mr-1" />
              Company Profile Viewer
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4" style={{ minHeight: "calc(100vh - 320px)" }}>
        {/* LHS: Source View */}
        <div className="bg-card rounded-lg border border-border shadow-card flex flex-col overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between bg-muted/30">
            <span className="text-[13px] font-semibold text-foreground uppercase tracking-wider">Source View</span>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-muted-foreground font-mono truncate max-w-[200px]">{src.liveUrl}</span>
              <a
                href={src.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
              >
                Open live page <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          <div className="flex-1 relative">
            <iframe
              ref={iframeRef}
              src={src.snapshot}
              title={`Source: ${record.source}`}
              className="absolute inset-0 w-full h-full border-0 bg-white"
              onLoad={personalizeSnapshot}
            />
          </div>
        </div>

        {/* RHS */}
        {rhsMode === "review" ? (
          <div className="bg-card rounded-lg border border-border shadow-card flex flex-col overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center justify-between bg-muted/30">
              <span className="text-[13px] font-semibold text-foreground uppercase tracking-wider">Review & Edit</span>
              <span className="text-[11px] text-muted-foreground">{reviewFields.filter((f) => f.confidence < 75).length} field(s) for review</span>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {reviewFields.map((f) => renderField(f, setReviewFields))}
            </div>
            <div className="px-5 py-3 border-t border-border flex items-center justify-end gap-2 bg-muted/20">
              <Button variant="outline" size="sm" className="text-[12px] h-8">Skip</Button>
              <Button size="sm" className="text-[12px] h-8">
                <Check className="w-3.5 h-3.5 mr-1" />
                Submit Review
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border shadow-card flex flex-col overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center justify-between bg-muted/30">
              <span className="text-[13px] font-semibold text-foreground uppercase tracking-wider">Company Profile</span>
              <span className="text-[11px] text-muted-foreground">{record.company}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {renderGroup("Basic Data", basicFields, setBasicFields, basicOpen, setBasicOpen, basicFilter, setBasicFilter, "text-foreground")}
              {renderGroup("Financial Data", financialFields, setFinancialFields, financialOpen, setFinancialOpen, financialFilter, setFinancialFilter, "text-foreground")}
              {renderGroup("Hierarchy Data", hierarchyFields, setHierarchyFields, hierarchyOpen, setHierarchyOpen, hierarchyFilter, setHierarchyFilter, "text-foreground")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
