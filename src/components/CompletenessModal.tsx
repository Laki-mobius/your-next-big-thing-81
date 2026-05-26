import { useState, useMemo } from 'react';
import { ModalShell, ModalHeader, SectionLabel, SegmentCards, TierBreakdown, HeroCard } from './ModalParts';
import { cn } from '@/lib/utils';
import { format, subDays, subMonths, isAfter, isBefore, startOfDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const currentnessData = [
  { name: 'Company Name', g: 'Basic Data', ref: '2026-03-14', cnt: '98.5M', pct: '98.2%', geo: { US: '42.1M', UK: '8.2M', Europe: '22.4M', APAC: '18.6M', Other: '7.2M' } },
  { name: 'Country', g: 'Basic Data', ref: '2026-03-14', cnt: '97.9M', pct: '97.6%', geo: { US: '41.8M', UK: '8.1M', Europe: '22.1M', APAC: '18.3M', Other: '7.6M' } },
  { name: 'Street Address', g: 'Basic Data', ref: '2026-03-13', cnt: '90.3M', pct: '90.1%', geo: { US: '38.7M', UK: '7.5M', Europe: '20.4M', APAC: '16.9M', Other: '6.8M' } },
  { name: 'City', g: 'Basic Data', ref: '2026-03-13', cnt: '91.2M', pct: '91.0%', geo: { US: '39.1M', UK: '7.6M', Europe: '20.6M', APAC: '17.1M', Other: '6.8M' } },
  { name: 'Foundation Year', g: 'Basic Data', ref: '2026-03-08', cnt: '83.1M', pct: '82.9%', geo: { US: '35.6M', UK: '6.9M', Europe: '18.8M', APAC: '15.6M', Other: '6.2M' } },
  { name: 'Phone Number', g: 'Basic Data', ref: '2026-03-07', cnt: '70.5M', pct: '70.3%', geo: { US: '30.2M', UK: '5.9M', Europe: '15.9M', APAC: '13.2M', Other: '5.3M' } },
  { name: 'NAICS Code', g: 'Basic Data', ref: '2026-03-12', cnt: '82.9M', pct: '82.7%', geo: { US: '35.5M', UK: '6.9M', Europe: '18.7M', APAC: '15.5M', Other: '6.3M' } },
  { name: 'Website', g: 'Basic Data', ref: '2026-02-22', cnt: '54.9M', pct: '54.8%', geo: { US: '23.5M', UK: '4.6M', Europe: '12.4M', APAC: '10.3M', Other: '4.1M' } },
  { name: 'Revenue', g: 'Financial Data', ref: '2026-03-12', cnt: '81.6M', pct: '81.4%', geo: { US: '34.9M', UK: '6.8M', Europe: '18.4M', APAC: '15.3M', Other: '6.2M' } },
  { name: 'Assets', g: 'Financial Data', ref: '2026-03-10', cnt: '73.3M', pct: '73.1%', geo: { US: '31.4M', UK: '6.1M', Europe: '16.6M', APAC: '13.7M', Other: '5.5M' } },
  { name: 'Net Income', g: 'Financial Data', ref: '2026-03-09', cnt: '67.7M', pct: '67.5%', geo: { US: '29.0M', UK: '5.6M', Europe: '15.3M', APAC: '12.7M', Other: '5.1M' } },
  { name: 'Ticker and Exchange', g: 'Financial Data', ref: '2026-03-14', cnt: '94.0M', pct: '93.8%', geo: { US: '40.3M', UK: '7.8M', Europe: '21.2M', APAC: '17.6M', Other: '7.1M' } },
  { name: 'Executive Name', g: 'Corporate Hierarchy & Governance', ref: '2026-03-06', cnt: '62.6M', pct: '62.4%', geo: { US: '26.8M', UK: '5.2M', Europe: '14.1M', APAC: '11.7M', Other: '4.8M' } },
  { name: 'Board of Directors', g: 'Corporate Hierarchy & Governance', ref: '2026-02-28', cnt: '57.6M', pct: '57.4%', geo: { US: '24.7M', UK: '4.8M', Europe: '13.0M', APAC: '10.8M', Other: '4.3M' } },
  { name: 'Parent Company', g: 'Corporate Hierarchy & Governance', ref: '2026-02-25', cnt: '54.1M', pct: '54.0%', geo: { US: '23.2M', UK: '4.5M', Europe: '12.2M', APAC: '10.1M', Other: '4.1M' } },
  { name: 'Mergers & Acquisition', g: 'Corporate Hierarchy & Governance', ref: '2026-02-20', cnt: '46.6M', pct: '46.5%', geo: { US: '20.0M', UK: '3.9M', Europe: '10.5M', APAC: '8.7M', Other: '3.5M' } },
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
    { label: 'T1', name: 'Public — US', value: '95.3%', width: '95.3%', color: '#185FA5', tierClass: 'bg-status-blue-light text-status-blue' },
    { label: 'T2', name: 'Public — Non-US', value: '91.6%', width: '91.6%', color: '#1A7A4A', tierClass: 'bg-brand-light text-brand' },
    { label: 'T3', name: 'Private — US', value: '91.2%', width: '91.2%', color: '#C97A00', tierClass: 'bg-status-amber-light text-status-amber' },
    { label: 'T4', name: 'Private — Non-US', value: '89.3%', width: '89.3%', color: '#534AB7', tierClass: 'bg-status-purple-light text-status-purple' },
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
          <HeroCard label="Overall currentness" value="91.8%" subtitle="+0.8% vs previous month" ringPercent={91.8} />
          <div className="mb-4"><SectionLabel>By segment</SectionLabel><SegmentCards pubLabel="Public" pubValue="93.5%" pubSub="Daily" prvValue="90.7%" prvSub="Weekly" showBars pubBar={93.5} prvBar={90.7} /></div>
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
