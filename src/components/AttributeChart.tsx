import { useState, useMemo } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';
import { filterOptions, aggregateByFilters } from '@/data/attribute-chart-data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const BAR_COLOR = 'hsl(var(--brand))';
const LINE_COLOR = 'hsl(152, 64%, 29%)';

function FilterSelect({ label, value, options, onChange }: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-[0.06em] font-semibold text-muted-foreground">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-8 text-xs w-[170px] bg-card border-border">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(o => (
            <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; payload: { attribute: string; group: string; count: number; accuracy: number; lastRefresh: string } }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-popover border border-border rounded-lg px-3 py-2.5 shadow-lg text-xs space-y-1.5 min-w-[180px]">
      <div className="font-semibold text-foreground text-[13px]">{d.attribute}</div>
      <div className="text-muted-foreground text-[10px] uppercase tracking-wide">{d.group}</div>
      <div className="h-px bg-border my-1" />
      <div className="flex justify-between">
        <span className="text-muted-foreground">Volume</span>
        <span className="font-medium text-foreground tabular-nums">{d.count.toFixed(1)}M records</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Accuracy</span>
        <span className="font-medium tabular-nums" style={{ color: d.accuracy >= 90 ? LINE_COLOR : d.accuracy >= 75 ? 'hsl(36, 100%, 39%)' : 'hsl(6, 63%, 46%)' }}>
          {d.accuracy.toFixed(1)}%
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Last refresh</span>
        <span className="font-medium text-foreground tabular-nums">{d.lastRefresh}</span>
      </div>
    </div>
  );
}

export default function AttributeChart() {
  const [filters, setFilters] = useState({
    companyStatus: 'All Companies',
    tier: 'All Tiers',
    dataGroup: 'All Groups',
    region: 'All Regions',
  });

  const data = useMemo(() => aggregateByFilters(filters), [filters]);

  // Build group boundary indices for reference lines
  const groupBoundaries = useMemo(() => {
    const bounds: { index: number; label: string }[] = [];
    let lastGroup = '';
    data.forEach((d, i) => {
      if (d.group !== lastGroup) {
        bounds.push({ index: i, label: d.group });
        lastGroup = d.group;
      }
    });
    return bounds;
  }, [data]);

  const updateFilter = (key: string, value: string) =>
    setFilters(prev => ({ ...prev, [key]: value }));

  const maxCount = useMemo(() => {
    const m = Math.max(...data.map(d => d.count), 1);
    return Math.ceil(m / 10) * 10 + 10;
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-3.5">
        <div className="text-[15px] font-semibold text-foreground mb-2.5 pb-2.5 border-b border-border">
          Attribute-level accuracy & volume
        </div>
        <div className="flex flex-wrap gap-3 mb-3">
          <FilterSelect label="Company status" value={filters.companyStatus} options={filterOptions.companyStatus} onChange={v => updateFilter('companyStatus', v)} />
          <FilterSelect label="Tier" value={filters.tier} options={filterOptions.tier} onChange={v => updateFilter('tier', v)} />
          <FilterSelect label="Data group" value={filters.dataGroup} options={filterOptions.dataGroup} onChange={v => updateFilter('dataGroup', v)} />
          <FilterSelect label="Region" value={filters.region} options={filterOptions.region} onChange={v => updateFilter('region', v)} />
        </div>
        <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
          No data matches the selected filters
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-3.5">
      <div className="text-[15px] font-semibold text-foreground mb-2.5 pb-2.5 border-b border-border">
        Attribute-level accuracy &amp; volume
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-3">
        <FilterSelect label="Company status" value={filters.companyStatus} options={filterOptions.companyStatus} onChange={v => updateFilter('companyStatus', v)} />
        <FilterSelect label="Tier" value={filters.tier} options={filterOptions.tier} onChange={v => updateFilter('tier', v)} />
        <FilterSelect label="Data group" value={filters.dataGroup} options={filterOptions.dataGroup} onChange={v => updateFilter('dataGroup', v)} />
        <FilterSelect label="Region" value={filters.region} options={filterOptions.region} onChange={v => updateFilter('region', v)} />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-[2px]" style={{ background: BAR_COLOR }} />
          <span>Attribute count (M)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 rounded" style={{ background: LINE_COLOR }} />
          <div className="w-2 h-2 rounded-full border-2" style={{ borderColor: LINE_COLOR }} />
          <span>Accuracy %</span>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full" style={{ height: Math.max(360, 360) }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 12, bottom: 90, left: 8 }}
            barCategoryGap="18%"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />

            <XAxis
              dataKey="attribute"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              angle={-90}
              textAnchor="end"
              interval={0}
              height={90}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />

            <YAxis
              yAxisId="count"
              orientation="left"
              domain={[0, maxCount]}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              label={{
                value: 'Records (M)',
                angle: -90,
                position: 'insideLeft',
                offset: -2,
                style: { fontSize: 11, fill: 'hsl(var(--muted-foreground))' },
              }}
            />

            <YAxis
              yAxisId="accuracy"
              orientation="right"
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickFormatter={(v: number) => `${v}%`}
              label={{
                value: 'Accuracy %',
                angle: 90,
                position: 'insideRight',
                offset: -2,
                style: { fontSize: 11, fill: 'hsl(var(--muted-foreground))' },
              }}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.4)' }} />

            {/* Group separator lines */}
            {groupBoundaries.slice(1).map(b => (
              <ReferenceLine
                key={b.label}
                x={data[b.index]?.attribute}
                yAxisId="count"
                stroke="hsl(var(--border))"
                strokeDasharray="4 4"
                label={{
                  value: b.label,
                  position: 'top',
                  style: { fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontWeight: 600 },
                }}
              />
            ))}

            <Bar
              yAxisId="count"
              dataKey="count"
              radius={[3, 3, 0, 0]}
              maxBarSize={36}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={BAR_COLOR} />
              ))}
            </Bar>

            <Line
              yAxisId="accuracy"
              type="monotone"
              dataKey="accuracy"
              stroke={LINE_COLOR}
              strokeWidth={2.5}
              dot={{ r: 4, fill: 'hsl(var(--card))', stroke: LINE_COLOR, strokeWidth: 2 }}
              activeDot={{ r: 6, fill: LINE_COLOR, stroke: 'hsl(var(--card))', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Group labels below chart */}
      <div className="flex mt-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
        {groupBoundaries.map((b, i) => {
          const nextIdx = i < groupBoundaries.length - 1 ? groupBoundaries[i + 1].index : data.length;
          const span = nextIdx - b.index;
          return (
            <div
              key={b.label}
              className="text-center border-t border-border pt-1.5"
              style={{ flex: span }}
            >
              {b.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
