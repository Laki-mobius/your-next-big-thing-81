import { useState, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { attributeCategories, attributeCategoryGroups, type AttributeCategory } from "@/data/attribute-category-data";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import QCSummaryCards from "./QCSummaryCards";
import SamplingModal from "./SamplingModal";
import DistributeModal from "./DistributeModal";
import AttributeCategoryReviewModal from "./AttributeCategoryReviewModal";
import { toast } from "sonner";

const severityColor: Record<string, string> = {
  CRITICAL: "text-red-500",
  HIGH: "text-orange-500",
  MEDIUM: "text-blue-500",
  LOW: "text-emerald-500",
};

const confidenceBarColors = [
  "bg-emerald-500",
  "bg-yellow-500",
  "bg-orange-500",
  "bg-amber-500",
];

const categoryConfidence = [
  { label: "Identity", value: 89 },
  { label: "Financials", value: 78 },
  { label: "Personnel", value: 82 },
  { label: "Contact", value: 76 },
];

const donutData = [
  { name: "High", value: 81.6, color: "hsl(var(--brand))" },
  { name: "Remaining", value: 18.4, color: "hsl(var(--muted))" },
];

export default function AttributeCategoryView() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [samplingOpen, setSamplingOpen] = useState(false);
  const [distributeOpen, setDistributeOpen] = useState(false);
  const [reviewCategory, setReviewCategory] = useState<AttributeCategory | null>(null);

  const metrics = useMemo(() => ({
    total: attributeCategories.reduce((s, c) => s + c.totalChanges, 0),
    pending: attributeCategories.filter(c => c.severity === "CRITICAL" || c.severity === "HIGH").reduce((s, c) => s + c.totalChanges, 0),
    approved: 1240,
    rejected: 86,
    preHitlScore: 82,
  }), []);

  const handleSample = useCallback((method: string, value: number) => {
    toast.success(`Sampling complete: ${method === "percentage" ? `${value}% sampled` : method === "random" ? `${value} records sampled` : "Category-based sampling done"}`);
  }, []);

  const filtered = useMemo(() => {
    return attributeCategories.filter(c => {
      if (categoryFilter !== "all" && c.group !== categoryFilter) return false;
      if (severityFilter !== "all" && c.severity !== severityFilter) return false;
      return true;
    });
  }, [categoryFilter, severityFilter]);

  const totalPending = filtered.reduce((s, c) => s + c.totalChanges, 0);
  const activeRecord = selectedCategory ? attributeCategories.find(c => c.id === selectedCategory) : null;

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    setSelectedIds(prev => prev.length === filtered.length ? [] : filtered.map(c => c.id));
  };

  // Group filtered categories
  const grouped = useMemo(() => {
    const groups: Record<string, AttributeCategory[]> = {};
    for (const g of attributeCategoryGroups) {
      const items = filtered.filter(c => c.group === g);
      if (items.length > 0) groups[g] = items;
    }
    return groups;
  }, [filtered]);

  return (
    <div className="flex flex-col h-full">
      {/* QC Summary Cards */}
      <div className="mb-2.5">
        <QCSummaryCards
          totalRecords={metrics.total}
          pendingReview={metrics.pending}
          approvedToday={metrics.approved}
          rejected={metrics.rejected}
          preHitlScore={metrics.preHitlScore}
          onSample={() => setSamplingOpen(true)}
          onDistribute={() => setDistributeOpen(true)}
        />
      </div>

      <div className="flex items-center gap-2 mb-2.5">
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="text-[11px] border border-border rounded px-2 py-1.5 bg-card text-foreground"
        >
          <option value="all">All Categories</option>
          {attributeCategoryGroups.map(g => (
            <option key={g} value={g}>{g.split(" ").map(w => w[0] + w.slice(1).toLowerCase()).join(" ")}</option>
          ))}
        </select>
        <select
          value={severityFilter}
          onChange={e => setSeverityFilter(e.target.value)}
          className="text-[11px] border border-border rounded px-2 py-1.5 bg-card text-foreground"
        >
          <option value="all">All Severity</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
        <div className="ml-auto flex items-center gap-2">
          <button className="text-[11px] font-medium text-primary-foreground bg-brand hover:bg-brand/90 rounded px-3 py-1.5 transition-colors">
            Bulk Approve
          </button>
          <button className="text-[11px] font-medium text-primary-foreground bg-red-500 hover:bg-red-600 rounded px-3 py-1.5 transition-colors">
            Bulk Reject
          </button>
          <button className="text-[11px] font-medium text-foreground border border-border rounded px-3 py-1.5 hover:bg-surface transition-colors">
            Export CSV
          </button>
        </div>
      </div>

      {/* Main split pane */}
      <div className="flex-1 flex gap-2.5 overflow-hidden min-h-0">
        {/* LHS - Validation Queue */}
        <div className="flex-1 bg-card border border-border rounded-lg flex flex-col overflow-hidden min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            <span className="text-[12px] font-semibold text-foreground uppercase tracking-wide">
              Data Field Validation Queue
            </span>
            <span className="text-[11px] text-muted-foreground">
              {Object.keys(grouped).length} categories · {totalPending.toLocaleString()} pending changes
            </span>
          </div>

          {/* Column headers */}
          <div className="flex items-center px-3 py-1.5 border-b border-border text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            <div className="w-6 shrink-0">
              <input
                type="checkbox"
                checked={selectedIds.length === filtered.length && filtered.length > 0}
                onChange={toggleAll}
                className="w-3 h-3 rounded border-border"
              />
            </div>
            <div className="flex-1">Data Field Category</div>
            <div className="w-[80px] text-right">Total Changes</div>
            <div className="w-[80px] text-center">Severity</div>
            <div className="w-[60px] text-center">Total Sources</div>
            <div className="w-[70px] text-right">Detected</div>
          </div>

          {/* Scrollable rows */}
          <div className="flex-1 overflow-y-auto">
            {Object.entries(grouped).map(([group, items]) => (
              <div key={group}>
                {/* Group header */}
                <div className="px-3 py-1.5 text-[10px] font-bold text-orange-500 uppercase tracking-wider bg-surface/50">
                  {group}
                </div>
                {items.map(cat => (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "flex items-center px-3 py-2 border-b border-border/50 cursor-pointer transition-colors hover:bg-surface/50",
                      selectedCategory === cat.id && "bg-brand-light"
                    )}
                  >
                    <div className="w-6 shrink-0" onClick={e => { e.stopPropagation(); toggleSelect(cat.id); }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(cat.id)}
                        onChange={() => toggleSelect(cat.id)}
                        className="w-3 h-3 rounded border-border"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-semibold text-foreground">{cat.name}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{cat.subAttributes}</div>
                    </div>
                    <div className={cn("w-[80px] text-right text-[13px] font-semibold", severityColor[cat.severity])}>
                      {cat.totalChanges.toLocaleString()}
                    </div>
                    <div className={cn("w-[80px] text-center text-[10px] font-bold uppercase", severityColor[cat.severity])}>
                      {cat.severity}
                    </div>
                    <div className="w-[60px] text-center text-[12px] text-foreground">
                      {cat.totalSources}
                    </div>
                    <div className="w-[70px] text-right text-[11px] text-muted-foreground">
                      {cat.detected}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* RHS - Pre-HITL Score + Record Detail */}
        <div className="w-[320px] shrink-0 flex flex-col gap-2.5 overflow-y-auto">
          {/* Pre-HITL Validation Score */}
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-foreground uppercase tracking-wide">Pre-HITL Validation Score</span>
              <span className="text-[9px] font-bold text-brand border border-brand rounded px-1.5 py-0.5 uppercase">AI Pass-Through</span>
            </div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-[80px] h-[80px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={donutData} dataKey="value" cx="50%" cy="50%" innerRadius={24} outerRadius={36} strokeWidth={2} startAngle={90} endAngle={-270}>
                      {donutData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <div className="text-[28px] font-semibold text-brand tracking-[-1px] leading-none">81.6%</div>
                <div className="text-[9px] text-muted-foreground mt-0.5">AI CONFIDENCE</div>
              </div>
              <div className="ml-auto text-right text-[10px] space-y-0.5">
                <div className="flex justify-between gap-4"><span className="text-muted-foreground">Fields Evaluated</span><span className="font-semibold text-foreground">14,380</span></div>
                <div className="flex justify-between gap-4"><span className="text-muted-foreground">High Confidence</span><span className="font-semibold text-brand">11,730</span></div>
                <div className="flex justify-between gap-4"><span className="text-muted-foreground">Low Confidence</span><span className="font-semibold text-red-500">2,650</span></div>
              </div>
            </div>
            {/* Category bars */}
            <div className="space-y-1.5">
              {categoryConfidence.map((cat, i) => (
                <div key={cat.label} className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground w-[60px] text-right">{cat.label}</span>
                  <div className="flex-1 h-[6px] bg-muted rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", confidenceBarColors[i])} style={{ width: `${cat.value}%` }} />
                  </div>
                  <span className="text-[10px] font-medium text-foreground w-[28px]">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Record Detail */}
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Record Detail</div>
            {activeRecord ? (
              <>
                <div className="text-[16px] font-bold text-foreground mb-0.5">{activeRecord.name}</div>
                <div className="text-[11px] text-muted-foreground mb-3">Category: {activeRecord.group.split(" ").map(w => w[0] + w.slice(1).toLowerCase()).join(" ")}</div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-orange-50 dark:bg-orange-950/30 border-l-2 border-orange-400 rounded p-2">
                    <div className="text-[9px] font-bold text-orange-500 uppercase mb-0.5">Scope</div>
                    <div className="text-[11px] text-foreground">{activeRecord.totalChanges} records with prior values</div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950/30 border-l-2 border-red-400 rounded p-2">
                    <div className="text-[9px] font-bold text-red-500 uppercase mb-0.5">Changes Summary</div>
                    <div className="text-[11px] text-foreground">{activeRecord.totalChanges} updated {activeRecord.subAttributes.split(" · ").slice(0, 3).join(", ").toLowerCase()}</div>
                  </div>
                </div>

                <div className="text-[11px] text-muted-foreground mb-1">
                  <span className="font-semibold text-foreground">Source:</span> SEC Filings · Company Registries · GLEIF · News Feed
                </div>
                <div className="text-[11px] text-muted-foreground mb-1">
                  <span className="font-semibold text-foreground">Confidence:</span>{" "}
                  <span className="text-brand font-semibold">76%</span>
                </div>
                <div className="text-[11px] text-muted-foreground mb-3">
                  <span className="font-semibold text-foreground">Note:</span> Includes {Math.round(activeRecord.totalChanges * 0.26)} enterprise number changes, {Math.round(activeRecord.totalChanges * 0.41)} company type reclassifications, and {Math.round(activeRecord.totalChanges * 0.32)} reportage level updates. {Math.round(activeRecord.totalChanges * 0.08)} flagged as potential duplicates requiring manual dedup.
                </div>

                <button
                  onClick={() => setReviewCategory(activeRecord)}
                  className="w-full text-[12px] font-semibold text-primary-foreground bg-primary hover:bg-primary-dark rounded-md py-2 transition-colors"
                >
                  REVIEW
                </button>
              </>
            ) : (
              <div className="text-[11px] text-muted-foreground py-8 text-center">
                Select a category to view details
              </div>
            )}
          </div>
        </div>
      </div>
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
      {reviewCategory && (
        <AttributeCategoryReviewModal
          category={reviewCategory}
          onClose={() => setReviewCategory(null)}
        />
      )}
    </div>
  );
}
