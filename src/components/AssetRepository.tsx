import { useMemo, useState, useEffect } from "react";
import {
  Boxes, Filter, Globe, MapPin, Layers, FileText, Link2, Tags, Workflow, CheckCircle2, RotateCcw, Save,
  Bookmark, Pencil, Trash2, Check, X, FolderOpen, RefreshCw,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { sourceCatalog, filterSources, allRegions } from "@/data/source-catalog";
import { useAssetSelection, type AssetSelection } from "@/contexts/AssetSelectionContext";
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
  const {
    savedConfigs, activeConfigId, saveConfig, updateConfig, renameConfig, deleteConfig, loadConfig,
  } = useAssetSelection();
  const { toast } = useToast();

  const [regions, setRegions] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [sourceTypes, setSourceTypes] = useState<string[]>([]);
  const [sourceNames, setSourceNames] = useState<string[]>([]);
  const [sourceUrls, setSourceUrls] = useState<string[]>([]);
  const [attributes, setAttributes] = useState<string[]>([]);
  const [workflows, setWorkflows] = useState<string[]>([]);

  // Save dialog state
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);

  // Rename dialog state
  const [renameTarget, setRenameTarget] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [renameError, setRenameError] = useState<string | null>(null);

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

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

  const previewCards = useMemo(() => {
    let pool = matched;
    if (sourceUrls.length) pool = pool.filter(s => sourceUrls.includes(s.sourceUrl));
    if (workflows.length) pool = pool.filter(s => s.workflows.some(w => workflows.includes(w)));
    return pool;
  }, [matched, sourceUrls, workflows]);

  const totalSelected =
    regions.length + countries.length + sourceTypes.length + sourceNames.length +
    sourceUrls.length + attributes.length + workflows.length;

  const currentSelection = (): AssetSelection => ({
    regions, countries, sourceTypes, sourceNames, sourceUrls, attributes, workflows,
  });

  const applySelection = (s: AssetSelection) => {
    setRegions(s.regions); setCountries(s.countries); setSourceTypes(s.sourceTypes);
    setSourceNames(s.sourceNames); setSourceUrls(s.sourceUrls);
    setAttributes(s.attributes); setWorkflows(s.workflows);
  };

  const summarize = (s: AssetSelection) => {
    const parts: string[] = [];
    if (s.regions.length) parts.push(`${s.regions.length} reg`);
    if (s.countries.length) parts.push(`${s.countries.length} ctry`);
    if (s.sourceNames.length) parts.push(`${s.sourceNames.length} src`);
    if (s.attributes.length) parts.push(`${s.attributes.length} attr`);
    if (s.workflows.length) parts.push(`${s.workflows.length} wf`);
    return parts.join(" · ") || "Empty";
  };

  // Save flow
  const openSaveDialog = () => {
    setSaveName("");
    setSaveError(null);
    setSaveOpen(true);
  };

  const handleSaveConfirm = () => {
    const name = saveName.trim();
    if (!name) { setSaveError("Please enter a configuration name."); return; }
    if (savedConfigs.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      setSaveError("A configuration with this name already exists.");
      return;
    }
    saveConfig(name, currentSelection());
    setSaveOpen(false);
    toast({ title: "Configuration saved", description: `“${name}” is now available in Job Configuration.` });
  };

  const handleOverwrite = (id: string) => {
    const cfg = savedConfigs.find(c => c.id === id);
    if (!cfg) return;
    updateConfig(id, currentSelection());
    toast({ title: "Configuration updated", description: `“${cfg.name}” has been overwritten.` });
  };

  const handleLoad = (id: string) => {
    const cfg = savedConfigs.find(c => c.id === id);
    if (!cfg) return;
    applySelection(cfg.selection);
    loadConfig(id);
    toast({ title: "Configuration loaded", description: `“${cfg.name}” is now active.` });
  };

  // Rename flow
  const openRename = (id: string) => {
    const cfg = savedConfigs.find(c => c.id === id);
    if (!cfg) return;
    setRenameTarget(id);
    setRenameValue(cfg.name);
    setRenameError(null);
  };
  const handleRenameConfirm = () => {
    if (!renameTarget) return;
    const name = renameValue.trim();
    if (!name) { setRenameError("Name cannot be empty."); return; }
    if (savedConfigs.some(c => c.id !== renameTarget && c.name.toLowerCase() === name.toLowerCase())) {
      setRenameError("A configuration with this name already exists.");
      return;
    }
    renameConfig(renameTarget, name);
    setRenameTarget(null);
    toast({ title: "Renamed", description: `Configuration renamed to “${name}”.` });
  };

  // Delete flow
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    const cfg = savedConfigs.find(c => c.id === deleteTarget);
    deleteConfig(deleteTarget);
    setDeleteTarget(null);
    toast({ title: "Deleted", description: cfg ? `“${cfg.name}” removed.` : "Configuration removed." });
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
          <Button size="sm" className="h-8 text-[11px] gap-1.5" onClick={openSaveDialog} disabled={previewCards.length === 0}>
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
          Saved configurations populate Job Configuration when loaded.
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

        {/* Currently saved */}
        <div className="border border-border rounded-md bg-card overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-2.5 py-1.5 border-b bg-muted/20">
            <div className="flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-brand" />
              <span className="text-[11px] font-semibold">Currently saved</span>
              <Badge variant="secondary" className="text-[9px] h-4 px-1.5">{savedConfigs.length}</Badge>
            </div>
          </div>
          <ScrollArea className="h-[200px]">
            <div className="p-1.5 space-y-1.5">
              {savedConfigs.length === 0 && (
                <div className="px-2 py-6 text-center text-[11px] text-muted-foreground">
                  No saved configurations yet.<br/>Apply filters and click <span className="font-medium">Save to Job Configuration</span>.
                </div>
              )}
              {savedConfigs.map(cfg => {
                const isActive = cfg.id === activeConfigId;
                return (
                  <div
                    key={cfg.id}
                    className={cn(
                      "border rounded-md p-2 text-[11px] transition-colors",
                      isActive ? "border-brand bg-brand-light/30" : "border-border hover:bg-muted/30",
                    )}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold truncate">{cfg.name}</span>
                          {isActive && <Check className="w-3 h-3 text-brand shrink-0" />}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">{summarize(cfg.selection)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-1.5">
                      <Button size="sm" variant="outline" className="h-6 px-1.5 text-[10px] gap-1"
                        onClick={() => handleLoad(cfg.id)}>
                        <FolderOpen className="w-2.5 h-2.5" /> Load
                      </Button>
                      <Button size="sm" variant="outline" className="h-6 px-1.5 text-[10px] gap-1"
                        onClick={() => handleOverwrite(cfg.id)} disabled={previewCards.length === 0}
                        title="Overwrite with current filters">
                        <RefreshCw className="w-2.5 h-2.5" /> Update
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0"
                        onClick={() => openRename(cfg.id)} title="Rename">
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

      {/* Save dialog */}
      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[15px]">Save configuration</DialogTitle>
            <DialogDescription className="text-[12px]">
              Name this filter configuration so you can load, update or rerun it later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="cfg-name" className="text-[11px] font-semibold">Configuration Name</Label>
            <Input
              id="cfg-name"
              autoFocus
              value={saveName}
              onChange={e => { setSaveName(e.target.value); setSaveError(null); }}
              onKeyDown={e => { if (e.key === "Enter") handleSaveConfirm(); }}
              placeholder="e.g. EU Stock Exchanges – Daily"
              className="h-9 text-[13px]"
              maxLength={80}
            />
            {saveError && (
              <p className="text-[11px] text-destructive">{saveError}</p>
            )}
            <div className="rounded-md border bg-muted/20 px-2.5 py-2 text-[10px] text-muted-foreground">
              <span className="font-semibold text-foreground">Summary:</span> {summarize(currentSelection())}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setSaveOpen(false)}>
              <X className="w-3.5 h-3.5 mr-1" /> Cancel
            </Button>
            <Button size="sm" onClick={handleSaveConfirm}>
              <Save className="w-3.5 h-3.5 mr-1" /> Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename dialog */}
      <Dialog open={!!renameTarget} onOpenChange={(o) => !o && setRenameTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[15px]">Rename configuration</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="rename-name" className="text-[11px] font-semibold">Configuration Name</Label>
            <Input
              id="rename-name"
              autoFocus
              value={renameValue}
              onChange={e => { setRenameValue(e.target.value); setRenameError(null); }}
              onKeyDown={e => { if (e.key === "Enter") handleRenameConfirm(); }}
              className="h-9 text-[13px]"
              maxLength={80}
            />
            {renameError && <p className="text-[11px] text-destructive">{renameError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setRenameTarget(null)}>Cancel</Button>
            <Button size="sm" onClick={handleRenameConfirm}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete configuration?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove “{savedConfigs.find(c => c.id === deleteTarget)?.name}”. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
