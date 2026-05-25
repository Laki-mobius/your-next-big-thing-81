import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  segmentCategories,
  getSegmentEstimate,
  getPreviewRows,
  formatCount,
  type HierarchyRow,
} from '@/data/hierarchy-data';

/* ─── Coverage dot ─── */
function CoverageDot({ score }: { score: number }) {
  const color = score >= 90 ? 'bg-status-good' : score >= 70 ? 'bg-status-amber' : 'bg-status-red';
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn('w-2 h-2 rounded-full', color)} />
      <span>{score.toFixed(1)}%</span>
    </span>
  );
}

/* ─── Main Component ─── */
export default function CorporateHierarchySection() {
  // Build initial filters from first option of each category
  const buildDefaults = () => {
    const defaults: Record<string, string> = {};
    segmentCategories.forEach(cat => {
      defaults[cat.key] = cat.options[0];
    });
    return defaults;
  };

  const [filters, setFilters] = useState<Record<string, string>>(buildDefaults);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(buildDefaults);
  const [searched, setSearched] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [progress, setProgress] = useState(0);

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setActiveFilters({ ...filters });
    setSearched(true);
  };

  const handleReset = () => {
    const defaults = buildDefaults();
    setFilters(defaults);
    setActiveFilters(defaults);
    setSearched(false);
  };

  const estimate = getSegmentEstimate(activeFilters);
  const previewRows: HierarchyRow[] = searched ? getPreviewRows(activeFilters) : [];

  const appliedCount = Object.values(activeFilters).filter(v => !v.startsWith('All') && !v.startsWith('Any')).length;

  /* simulated download */
  const handleDownload = useCallback(() => {
    setDownloading(true);
    setProgress(0);
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setDownloading(false);
          toast({ title: 'Download ready', description: `${formatCount(estimate.records)} hierarchy records exported as CSV.` });
          return 0;
        }
        return p + 8;
      });
    }, 120);
  }, [estimate.records]);

  /* simulated push */
  const handlePush = useCallback(() => {
    setPushing(true);
    setProgress(0);
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setPushing(false);
          toast({ title: 'API push complete', description: `${formatCount(estimate.records)} records pushed to configured endpoint.` });
          return 0;
        }
        return p + 5;
      });
    }, 100);
  }, [estimate.records]);

  const isProcessing = downloading || pushing;

  return (
    <section id="corporate-hierarchy" className="mt-3">
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-brand-light flex items-center justify-center text-brand shrink-0">
            <svg viewBox="0 0 20 20" fill="none" className="w-[18px] h-[18px]">
              <circle cx="10" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="4" cy="14" r="2.5" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="16" cy="14" r="2.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M10 6.5v3M7 13l3-3.5M13 13l-3-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-foreground leading-tight">Corporate Hierarchy Intelligence</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">Select segments below and click Search to preview data</p>
          </div>
          <span className="ml-auto text-[12px] font-bold px-2.5 py-1 rounded-full bg-brand text-primary-foreground tabular-nums">
            {formatCount(estimate.records)} records
          </span>
        </div>

        <div className="p-4 space-y-4">
          {/* ── Segment Dropdowns ── */}
          <div className="space-y-3">
            <h3 className="text-[13px] font-semibold text-foreground">Segment Selection</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {segmentCategories.map(cat => (
                <div key={cat.key} className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                    {cat.label}
                  </label>
                  <Select value={filters[cat.key]} onValueChange={(v) => updateFilter(cat.key, v)}>
                    <SelectTrigger className="h-9 text-[13px] bg-card border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cat.options.map(opt => (
                        <SelectItem key={opt} value={opt} className="text-[13px]">
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            {/* Search & Reset buttons */}
            <div className="flex items-center gap-2 pt-1 justify-end">
              <button
                onClick={handleSearch}
                className={cn(
                  'h-9 px-5 rounded-lg text-[13px] font-semibold border-none cursor-pointer transition-colors flex items-center gap-2',
                  'active:scale-[0.97]',
                  'bg-brand text-primary-foreground hover:bg-brand-dark'
                )}
              >
                <Search className="w-4 h-4" />
                Search
              </button>
              <button
                onClick={handleReset}
                className="h-9 px-4 rounded-lg text-[13px] font-medium border border-border text-muted-foreground bg-card cursor-pointer transition-colors hover:bg-secondary active:scale-[0.97]"
              >
                Reset
              </button>
            </div>
          </div>

          {/* ── Selection Summary ── */}
          <div className="flex items-center gap-4 bg-surface rounded-lg px-4 py-3 border border-border">
            <div className="flex-1">
              <p className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wide">Selection Summary</p>
              <p className="text-[14px] font-bold text-foreground tabular-nums mt-0.5">
                {formatCount(estimate.records)} records · {formatCount(estimate.links)} hierarchy links
              </p>
              {appliedCount > 0 ? (
                <p className="text-[11px] text-muted-foreground mt-1">
                  {appliedCount} filter{appliedCount > 1 ? 's' : ''} applied
                </p>
              ) : (
                <p className="text-[11px] text-muted-foreground mt-1">No filters applied — full dataset selected</p>
              )}
            </div>
          </div>

          {/* ── Preview Table ── */}
          {searched && (
            <div>
              <h3 className="text-[13px] font-semibold text-foreground mb-2">Data Preview</h3>
              <div className="border border-border rounded-lg overflow-auto">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="bg-surface text-muted-foreground">
                      <th className="text-left font-semibold px-3 py-2">Parent Name</th>
                      <th className="text-left font-semibold px-3 py-2">Subsidiary Name</th>
                      <th className="text-left font-semibold px-3 py-2">Entity Type</th>
                      <th className="text-left font-semibold px-3 py-2">Country</th>
                      <th className="text-right font-semibold px-3 py-2">Ownership %</th>
                      <th className="text-right font-semibold px-3 py-2">Coverage Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, i) => (
                      <tr key={i} className="border-t border-border hover:bg-surface/60 transition-colors">
                        <td className="px-3 py-2 text-foreground font-medium">{row.parentName}</td>
                        <td className="px-3 py-2 text-foreground">{row.subsidiaryName}</td>
                        <td className="px-3 py-2">
                          <span className={cn(
                            'text-[10px] px-1.5 py-0.5 rounded font-semibold',
                            row.entityType === 'Subsidiary' && 'bg-brand-light text-brand',
                            row.entityType === 'Branch' && 'bg-blue-light text-blue',
                            row.entityType === 'JV Partner' && 'bg-purple-light text-purple'
                          )}>
                            {row.entityType}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">{row.country}</td>
                        <td className="px-3 py-2 text-right tabular-nums text-foreground">{row.ownershipPct}%</td>
                        <td className="px-3 py-2 text-right tabular-nums"><CoverageDot score={row.coverageScore} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5">Showing {previewRows.length} of {formatCount(estimate.records)} records · Full data available via Download or API Push</p>
            </div>
          )}

          {!searched && (
            <div className="flex items-center justify-center py-8 text-muted-foreground text-[13px]">
              Select your segments above and click <span className="font-semibold text-brand mx-1">Search</span> to preview data
            </div>
          )}

          {/* ── Actions ── */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleDownload}
              disabled={isProcessing || !searched}
              className={cn(
                'h-9 px-4 rounded-lg text-[13px] font-semibold border-none cursor-pointer transition-colors flex items-center gap-2',
                'active:scale-[0.97]',
                'bg-brand text-primary-foreground hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <path d="M8 2v9M4.5 8L8 11.5 11.5 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 13h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              {downloading ? 'Generating CSV…' : 'Download CSV'}
            </button>
            <button
              onClick={handlePush}
              disabled={isProcessing || !searched}
              className={cn(
                'h-9 px-4 rounded-lg text-[13px] font-semibold border border-brand text-brand bg-card cursor-pointer transition-colors flex items-center gap-2',
                'active:scale-[0.97]',
                'hover:bg-brand-light disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <path d="M8 14V5M4.5 8L8 4.5 11.5 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 3h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              {pushing ? 'Pushing…' : 'Push to API'}
            </button>

            {isProcessing && (
              <div className="flex-1 min-w-[120px] max-w-[260px]">
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand rounded-full transition-all duration-150"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 tabular-nums">{Math.min(progress, 100)}% complete</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
