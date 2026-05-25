import { useMemo, useState, useEffect } from "react";
import {
  Boxes, Filter, Globe, MapPin, Layers, FileText, Link2, Tags, Workflow, CheckCircle2, RotateCcw, Save,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sourceCatalog, filterSources, allRegions } from "@/data/source-catalog";
import { useAssetSelection } from "@/contexts/AssetSelectionContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const regionOptions = allRegions.filter(r => r !== "Any");

function FilterBlock({
  icon: Icon, label, options, selected, onChange, search = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  search?: boolean;
}) {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => (q ? options.filter(o => o.toLowerCase().includes(q.toLowerCase())) : options),
    [options, q],
  );
  const toggle = (v: string) =>
    onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v]);

  return (
    <div className="border border-border rounded-md bg-card overflow-hidden">
      <div className="flex items-center justify-between px-2.5 py-1.5 border-b bg-muted/20">
        <div className="flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5 text-brand" />
          <span className="text-[11px] font-semibold text-foreground">{label}</span>
          <Badge variant="secondary" className="text-[9px] h-4 px-1.5">{selected.length}/{options.length}</Badge>
        </div>
        <div className="flex gap-2">
          <button type="button" className="text-[10px] text-primary hover:underline"
            onClick={() => onChange(options)}>Select all</button>
          <button type="button" className="text-[10px] text-muted-foreground hover:underline"
            onClick={() => onChange([])}>Clear</button>
        </div>
      </div>
      {search && (
        <div className="px-2 py-1.5 border-b">
          <Input value={q} onChange={e => setQ(e.target.value)} placeholder={`Search ${label.toLowerCase()}…`}
            className="h-7 text-[11px]" />
        </div>
      )}
      <ScrollArea className="h-40">
        <div className="p-1">
          {filtered.length === 0 && (
            <div className="px-2 py-2 text-[11px] text-muted-foreground">No matches</div>
          )}
          {filtered.map(opt => (
            <label key={opt} className="flex items-center gap-2 px-2 py-1 rounded text-[11px] cursor-pointer hover:bg-muted/40">
              <Checkbox checked={selected.includes(opt)} onCheckedChange={() => toggle(opt)} />
              <span className="truncate">{opt}</span>
            </label>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export default function AssetRepository() {
  const { selection, setSelection } = useAssetSelection();
  const { toast } = useToast();

  const [regions, setRegions] = useState<string[]>(selection.regions);
  const [countries, setCountries] = useState<string[]>(selection.countries);
  const [sourceTypes, setSourceTypes] = useState<string[]>(selection.sourceTypes);
  const [sourceNames, setSourceNames] = useState<string[]>(selection.sourceNames);
  const [sourceUrls, setSourceUrls] = useState<string[]>(selection.sourceUrls);
  const [attributes, setAttributes] = useState<string[]>(selection.attributes);
  const [workflows, setWorkflows] = useState<string[]>(selection.workflows);

  // Cascading option lists
  const countryOptions = useMemo(() => {
    const pool = filterSources({ regions });
    return Array.from(new Set(pool.map(s => s.country))).sort();
  }, [regions]);

  const typeOptions = useMemo(() => {
    const pool = filterSources({ regions, countries });
    return Array.from(new Set(pool.map(s => s.sourceType))).sort();
  }, [regions, countries]);

  const nameOptions = useMemo(() => {
    const pool = filterSources({ regions, countries, sourceTypes });
    return Array.from(new Set(pool.map(s => s.sourceName))).sort();
  }, [regions, countries, sourceTypes]);

  const matched = useMemo(
    () => filterSources({ regions, countries, sourceTypes, sourceNames }),
    [regions, countries, sourceTypes, sourceNames],
  );

  const urlOptions = useMemo(
    () => Array.from(new Set(matched.map(s => s.sourceUrl))).sort(),
    [matched],
  );
  const attrOptions = useMemo(() => {
    const set = new Set<string>();
    matched.forEach(s => s.attributes.forEach(a => set.add(a)));
    return Array.from(set).sort();
  }, [matched]);
  const workflowOptions = useMemo(() => {
    const set = new Set<string>();
    matched.forEach(s => s.workflows.forEach(w => set.add(w)));
    return Array.from(set).sort();
  }, [matched]);

  // Prune downstream when upstream changes
  useEffect(() => { setCountries(c => c.filter(x => countryOptions.includes(x))); }, [countryOptions]);
  useEffect(() => { setSourceTypes(t => t.filter(x => typeOptions.includes(x))); }, [typeOptions]);
  useEffect(() => { setSourceNames(n => n.filter(x => nameOptions.includes(x))); }, [nameOptions]);
  useEffect(() => { setSourceUrls(u => u.filter(x => urlOptions.includes(x))); }, [urlOptions]);
  useEffect(() => { setAttributes(a => a.filter(x => attrOptions.includes(x))); }, [attrOptions]);
  useEffect(() => { setWorkflows(w => w.filter(x => workflowOptions.includes(x))); }, [workflowOptions]);

  // Preview cards filtered by all selections
  const previewCards = useMemo(() => {
    let pool = matched;
    if (sourceUrls.length) pool = pool.filter(s => sourceUrls.includes(s.sourceUrl));
    if (workflows.length) pool = pool.filter(s => s.workflows.some(w => workflows.includes(w)));
    return pool;
  }, [matched, sourceUrls, workflows]);

  const totalSelected =
    regions.length + countries.length + sourceTypes.length + sourceNames.length +
    sourceUrls.length + attributes.length + workflows.length;

  const handleSave = () => {
    setSelection({ regions, countries, sourceTypes, sourceNames, sourceUrls, attributes, workflows });
    toast({
      title: "Assets saved",
      description: `${previewCards.length} sources scoped for Job Configuration.`,
    });
  };

  const handleReset = () => {
    setRegions([]); setCountries([]); setSourceTypes([]); setSourceNames([]);
    setSourceUrls([]); setAttributes([]); setWorkflows([]);
  };

  return (
    <div className="space-y-3">
      <div className="border-l-[3px] border-primary pl-4 flex items-start justify-between">
        <div>
          <h1 className="text-[18px] font-bold text-foreground">Asset Repository</h1>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            Browse the catalog of {sourceCatalog.length} sources. Select the regions, sources, attributes and workflows you want available in Job Configuration.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" className="h-8 text-[11px] gap-1.5" onClick={handleReset}>
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </Button>
          <Button size="sm" className="h-8 text-[11px] gap-1.5" onClick={handleSave} disabled={previewCards.length === 0}>
            <Save className="w-3.5 h-3.5" /> Save to Job Configuration
          </Button>
        </div>
      </div>

      {/* Summary */}
      <Card className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[12px]">
          <Filter className="w-4 h-4 text-brand" />
          <span className="font-semibold">Filters active:</span>
          <Badge variant="outline" className="text-[10px]">{totalSelected}</Badge>
          <span className="text-muted-foreground">·</span>
          <span><span className="font-semibold">{previewCards.length}</span> matching source{previewCards.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="text-[11px] text-muted-foreground">
          Only saved selections flow into Job Configuration dropdowns.
        </div>
      </Card>

      {/* Filter grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <FilterBlock icon={Globe} label="Region" options={regionOptions} selected={regions} onChange={setRegions} search />
        <FilterBlock icon={MapPin} label="Country" options={countryOptions} selected={countries} onChange={setCountries} search />
        <FilterBlock icon={Layers} label="Source Type" options={typeOptions} selected={sourceTypes} onChange={setSourceTypes} />
        <FilterBlock icon={FileText} label="Source Name" options={nameOptions} selected={sourceNames} onChange={setSourceNames} search />
        <FilterBlock icon={Link2} label="Source URL" options={urlOptions} selected={sourceUrls} onChange={setSourceUrls} search />
        <FilterBlock icon={Tags} label="Data Attributes" options={attrOptions} selected={attributes} onChange={setAttributes} search />
        <FilterBlock icon={Workflow} label="Workflow" options={workflowOptions} selected={workflows} onChange={setWorkflows} />
        <div className="border border-dashed border-border rounded-md bg-muted/10 p-2.5 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Boxes className="w-3.5 h-3.5 text-brand" />
            <span className="text-[11px] font-semibold">Currently saved</span>
          </div>
          <ul className="space-y-0.5 text-[10px] text-muted-foreground">
            <li>Regions: <span className="text-foreground font-medium">{selection.regions.length}</span></li>
            <li>Countries: <span className="text-foreground font-medium">{selection.countries.length}</span></li>
            <li>Sources: <span className="text-foreground font-medium">{selection.sourceNames.length}</span></li>
            <li>Attributes: <span className="text-foreground font-medium">{selection.attributes.length}</span></li>
            <li>Workflows: <span className="text-foreground font-medium">{selection.workflows.length}</span></li>
          </ul>
        </div>
      </div>

      {/* Preview cards */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-[12px] font-semibold text-foreground">Matching assets ({previewCards.length})</h3>
          <span className="text-[10px] text-muted-foreground">Showing first 60</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
          {previewCards.slice(0, 60).map((s, i) => {
            const isSelected = sourceNames.includes(s.sourceName);
            return (
              <Card
                key={`${s.sourceName}-${i}`}
                className={cn(
                  "p-2.5 cursor-pointer transition-all hover:border-brand-mid hover:shadow-sm",
                  isSelected && "border-brand bg-brand-light/30",
                )}
                onClick={() =>
                  setSourceNames(prev =>
                    prev.includes(s.sourceName) ? prev.filter(x => x !== s.sourceName) : [...prev, s.sourceName],
                  )
                }
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-[12px] font-semibold leading-tight truncate flex-1">{s.sourceName}</h4>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0" />}
                </div>
                <div className="flex flex-wrap gap-1 mb-1.5">
                  <Badge variant="outline" className="text-[9px] h-4 px-1">{s.sourceType}</Badge>
                  <Badge variant="outline" className="text-[9px] h-4 px-1">{s.region}</Badge>
                  <Badge variant="outline" className="text-[9px] h-4 px-1">{s.country}</Badge>
                </div>
                <a href={s.sourceUrl} target="_blank" rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="text-[10px] text-primary hover:underline truncate block mb-1">
                  {s.sourceUrl}
                </a>
                <div className="text-[10px] text-muted-foreground">
                  <span className="font-medium">{s.attributes.length}</span> attributes ·{" "}
                  <span className="font-medium">{s.workflows.length}</span> workflows
                </div>
              </Card>
            );
          })}
          {previewCards.length === 0 && (
            <Card className="col-span-full p-8 text-center text-[12px] text-muted-foreground">
              No assets match the current filters.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
