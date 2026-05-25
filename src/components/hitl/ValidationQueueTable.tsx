import { useState } from "react";
import { type ValidationRecord } from "@/data/hitl-validation-data";
import { Search, ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface ValidationQueueTableProps {
  records: ValidationRecord[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
  onReview: (id: string) => void;
  activeRecordId: string | null;
  search: string;
  onSearchChange: (s: string) => void;
  statusFilter: string;
  onStatusFilter: (s: string) => void;
}

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: "Pending", bg: "bg-status-amber-light", text: "text-status-amber" },
  in_review: { label: "In Review", bg: "bg-status-blue-light", text: "text-status-blue" },
  rejected: { label: "Rejected", bg: "bg-destructive-light", text: "text-destructive" },
};

export default function ValidationQueueTable({
  records, selectedIds, onToggleSelect, onToggleAll, onReview, activeRecordId,
  search, onSearchChange, statusFilter, onStatusFilter,
}: ValidationQueueTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  let sorted = [...records];
  if (sortKey) {
    sorted.sort((a, b) => {
      let av: any, bv: any;
      if (sortKey === "companyName") { av = a.companyName; bv = b.companyName; }
      else if (sortKey === "confidenceScore") { av = a.confidenceScore; bv = b.confidenceScore; }
      else if (sortKey === "lastUpdated") { av = a.lastUpdated; bv = b.lastUpdated; }
      else if (sortKey === "status") { av = a.status; bv = b.status; }
      else { av = (a as any)[sortKey]; bv = (b as any)[sortKey]; }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }

  const allSelected = sorted.length > 0 && sorted.every(r => selectedIds.includes(r.id));

  const columns = [
    { key: "id", label: "Record ID", sortable: true },
    { key: "companyName", label: "Entity Name", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "confidenceScore", label: "Confidence", sortable: true },
    { key: "sourceList", label: "Source", sortable: false },
    { key: "lastUpdated", label: "Last Updated", sortable: true },
  ];

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <div className="relative flex-1 max-w-[260px]">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search records…"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-7 pr-2 py-1.5 text-[12px] bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => onStatusFilter(e.target.value)}
          className="text-[12px] bg-background border border-border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_review">In Review</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-auto flex-1">
        <table className="w-full text-[12px] table-auto">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-3 py-2 text-left w-8">
                <Checkbox checked={allSelected} onCheckedChange={onToggleAll} />
              </th>
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`px-3 py-2 text-left font-medium text-muted-foreground uppercase tracking-wide text-[10px] whitespace-nowrap ${col.sortable ? "cursor-pointer select-none hover:text-foreground" : ""}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && <ArrowUpDown className="w-3 h-3 opacity-40" />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map(record => {
              const sc = statusConfig[record.status];
              const isActive = record.id === activeRecordId;
              return (
                <tr
                  key={record.id}
                  onClick={() => onReview(record.id)}
                  className={`border-b border-border transition-colors hover:bg-muted/30 cursor-pointer ${isActive ? "bg-brand-light/50" : ""}`}
                >
                  <td className="px-3 py-2" onClick={e => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.includes(record.id)}
                      onCheckedChange={() => onToggleSelect(record.id)}
                    />
                  </td>
                  <td className="px-3 py-2 font-mono text-muted-foreground whitespace-nowrap">{record.id}</td>
                  <td className="px-3 py-2 text-foreground whitespace-nowrap">{record.companyName}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap ${sc.bg} ${sc.text}`}>
                      {sc.label}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${record.confidenceScore}%`,
                            backgroundColor: record.confidenceScore >= 80 ? "hsl(var(--brand))" : record.confidenceScore >= 60 ? "hsl(var(--amber))" : "hsl(var(--destructive))",
                          }}
                        />
                      </div>
                      <span className="text-muted-foreground">{record.confidenceScore}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{record.sourceList.join(", ")}</td>
                  <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{record.lastUpdated}</td>
                </tr>
              );
            })}
            {sorted.length === 0 && (
              <tr>
               <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground text-[12px]">
                  No records match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
