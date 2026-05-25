import { type ValidationRecord, type ValidationAttribute } from "@/data/hitl-validation-data";
import { CheckCircle2, AlertTriangle, Edit3, Flag, X, Eye, MoreVertical, Settings } from "lucide-react";
import { useState } from "react";
import { getConfidenceScoreFromStatus } from "@/lib/confidence";

interface RecordDetailPanelProps {
  record: ValidationRecord;
  onClose: () => void;
  onUpdateAttribute: (recordId: string, attrIndex: number, attr: ValidationAttribute) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onReview: (id: string) => void;
}

const getConfidenceColor = (status: string) => {
  switch (status) {
    case "validated": return "text-brand";
    case "edited": return "text-status-blue";
    case "flagged": return "text-destructive";
    default: return "text-status-amber";
  }
};

const getConfidenceNum = (attr: { name: string; status: string; currentValue: string; extractedValue: string }): number => {
  const value = attr.currentValue || attr.extractedValue || "";
  return getConfidenceScoreFromStatus(attr.status as "validated" | "pending" | "flagged" | "edited", value, attr.name);
};

export default function RecordDetailPanel({ record, onClose, onUpdateAttribute, onApprove, onReject, onReview }: RecordDetailPanelProps) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (idx: number, val: string) => {
    setEditingIdx(idx);
    setEditValue(val);
  };

  const saveEdit = (idx: number) => {
    const attr = record.attributes[idx];
    onUpdateAttribute(record.id, idx, { ...attr, currentValue: editValue, status: "edited", qcFlag: false });
    setEditingIdx(null);
  };

  return (
    <div className="bg-card border border-border rounded-lg flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
        <div>
          <h3 className="text-[13px] font-semibold text-foreground">Record Detail</h3>
          <p className="text-[12px] text-muted-foreground mt-0.5">{record.id} · {record.companyName}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Attributes Grid - only show low-confidence (<85%) */}
      <div className="flex-1 overflow-auto px-3 py-2">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Low Confidence Attributes (&lt;85%)</p>
        <div className="grid grid-cols-3 gap-2">
          {record.attributes.map((attr, idx) => {
            const confidence = getConfidenceNum(attr);
            if (confidence >= 85) return null;
            return (
            <div key={attr.name} className="flex flex-col">
              {/* Attribute header row */}
              <div className="flex items-center gap-1 mb-1">
                <span className="text-[12px] text-foreground truncate flex-1" title={attr.name}>
                  {attr.name}
                </span>
                <span className={`text-[12px] font-medium shrink-0 ${getConfidenceColor(attr.status)}`}>
                  {confidence}%
                </span>
                <button
                  onClick={() => onUpdateAttribute(record.id, idx, { ...attr, status: "validated", qcFlag: false })}
                  className="p-0.5 hover:bg-muted rounded transition-colors shrink-0" title="Accept"
                >
                  <Settings className="w-3 h-3 text-muted-foreground" />
                </button>
                <button
                  onClick={() => startEdit(idx, attr.currentValue)}
                  className="p-0.5 hover:bg-muted rounded transition-colors shrink-0" title="More"
                >
                  <MoreVertical className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
              {/* Value box */}
              <div className="border border-border rounded px-2 py-1.5 bg-background">
                {editingIdx === idx ? (
                  <div className="flex items-center gap-1">
                    <input
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      className="flex-1 text-[12px] bg-transparent focus:outline-none text-foreground"
                      autoFocus
                      onKeyDown={e => { if (e.key === "Enter") saveEdit(idx); if (e.key === "Escape") setEditingIdx(null); }}
                    />
                    <button onClick={() => saveEdit(idx)} className="text-[10px] text-brand font-medium">Save</button>
                  </div>
                ) : (
                  <span className="text-[12px] text-foreground">{attr.currentValue}</span>
                )}
              </div>
            </div>
          );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-t border-border">
        <button
          onClick={() => onReview(record.id)}
          className="flex-1 py-1.5 text-[12px] font-medium text-primary-foreground bg-status-blue hover:opacity-90 rounded transition-colors flex items-center justify-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5" />
          Review
        </button>
      </div>
    </div>
  );
}
