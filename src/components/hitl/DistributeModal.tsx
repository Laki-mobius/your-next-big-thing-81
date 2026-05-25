import { useState, useMemo } from "react";
import { X, Users } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface Reviewer {
  name: string;
  role: string;
  percentage: number;
  count: number;
}

interface DistributeModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (assignments: Reviewer[]) => void;
  totalPending: number;
}

const defaultReviewers = [
  { name: "User 3", role: "QC Specialist" },
  { name: "User 4", role: "Junior Analyst" },
  { name: "User 5", role: "Data Analyst" },
  { name: "User 6", role: "QC Specialist" },
  { name: "User 7", role: "Senior Analyst" },
  { name: "User 8", role: "Junior Analyst" },
];

export default function DistributeModal({ open, onClose, onConfirm, totalPending }: DistributeModalProps) {
  const evenPct = Math.floor(100 / defaultReviewers.length);
  const [percentages, setPercentages] = useState<number[]>(
    defaultReviewers.map((_, i) => i === defaultReviewers.length - 1 ? 100 - evenPct * (defaultReviewers.length - 1) : evenPct)
  );

  const totalAssigned = useMemo(() => percentages.reduce((a, b) => a + b, 0), [percentages]);
  const unassigned = 100 - totalAssigned;

  const handleSliderChange = (index: number, newVal: number) => {
    setPercentages(prev => {
      const updated = [...prev];
      updated[index] = newVal;
      return updated;
    });
  };

  const reviewers: Reviewer[] = defaultReviewers.map((r, i) => ({
    ...r,
    percentage: percentages[i],
    count: Math.round((percentages[i] / 100) * totalPending),
  }));

  const handleConfirm = () => {
    onConfirm(reviewers);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/20" onClick={onClose}>
      <div className="bg-card border border-border rounded-lg shadow-lg w-[460px]" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <h3 className="text-[13px] font-semibold text-foreground">Distribute Records</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded"><X className="w-4 h-4 text-muted-foreground" /></button>
        </div>

        {/* Total Pending */}
        <div className="px-4 py-3 border-b border-border">
          <p className="text-[11px] text-muted-foreground text-center">Total Records Pending Review</p>
          <p className="text-[28px] font-semibold text-primary leading-none tabular-nums text-center mt-1">
            {totalPending.toLocaleString()}
          </p>
        </div>

        {/* User Assignments */}
        <div className="px-4 py-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-foreground uppercase tracking-wider">User Assignments</p>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground">Unassigned:</span>
              <span className={`w-2 h-2 rounded-full ${unassigned > 0 ? 'bg-status-amber' : 'bg-brand'}`} />
              <span className={`text-[11px] font-medium tabular-nums ${unassigned > 0 ? 'text-status-amber' : 'text-brand'}`}>
                {unassigned}%
              </span>
            </div>
          </div>

          <div className="space-y-1">
            {reviewers.map((reviewer, i) => (
              <div key={reviewer.name} className="flex items-center gap-3 py-1.5 px-2.5 rounded border border-border bg-background">
                <div className="w-[90px] flex-shrink-0">
                  <p className="text-[12px] font-medium text-foreground leading-tight">{reviewer.name}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{reviewer.role}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <Slider
                    value={[percentages[i]]}
                    onValueChange={([v]) => handleSliderChange(i, v)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
                <span className="text-[11px] text-muted-foreground tabular-nums w-[28px] text-right">
                  {percentages[i]}%
                </span>
                <span className="text-[16px] font-semibold text-primary tabular-nums w-[40px] text-right leading-none">
                  {reviewer.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-border">
          <button onClick={onClose} className="px-3 py-1.5 text-[11px] text-muted-foreground hover:bg-muted rounded transition-colors">Cancel</button>
          <button onClick={handleConfirm} className="px-3 py-1.5 text-[11px] font-medium text-primary-foreground bg-primary hover:bg-primary-dark rounded transition-colors">
            Confirm Distribution
          </button>
        </div>
      </div>
    </div>
  );
}
