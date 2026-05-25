import { useState, useRef } from 'react';
import { heatmapRegions, months, geoQuality, getHeatmapColor, getScaleLabel } from '@/data/dashboard-data';

export default function GeographicSection() {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const legendColors = ['#C0392B', '#E67E22', '#F1C40F', '#82C864', '#27AE60', '#0F4F2E'];
  const legendLabels = ['Very low', 'Low', 'Moderate', 'Good', 'Strong', 'Excellent'];
  const legendRanges = ['0–20%', '20–40%', '40–60%', '60–75%', '75–90%', '90–100%'];

  return (
    <div className="bg-card border border-border rounded-lg p-3.5 mb-3">
      <div className="text-[15px] font-semibold text-foreground mb-2.5 pb-2.5 border-b border-border">
        Geographic distribution
      </div>
      <div className="grid grid-cols-[25%_75%] gap-0 items-start">
        {/* Left: Data quality table */}
        <div className="border-r border-border pr-5">
          <div className="text-[13px] font-semibold text-muted-foreground mb-3.5">Data quality</div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-[11px] font-semibold text-muted-foreground text-left pb-2 border-b border-border uppercase tracking-[0.04em]">Region</th>
                <th className="text-[11px] font-semibold text-muted-foreground text-right pb-2 border-b border-border uppercase tracking-[0.04em]">Score</th>
              </tr>
            </thead>
            <tbody>
              {geoQuality.map(row => (
                <tr key={row.region}>
                  <td className="py-[7px] border-b border-border text-xs text-muted-foreground">{row.region}</td>
                  <td className="py-[7px] border-b border-border text-xs text-muted-foreground text-right">{row.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: Heatmap */}
        <div className="pl-5" ref={containerRef}>
          <div className="text-[13px] font-semibold text-muted-foreground mb-3.5">
            Company universe — monthly data enriched (M records)
          </div>
          <table className="w-full border-collapse table-fixed">
            <colgroup>
              <col style={{ width: 130 }} />
              {months.map((_, i) => <col key={i} />)}
            </colgroup>
            <thead>
              <tr>
                <td />
                {months.map(m => (
                  <th key={m} className="text-[11px] font-medium text-muted-foreground text-center pb-1.5">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapRegions.map(region => (
                <tr key={region.name}>
                  <td className="text-xs text-muted-foreground text-right pr-3 whitespace-nowrap align-middle">{region.name}</td>
                  {region.data.map((v, mi) => (
                    <td
                      key={mi}
                      className="h-[30px] cursor-pointer hover:outline hover:outline-2 hover:outline-foreground hover:outline-offset-[-2px] hover:z-[2] hover:relative"
                      style={{ background: getHeatmapColor(v) }}
                      onMouseEnter={(e) => {
                        setTooltip({
                          text: `${region.name} · ${months[mi]}: ${v}M records — ${getScaleLabel(v)}`,
                          x: e.clientX + 14,
                          y: e.clientY - 36,
                        });
                      }}
                      onMouseMove={(e) => {
                        setTooltip(prev => prev ? { ...prev, x: e.clientX + 14, y: e.clientY - 36 } : null);
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Legend */}
          <div className="mt-3.5 ml-[130px]">
            <div className="flex h-2.5 rounded overflow-hidden">
              {legendColors.map((c, i) => (
                <div key={i} className="flex-1" style={{ background: c }} />
              ))}
            </div>
            <div className="flex justify-between mt-1.5">
              {legendLabels.map((l, i) => (
                <span key={i} className="text-[11px] text-muted-foreground text-center flex-1 first:text-left last:text-right">{l}</span>
              ))}
            </div>
            <div className="flex justify-between mt-0.5">
              {legendRanges.map((r, i) => (
                <span key={i} className="text-[11px] text-muted-foreground text-center flex-1 first:text-left last:text-right">{r}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed bg-gray-900 text-primary-foreground text-xs py-1.5 px-3 rounded-md pointer-events-none whitespace-nowrap z-[9999]"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
