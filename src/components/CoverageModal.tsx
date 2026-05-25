import { useState, useMemo } from 'react';
import { ModalShell, ModalHeader, SectionLabel, SegmentCards, TierBreakdown, HeroCard, StatusPill, AttributeTable, FilterToolbar } from './ModalParts';
import { covData, dataGroups, getColorForValue } from '@/data/dashboard-data';

export default function CoverageModal({ onClose, inline = false }: { onClose: () => void; inline?: boolean }) {
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState('all');
  const [filter, setFilter] = useState('all');
  const [segment, setSegment] = useState('all');
  const [tier, setTier] = useState('all');
  const [geography, setGeography] = useState('all');
  const [companySize, setCompanySize] = useState('all');
  const [revenue, setRevenue] = useState('all');

  // Ensure Company Name and Address appear first with 100% coverage
  const adjustedCovData = useMemo(() => {
    return covData.map(a => {
      if (a.name === 'Company Name' || a.name === 'Street Address') {
        return { ...a, v: 100, cnt: '98.7M', st: 'good' as const };
      }
      return a;
    });
  }, []);

  const sorted = useMemo(() => {
    const priority = ['Company Name', 'Street Address'];
    return [...adjustedCovData].sort((a, b) => {
      const aIdx = priority.indexOf(a.name);
      const bIdx = priority.indexOf(b.name);
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
      if (aIdx !== -1) return -1;
      if (bIdx !== -1) return 1;
      return 0;
    });
  }, [adjustedCovData]);

  const filtered = useMemo(() => {
    return sorted.filter(a =>
      (a.name.toLowerCase().includes(search.toLowerCase()) || a.src.toLowerCase().includes(search.toLowerCase())) &&
      (group === 'all' || a.g === group) &&
      (filter === 'all' || (filter === 'good' && a.v >= 80) || (filter === 'warn' && a.v >= 60 && a.v < 80) || (filter === 'low' && a.v < 60))
    );
  }, [search, group, filter, sorted]);

  const tiers = [
    { label: 'T1', name: 'Public — US', value: '98.2%', width: '98.2%', color: '#185FA5', tierClass: 'bg-status-blue-light text-status-blue' },
    { label: 'T2', name: 'Public — Non-US', value: '95.4%', width: '95.4%', color: '#1A7A4A', tierClass: 'bg-brand-light text-brand' },
    { label: 'T3', name: 'Private — US', value: '94.0%', width: '94%', color: '#C97A00', tierClass: 'bg-status-amber-light text-status-amber' },
    { label: 'T4', name: 'Private — Non-US', value: '91.8%', width: '91.8%', color: '#534AB7', tierClass: 'bg-status-purple-light text-status-purple' },
  ];

  return (
    <ModalShell id="modal-coverage" onClose={onClose} fullHeight inline={inline}>
      <div className="grid grid-cols-[280px_1fr] flex-1 overflow-hidden min-h-0">
        {/* Left Pane */}
        <div className="p-[18px_20px] overflow-y-auto border-r border-border">
          {/* Overall card — bg-surface style, original text sizing */}
          <div className="rounded-[11px] border border-border bg-surface p-3.5 flex items-center justify-between mb-3.5 transition-all hover:border-brand/40 hover:bg-brand-light hover:shadow-sm">
            <div>
              <div className="text-[10px] font-semibold text-brand uppercase tracking-[0.06em] mb-[3px]">Overall</div>
              <div className="text-[30px] font-light text-brand tracking-[-1.5px] leading-none">94.2%</div>
              <div className="text-[11px] text-muted-foreground mt-[3px]">+1.4% vs last month</div>
            </div>
            <div className="relative w-[66px] h-[66px] shrink-0">
              <svg viewBox="0 0 66 66" className="w-[66px] h-[66px] -rotate-90">
                <circle cx="33" cy="33" r="26" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
                <circle cx="33" cy="33" r="26" fill="none" stroke="hsl(var(--brand))" strokeWidth="6" strokeDasharray={2 * Math.PI * 26} strokeDashoffset={2 * Math.PI * 26 * (1 - 94.2 / 100)} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-brand">94%</div>
            </div>
          </div>
          <div className="mb-4">
            <SectionLabel>By segment</SectionLabel>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-[10px] p-3 border border-border bg-surface transition-all hover:border-brand/40 hover:bg-brand-light hover:shadow-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-status-blue">Public</span>
                  <div className="w-[19px] h-[19px] rounded-[5px] bg-surface border border-border flex items-center justify-center">
                    <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5"><path d="M2 9h8M3 9V5.5L6 3l3 2.5V9" stroke="#185FA5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                </div>
                <div className="text-[21px] font-light tracking-[-1px] leading-none text-status-blue mb-0.5">96.8%</div>
                <div className="text-[10px] text-muted-foreground">Daily</div>
                <div className="h-[3px] bg-border rounded-sm overflow-hidden mt-1.5">
                  <div className="h-full rounded-sm bg-status-blue" style={{ width: '96.8%' }} />
                </div>
              </div>
              <div className="rounded-[10px] p-3 border border-border bg-surface transition-all hover:border-brand/40 hover:bg-brand-light hover:shadow-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-brand">Private</span>
                  <div className="w-[19px] h-[19px] rounded-[5px] bg-surface border border-border flex items-center justify-center">
                    <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5"><rect x="2" y="5" width="8" height="6" rx="1" stroke="#1A7A4A" strokeWidth="1.2" /><path d="M4 5V4a2 2 0 1 1 4 0v1" stroke="#1A7A4A" strokeWidth="1.2" strokeLinecap="round" /></svg>
                  </div>
                </div>
                <div className="text-[21px] font-light tracking-[-1px] leading-none text-brand mb-0.5">93.1%</div>
                <div className="text-[10px] text-muted-foreground">Weekly</div>
                <div className="h-[3px] bg-border rounded-sm overflow-hidden mt-1.5">
                  <div className="h-full rounded-sm bg-brand" style={{ width: '93.1%' }} />
                </div>
              </div>
            </div>
          </div>
          <div>
            <SectionLabel>Tier breakdown</SectionLabel>
            <TierBreakdown tiers={tiers} />
          </div>
        </div>

        {/* Right Pane */}
        <div className="p-[18px_20px] overflow-y-auto flex flex-col gap-3.5">
          <div>
            <SectionLabel>Record completeness — all 98.7M records</SectionLabel>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] text-muted-foreground">By field population level</span>
              <span className="text-[10px] text-muted-foreground italic">hover for details</span>
            </div>
            {/* Stacked bar */}
            <div className="flex h-6 rounded-md overflow-hidden mb-2.5 gap-0.5">
              <div className="flex items-center justify-center text-[10px] font-semibold text-primary-foreground whitespace-nowrap px-[7px] cursor-pointer transition-[filter] hover:brightness-110 relative group" style={{ width: '5.4%', background: '#1A7A4A' }}>
                5.3M
                <div className="absolute bottom-[calc(100%+7px)] left-1/2 -translate-x-1/2 bg-gray-900 border border-border rounded-md py-1.5 px-2.5 text-[11px] text-primary-foreground whitespace-nowrap pointer-events-none z-50 hidden group-hover:block text-center leading-relaxed">
                  ✓ Fully filled<br /><strong>5.3M</strong> · 5.4%
                </div>
              </div>
              <div className="flex items-center justify-center text-[10px] font-semibold text-primary-foreground whitespace-nowrap px-[7px] cursor-pointer transition-[filter] hover:brightness-110 relative group" style={{ width: '12.4%', background: '#C97A00' }}>
                Partial 12.2M
                <div className="absolute bottom-[calc(100%+7px)] left-1/2 -translate-x-1/2 bg-gray-900 border border-border rounded-md py-1.5 px-2.5 text-[11px] text-primary-foreground whitespace-nowrap pointer-events-none z-50 hidden group-hover:block text-center leading-relaxed">
                  ⚠ Partially filled<br /><strong>12.2M</strong> · 12.4%
                </div>
              </div>
              <div className="flex items-center justify-center text-[10px] font-semibold text-primary-foreground whitespace-nowrap px-[7px] cursor-pointer transition-[filter] hover:brightness-110 relative group" style={{ width: '82.2%', background: '#1E3A5A' }}>
                Below threshold ≤60% — 82.2%
                <div className="absolute bottom-[calc(100%+7px)] left-1/2 -translate-x-1/2 bg-gray-900 border border-border rounded-md py-1.5 px-2.5 text-[11px] text-primary-foreground whitespace-nowrap pointer-events-none z-50 hidden group-hover:block text-center leading-relaxed">
                  ○ Below threshold<br /><strong>81.2M</strong> · 82.2%
                </div>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <span className="flex items-center gap-[5px] text-[11px] text-muted-foreground"><span className="w-[9px] h-[9px] rounded-sm shrink-0" style={{ background: '#1A7A4A' }} />Fully filled: 5.3M (5.4%)</span>
              <span className="flex items-center gap-[5px] text-[11px] text-muted-foreground"><span className="w-[9px] h-[9px] rounded-sm shrink-0" style={{ background: '#C97A00' }} />Partially filled: 12.2M (12.4%)</span>
              <span className="flex items-center gap-[5px] text-[11px] text-muted-foreground"><span className="w-[9px] h-[9px] rounded-sm shrink-0" style={{ background: '#1E3A5A' }} />Below threshold: 81.2M (82.2%)</span>
            </div>
          </div>

          <div className="flex-1 min-h-0 flex flex-col">
            <SectionLabel>Attribute level completeness</SectionLabel>
            <div className="flex items-center gap-2 mb-2.5 flex-wrap">
              <div className="relative flex-1 min-w-[130px] max-w-[160px]">
                <svg viewBox="0 0 14 14" fill="none" className="absolute left-2 top-1/2 -translate-y-1/2 w-[11px] h-[11px] text-muted-foreground pointer-events-none">
                  <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                <input
                  className="w-full py-[5px] pr-2 pl-7 border border-border rounded-md text-[11px] bg-card text-foreground outline-none focus:border-brand"
                  placeholder="Search attribute..."
                  onChange={e => setSearch(e.target.value)}
                />
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
                  {dataGroups.map(g => <option key={g} value={g}>{g}</option>)}
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
              {/* Coverage pills */}
              <div className="flex gap-[5px] flex-wrap ml-auto">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'good', label: '≥80%' },
                  { value: 'warn', label: '60–79%' },
                  { value: 'low', label: '<60%' },
                ].map(p => (
                  <button
                    key={p.value}
                    className={`py-[3px] px-2 rounded-[20px] border text-[11px] font-medium cursor-pointer ${filter === p.value ? 'bg-gray-900 border-gray-900 text-primary-foreground dark:bg-brand dark:border-brand' : 'bg-card border-border text-muted-foreground'}`}
                    onClick={() => setFilter(p.value)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <AttributeTable
              data={filtered.map(a => ({ ...a, status: <StatusPill status={a.st} goodLabel="Good" warnLabel="Medium" /> }))}
              columns={['Attribute', 'Primary source', 'Coverage %', 'Count', 'Last refreshed', 'Status']}
              colorFn={getColorForValue}
            />
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
