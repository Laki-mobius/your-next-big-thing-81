import { cn } from '@/lib/utils';

// Shared sub-components for modals

export function ModalShell({ children, id, onClose, wide = true, fullHeight = false, inline = false }: {
  children: React.ReactNode;
  id: string;
  onClose: () => void;
  wide?: boolean;
  fullHeight?: boolean;
  inline?: boolean;
}) {
  if (inline) {
    return (
      <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col shadow-sm">
        {children}
      </div>
    );
  }
  return (
    <div
      className="fixed inset-0 bg-black/55 z-[300] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={cn(
        'bg-card rounded-2xl w-full overflow-hidden flex flex-col shadow-[0_24px_64px_rgba(0,0,0,0.22)]',
        wide ? 'max-w-[1100px]' : 'max-w-[720px]',
        fullHeight ? 'h-[90vh]' : 'max-h-[92vh]'
      )}>
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ title, subtitle, iconBg, icon, onClose }: {
  title: string;
  subtitle: string;
  iconBg: string;
  icon: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="px-6 pt-4 pb-3 border-b border-border shrink-0 flex items-center justify-between">
      <div className="flex items-center gap-3.5">
        <div className={cn('w-[38px] h-[38px] rounded-[10px] flex items-center justify-center shrink-0', iconBg)}>
          {icon}
        </div>
        <div>
          <div className="text-[15px] font-semibold text-foreground mb-0.5">{title}</div>
          <div className="text-[11px] text-muted-foreground">{subtitle}</div>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-[5px] text-[11px] text-brand bg-brand-light px-2.5 py-[3px] rounded-[20px] font-medium">
          <div className="w-[7px] h-[7px] rounded-full bg-brand animate-pulse-dot" />
          Live
        </div>
        <button
          onClick={onClose}
          className="w-[26px] h-[26px] rounded-md border border-border bg-surface flex items-center justify-center cursor-pointer text-muted-foreground hover:bg-border hover:text-foreground transition-colors"
        >
          <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3">
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.08em] mb-3 flex items-center gap-2">
      {children}
      <span className="flex-1 h-px bg-border" />
    </div>
  );
}

export function StatusPill({ status, goodLabel = 'Good', warnLabel = 'Medium' }: { status: string; goodLabel?: string; warnLabel?: string }) {
  const cls = status === 'good'
    ? 'bg-brand-light text-brand'
    : status === 'warn'
    ? 'bg-status-amber-light text-status-amber'
    : 'bg-destructive-light text-destructive';
  const label = status === 'good' ? goodLabel : status === 'warn' ? warnLabel : 'Low';
  return <span className={cn('text-[10px] px-[7px] py-[2px] rounded-[20px] font-medium whitespace-nowrap inline-block', cls)}>{label}</span>;
}

