import { useState, useMemo } from "react";
import { ArrowLeft, Check, X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface JobOutput {
  jobId: string;
  jobName: string;
  workflowLabel: string;
  columns: string[];   // columns[0] = "Company", may include "Website"
  rows: string[][];
  createdAt: string;
}

interface Props {
  job: JobOutput;
  onClose: () => void;
}

/**
 * Spreadsheet-style review of all rows × attributes extracted by a workflow job.
 * Mirrors the Attribute Category-wise review flow: bulk approve/reject per row
 * plus a per-cell status indicator. Lightweight on purpose — the canonical
 * record-by-record review still lives in the Record-wise tab.
 */
export default function JobOutputReviewModal({ job, onClose }: Props) {
  const [statuses, setStatuses] = useState<Record<string, "pending" | "approved" | "rejected">>({});
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return job.rows;
    return job.rows.filter(r => r.some(c => String(c).toLowerCase().includes(q)));
  }, [job.rows, search]);

  const setStatus = (rowId: string, s: "approved" | "rejected") =>
    setStatuses(prev => ({ ...prev, [rowId]: s }));

  const approvedCount = Object.values(statuses).filter(v => v === "approved").length;
  const rejectedCount = Object.values(statuses).filter(v => v === "rejected").length;

  const attrColumns = job.columns.slice(1); // drop "Company"
  const hasWebsiteCol = job.columns[1]?.toLowerCase() === "website";

  return (
    <div className="fixed inset-0 z-[300] bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card">
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={onClose} className="p-1 rounded hover:bg-muted/40">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <div className="text-[13px] font-bold text-foreground truncate">{job.jobName}</div>
            <div className="text-[10px] text-muted-foreground truncate">
              {job.workflowLabel} · {job.rows.length.toLocaleString()} records · {attrColumns.length} attributes · {job.createdAt}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search rows…"
            className="h-7 text-[11px] px-2 rounded border border-border bg-background w-48"
          />
          <button
            onClick={() => {
              const next: typeof statuses = {};
              filtered.forEach((_, i) => { next[`r-${i}`] = "approved"; });
              setStatuses(prev => ({ ...prev, ...next }));
              toast.success(`${filtered.length} rows approved`);
            }}
            className="text-[11px] font-medium text-primary-foreground bg-brand hover:bg-brand/90 rounded px-3 py-1.5"
          >
            Bulk Approve
          </button>
          <button
            onClick={() => {
              const next: typeof statuses = {};
              filtered.forEach((_, i) => { next[`r-${i}`] = "rejected"; });
              setStatuses(prev => ({ ...prev, ...next }));
              toast.error(`${filtered.length} rows rejected`);
            }}
            className="text-[11px] font-medium text-primary-foreground bg-red-500 hover:bg-red-600 rounded px-3 py-1.5"
          >
            Bulk Reject
          </button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="flex items-center gap-4 px-4 py-2 border-b border-border bg-muted/10 text-[11px]">
        <span><span className="font-semibold text-foreground">{job.rows.length}</span> total</span>
        <span className="text-emerald-600"><span className="font-semibold">{approvedCount}</span> approved</span>
        <span className="text-red-500"><span className="font-semibold">{rejectedCount}</span> rejected</span>
        <span className="text-muted-foreground">
          {job.rows.length - approvedCount - rejectedCount} pending
        </span>
      </div>

      {/* Spreadsheet */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-[11px]">
          <thead className="sticky top-0 bg-muted/30 z-10">
            <tr>
              <th className="px-2 py-1.5 text-left font-semibold border-b border-border w-[40px]">#</th>
              <th className="px-2 py-1.5 text-left font-semibold border-b border-border">Company</th>
              {hasWebsiteCol && (
                <th className="px-2 py-1.5 text-left font-semibold border-b border-border">Website</th>
              )}
              {attrColumns.slice(hasWebsiteCol ? 1 : 0).map(c => (
                <th key={c} className="px-2 py-1.5 text-left font-semibold border-b border-border whitespace-nowrap">
                  {c}
                </th>
              ))}
              <th className="px-2 py-1.5 text-center font-semibold border-b border-border w-[110px] sticky right-0 bg-muted/30">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => {
              const rowId = `r-${i}`;
              const status = statuses[rowId] || "pending";
              return (
                <tr
                  key={rowId}
                  className={cn(
                    "hover:bg-muted/30",
                    status === "approved" && "bg-emerald-50/60 dark:bg-emerald-950/20",
                    status === "rejected" && "bg-red-50/60 dark:bg-red-950/20",
                  )}
                >
                  <td className="px-2 py-1.5 border-b border-border/60 text-muted-foreground">{i + 1}</td>
                  <td className="px-2 py-1.5 border-b border-border/60 font-semibold text-foreground whitespace-nowrap">
                    {row[0]}
                  </td>
                  {hasWebsiteCol && (
                    <td className="px-2 py-1.5 border-b border-border/60 whitespace-nowrap">
                      {row[1] ? (
                        <a
                          href={/^https?:/i.test(row[1]) ? row[1] : `https://${row[1]}`}
                          target="_blank" rel="noreferrer"
                          className="text-primary inline-flex items-center gap-1 hover:underline"
                        >
                          {row[1]} <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : <span className="text-muted-foreground">—</span>}
                    </td>
                  )}
                  {row.slice(hasWebsiteCol ? 2 : 1).map((cell, j) => (
                    <td key={j} className="px-2 py-1.5 border-b border-border/60 whitespace-nowrap text-foreground">
                      {cell || <span className="text-muted-foreground">—</span>}
                    </td>
                  ))}
                  <td className="px-2 py-1.5 border-b border-border/60 sticky right-0 bg-background">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setStatus(rowId, "approved")}
                        className={cn(
                          "p-1 rounded border text-emerald-600 border-emerald-200 hover:bg-emerald-50",
                          status === "approved" && "bg-emerald-500 text-white border-emerald-500",
                        )}
                        title="Approve"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setStatus(rowId, "rejected")}
                        className={cn(
                          "p-1 rounded border text-red-500 border-red-200 hover:bg-red-50",
                          status === "rejected" && "bg-red-500 text-white border-red-500",
                        )}
                        title="Reject"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={job.columns.length + 2} className="text-center text-muted-foreground py-12 text-[12px]">
                  No rows match the current search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
