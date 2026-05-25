import { CheckCircle2, XCircle } from "lucide-react";

interface BulkActionToolbarProps {
  selectedCount: number;
  onBulkApprove: () => void;
  onBulkReject: () => void;
}

export default function BulkActionToolbar({ selectedCount, onBulkApprove, onBulkReject }: BulkActionToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-brand-light border border-brand-mid rounded-lg">
      <span className="text-[12px] font-medium text-foreground">
        {selectedCount} record{selectedCount > 1 ? "s" : ""} selected
      </span>
      <div className="flex-1" />
      <button
        onClick={onBulkApprove}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-primary-foreground bg-primary hover:bg-primary-dark rounded transition-colors"
      >
        <CheckCircle2 className="w-3.5 h-3.5" />
        Bulk Approve
      </button>
      <button
        onClick={onBulkReject}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-destructive-foreground bg-destructive hover:opacity-90 rounded transition-colors"
      >
        <XCircle className="w-3.5 h-3.5" />
        Bulk Reject
      </button>
    </div>
  );
}