export function SegmentCards({ pubLabel, pubValue, pubSub, prvValue, prvSub, showBars, pubBar, prvBar }: {
  pubLabel?: string;
  pubValue: string;
  pubSub: string;
  prvValue: string;
  prvSub: string;
  showBars?: boolean;
  pubBar?: number;
  prvBar?: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <div className="rounded-[10px] p-3 bg-gradient-to-br from-status-blue-light to-[hsl(210,80%,90%)] border border-[hsl(210,50%,82%)] dark:from-[hsl(210,60%,12%)] dark:to-[hsl(210,50%,15%)] dark:border-[hsl(210,40%,25%)]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-status-blue">{pubLabel || 'Public companies'}</span>
          <div className="w-[19px] h-[19px] rounded-[5px] bg-[rgba(24,95,165,0.12)] flex items-center justify-center">
            <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5"><path d="M2 9h8M3 9V5.5L6 3l3 2.5V9" stroke="#185FA5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>
        <div className="text-[21px] font-light tracking-[-1px] leading-none text-status-blue mb-0.5">{pubValue}</div>
        <div className="text-[10px] text-muted-foreground">{pubSub}</div>
        {showBars && pubBar != null && (
          <div className="h-[3px] bg-black/[0.08] rounded-sm overflow-hidden mt-1.5">
            <div className="h-full rounded-sm bg-status-blue" style={{ width: `${pubBar}%` }} />
          </div>
        )}
      </div>
      <div className="rounded-[10px] p-3 bg-gradient-to-br from-brand-light to-[hsl(148,50%,86%)] border border-brand-mid dark:from-[hsl(152,38%,16%)] dark:to-[hsl(152,40%,19%)] dark:border-[hsl(152,35%,22%)]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-brand">{pubLabel ? 'Private' : 'Private companies'}</span>
          <div className="w-[19px] h-[19px] rounded-[5px] bg-[rgba(26,122,74,0.12)] flex items-center justify-center">
            <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5"><rect x="2" y="5" width="8" height="6" rx="1" stroke="#1A7A4A" strokeWidth="1.2" /><path d="M4 5V4a2 2 0 1 1 4 0v1" stroke="#1A7A4A" strokeWidth="1.2" strokeLinecap="round" /></svg>
          </div>
        </div>
        <div className="text-[21px] font-light tracking-[-1px] leading-none text-brand mb-0.5">{prvValue}</div>
        <div className="text-[10px] text-muted-foreground">{prvSub}</div>
        {showBars && prvBar != null && (
          <div className="h-[3px] bg-black/[0.08] rounded-sm overflow-hidden mt-1.5">
            <div className="h-full rounded-sm bg-brand" style={{ width: `${prvBar}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}

export function TierBreakdown({ tiers }: { tiers: { label: string; name: string; value: string; width: string; color: string; tierClass: string }[] }) {
  return (
    <div>
      {tiers.map((t, i) => (
        <div key={i} className={cn('bg-surface border border-border rounded-md py-2.5 px-3 flex items-center gap-2.5 transition-colors hover:border-gray-300 hover:bg-card', i < tiers.length - 1 && 'mb-1.5')}>
          <span className={cn('text-[10px] font-bold py-0.5 px-[7px] rounded-md tracking-[0.04em] shrink-0 whitespace-nowrap', t.tierClass)}>{t.label}</span>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-normal text-muted-foreground mb-[3px]">{t.name}</div>
            <div className="h-[3px] bg-border rounded-sm overflow-hidden">
              <div className="h-full rounded-sm" style={{ width: t.width, background: t.color }} />
            </div>
          </div>
          <div className="text-[13px] font-semibold text-foreground text-right shrink-0 font-mono min-w-[36px]">{t.value}</div>
        </div>
      ))}
    </div>
  );
}

export function HeroCard({ label, value, subtitle, ringPercent }: {
  label: string;
  value: string;
  subtitle: string;
  ringPercent: number;
}) {
  const circumference = 2 * Math.PI * 26;
  const offset = circumference * (1 - ringPercent / 100);
  return (
    <div className="bg-gradient-to-br from-brand-light to-[hsl(148,50%,83%)] border border-brand-mid rounded-[11px] p-3.5 flex items-center justify-between mb-3.5 dark:from-[hsl(152,38%,16%)] dark:to-[hsl(152,40%,19%)] dark:border-[hsl(152,35%,22%)]">
      <div>
        <div className="text-[10px] font-semibold text-brand uppercase tracking-[0.06em] mb-[3px]">{label}</div>
        <div className="text-[30px] font-light text-brand tracking-[-1.5px] leading-none">{value}</div>
        <div className="text-[11px] text-muted-foreground mt-[3px]">{subtitle}</div>
      </div>
      <div className="relative w-[66px] h-[66px] shrink-0">
        <svg viewBox="0 0 66 66" className="w-[66px] h-[66px] -rotate-90">
          <circle cx="33" cy="33" r="26" fill="none" stroke="rgba(26,122,74,0.15)" strokeWidth="6" />
          <circle cx="33" cy="33" r="26" fill="none" stroke="#1A7A4A" strokeWidth="6" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-brand">
          {Math.round(ringPercent)}%
        </div>
      </div>
    </div>
  );
}

export function AttributeTable({ data, columns, colorFn }: {
  data: { name: string; src?: string; g?: string; v: number; cnt: string; ref: string; status?: React.ReactNode }[];
  columns: string[];
  colorFn: (v: number) => string;
}) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="overflow-y-auto max-h-[340px]">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-surface">
              {columns.map(col => (
                <th key={col} className="text-left text-[10px] font-bold text-muted-foreground uppercase tracking-[0.05em] py-[7px] px-2.5 border-b-[1.5px] border-border whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={columns.length} className="text-center py-4 text-muted-foreground text-xs">No results</td></tr>
            ) : (
              data.map((row, i) => (
                <tr key={i} className="hover:bg-surface">
                  <td className="py-1.5 px-2.5 border-b border-border font-normal text-foreground whitespace-nowrap text-xs">{row.name}</td>
                  <td className="py-1.5 px-2.5 border-b border-border text-muted-foreground text-[11px] whitespace-nowrap">{row.src || row.g}</td>
                  <td className="py-1.5 px-2.5 border-b border-border min-w-[110px]">
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-[5px] bg-border rounded-sm overflow-hidden">
                        <div className="h-full rounded-sm" style={{ width: `${row.v}%`, background: colorFn(row.v) }} />
                      </div>
                      <span className="font-semibold text-[11px] font-mono" style={{ color: colorFn(row.v) }}>{row.v}%</span>
                    </div>
                  </td>
                  <td className="py-1.5 px-2.5 border-b border-border text-[11px] text-muted-foreground font-mono whitespace-nowrap">{row.cnt}</td>
                  <td className="py-1.5 px-2.5 border-b border-border text-[11px] text-muted-foreground whitespace-nowrap">{row.ref}</td>
                  <td className="py-1.5 px-2.5 border-b border-border">{row.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function FilterToolbar({ searchId, searchPlaceholder, onSearch, groups, selectedGroup, onGroupChange, pills, activePill, onPillClick }: {
  searchId: string;
  searchPlaceholder: string;
  onSearch: (v: string) => void;
  groups: string[];
  selectedGroup: string;
  onGroupChange: (v: string) => void;
  pills: { value: string; label: string }[];
  activePill: string;
  onPillClick: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 mb-2.5 flex-wrap">
      <div className="relative flex-1 min-w-[130px] max-w-[180px]">
        <svg viewBox="0 0 14 14" fill="none" className="absolute left-2 top-1/2 -translate-y-1/2 w-[11px] h-[11px] text-muted-foreground pointer-events-none">
          <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3" />
          <path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        <input
          id={searchId}
          className="w-full py-[5px] pr-2 pl-7 border border-border rounded-md text-[11px] bg-card text-foreground outline-none focus:border-brand"
          placeholder={searchPlaceholder}
          onChange={e => onSearch(e.target.value)}
        />
      </div>
      <div className="relative shrink-0">
        <select
          className="appearance-none py-[5px] pl-2.5 pr-6 border border-border rounded-md text-[11px] bg-card text-foreground outline-none cursor-pointer min-w-[150px] focus:border-brand"
          value={selectedGroup}
          onChange={e => onGroupChange(e.target.value)}
        >
          <option value="all">All data groups</option>
          {groups.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <span className="absolute right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-muted-foreground pointer-events-none" />
      </div>
      <div className="flex gap-[5px] flex-wrap ml-auto">
        {pills.map(p => (
          <button
            key={p.value}
            className={cn(
              'py-[3px] px-2 rounded-[20px] border text-[11px] font-medium cursor-pointer',
              activePill === p.value
                ? 'bg-gray-900 border-gray-900 text-primary-foreground dark:bg-brand dark:border-brand'
                : 'bg-card border-border text-muted-foreground'
            )}
            onClick={() => onPillClick(p.value)}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
