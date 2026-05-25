import { FlaskConical, Users, Clock, CheckCircle2, XCircle, Gauge } from "lucide-react";
import { toast } from "sonner";

interface QCSummaryCardsProps {
  totalRecords: number;
  pendingReview: number;
  approvedToday: number;
  rejected: number;
  preHitlScore: number;
  onSample: () => void;
  onDistribute: () => void;
}

export default function QCSummaryCards({
  totalRecords, pendingReview, approvedToday, rejected, preHitlScore, onSample, onDistribute
}: QCSummaryCardsProps) {
  const cards = [
    {
      label: "Sampling",
      value: totalRecords.toLocaleString(),
      subtitle: "Total records",
      icon: <FlaskConical className="w-4 h-4" />,
      action: onSample,
      actionLabel: "Run Sample",
      trend: null,
    },
    {
      label: "Distribute Records",
      value: "",
      subtitle: "Assign to reviewers",
      icon: <Users className="w-4 h-4" />,
      action: onDistribute,
      actionLabel: "Distribute",
      trend: null,
    },
    {
      label: "Pending Review",
      value: pendingReview.toLocaleString(),
      subtitle: "Awaiting QC",
      icon: <Clock className="w-4 h-4" />,
      action: null,
      actionLabel: null,
      trend: pendingReview > 0 ? "needs-attention" : "good",
    },
    {
      label: "Approved Today",
      value: approvedToday.toLocaleString(),
      subtitle: "Records approved",
      icon: <CheckCircle2 className="w-4 h-4" />,
      action: null,
      actionLabel: null,
      trend: "up",
    },
    {
      label: "Rejected",
      value: rejected.toLocaleString(),
      subtitle: "Records rejected",
      icon: <XCircle className="w-4 h-4" />,
      action: null,
      actionLabel: null,
      trend: rejected > 0 ? "warning" : "good",
    },
    {
      label: "Pre-HITL Score",
      value: `${preHitlScore}%`,
      subtitle: "Automation accuracy",
      icon: <Gauge className="w-4 h-4" />,
      action: null,
      actionLabel: null,
      trend: preHitlScore >= 80 ? "up" : "warning",
    },
  ];

  return (
    <div className="grid grid-cols-6 gap-2.5">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-card border border-border rounded-lg p-3.5 flex flex-col justify-between cursor-default transition-all duration-150 hover:bg-brand-light hover:border-brand-mid hover:shadow-[0_2px_10px_rgba(26,122,74,0.07)] hover:-translate-y-px"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="text-sm font-normal text-foreground leading-tight">
              {card.label}
            </div>
            <div className="text-muted-foreground shrink-0 opacity-55">
              {card.icon}
            </div>
          </div>
          {card.value && (
            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="text-[28px] font-normal text-foreground tracking-[-1.5px] leading-none">
                {card.value}
              </span>
              {card.trend === "up" && (
                <span className="text-[13px] text-brand font-medium flex items-center gap-0.5">
                  <svg viewBox="0 0 10 10" fill="none" className="w-[11px] h-[11px]">
                    <path d="M5 8V2M2 5l3-3 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </span>
              )}
              {card.trend === "warning" && (
                <span className="text-[13px] text-status-amber font-medium">⚠</span>
              )}
              {card.trend === "needs-attention" && (
                <span className="text-[13px] text-status-amber font-medium">●</span>
              )}
            </div>
          )}
          <div className="text-xs text-muted-foreground">{card.subtitle}</div>
          {card.action && (
            <button
              onClick={card.action}
              className="mt-1.5 text-[11px] font-medium text-primary-foreground bg-primary hover:bg-primary-dark rounded px-2.5 py-1 transition-colors"
            >
              {card.actionLabel}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
