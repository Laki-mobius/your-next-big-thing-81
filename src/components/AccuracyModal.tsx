import { useState, useMemo } from 'react';
import { ShieldCheck, BarChart3, Target } from 'lucide-react';
import { ModalShell, ModalHeader, SectionLabel, FilterToolbar } from './ModalParts';
import { dataGroups } from '@/data/dashboard-data';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const qcAttributes = [
  { name: 'Company Name', accuracy: 99, correct: 99, total: 100, status: 'passed' as const, issues: '1 Minor Typo' },
  { name: 'Headquarters Country', accuracy: 98, correct: 98, total: 100, status: 'passed' as const, issues: '2 Abbreviation Issues' },
  { name: 'Foundation Year', accuracy: 99, correct: 99, total: 100, status: 'passed' as const, issues: '1 Null Value' },
  { name: 'Industry Sector', accuracy: 95, correct: 95, total: 100, status: 'warning' as const, issues: '5 Misclassifications' },
  { name: 'Employee Count', accuracy: 91, correct: 91, total: 100, status: 'warning' as const, issues: '9 Outdated Data' },
  { name: 'Revenue Range', accuracy: 96, correct: 96, total: 100, status: 'passed' as const, issues: '4 Formatting Errors' },
  { name: 'Street Address', accuracy: 97, correct: 97, total: 100, status: 'passed' as const, issues: '3 Formatting Issues' },
  { name: 'Phone Number', accuracy: 88, correct: 88, total: 100, status: 'failed' as const, issues: '12 Invalid Formats' },
  { name: 'NAICS Code', accuracy: 96, correct: 96, total: 100, status: 'passed' as const, issues: '4 Mapping Errors' },
  { name: 'Website', accuracy: 93, correct: 93, total: 100, status: 'warning' as const, issues: '7 Broken Links' },
  { name: 'Net Income', accuracy: 97, correct: 97, total: 100, status: 'passed' as const, issues: '3 Rounding Errors' },
  { name: 'Executive Name', accuracy: 89, correct: 89, total: 100, status: 'failed' as const, issues: '11 Outdated Records' },
];

