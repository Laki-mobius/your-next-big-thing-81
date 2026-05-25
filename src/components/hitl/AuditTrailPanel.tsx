import { type AuditAction } from "@/data/hitl-validation-data";
import { CheckCircle2, XCircle, Edit3, Flag } from "lucide-react";

interface AuditTrailPanelProps {
  actions: AuditAction[];
}

const actionIcons: Record<string, React.ReactNode> = {
  "Record Approved": <CheckCircle2 className="w-3.5 h-3.5 text-brand" />,
  "Record Rejected": <XCircle className="w-3.5 h-3.5 text-destructive" />,
  "Attribute Edited": <Edit3 className="w-3.5 h-3.5 text-status-blue" />,
  "QC Flag Raised": <Flag className="w-3.5 h-3.5 text-status-amber" />,
};

export default function AuditTrailPanel({ actions }: AuditTrailPanelProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-3 py-2 border-b border-border">
        <h3 className="text-[11px] font-semibold text-foreground uppercase tracking-wide">Recent Actions</h3>
      </div>
      <div className="max-h-[200px] overflow-auto">
        {actions.map((a, i) => (
          <div key={a.id} className="flex items-start gap-2 px-3 py-2 border-b border-border last:border-b-0">
            <div className="mt-0.5 shrink-0">
              {actionIcons[a.action] || <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-foreground">
                <span className="font-medium">{a.user}</span>
                <span className="text-muted-foreground"> — {a.action}</span>
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {a.recordRef} · {a.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
