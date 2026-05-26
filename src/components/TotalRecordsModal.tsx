import { ModalShell, ModalHeader, SectionLabel } from './ModalParts';
import { Building2, Building, Network, GitBranch, Landmark } from 'lucide-react';

const companyTypes = [
  { type: 'Public Companies', count: '231', sub: '23.1% of total', icon: Building2, iconColor: 'text-muted-foreground' },
  { type: 'Private Companies', count: '737', sub: '73.7% of total', icon: Building, iconColor: 'text-muted-foreground' },
  { type: 'Parent Companies', count: '21', sub: '2.1% of total', icon: Network, iconColor: 'text-muted-foreground' },
  { type: 'Subsidiaries', count: '9', sub: '0.9% of total', icon: GitBranch, iconColor: 'text-muted-foreground' },
  { type: 'Government / State-Owned', count: '2', sub: '0.2% of total', icon: Landmark, iconColor: 'text-muted-foreground' },
];

const tierSegments = [
  { label: 'Tier 1', name: 'US', value: '181', flex: 1.81, color: '#185FA5' },
  { label: 'Tier 2', name: 'Non-US', value: '50', flex: 0.5, color: '#1A7A4A' },
  { label: 'Tier 3', name: 'US', value: '120', flex: 1.2, color: '#C97A00' },
  { label: 'Tier 4', name: 'Non-US', value: '649', flex: 6.49, color: '#534AB7' },
] as const;

const publicCompanyFlex = tierSegments[0].flex + tierSegments[1].flex;
const privateCompanyFlex = tierSegments[2].flex + tierSegments[3].flex;
const totalTierFlex = publicCompanyFlex + privateCompanyFlex;
const privateCompanyStart = (publicCompanyFlex / totalTierFlex) * 100;

const geographyBars = [
  { region: 'US', count: 181, label: '181' },
  { region: 'China', count: 158, label: '158' },
  { region: 'India', count: 109, label: '109' },
  { region: 'UK', count: 88, label: '88' },
  { region: 'Australia', count: 72, label: '72' },
  { region: 'Germany', count: 65, label: '65' },
  { region: 'Netherlands', count: 64, label: '64' },
  { region: 'Japan', count: 53, label: '53' },
  { region: 'Brazil', count: 26, label: '26' },
  { region: 'Canada', count: 25, label: '25' },
  { region: 'Rest of World', count: 159, label: '159' },
];

const yTicks = [0, 25, 50, 75, 100, 125, 150, 175, 200];


export default function TotalRecordsModal({ onClose, inline = false }: { onClose: () => void; inline?: boolean }) {
  return (
    <ModalShell id="modal-total" onClose={onClose} inline={inline}>
      <div className="p-[18px_24px] overflow-y-auto flex-1">
        <div className="flex gap-5 items-stretch">
          {/* LEFT PANE — By Segment (30%) */}
          <div className="w-[30%] shrink-0 flex flex-col">
            <SectionLabel>By segment</SectionLabel>
            <div className="grid grid-cols-2 gap-2 flex-1 content-stretch auto-rows-fr">
              {companyTypes.map((ct, i) => {
                const Icon = ct.icon;
                return (
                  <div
                    key={ct.type}
                    className={`text-left p-2.5 rounded-lg border border-border bg-surface transition-all hover:border-brand/40 hover:bg-brand-light hover:shadow-sm ${i === companyTypes.length - 1 ? 'col-span-2' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12px] font-semibold text-foreground">{ct.type}</span>
                      <div className="w-[24px] h-[24px] rounded-md bg-surface border border-border flex items-center justify-center shrink-0">
                        <Icon className={`w-3 h-3 ${ct.iconColor}`} />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[20px] font-light tracking-[-1px] leading-none text-foreground">{ct.count}</span>
                      <span className="text-[11px] text-muted-foreground leading-snug">{ct.sub}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT PANE — Tier & Geography (75%) */}
          <div className="flex-1 min-w-0">
            {/* TOTAL RECORDS BY TIER & SEGMENT */}
            <SectionLabel>Total records by tier &amp; segment (scale proportional)</SectionLabel>
            <div className="flex h-6 rounded-md overflow-hidden mb-2.5 gap-0.5">
              {tierSegments.map((t, i) => {
                const pct = ((t.flex / totalTierFlex) * 100).toFixed(1);
                return (
                  <div
                    key={i}
                    className="flex items-center justify-center text-[10px] font-semibold text-primary-foreground whitespace-nowrap px-[7px] cursor-pointer transition-[filter] hover:brightness-110 relative group"
                    style={{ width: `${pct}%`, background: t.color }}
                  >
                    {t.value}
                    <div className="absolute bottom-[calc(100%+7px)] left-1/2 -translate-x-1/2 bg-gray-900 border border-border rounded-md py-1.5 px-2.5 text-[11px] text-primary-foreground whitespace-nowrap pointer-events-none z-50 hidden group-hover:block text-center leading-relaxed">
                      {t.label} · {t.name}<br /><strong>{t.value}</strong> · {pct}%
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-3 flex-wrap mb-5">
              {tierSegments.map((t, i) => {
                const pct = ((t.flex / totalTierFlex) * 100).toFixed(1);
                return (
                  <span key={i} className="flex items-center gap-[5px] text-[11px] text-muted-foreground">
                    <span className="w-[9px] h-[9px] rounded-sm shrink-0" style={{ background: t.color }} />
                    {t.label} · {t.name}: {t.value} ({pct}%)
                  </span>
                );
              })}
            </div>

            {/* BAR CHART BY GEOGRAPHY */}
            <SectionLabel>Records by geography (Top 10 + Rest of World)</SectionLabel>
            <div className="border border-border rounded-lg p-3 bg-surface">
              <div className="flex items-end gap-0" style={{ height: 180 }}>
                <div className="flex flex-col justify-between h-full pr-2 shrink-0" style={{ paddingBottom: 22 }}>
                  {yTicks.slice().reverse().map(t => (
                    <span key={t} className="text-[11px] text-muted-foreground leading-none text-right min-w-[24px]">{t}</span>
                  ))}
                </div>
                <div className="flex-1 flex items-end justify-between gap-[6px]" style={{ height: '100%', paddingBottom: 22, position: 'relative' }}>
                  <div className="absolute inset-0" style={{ bottom: 22 }}>
                    {yTicks.map(t => (
                      <div
                        key={t}
                        className="absolute w-full border-t border-border/50"
                        style={{ bottom: `${(t / 45) * 100}%` }}
                      />
                    ))}
                  </div>
                  {geographyBars.map((g, i) => {
                    const lightness = 22 + (i * 4);
                    const barGradient = `linear-gradient(to top, hsl(152, 64%, ${lightness}%), hsl(152, 54%, ${lightness + 8}%))`;
                    return (
                      <div key={g.region} className="flex flex-col items-center flex-1 min-w-0 relative z-10" style={{ height: '100%', justifyContent: 'flex-end' }}>
                        <span className="text-[11px] font-semibold text-foreground mb-1">{g.label}</span>
                        <div
                          className="w-full max-w-[36px] rounded-full shadow-sm"
                          style={{
                            height: `${(g.count / 45) * 100}%`,
                            minHeight: 8,
                            background: barGradient,
                          }}
                        />
                        <span className="text-[11px] text-muted-foreground mt-1.5 text-center leading-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-[52px]">{g.region}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
