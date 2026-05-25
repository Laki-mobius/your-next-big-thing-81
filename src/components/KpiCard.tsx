interface KpiCardProps {
  label: string;
  value: string;
  delta: string;
  subtitle: string;
  icon: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}

export default function KpiCard({ label, value, delta, subtitle, icon, onClick, active }: KpiCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-card border rounded-lg p-3.5 cursor-pointer transition-all duration-150 hover:bg-brand-light hover:border-brand-mid hover:shadow-[0_2px_10px_rgba(26,122,74,0.07)] hover:-translate-y-px ${active ? 'bg-brand-light border-brand-mid shadow-[0_2px_10px_rgba(26,122,74,0.10)] ring-1 ring-brand/20' : 'border-border'}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="text-sm font-normal text-foreground leading-tight">{label}</div>
        <div className="text-muted-foreground shrink-0 opacity-55">{icon}</div>
      </div>
      <div className="flex items-baseline gap-2 mb-1.5">
        <div className="text-[28px] font-normal text-foreground tracking-[-1.5px] leading-none">{value}</div>
        <div className="text-[13px] text-brand font-medium flex items-center gap-0.5 whitespace-nowrap">
          <svg viewBox="0 0 10 10" fill="none" className="w-[11px] h-[11px]">
            <path d="M5 8V2M2 5l3-3 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          {delta}
        </div>
      </div>
      <div className="text-xs text-muted-foreground">{subtitle}</div>
    </div>
  );
}
