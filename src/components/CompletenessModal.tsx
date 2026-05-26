import { useState, useMemo } from 'react';
import { ModalShell, ModalHeader, SectionLabel, SegmentCards, TierBreakdown, HeroCard } from './ModalParts';
import { cn } from '@/lib/utils';
import { format, subDays, subMonths, isAfter, isBefore, startOfDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// POC attributes — ordered per requested display sequence
const currentnessData = [
  { name: 'Company Name', g: 'Basic Data', ref: '2026-05-22', cnt: '1000', pct: '100.0%', geo: { US: '181', UK: '88', Europe: '129', APAC: '432', Other: '170' } },
  { name: 'Website', g: 'Basic Data', ref: '2026-05-21', cnt: '462', pct: '100.0%', geo: { US: '84', UK: '41', Europe: '146', APAC: '147', Other: '44' } },
  { name: 'Suffix', g: 'Corporate Hierarchy & Governance', ref: '2026-05-22', cnt: '45', pct: '100.0%', geo: { US: '8', UK: '4', Europe: '14', APAC: '15', Other: '4' } },
  { name: 'First Name', g: 'Corporate Hierarchy & Governance', ref: '2026-05-22', cnt: '503', pct: '100.0%', geo: { US: '91', UK: '44', Europe: '160', APAC: '160', Other: '48' } },
  { name: 'Middle Name', g: 'Corporate Hierarchy & Governance', ref: '2026-05-22', cnt: '150', pct: '100.0%', geo: { US: '27', UK: '13', Europe: '48', APAC: '48', Other: '14' } },
  { name: 'Last Name', g: 'Corporate Hierarchy & Governance', ref: '2026-05-22', cnt: '503', pct: '100.0%', geo: { US: '91', UK: '44', Europe: '160', APAC: '160', Other: '48' } },
  { name: 'Executive Title', g: 'Corporate Hierarchy & Governance', ref: '2026-05-22', cnt: '503', pct: '100.0%', geo: { US: '91', UK: '44', Europe: '160', APAC: '160', Other: '48' } },
  { name: 'Number of Employees', g: 'Basic Data', ref: '2026-05-22', cnt: '542', pct: '100.0%', geo: { US: '98', UK: '48', Europe: '172', APAC: '172', Other: '52' } },
  { name: 'Revenue', g: 'Financial Data', ref: '2026-05-22', cnt: '514', pct: '100.0%', geo: { US: '93', UK: '46', Europe: '163', APAC: '163', Other: '49' } },
  { name: 'Revenue Currency', g: 'Financial Data', ref: '2026-05-22', cnt: '514', pct: '100.0%', geo: { US: '93', UK: '46', Europe: '163', APAC: '163', Other: '49' } },
  { name: 'Revenue Fiscal Year', g: 'Financial Data', ref: '2026-05-22', cnt: '205', pct: '100.0%', geo: { US: '37', UK: '18', Europe: '65', APAC: '65', Other: '20' } },
  { name: 'Annual Report', g: 'Financial Data', ref: '2026-05-22', cnt: '52', pct: '100.0%', geo: { US: '9', UK: '5', Europe: '17', APAC: '16', Other: '5' } },
];

type DatePreset = 'week' | 'month' | '3months' | 'custom';

export default function CompletenessModal({ onClose, inline = false }: { onClose: () => void; inline?: boolean }) {
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState('all');
  const [segment, setSegment] = useState('all');
  const [tier, setTier] = useState('all');
  const [geography, setGeography] = useState('all');
  const [companySize, setCompanySize] = useState('all');
  const [revenue, setRevenue] = useState('all');
  const [datePreset, setDatePreset] = useState<DatePreset>('month');
  const [customFrom, setCustomFrom] = useState<Date | undefined>(subMonths(new Date(), 1));
  const [customTo, setCustomTo] = useState<Date | undefined>(new Date());
  const [geoExpanded, setGeoExpanded] = useState<string | null>(null);

  const dateRange = useMemo(() => {
    const now = new Date();
    switch (datePreset) {
      case 'week': return { from: subDays(now, 7), to: now };
      case 'month': return { from: subMonths(now, 1), to: now };
      case '3months': return { from: subMonths(now, 3), to: now };
      case 'custom': return { from: customFrom || subMonths(now, 1), to: customTo || now };
    }
  }, [datePreset, customFrom, customTo]);

  const filtered = useMemo(() => {
    return currentnessData.filter(a => {
      const refDate = startOfDay(new Date(a.ref));
      const inDateRange = isAfter(refDate, startOfDay(dateRange.from)) || refDate.getTime() === startOfDay(dateRange.from).getTime();
      const beforeEnd = isBefore(refDate, startOfDay(dateRange.to)) || refDate.getTime() === startOfDay(dateRange.to).getTime();
      return a.name.toLowerCase().includes(search.toLowerCase()) &&
        (group === 'all' || a.g === group) &&
        inDateRange && beforeEnd;
    });
  }, [search, group, dateRange]);

  const tiers = [
    { label: 'T1', name: 'Public — US', value: '100%', width: '100%', color: '#185FA5', tierClass: 'bg-status-blue-light text-status-blue' },
    { label: 'T2', name: 'Public — Non-US', value: '100%', width: '100%', color: '#1A7A4A', tierClass: 'bg-brand-light text-brand' },
    { label: 'T3', name: 'Private — US', value: '100%', width: '100%', color: '#C97A00', tierClass: 'bg-status-amber-light text-status-amber' },
    { label: 'T4', name: 'Private — Non-US', value: '100%', width: '100%', color: '#534AB7', tierClass: 'bg-status-purple-light text-status-purple' },
  ];

  const geoKeys = ['US', 'UK', 'Europe', 'APAC', 'Other'] as const;
  const geoColors: Record<string, string> = { US: '#185FA5', UK: '#1A7A4A', Europe: '#534AB7', APAC: '#C97A00', Other: 'hsl(var(--muted-foreground))' };

  const freshnessPill = (dateStr: string) => {
    const days = (Date.now() - new Date(dateStr).getTime()) / 86400000;
    if (days < 30) return { label: 'Fresh', cls: 'bg-brand-light text-brand' };
    if (days < 90) return { label: 'Aging', cls: 'bg-status-amber-light text-status-amber' };
    return { label: 'Stale', cls: 'bg-destructive-light text-destructive' };
  };

  return (
    <ModalShell id="modal-currentness" onClose={onClose} fullHeight inline={inline}>
      <div className="grid grid-cols-[280px_1fr] flex-1 overflow-hidden min-h-0">
        <div className="p-[18px_20px] overflow-y-auto border-r border-border">
          <HeroCard label="Overall currentness" value="100%" subtitle="+0.8% vs previous month" ringPercent={100} />
          <div className="mb-4"><SectionLabel>By segment</SectionLabel><SegmentCards pubLabel="Public" pubValue="100%" pubSub="Daily" prvValue="100%" prvSub="Weekly" showBars pubBar={100} prvBar={100} /></div>
          <div><SectionLabel>Tier breakdown</SectionLabel><TierBreakdown tiers={tiers} /></div>
        </div>

        <div className="p-[18px_20px] overflow-y-auto flex flex-col gap-3.5">
          {/* Date Range Selector */}
          <div>
            <SectionLabel>Last verified update by attribute</SectionLabel>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.05em]">Date Range</span>
              <div className="flex gap-1">
                {([
                  { v: 'week' as DatePreset, l: 'Last Week' },
                  { v: 'month' as DatePreset, l: 'Last Month' },
                  { v: '3months' as DatePreset, l: 'Last 3 Months' },
                  { v: 'custom' as DatePreset, l: 'Custom' },
                ]).map(o => (
                  <button key={o.v} onClick={() => setDatePreset(o.v)} className={cn('py-[3px] px-2.5 rounded-[20px] border text-[11px] font-medium cursor-pointer transition-colors', datePreset === o.v ? 'bg-gray-900 border-gray-900 text-primary-foreground dark:bg-brand dark:border-brand' : 'bg-card border-border text-muted-foreground')}>{o.l}</button>
                ))}
              </div>
              {datePreset === 'custom' && (
                <div className="flex items-center gap-1.5 ml-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="py-[3px] px-2.5 rounded-md border border-border bg-card text-[11px] text-foreground cursor-pointer hover:border-brand">
                        {customFrom ? format(customFrom, 'MMM dd, yyyy') : 'From'}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={customFrom} onSelect={setCustomFrom} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                  <span className="text-[10px] text-muted-foreground">to</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="py-[3px] px-2.5 rounded-md border border-border bg-card text-[11px] text-foreground cursor-pointer hover:border-brand">
                        {customTo ? format(customTo, 'MMM dd, yyyy') : 'To'}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={customTo} onSelect={setCustomTo} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
              <div className="ml-auto text-[10px] text-muted-foreground">
                Showing: {format(dateRange.from, 'MMM dd')} – {format(dateRange.to, 'MMM dd, yyyy')}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2.5 flex-wrap">
              <div className="relative flex-1 min-w-[130px] max-w-[160px]">
                <svg viewBox="0 0 14 14" fill="none" className="absolute left-2 top-1/2 -translate-y-1/2 w-[11px] h-[11px] text-muted-foreground pointer-events-none">
                  <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                <input className="w-full py-[5px] pr-2 pl-7 border border-border rounded-md text-[11px] bg-card text-foreground outline-none focus:border-brand" placeholder="Search attribute..." onChange={e => setSearch(e.target.value)} />
              </div>
              {/* Segment */}
              <div className="relative shrink-0">
                <select className="appearance-none py-[5px] pl-2.5 pr-6 border border-border rounded-md text-[11px] bg-card text-foreground outline-none cursor-pointer focus:border-brand" value={segment} onChange={e => setSegment(e.target.value)}>
                  <option value="all">All Segments</option>
                  <option value="public">Public Companies</option>
                  <option value="private">Private Companies</option>
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-muted-foreground pointer-events-none" />
              </div>
              {/* Tier */}
              <div className="relative shrink-0">
                <select className="appearance-none py-[5px] pl-2.5 pr-6 border border-border rounded-md text-[11px] bg-card text-foreground outline-none cursor-pointer focus:border-brand" value={tier} onChange={e => setTier(e.target.value)}>
                  <option value="all">All Tiers</option>
                  <option value="t1">Tier 1</option>
                  <option value="t2">Tier 2</option>
                  <option value="t3">Tier 3</option>
                  <option value="t4">Tier 4</option>
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-muted-foreground pointer-events-none" />
              </div>
              {/* Geography */}
              <div className="relative shrink-0">
                <select className="appearance-none py-[5px] pl-2.5 pr-6 border border-border rounded-md text-[11px] bg-card text-foreground outline-none cursor-pointer focus:border-brand" value={geography} onChange={e => setGeography(e.target.value)}>
                  <option value="all">All Geographies</option>
                  <option value="na">North America</option>
                  <option value="eu">Europe</option>
                  <option value="apac">APAC</option>
                  <option value="mena">Middle East</option>
                  <option value="africa">Africa</option>
                  <option value="latam">Latin America</option>
                  <option value="us">United States</option>
                  <option value="uk">United Kingdom</option>
                  <option value="de">Germany</option>
                  <option value="fr">France</option>
                  <option value="in">India</option>
                  <option value="cn">China</option>
                  <option value="jp">Japan</option>
                  <option value="au">Australia</option>
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-muted-foreground pointer-events-none" />
              </div>
              {/* Data Group */}
              <div className="relative shrink-0">
                <select className="appearance-none py-[5px] pl-2.5 pr-6 border border-border rounded-md text-[11px] bg-card text-foreground outline-none cursor-pointer focus:border-brand" value={group} onChange={e => setGroup(e.target.value)}>
                  <option value="all">All Data Groups</option>
                  {['Basic Data', 'Financial Data', 'Corporate Hierarchy & Governance'].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-muted-foreground pointer-events-none" />
              </div>
              {/* Company Size */}
              <div className="relative shrink-0">
                <select className="appearance-none py-[5px] pl-2.5 pr-6 border border-border rounded-md text-[11px] bg-card text-foreground outline-none cursor-pointer focus:border-brand" value={companySize} onChange={e => setCompanySize(e.target.value)}>
                  <option value="all">All Sizes</option>
                  <option value="small">Small</option>
                  <option value="mid">Mid</option>
                  <option value="large">Large</option>
                  <option value="enterprise">Enterprise</option>
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-muted-foreground pointer-events-none" />
              </div>
              {/* Revenue */}
              <div className="relative shrink-0">
                <select className="appearance-none py-[5px] pl-2.5 pr-6 border border-border rounded-md text-[11px] bg-card text-foreground outline-none cursor-pointer focus:border-brand" value={revenue} onChange={e => setRevenue(e.target.value)}>
                  <option value="all">All Revenue</option>
                  <option value="0-1m">$0 – $1M</option>
                  <option value="1-10m">$1M – $10M</option>
                  <option value="10-50m">$10M – $50M</option>
                  <option value="50-250m">$50M – $250M</option>
                  <option value="250m-1b">$250M – $1B</option>
                  <option value="1b+">$1B+</option>
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Table */}
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="overflow-y-auto max-h-[340px]">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-surface">
                      <th className="text-left text-[10px] font-bold text-muted-foreground uppercase tracking-[0.05em] py-[7px] px-2.5 border-b-[1.5px] border-border">Attribute</th>
                      <th className="text-left text-[10px] font-bold text-muted-foreground uppercase tracking-[0.05em] py-[7px] px-2.5 border-b-[1.5px] border-border">Records %</th>
                      <th className="text-left text-[10px] font-bold text-muted-foreground uppercase tracking-[0.05em] py-[7px] px-2.5 border-b-[1.5px] border-border">Records Updated</th>
                      <th className="text-left text-[10px] font-bold text-muted-foreground uppercase tracking-[0.05em] py-[7px] px-2.5 border-b-[1.5px] border-border">Last Verified</th>
                      <th className="text-left text-[10px] font-bold text-muted-foreground uppercase tracking-[0.05em] py-[7px] px-2.5 border-b-[1.5px] border-border">Freshness</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-4 text-muted-foreground text-xs">No records in selected date range</td></tr>
                    ) : filtered.map((row, i) => {
                      const fp = freshnessPill(row.ref);
                      return (
                          <tr key={row.name} className="hover:bg-surface">
                            <td className="py-1.5 px-2.5 border-b border-border text-foreground whitespace-nowrap text-xs">{row.name}</td>
                            <td className="py-1.5 px-2.5 border-b border-border whitespace-nowrap min-w-[120px]">
                              {(() => {
                                const pctNum = parseFloat(row.pct);
                                const barColor = pctNum >= 90 ? 'bg-brand' : pctNum >= 70 ? 'bg-status-amber' : 'bg-destructive';
                                const textColor = pctNum >= 90 ? 'text-brand' : pctNum >= 70 ? 'text-status-amber' : 'text-destructive';
                                return (
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-[7px] rounded-full bg-secondary overflow-hidden">
                                      <div className={cn('h-full rounded-full transition-all', barColor)} style={{ width: row.pct }} />
                                    </div>
                                    <span className={cn('text-[11px] font-semibold font-mono', textColor)}>{row.pct}</span>
                                  </div>
                                );
                              })()}
                            </td>
                            <td className="py-1.5 px-2.5 border-b border-border text-[11px] text-foreground font-semibold font-mono whitespace-nowrap">{row.cnt}</td>
                            <td className="py-1.5 px-2.5 border-b border-border text-[11px] text-muted-foreground whitespace-nowrap">{row.ref}</td>
                            <td className="py-1.5 px-2.5 border-b border-border"><span className={cn('text-[10px] px-[7px] py-[2px] rounded-[20px] font-medium whitespace-nowrap inline-block', fp.cls)}>{fp.label}</span></td>
                          </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
