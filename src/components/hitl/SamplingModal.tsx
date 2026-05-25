import { useState } from "react";
import { X, FlaskConical } from "lucide-react";

interface SamplingModalProps {
  open: boolean;
  onClose: () => void;
  onSample: (method: string, value: number) => void;
  totalRecords: number;
}

export default function SamplingModal({ open, onClose, onSample, totalRecords }: SamplingModalProps) {
  const [method, setMethod] = useState<"random" | "percentage" | "category">("random");
  const [sampleSize, setSampleSize] = useState(50);
  const [pct, setPct] = useState(10);

  if (!open) return null;

  const handleRun = () => {
    if (method === "random") onSample("random", sampleSize);
    else if (method === "percentage") onSample("percentage", pct);
    else onSample("category", 0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/20" onClick={onClose}>
      <div className="bg-card border border-border rounded-lg shadow-lg w-[380px]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-primary" />
            <h3 className="text-[13px] font-semibold text-foreground">QC Sampling</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded"><X className="w-4 h-4 text-muted-foreground" /></button>
        </div>
        <div className="px-4 py-3 space-y-3">
          <p className="text-[11px] text-muted-foreground">Total records available: <span className="font-medium text-foreground">{totalRecords}</span></p>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[12px] cursor-pointer">
              <input type="radio" name="method" checked={method === "random"} onChange={() => setMethod("random")} className="accent-primary" />
              Random Sample
            </label>
            {method === "random" && (
              <input
                type="number" min={1} max={totalRecords} value={sampleSize}
                onChange={e => setSampleSize(Number(e.target.value))}
                className="w-full px-2 py-1.5 text-[12px] bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Sample size"
              />
            )}

            <label className="flex items-center gap-2 text-[12px] cursor-pointer">
              <input type="radio" name="method" checked={method === "percentage"} onChange={() => setMethod("percentage")} className="accent-primary" />
              By Percentage
            </label>
            {method === "percentage" && (
              <div className="flex items-center gap-2">
                <input
                  type="number" min={1} max={100} value={pct}
                  onChange={e => setPct(Number(e.target.value))}
                  className="w-20 px-2 py-1.5 text-[12px] bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <span className="text-[11px] text-muted-foreground">% of dataset ({Math.ceil(totalRecords * pct / 100)} records)</span>
              </div>
            )}

            <label className="flex items-center gap-2 text-[12px] cursor-pointer">
              <input type="radio" name="method" checked={method === "category"} onChange={() => setMethod("category")} className="accent-primary" />
              By Attribute Category
            </label>
            {method === "category" && (
              <p className="text-[11px] text-muted-foreground pl-5">Samples records from each attribute category proportionally.</p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-border">
          <button onClick={onClose} className="px-3 py-1.5 text-[11px] text-muted-foreground hover:bg-muted rounded transition-colors">Cancel</button>
          <button onClick={handleRun} className="px-3 py-1.5 text-[11px] font-medium text-primary-foreground bg-primary hover:bg-primary-dark rounded transition-colors">
            Run Sample
          </button>
        </div>
      </div>
    </div>
  );
}