function CircularGauge({ value, label, subtitle, color, icon }: { value: number; label: string; subtitle: string; color: string; icon: React.ReactNode }) {
  const donutData = [
    { name: 'Filled', value: value, fill: color },
    { name: 'Empty', value: 100 - value, fill: 'hsl(var(--border))' },
  ];

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="text-left flex-1 min-w-0">
        <div className="text-xs font-semibold text-foreground">{label}</div>
        <div className="text-[10px] text-muted-foreground">{subtitle}</div>
        <div className="text-xl font-bold text-foreground leading-none mt-1">{value}%</div>
      </div>
      <div className="relative w-[70px] h-[70px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={donutData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={22}
              outerRadius={33}
              strokeWidth={2}
              stroke="hsl(var(--card))"
              startAngle={90}
              endAngle={-270}
            >
              {donutData.map((d, i) => <Cell key={i} fill={d.fill} />)}
            </Pie>
            <Tooltip
              contentStyle={{ fontSize: 11, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
              formatter={(v: number) => [`${v}%`, ""]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
    </div>
  );
}

export default function AccuracyModal({ onClose, inline = false }: { onClose: () => void; inline?: boolean }) {
  const [search, setSearch] = useState('');
  const [segment, setSegment] = useState('all');
  const [filterTier, setFilterTier] = useState('all');
  const [geography, setGeography] = useState('all');
  const [dataGroup, setDataGroup] = useState('all');
  const [companySize, setCompanySize] = useState('all');
  const [revenue, setRevenue] = useState('all');

  const filtered = useMemo(() => {
    return qcAttributes.filter(a =>
      a.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const statusPill = (status: 'passed' | 'warning' | 'failed') => {
    const cls = status === 'passed' ? 'bg-brand-light text-brand' : status === 'warning' ? 'bg-status-amber-light text-status-amber' : 'bg-destructive-light text-destructive';
    const label = status === 'passed' ? 'PASSED' : status === 'warning' ? 'WARNING' : 'FAILED';
    return <span className={cn('text-[10px] px-[7px] py-[2px] rounded-[20px] font-bold whitespace-nowrap inline-block uppercase', cls)}>{label}</span>;
  };

  const selectCls = "py-[5px] px-2 border border-border rounded-md text-[11px] bg-card text-foreground outline-none focus:border-brand";

  return (
    <ModalShell id="modal-accuracy" onClose={onClose} fullHeight inline={inline}>
      <div className="flex-1 overflow-y-auto p-[18px_20px] flex gap-4">
        {/* Left Pane – Donut Charts */}
        <div className="w-[260px] shrink-0 flex flex-col gap-3">
          <div className="bg-surface border border-border rounded-lg p-2.5 flex items-center">
            <CircularGauge value={97} label="Overall Quality" subtitle="Overall Record Accuracy" color="hsl(var(--brand))" icon={<ShieldCheck size={16} />} />
          </div>
          <div className="bg-surface border border-border rounded-lg p-2.5 flex items-center">
            <CircularGauge value={99} label="Attribute Fill Rate" subtitle="System Completeness" color="hsl(var(--blue))" icon={<BarChart3 size={16} />} />
          </div>
          <div className="bg-surface border border-border rounded-lg p-2.5 flex items-center">
            <CircularGauge value={98} label="Accuracy vs QC Flag" subtitle="Avg Attribute Correctness" color="hsl(var(--purple))" icon={<Target size={16} />} />
          </div>

          {/* Accuracy Split by Company Type */}
          <SectionLabel>Accuracy split by company type</SectionLabel>
          <div className="space-y-2.5">
            {[
              { label: 'Public Companies', pct: 98, count: '231 records', color: '#185FA5' },
              { label: 'Private Companies', pct: 96, count: '961 records', color: '#1A7A4A' },
            ].map(item => (
              <div key={item.label} className="bg-surface border border-border rounded-md p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-foreground">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold font-mono" style={{ color: item.color }}>{item.pct}%</span>
                    <span className="text-[10px] text-muted-foreground">{item.count}</span>
                  </div>
                </div>
                <div className="h-[8px] bg-border rounded-sm overflow-hidden">
                  <div className="h-full rounded-sm transition-all" style={{ width: `${item.pct}%`, background: item.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center pt-2 border-t border-border text-[10px] text-muted-foreground mt-auto">
            <span>Last updated: 2026-02-27 &nbsp;|&nbsp; Next QC check: 2026-03-27</span>
          </div>
        </div>

        {/* Right Pane – Attribute Level Accuracy Breakdown */}
        <div className="flex-1 min-w-0 flex flex-col gap-2.5">
          <SectionLabel>Attribute level accuracy breakdown</SectionLabel>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <svg viewBox="0 0 14 14" fill="none" className="absolute left-2 top-1/2 -translate-y-1/2 w-[11px] h-[11px] text-muted-foreground pointer-events-none">
                <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3" />
                <path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <input className="w-[140px] py-[5px] pr-2 pl-7 border border-border rounded-md text-[11px] bg-card text-foreground outline-none focus:border-brand" placeholder="Search attribute..." onChange={e => setSearch(e.target.value)} />
            </div>
            <select value={segment} onChange={e => setSegment(e.target.value)} className={selectCls}>
              <option value="all">All Segments</option>
              <option value="public">Public Companies</option>
              <option value="private">Private Companies</option>
            </select>
            <select value={filterTier} onChange={e => setFilterTier(e.target.value)} className={selectCls}>
              <option value="all">All Tiers</option>
              <option value="t1">Tier 1</option>
              <option value="t2">Tier 2</option>
              <option value="t3">Tier 3</option>
              <option value="t4">Tier 4</option>
            </select>
            <select value={geography} onChange={e => setGeography(e.target.value)} className={selectCls}>
              <option value="all">All Geographies</option>
              <option value="na">North America</option>
              <option value="eu">Europe</option>
              <option value="apac">APAC</option>
              <option value="latam">LATAM</option>
              <option value="mea">MEA</option>
              <option value="us">United States</option>
              <option value="uk">United Kingdom</option>
              <option value="de">Germany</option>
              <option value="jp">Japan</option>
              <option value="in">India</option>
            </select>
            <select value={dataGroup} onChange={e => setDataGroup(e.target.value)} className={selectCls}>
              <option value="all">All Data Groups</option>
              <option value="basic">Basic Data</option>
              <option value="financial">Financial Data</option>
              <option value="hierarchy">Corporate Hierarchy Data</option>
            </select>
            <select value={companySize} onChange={e => setCompanySize(e.target.value)} className={selectCls}>
              <option value="all">All Sizes</option>
              <option value="small">Small</option>
              <option value="mid">Mid</option>
              <option value="large">Large</option>
              <option value="enterprise">Enterprise</option>
            </select>
            <select value={revenue} onChange={e => setRevenue(e.target.value)} className={selectCls}>
              <option value="all">All Revenue</option>
              <option value="lt1m">&lt; $1M</option>
              <option value="1m10m">$1M – $10M</option>
              <option value="10m100m">$10M – $100M</option>
              <option value="100m1b">$100M – $1B</option>
              <option value="gt1b">$1B+</option>
            </select>
          </div>
          <div className="border border-border rounded-lg overflow-hidden flex-1">
            <div className="overflow-y-auto max-h-[500px]">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-surface">
                    <th className="text-left text-[10px] font-bold text-muted-foreground uppercase tracking-[0.05em] py-[7px] px-2.5 border-b-[1.5px] border-border">Attribute</th>
                    <th className="text-left text-[10px] font-bold text-muted-foreground uppercase tracking-[0.05em] py-[7px] px-2.5 border-b-[1.5px] border-border">Accuracy %</th>
                    <th className="text-left text-[10px] font-bold text-muted-foreground uppercase tracking-[0.05em] py-[7px] px-2.5 border-b-[1.5px] border-border">Correct / Total</th>
                    <th className="text-left text-[10px] font-bold text-muted-foreground uppercase tracking-[0.05em] py-[7px] px-2.5 border-b-[1.5px] border-border">Status</th>
                    <th className="text-left text-[10px] font-bold text-muted-foreground uppercase tracking-[0.05em] py-[7px] px-2.5 border-b-[1.5px] border-border">Issues</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-4 text-muted-foreground text-xs">No results</td></tr>
                  ) : filtered.map((row, i) => {
                    const barColor = row.accuracy >= 95 ? '#1A7A4A' : row.accuracy >= 90 ? '#C97A00' : '#C0392B';
                    return (
                      <tr key={i} className="hover:bg-surface">
                        <td className="py-1.5 px-2.5 border-b border-border text-foreground whitespace-nowrap text-xs">{row.name}</td>
                        <td className="py-1.5 px-2.5 border-b border-border min-w-[100px]">
                          <div className="flex items-center gap-1.5">
                            <div className="flex-1 h-[5px] bg-border rounded-sm overflow-hidden">
                              <div className="h-full rounded-sm" style={{ width: `${row.accuracy}%`, background: barColor }} />
                            </div>
                            <span className="font-semibold text-[11px] font-mono" style={{ color: barColor }}>{row.accuracy}%</span>
                          </div>
                        </td>
                        <td className="py-1.5 px-2.5 border-b border-border text-[11px] text-muted-foreground font-mono whitespace-nowrap">{row.correct}/{row.total}</td>
                        <td className="py-1.5 px-2.5 border-b border-border">{statusPill(row.status)}</td>
                        <td className="py-1.5 px-2.5 border-b border-border text-[11px] text-muted-foreground whitespace-nowrap">{row.issues}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
