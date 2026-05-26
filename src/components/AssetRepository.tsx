import { useMemo, useState } from "react";
import {
  Archive, Workflow, Globe, Save, Filter as FilterIcon, Download, Search,
  ExternalLink, X, TrendingUp, ChevronDown, ChevronRight, Check,
  Bookmark, Pencil, Trash2, MapPin, PlusCircle, ArrowLeftRight, ShieldCheck,
  RefreshCw, GitMerge, FileText, Database, BarChart3, Briefcase, Users, Building2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { sourceCatalog, allRegions } from "@/data/source-catalog";
import { useAssetSelection, type AssetSelection } from "@/contexts/AssetSelectionContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Tab = "sources" | "workflows";

const EMPTY: AssetSelection = {
  regions: [], countries: [], sourceTypes: [], sourceNames: [],
  sourceUrls: [], attributes: [], workflows: [],
};

// ---------- KPI Card ----------
function StatCard({
  label, value, sub, icon: Icon, trend,
}: {
  label: string; value: string; sub: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
}) {
  return (
    <Card className="p-4 bg-brand-light/40 border-brand-mid/30">
      <div className="flex items-start justify-between mb-2">
        <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">{label}</span>
        <div className="w-7 h-7 rounded-md bg-card border border-brand-mid/40 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-brand" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-[28px] font-bold leading-none text-foreground">{value}</span>
        {trend && (
          <span className="flex items-center gap-0.5 text-[10px] font-semibold text-brand">
            <TrendingUp className="w-2.5 h-2.5" /> {trend}
          </span>
        )}
      </div>
      <div className="text-[11px] text-muted-foreground mt-1.5">{sub}</div>
    </Card>
  );
}

export default function AssetRepository() {
  const {
    savedConfigs, activeConfigId, saveConfig, updateConfig,
    renameConfig, deleteConfig, loadConfig,
  } = useAssetSelection();
  const { toast } = useToast();

  const [tab, setTab] = useState<Tab>("sources");
  const [jobName, setJobName] = useState("");
  const [search, setSearch] = useState("");
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);

  // Filters
  const [regions, setRegions] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [sourceTypes, setSourceTypes] = useState<string[]>([]);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  // Dialogs
  const [renameTarget, setRenameTarget] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [renameError, setRenameError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // ---------- Derived stats ----------
  const allSourceTypes = useMemo(
    () => Array.from(new Set(sourceCatalog.map(s => s.sourceType))).sort(),
    [],
  );
  const allWorkflows = useMemo(() => {
    const set = new Set<string>();
    sourceCatalog.forEach(s => s.workflows.forEach(w => set.add(w)));
    return Array.from(set).sort();
  }, []);
  const allCountries = useMemo(
    () => Array.from(new Set(sourceCatalog.map(s => s.country).filter(Boolean))).sort(),
    [],
  );

  const totalAssets = sourceCatalog.length;
  const activeWorkflowsCount = allWorkflows.length;
  const globalCoverage = allCountries.length;

  // ---------- Filter pipeline ----------
  const filteredSources = useMemo(() => {
    return sourceCatalog.filter(s => {
      if (regions.length && !regions.includes(s.region)) return false;
      if (countries.length && !countries.includes(s.country)) return false;
      if (sourceTypes.length && !sourceTypes.includes(s.sourceType)) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !s.sourceName.toLowerCase().includes(q) &&
          !s.country.toLowerCase().includes(q) &&
          !s.sourceType.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [regions, countries, sourceTypes, search]);

  // ---------- Sources tab groups ----------
  const sourceGroups = useMemo(() => {
    const map = new Map<string, typeof sourceCatalog>();
    filteredSources.forEach(s => {
      if (!map.has(s.sourceType)) map.set(s.sourceType, []);
      map.get(s.sourceType)!.push(s);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredSources]);

  // ---------- Workflows tab groups ----------
  const workflowGroups = useMemo(() => {
    const map = new Map<string, typeof sourceCatalog>();
    filteredSources.forEach(s => {
      s.workflows.forEach(w => {
        if (search && !w.toLowerCase().includes(search.toLowerCase()) &&
            !s.sourceName.toLowerCase().includes(search.toLowerCase())) return;
        if (!map.has(w)) map.set(w, []);
        map.get(w)!.push(s);
      });
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredSources, search]);

  // ---------- Selection helpers ----------
  const allFilteredNames = useMemo(() => filteredSources.map(s => s.sourceName), [filteredSources]);
  const allSelected = allFilteredNames.length > 0 && allFilteredNames.every(n => selectedSources.includes(n));

  const toggleSource = (name: string) =>
    setSelectedSources(prev => prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]);
  const toggleWorkflow = (w: string) =>
    setSelectedWorkflows(prev => prev.includes(w) ? prev.filter(x => x !== w) : [...prev, w]);

  const toggleGroup = (key: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) setSelectedSources([]);
    else setSelectedSources(prev => Array.from(new Set([...prev, ...allFilteredNames])));
  };

  // ---------- Save job ----------
  const currentSelection = (): AssetSelection => ({
    regions, countries, sourceTypes,
    sourceNames: selectedSources, sourceUrls: [],
    attributes: [],
    workflows: selectedWorkflows,
  });

  const summarize = (s: AssetSelection) => {
    const parts: string[] = [];
    if (s.sourceTypes.length) parts.push(`${s.sourceTypes.length} type`);
    if (s.regions.length) parts.push(`${s.regions.length} reg`);
    if (s.sourceNames.length) parts.push(`${s.sourceNames.length} src`);
    if (s.workflows.length) parts.push(`${s.workflows.length} wf`);
    return parts.join(" · ") || "Empty";
  };

  const handleSaveJob = () => {
    const name = jobName.trim();
    if (!name) { toast({ title: "Job name required", description: "Enter a job name first.", variant: "destructive" }); return; }
    if (savedConfigs.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      toast({ title: "Duplicate name", description: "A saved job already uses this name.", variant: "destructive" });
      return;
    }
    if (selectedSources.length === 0 && selectedWorkflows.length === 0) {
      toast({ title: "Nothing selected", description: "Select at least one source or workflow.", variant: "destructive" });
      return;
    }
    saveConfig(name, currentSelection());
    toast({ title: "Job saved", description: `“${name}” is available in Job Configuration.` });
    setJobName("");
  };

  const handleLoad = (id: string) => {
    const cfg = savedConfigs.find(c => c.id === id);
    if (!cfg) return;
    loadConfig(id);
    setRegions(cfg.selection.regions);
    setCountries(cfg.selection.countries);
    setSourceTypes(cfg.selection.sourceTypes);
    setSelectedSources(cfg.selection.sourceNames);
    setSelectedWorkflows(cfg.selection.workflows);
    setJobName(cfg.name);
    toast({ title: "Loaded", description: `“${cfg.name}” applied.` });
  };

  const handleOverwrite = (id: string) => {
    const cfg = savedConfigs.find(c => c.id === id);
    if (!cfg) return;
    updateConfig(id, currentSelection());
    toast({ title: "Updated", description: `“${cfg.name}” overwritten.` });
  };

  const openRename = (id: string) => {
    const cfg = savedConfigs.find(c => c.id === id);
    if (!cfg) return;
    setRenameTarget(id); setRenameValue(cfg.name); setRenameError(null);
  };
  const confirmRename = () => {
    if (!renameTarget) return;
    const name = renameValue.trim();
    if (!name) { setRenameError("Name cannot be empty."); return; }
    if (savedConfigs.some(c => c.id !== renameTarget && c.name.toLowerCase() === name.toLowerCase())) {
      setRenameError("A configuration with this name already exists."); return;
    }
    renameConfig(renameTarget, name);
    setRenameTarget(null);
    toast({ title: "Renamed", description: `Renamed to “${name}”.` });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const cfg = savedConfigs.find(c => c.id === deleteTarget);
    deleteConfig(deleteTarget);
    setDeleteTarget(null);
    toast({ title: "Deleted", description: cfg ? `“${cfg.name}” removed.` : "Removed." });
  };

  // ---------- CSV export ----------
  const exportCsv = () => {
    const rows = [["Source Type", "Source Name", "Region", "Country", "Source URL", "Workflows", "Attributes"]];
    filteredSources.forEach(s => {
      rows.push([
        s.sourceType, s.sourceName, s.region, s.country, s.sourceUrl,
        s.workflows.join("; "), s.attributes.join("; "),
      ]);
    });
    const csv = rows.map(r => r.map(c => `"${(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "asset-repository.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const filterCount = regions.length + countries.length + sourceTypes.length;
  const clearFilters = () => { setRegions([]); setCountries([]); setSourceTypes([]); };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="border-l-[3px] border-primary pl-4">
        <h1 className="text-[18px] font-bold text-foreground">Asset Repository</h1>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          Browse verified data sources and workflows. Build a job by selecting assets and saving it for execution.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Total Assets" value={`${totalAssets}+`} sub="Verified global data sources"
          icon={Archive} trend="+12%" />
        <StatCard label="Active Workflows" value={String(activeWorkflowsCount)} sub="Optimized ingestion pipelines"
          icon={Workflow} />
        <StatCard label="Global Coverage" value={`${globalCoverage}+`} sub="Countries across 6 continents"
          icon={Globe} />
      </div>

      {/* Asset Name row */}
      <Card className="p-3 flex items-center gap-3">
        <Label htmlFor="job-name" className="text-[12px] font-semibold whitespace-nowrap">Asset Name:</Label>
        <Input
          id="job-name"
          value={jobName}
          onChange={e => setJobName(e.target.value)}
          placeholder="e.g., Q3 Market Update"
          className="h-9 text-[12px] flex-1"
          maxLength={80}
        />
        <Button size="sm" className="h-9 gap-1.5 text-[12px]" onClick={handleSaveJob}>
          <Save className="w-3.5 h-3.5" /> Save Asset
        </Button>
      </Card>

      {/* Toolbar */}
      <Card className="p-2.5 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {/* Tabs */}
          <div className="inline-flex rounded-md border border-border bg-muted/30 p-0.5">
            <button
              onClick={() => setTab("sources")}
              className={cn(
                "px-3 h-7 text-[11px] font-semibold rounded transition-colors",
                tab === "sources" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >Sources</button>
            <button
              onClick={() => setTab("workflows")}
              className={cn(
                "px-3 h-7 text-[11px] font-semibold rounded transition-colors",
                tab === "workflows" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >Workflows</button>
          </div>

          <div className="w-px h-6 bg-border" />

          {/* Filter popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-[11px] gap-1.5">
                <FilterIcon className="w-3.5 h-3.5" /> Filter
                {filterCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-4 px-1 text-[9px]">{filterCount}</Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[480px] p-3" align="start">
              <div className="grid grid-cols-2 gap-3">
                <MultiPick label="Region" options={allRegions.filter(r => r !== "Any")} selected={regions} onChange={setRegions} />
                <MultiPick label="Country" options={allCountries} selected={countries} onChange={setCountries} search />
              </div>
              <div className="flex justify-end mt-3 pt-2 border-t">
                <Button size="sm" variant="ghost" className="h-7 text-[11px]" onClick={clearFilters}>Clear all</Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Source type chip */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md border border-brand-mid/40 bg-brand-light/40 text-[11px] font-medium text-foreground hover:bg-brand-light/60">
                Source: {sourceTypes.length === 0 ? "All Types" : `${sourceTypes.length} selected`}
                {sourceTypes.length > 0
                  ? <X className="w-3 h-3 text-muted-foreground hover:text-foreground"
                      onClick={(e) => { e.stopPropagation(); setSourceTypes([]); }} />
                  : <ChevronDown className="w-3 h-3 text-muted-foreground" />}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="start">
              <div className="space-y-1">
                {allSourceTypes.map(t => (
                  <label key={t} className="flex items-center gap-2 px-2 py-1.5 rounded text-[11px] cursor-pointer hover:bg-muted/40">
                    <Checkbox
                      checked={sourceTypes.includes(t)}
                      onCheckedChange={() =>
                        setSourceTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
                      }
                    />
                    <span className="flex-1">{t}</span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Button variant="outline" size="sm" className="h-8 text-[11px] gap-1.5" onClick={exportCsv}>
          <Download className="w-3.5 h-3.5" /> Export CSV
        </Button>
      </Card>

      {/* Select all + search */}
      <div className="flex items-center justify-between gap-3">
        {tab === "sources" ? (
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
            <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              Select All Assets
            </span>
            {selectedSources.length > 0 && (
              <Badge variant="secondary" className="text-[10px]">{selectedSources.length} selected</Badge>
            )}
          </label>
        ) : (
          <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Workflows{selectedWorkflows.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-[10px]">{selectedWorkflows.length} selected</Badge>
            )}
          </span>
        )}
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search within results…"
            className="h-8 pl-8 text-[11px] bg-brand-light/30"
          />
        </div>
      </div>

      {/* Grouped list */}
      <Card className="p-4">
        {tab === "sources" ? (
          <div className="space-y-6">
            {sourceGroups.length === 0 && (
              <div className="text-center py-10 text-[12px] text-muted-foreground">
                No assets match the current filters.
              </div>
            )}
            {sourceGroups.map(([type, items]) => {
              const collapsed = collapsedGroups.has(type);
              return (
                <div key={type}>
                  <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
                    <button onClick={() => toggleGroup(type)} className="flex items-center gap-2 text-left">
                      {collapsed
                        ? <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                      <span className="text-[12px] font-bold tracking-wide uppercase text-foreground">{type}</span>
                      <Badge variant="secondary" className="text-[10px] h-5 px-2 bg-brand-light/60 text-brand border-0">
                        {items.length} assets
                      </Badge>
                    </button>
                    <button onClick={() => toggleGroup(type)} className="text-[11px] font-medium text-primary hover:underline">
                      {collapsed ? "Expand" : "Collapse"}
                    </button>
                  </div>
                  {!collapsed && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-1">
                      {items.map((s) => {
                        const selected = selectedSources.includes(s.sourceName);
                        const hash = s.sourceName.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
                        const isUpdating = hash % 7 === 0;
                        const recId = String(100 + ((hash * 31) % 900));
                        return (
                          <div
                            key={`${s.sourceName}-${s.sourceUrl}`}
                            className="group flex items-center gap-2 px-2 py-2 rounded-md hover:bg-brand-light/40 transition-colors"
                          >
                            <Checkbox
                              checked={selected}
                              onCheckedChange={() => toggleSource(s.sourceName)}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="text-[12px] font-semibold text-foreground truncate">{s.sourceName}</div>
                              <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-muted-foreground">
                                <MapPin className="w-2.5 h-2.5" />
                                <span className="truncate">{s.country}</span>
                                <span>•</span>
                                <span className={cn(
                                  "font-medium",
                                  isUpdating ? "text-primary" : "text-emerald-600 dark:text-emerald-400",
                                )}>
                                  {isUpdating ? "Updating" : "Active"}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              <a
                                href={s.sourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="text-primary hover:text-primary/80"
                                title="Visit source"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                              <span className="text-[9px] font-mono text-muted-foreground tracking-tight">ID-{recId}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            {workflowGroups.length === 0 ? (
              <div className="text-center py-10 text-[12px] text-muted-foreground">
                No workflows match the current filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {workflowGroups.map(([wf, items]) => {
                  const selected = selectedWorkflows.includes(wf);
                  const Icon = workflowIconFor(wf);
                  return (
                    <button
                      key={wf}
                      type="button"
                      onClick={() => toggleWorkflow(wf)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-md border text-left transition-colors",
                        selected
                          ? "border-brand bg-brand-light/40"
                          : "border-border bg-card hover:border-brand-mid/60 hover:bg-brand-light/20",
                      )}
                      title={`${items.length} sources`}
                    >
                      <div className="w-9 h-9 rounded-md bg-brand-light/60 border border-brand-mid/40 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-brand" />
                      </div>
                      <span className="text-[12px] font-semibold text-foreground flex-1 leading-tight">{wf}</span>
                      <Checkbox
                        checked={selected}
                        onCheckedChange={() => toggleWorkflow(wf)}
                        onClick={e => e.stopPropagation()}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </Card>


      {/* Saved jobs */}
      {savedConfigs.length > 0 && (
        <Card className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <Bookmark className="w-3.5 h-3.5 text-brand" />
            <span className="text-[11px] font-semibold tracking-wider uppercase text-foreground">Currently Saved</span>
            <Badge variant="secondary" className="text-[10px]">{savedConfigs.length}</Badge>
          </div>
          <ScrollArea className="max-h-[200px]">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
              {savedConfigs.map(cfg => {
                const isActive = cfg.id === activeConfigId;
                return (
                  <div key={cfg.id}
                    className={cn(
                      "border rounded-md p-2 transition-colors",
                      isActive ? "border-brand bg-brand-light/30" : "border-border hover:bg-muted/30",
                    )}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1 min-w-0">
                        <span className="text-[12px] font-semibold truncate">{cfg.name}</span>
                        {isActive && <Check className="w-3 h-3 text-brand shrink-0" />}
                      </div>
                    </div>
                    <div className="text-[10px] text-muted-foreground truncate mb-1.5">{summarize(cfg.selection)}</div>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="outline" className="h-6 px-2 text-[10px]" onClick={() => handleLoad(cfg.id)}>Load</Button>
                      <Button size="sm" variant="outline" className="h-6 px-2 text-[10px]" onClick={() => handleOverwrite(cfg.id)}>Update</Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => openRename(cfg.id)} title="Rename">
                        <Pencil className="w-2.5 h-2.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(cfg.id)} title="Delete">
                        <Trash2 className="w-2.5 h-2.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </Card>
      )}

      {/* Rename */}
      <Dialog open={!!renameTarget} onOpenChange={(o) => !o && setRenameTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[15px]">Rename job</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="rename-name" className="text-[11px] font-semibold">Job Name</Label>
            <Input id="rename-name" autoFocus value={renameValue}
              onChange={e => { setRenameValue(e.target.value); setRenameError(null); }}
              onKeyDown={e => { if (e.key === "Enter") confirmRename(); }}
              className="h-9 text-[13px]" maxLength={80} />
            {renameError && <p className="text-[11px] text-destructive">{renameError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setRenameTarget(null)}>Cancel</Button>
            <Button size="sm" onClick={confirmRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete job?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove “{savedConfigs.find(c => c.id === deleteTarget)?.name}”. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ---------- Workflow icon mapping ----------
function workflowIconFor(name: string) {
  const n = name.toLowerCase();
  if (n.includes("annual report")) return FileText;
  if (n.includes("financial")) return BarChart3;
  if (n.includes("invoice")) return FileText;
  if (n.includes("image") || n.includes("unstructured") || n.includes("idp")) return Database;
  if (n.includes("uk company")) return Building2;
  if (n.includes("us company")) return Building2;
  if (n.includes("register")) return Briefcase;
  if (n.includes("sourcing")) return Users;
  if (n.includes("enrichment")) return PlusCircle;
  if (n.includes("exchange") || n.includes("update")) return ArrowLeftRight;
  if (n.includes("quality")) return ShieldCheck;
  if (n.includes("refresh")) return RefreshCw;
  if (n.includes("consolidation")) return GitMerge;
  return Workflow;
}

// ---------- Reusable multi-pick block ----------
function MultiPick({
  label, options, selected, onChange, search = false,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  search?: boolean;
}) {
  const [q, setQ] = useState("");
  const filtered = q ? options.filter(o => o.toLowerCase().includes(q.toLowerCase())) : options;
  const toggle = (v: string) =>
    onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v]);
  return (
    <div className="border border-border rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-2 py-1.5 border-b bg-muted/30">
        <span className="text-[11px] font-semibold">{label}</span>
        <div className="flex gap-2">
          <button type="button" className="text-[10px] text-primary hover:underline" onClick={() => onChange(options)}>All</button>
          <button type="button" className="text-[10px] text-muted-foreground hover:underline" onClick={() => onChange([])}>Clear</button>
        </div>
      </div>
      {search && (
        <div className="px-1.5 py-1.5 border-b">
          <Input value={q} onChange={e => setQ(e.target.value)} placeholder={`Search ${label.toLowerCase()}…`} className="h-7 text-[11px]" />
        </div>
      )}
      <ScrollArea className="h-44">
        <div className="p-1">
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
