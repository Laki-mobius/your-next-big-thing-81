import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Clock, Activity, CheckCircle2, XCircle, Play, ChevronDown,
  ExternalLink, Database, Workflow, RefreshCw, AlertTriangle, Loader2, CalendarClock,
  Upload, FileSpreadsheet, X, Download,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  filterSources,
  allRegions as rawRegions,
  type SourceRecord,
} from "@/data/source-catalog";
import { summaryStats } from "@/data/job-status-data";
import { useAssetSelection } from "@/contexts/AssetSelectionContext";
import { useToast } from "@/hooks/use-toast";
import { buildJobResult, parseEntityFile, parseManualEntities, type JobResult } from "@/data/job-result-generator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

/* ───────────────── Multi-select dropdown ───────────────── */
function MultiSelect({
  label, options, selected, onChange, placeholder = "Any",
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const toggle = (v: string) =>
    onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v]);

  const summary = selected.length === 0
    ? placeholder
    : selected.length === 1
      ? selected[0]
      : `${selected.length} selected`;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-semibold tracking-wide uppercase text-muted-foreground">{label}</label>
        <div className="flex gap-2">
          <button type="button" className="text-[9px] text-primary hover:underline"
            onClick={() => onChange(options)} disabled={!options.length}>Select all</button>
          <button type="button" className="text-[9px] text-muted-foreground hover:underline"
            onClick={() => onChange([])}>Clear</button>
        </div>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="w-full flex items-center justify-between h-8 px-2.5 text-[12px] rounded-md border border-input bg-background hover:bg-muted/30 transition-colors"
          >
            <span className={cn("truncate", selected.length === 0 && "text-muted-foreground")}>{summary}</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0 ml-1" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[240px]" align="start">
          <div className="flex items-center justify-between px-2.5 py-1.5 border-b">
            <span className="text-[11px] text-muted-foreground">{selected.length}/{options.length} selected</span>
            <div className="flex gap-2">
              <button className="text-[11px] text-primary hover:underline" onClick={() => onChange(options)}>All</button>
              <button className="text-[11px] text-muted-foreground hover:underline" onClick={() => onChange([])}>Clear</button>
            </div>
          </div>
          <ScrollArea className="max-h-64">
            <div className="p-1">
              {options.length === 0 && (
                <div className="px-2 py-2 text-[11px] text-muted-foreground">No options available</div>
              )}
              {options.map(opt => (
                <label
                  key={opt}
                  className="flex items-center gap-2 px-2 py-1.5 rounded text-[12px] cursor-pointer hover:bg-muted/40"
                >
                  <Checkbox
                    checked={selected.includes(opt)}
                    onCheckedChange={() => toggle(opt)}
                  />
                  <span className="truncate">{opt}</span>
                </label>
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}

/* ───────────────── Single-select saved config dropdown ───────────────── */
function SavedConfigSelect({
  label, configs, value, onLoad, placeholder = "Select…",
}: {
  label: string;
  configs: { id: string; name: string }[];
  value: string | null;
  onLoad: (id: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const current = configs.find(c => c.id === value);
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-semibold tracking-wide uppercase text-muted-foreground">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="w-full flex items-center justify-between h-8 px-2.5 text-[12px] rounded-md border border-input bg-background hover:bg-muted/30 transition-colors"
          >
            <span className={cn("truncate", !current && "text-muted-foreground")}>{current?.name ?? placeholder}</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0 ml-1" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[240px]" align="start">
          <ScrollArea className="max-h-64">
            <div className="p-1">
              {configs.length === 0 && (
                <div className="px-2 py-2 text-[11px] text-muted-foreground">No saved configurations</div>
              )}
              {configs.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => { onLoad(c.id); setOpen(false); }}
                  className={cn(
                    "w-full text-left px-2 py-1.5 rounded text-[12px] hover:bg-muted/40 truncate",
                    c.id === value && "bg-muted/40 font-medium",
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}



/* ───────────────── Schedule dialog ───────────────── */
interface ScheduleConfig {
  timezone: string;
  frequency: string;
  startDate: string;
  endDate: string;
}

const TIMEZONES = ["UTC", "America/New_York", "America/Los_Angeles", "Europe/London", "Europe/Berlin", "Asia/Singapore", "Asia/Tokyo", "Asia/Kolkata"];
const FREQUENCIES = ["One-time", "Hourly", "Daily", "Weekly", "Monthly"];

function ScheduleButton({ value, onSave }: { value: ScheduleConfig | null; onSave: (s: ScheduleConfig) => void }) {
  const [open, setOpen] = useState(false);
  const [tz, setTz] = useState(value?.timezone ?? "UTC");
  const [freq, setFreq] = useState(value?.frequency ?? "Daily");
  const [start, setStart] = useState(value?.startDate ?? "");
  const [end, setEnd] = useState(value?.endDate ?? "");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1.5">
          <CalendarClock className="w-3 h-3" />
          {value ? `${value.frequency}` : "Schedule"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[14px]">Schedule extraction</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-[11px]">Timezone</Label>
            <Select value={tz} onValueChange={setTz}>
              <SelectTrigger className="h-8 text-[12px]"><SelectValue /></SelectTrigger>
              <SelectContent>{TIMEZONES.map(t => <SelectItem key={t} value={t} className="text-[12px]">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px]">Frequency</Label>
            <Select value={freq} onValueChange={setFreq}>
              <SelectTrigger className="h-8 text-[12px]"><SelectValue /></SelectTrigger>
              <SelectContent>{FREQUENCIES.map(f => <SelectItem key={f} value={f} className="text-[12px]">{f}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px]">Start date</Label>
            <Input type="date" value={start} onChange={e => setStart(e.target.value)} className="h-8 text-[12px]" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px]">End date</Label>
            <Input type="date" value={end} onChange={e => setEnd(e.target.value)} className="h-8 text-[12px]" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={() => { onSave({ timezone: tz, frequency: freq, startDate: start, endDate: end }); setOpen(false); }}>
            Save schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ───────────────── Entity Identifiers upload ───────────────── */
function EntityIdentifiersUpload({
  file, onFile, manual, onManual,
}: {
  file: File | null;
  onFile: (f: File | null) => void;
  manual: string;
  onManual: (v: string) => void;
}) {
  const [mode, setMode] = useState<"upload" | "manual">("upload");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const accept = ".csv,.txt,.xlsx";
  const handleFiles = (fs: FileList | null) => {
    if (!fs || !fs[0]) return;
    const f = fs[0];
    const ok = /\.(csv|txt|xlsx)$/i.test(f.name);
    if (!ok) return;
    onFile(f);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Entity Identifiers <span className="text-destructive">*</span>
        </span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="sm"
            variant={mode === "upload" ? "default" : "outline"}
            className="h-6 text-[10px] px-2 gap-1"
            onClick={() => setMode("upload")}
          >
            <Upload className="w-3 h-3" /> Upload File
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode === "manual" ? "default" : "outline"}
            className="h-6 text-[10px] px-2"
            onClick={() => setMode("manual")}
          >
            Manual Entry
          </Button>
        </div>
      </div>

      {mode === "upload" ? (
        file ? (
          <div className="border rounded-md px-2.5 py-2 flex items-center gap-2 bg-muted/10">
            <FileSpreadsheet className="w-4 h-4 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-semibold text-foreground truncate">{file.name}</div>
              <div className="text-[10px] text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</div>
            </div>
            <button
              type="button"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => onFile(null)}
              aria-label="Remove file"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "border border-dashed rounded-md px-3 py-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors text-center",
              dragOver ? "border-primary bg-primary/5" : "border-border bg-muted/10 hover:bg-muted/20",
            )}
          >
            <Upload className="w-4 h-4 text-muted-foreground" />
            <div className="text-[11px] text-muted-foreground">
              Drop a CSV, TXT or XLSX file, or
            </div>
            <Button type="button" size="sm" variant="outline" className="h-6 text-[10px] px-2 mt-0.5"
              onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}>
              Browse Files
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={e => handleFiles(e.target.files)}
            />
            <div className="text-[10px] text-muted-foreground mt-1">
              Accepted: Company name and Company webpage
            </div>
          </div>
        )
      ) : (
        <div className="space-y-1">
          <textarea
            value={manual}
            onChange={e => onManual(e.target.value)}
            placeholder="Enter one per line: Company name, Company webpage"
            className="w-full min-h-[72px] rounded-md border border-input bg-background px-2.5 py-1.5 text-[11px] resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <div className="text-[10px] text-muted-foreground">Accepted: Company name and Company webpage</div>
        </div>
      )}
    </div>
  );
}

/* ───────────────── Job model ───────────────── */
type JobStatus = "Queued" | "Running" | "Completed" | "Failed";

interface RunJob {
  id: string;
  kind: "sources" | "workflows";
  label: string;
  jobName?: string;
  status: JobStatus;
  progress: number;
  startedAt: number;
  endedAt?: number;
  sourcesCount: number;
  attributesCount: number;
  attributesExtracted: number;
  errors: string[];
  schedule?: ScheduleConfig | null;
  jobResult?: JobResult | null;
  persisted?: boolean;
}

const fmtTime = (ts?: number) =>
  ts ? new Date(ts).toLocaleTimeString("en-US", { hour12: false }) : "—";

const fmtDuration = (start: number, end?: number) => {
  const ms = (end ?? Date.now()) - start;
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}m ${String(s % 60).padStart(2, "0")}s`;
};

/* ───────────────── Pane: Run by Sources ───────────────── */
function RunBySourcesPane({ onRun }: { onRun: (j: RunJob) => void }) {
  const { scopedSources, savedConfigs, activeConfigId, loadConfig } = useAssetSelection();
  const { toast } = useToast();


  
  const [jobName, setJobName] = useState("");
  const [schedule, setSchedule] = useState<ScheduleConfig | null>(null);
  const [entityFile, setEntityFile] = useState<File | null>(null);
  const [entityManual, setEntityManual] = useState("");

  const sourceConfigs = useMemo(
    () => savedConfigs.filter(c => c.selection.sourceNames.length > 0),
    [savedConfigs],
  );

  const activeIsSource = !!sourceConfigs.find(c => c.id === activeConfigId);

  const selectedNames = useMemo(() => {
    if (!activeIsSource) return [];
    const cfg = sourceConfigs.find(c => c.id === activeConfigId);
    return cfg ? cfg.selection.sourceNames : [];
  }, [activeIsSource, activeConfigId, sourceConfigs]);

  const matched: SourceRecord[] = useMemo(
    () => scopedSources.filter(s => selectedNames.includes(s.sourceName)),
    [scopedSources, selectedNames],
  );

  const availableAttrs = useMemo(() => {
    const set = new Set<string>();
    matched.forEach(s => s.attributes.forEach(a => set.add(a)));
    return Array.from(set).sort();
  }, [matched]);

  const canRun = matched.length > 0 && jobName.trim().length > 0;

  const handleRun = () => {
    onRun({
      id: `SRC-${Date.now().toString(36).toUpperCase()}`,
      kind: "sources",
      jobName: jobName.trim(),
      label: `${matched.length} source${matched.length !== 1 ? "s" : ""} · ${availableAttrs.length} attribute${availableAttrs.length !== 1 ? "s" : ""}`,
      status: "Queued",
      progress: 0,
      startedAt: Date.now(),
      sourcesCount: matched.length,
      attributesCount: availableAttrs.length,
      attributesExtracted: 0,
      errors: [],
      schedule,
    });
    toast({ title: `Job "${jobName.trim()}" saved & queued`, description: schedule ? `Scheduled · ${schedule.frequency} (${schedule.timezone})` : "Running now" });
  };

  return (
    <Card className="flex flex-col h-full p-0 overflow-hidden">
      <div className="flex items-center gap-2 px-3.5 py-2.5 border-b bg-muted/20">
        <Database className="w-4 h-4 text-primary" />
        <h3 className="text-[13px] font-bold text-foreground">Run by Sources</h3>
      </div>
      <div className="p-3 space-y-3 flex-1 overflow-y-auto">
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold tracking-wide uppercase text-muted-foreground">Job Name</label>
          <Input value={jobName} onChange={e => setJobName(e.target.value)}
            placeholder="e.g. EU Stock Exchanges - Daily"
            className="h-8 text-[12px]" />
        </div>

        <SavedConfigSelect
          label="Saved Sources"
          configs={sourceConfigs}
          value={activeIsSource ? activeConfigId : null}
          onLoad={loadConfig}
          placeholder={sourceConfigs.length ? "Select a saved source" : "No saved sources"}
        />


        <EntityIdentifiersUpload file={entityFile} onFile={setEntityFile} manual={entityManual} onManual={setEntityManual} />
      </div>
      <div className="px-3 py-2.5 border-t bg-muted/10 flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground truncate">
          {matched.length} src · {availableAttrs.length} attrs
        </span>
        <div className="flex items-center gap-2">
          <ScheduleButton value={schedule} onSave={setSchedule} />
          <Button size="sm" className="h-7 text-[11px] gap-1.5" disabled={!canRun} onClick={handleRun}>
            <Play className="w-3 h-3" /> Run Extraction
          </Button>
        </div>
      </div>
    </Card>
  );
}

/* ───────────────── Pane: Run by Workflows ───────────────── */
function RunByWorkflowsPane({ onRun }: { onRun: (j: RunJob) => void }) {
  const { scopedSources, savedConfigs, activeConfigId, loadConfig } = useAssetSelection();
  const { toast } = useToast();

  const [jobName, setJobName] = useState("");
  const [schedule, setSchedule] = useState<ScheduleConfig | null>(null);
  const [entityFile, setEntityFile] = useState<File | null>(null);
  const [entityManual, setEntityManual] = useState("");

  const workflowConfigs = useMemo(
    () => savedConfigs.filter(c => c.selection.workflows.length > 0),
    [savedConfigs],
  );

  const activeIsWorkflow = !!workflowConfigs.find(c => c.id === activeConfigId);

  const selectedWfs = useMemo(() => {
    if (!activeIsWorkflow) return [];
    const cfg = workflowConfigs.find(c => c.id === activeConfigId);
    return cfg ? cfg.selection.workflows : [];
  }, [activeIsWorkflow, activeConfigId, workflowConfigs]);

  const matched: SourceRecord[] = useMemo(
    () => scopedSources.filter(s => s.workflows.some(w => selectedWfs.includes(w))),
    [scopedSources, selectedWfs],
  );

  const availableAttrs = useMemo(() => {
    const set = new Set<string>();
    matched.forEach(s => s.attributes.forEach(a => set.add(a)));
    return Array.from(set).sort();
  }, [matched]);

  const canRun = selectedWfs.length > 0 && jobName.trim().length > 0;

  const handleRun = async () => {
    // Determine entity rows from upload or manual entry. Fallback to a
    // single synthetic company if the user didn't supply any.
    let header: string[] = [];
    let entityRows: string[][] = [];
    if (entityFile) {
      const parsed = await parseEntityFile(entityFile);
      header = parsed.header;
      entityRows = parsed.rows;
    } else if (entityManual.trim()) {
      entityRows = parseManualEntities(entityManual);
    }
    if (entityRows.length === 0) {
      entityRows = [["Sample Company Inc.", "sample-company.com"]];
      header = ["Company", "Website"];
    }

    const jobId = `WF-${Date.now().toString(36).toUpperCase()}`;
    const jobResult = buildJobResult({
      jobId,
      jobName: jobName.trim(),
      workflowLabels: selectedWfs,
      entityRows,
      inputHeader: header,
    });

    onRun({
      id: jobId,
      kind: "workflows",
      jobName: jobName.trim(),
      label: `${selectedWfs.length} workflow${selectedWfs.length !== 1 ? "s" : ""} · ${jobResult.records} record${jobResult.records !== 1 ? "s" : ""}`,
      status: "Queued",
      progress: 0,
      startedAt: Date.now(),
      sourcesCount: Math.max(matched.length, selectedWfs.length),
      attributesCount: jobResult.attributesCount,
      attributesExtracted: 0,
      errors: [],
      schedule,
      jobResult,
    });
    toast({ title: `Job "${jobName.trim()}" saved & queued`, description: schedule ? `Scheduled · ${schedule.frequency} (${schedule.timezone})` : "Running now" });
  };

  return (
    <Card className="flex flex-col h-full p-0 overflow-hidden">
      <div className="flex items-center gap-2 px-3.5 py-2.5 border-b bg-muted/20">
        <Workflow className="w-4 h-4 text-primary" />
        <h3 className="text-[13px] font-bold text-foreground">Run by Workflows</h3>
      </div>
      <div className="p-3 space-y-3 flex-1 overflow-y-auto">
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold tracking-wide uppercase text-muted-foreground">Job Name</label>
          <Input value={jobName} onChange={e => setJobName(e.target.value)}
            placeholder="e.g. APAC Quality Checks - Weekly"
            className="h-8 text-[12px]" />
        </div>

        <SavedConfigSelect
          label="Saved Workflows"
          configs={workflowConfigs}
          value={activeIsWorkflow ? activeConfigId : null}
          onLoad={loadConfig}
          placeholder={workflowConfigs.length ? "Select a saved workflow" : "No saved workflows"}
        />


        <EntityIdentifiersUpload file={entityFile} onFile={setEntityFile} manual={entityManual} onManual={setEntityManual} />
      </div>
      <div className="px-3 py-2.5 border-t bg-muted/10 flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground truncate">
          {selectedWfs.length} wf · {availableAttrs.length} attrs
        </span>
        <div className="flex items-center gap-2">
          <ScheduleButton value={schedule} onSave={setSchedule} />
          <Button size="sm" className="h-7 text-[11px] gap-1.5" disabled={!canRun} onClick={handleRun}>
            <Play className="w-3 h-3" /> Run Workflow
          </Button>
        </div>
      </div>
    </Card>
  );
}

/* ───────────────── Pane: Job Execution & Progress ───────────────── */
const statusStyle: Record<JobStatus, string> = {
  Queued:    "bg-muted text-muted-foreground border-border",
  Running:   "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  Failed:    "bg-destructive/10 text-destructive border-destructive/20",
};

const statusIcon = (s: JobStatus) => {
  if (s === "Running") return <Loader2 className="w-3 h-3 animate-spin" />;
  if (s === "Completed") return <CheckCircle2 className="w-3 h-3" />;
  if (s === "Failed") return <XCircle className="w-3 h-3" />;
  return <Clock className="w-3 h-3" />;
};

const csvEscape = (v: unknown) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

function downloadJobOutput(job: RunJob) {
  const r = job.jobResult;
  let csv = "";
  let filename = `${job.id}-${(job.jobName || job.label || "job").replace(/[^a-z0-9]+/gi, "_")}.csv`;
  if (r && r.csvColumns?.length && r.csvRows?.length) {
    csv = [r.csvColumns, ...r.csvRows].map(row => row.map(csvEscape).join(",")).join("\n");
  } else {
    csv = [
      ["Job ID", "Job Name", "Kind", "Status", "Started", "Ended", "Duration", "Sources", "Attributes Extracted", "Attributes Total", "Errors"],
      [
        job.id, job.jobName || job.label, job.kind, job.status,
        fmtTime(job.startedAt), job.endedAt ? fmtTime(job.endedAt) : "",
        fmtDuration(job.startedAt, job.endedAt),
        job.sourcesCount, job.attributesExtracted, job.attributesCount,
        job.errors.join(" | "),
      ],
    ].map(row => row.map(csvEscape).join(",")).join("\n");
  }
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function ExecutionPane({ jobs, tick }: { jobs: RunJob[]; tick: number }) {
  return (
    <Card className="flex flex-col h-full p-0 overflow-hidden">
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b bg-muted/20">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <h3 className="text-[13px] font-bold text-foreground">Job Execution &amp; Progress</h3>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <RefreshCw className="w-3 h-3 animate-spin [animation-duration:3s]" />
          <span>Live · {new Date(tick).toLocaleTimeString("en-US", { hour12: false })}</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {jobs.length === 0 && (
          <div className="text-center text-[12px] text-muted-foreground py-12">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-30" />
            No jobs yet. Trigger a run from the left panes.
          </div>
        )}
        {jobs.map(job => {
          const canDownload = job.status === "Completed";
          return (
          <div key={job.id} className="border rounded-md px-2.5 py-1.5 bg-card text-[11px]">
            {/* Line 1: name + status + meta */}
            <div className="flex items-center gap-2 min-w-0">
              <span className={cn("inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full border shrink-0", statusStyle[job.status])}>
                {statusIcon(job.status)} {job.status}
              </span>
              <span className="font-semibold text-foreground truncate flex-1" title={job.jobName}>
                {job.jobName || job.label}
              </span>
              <Badge variant="outline" className="text-[9px] h-4 px-1 shrink-0">{job.kind === "sources" ? "SRC" : "WF"}</Badge>
              <span className="font-mono text-[9px] text-muted-foreground shrink-0">{job.id}</span>
              <span className="tabular-nums text-[10px] text-muted-foreground w-9 text-right shrink-0">{job.progress}%</span>
              <button
                type="button"
                onClick={() => canDownload && downloadJobOutput(job)}
                disabled={!canDownload}
                title={canDownload ? "Download output (CSV)" : "Available once the job completes"}
                aria-label="Download job output"
                className={cn(
                  "shrink-0 inline-flex items-center justify-center w-5 h-5 rounded border transition-colors",
                  canDownload
                    ? "border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer"
                    : "border-border text-muted-foreground/40 cursor-not-allowed"
                )}
              >
                <Download className="w-3 h-3" />
              </button>
            </div>
            {/* Line 2: progress + compact metrics */}
            <div className="flex items-center gap-2 mt-1">
              <Progress value={job.progress} className="h-1 flex-1" />
              <span className="text-[9px] text-muted-foreground whitespace-nowrap shrink-0">
                {fmtTime(job.startedAt)}–{job.endedAt ? fmtTime(job.endedAt) : "…"} · {fmtDuration(job.startedAt, job.endedAt)} · {job.sourcesCount} src · {job.attributesExtracted}/{job.attributesCount} attrs
                {job.errors.length > 0 && <span className="text-destructive ml-1"> · <AlertTriangle className="inline w-2.5 h-2.5" /> {job.errors.length}</span>}
              </span>
            </div>
          </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ───────────────── Main dashboard ───────────────── */
export default function JobStatusDashboard() {
  const { hasSelection, scopedSources } = useAssetSelection();
  const { session } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<RunJob[]>([]);
  const [tick, setTick] = useState<number>(Date.now());

  useEffect(() => {
    const id = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!jobs.some(j => j.status === "Running" || j.status === "Queued")) return;
    const id = setInterval(() => {
      setJobs(prev => prev.map(j => {
        if (j.status === "Queued") {
          return { ...j, status: "Running" as JobStatus, progress: 5 };
        }
        if (j.status === "Running") {
          const nextProgress = Math.min(100, j.progress + Math.round(3 + Math.random() * 8));
          const extracted = Math.min(j.attributesCount, Math.round((nextProgress / 100) * j.attributesCount));
          if (nextProgress >= 100) {
            const fail = Math.random() < 0.08;
            return {
              ...j,
              progress: 100,
              status: fail ? "Failed" : "Completed",
              endedAt: Date.now(),
              attributesExtracted: fail ? Math.floor(extracted * 0.7) : j.attributesCount,
              errors: fail ? [...j.errors, `Source timeout on ${Math.max(1, Math.floor(j.sourcesCount * 0.1))} source(s).`] : j.errors,
            };
          }
          return { ...j, progress: nextProgress, attributesExtracted: extracted };
        }
        return j;
      }));
    }, 900);
    return () => clearInterval(id);
  }, [jobs]);

  // Persist completed workflow jobs to Supabase so HITL review screens
  // (Record-wise + Attribute Category-wise) can pick them up.
  useEffect(() => {
    const uid = session?.user?.id;
    if (!uid) return;
    const toPersist = jobs.filter(
      j => j.status === "Completed" && j.jobResult && !j.persisted,
    );
    if (toPersist.length === 0) return;

    (async () => {
      for (const j of toPersist) {
        const r = j.jobResult!;
        const { error } = await supabase.from("jobs").insert({
          user_id: uid,
          job_id: r.jobId,
          name: r.name || j.jobName || "Workflow Job",
          status: "Completed",
          progress: 100,
          records: r.records,
          runtime: `${Math.max(1, Math.round(((j.endedAt ?? Date.now()) - j.startedAt) / 1000))}s`,
          error_rate: "0%",
          tier: r.tier,
          flow_steps: [],
          logs: [],
          csv_columns: r.csvColumns,
          csv_rows: r.csvRows,
        });
        if (error) {
          toast({ title: "Failed to save job output", description: error.message, variant: "destructive" });
        }
      }
      setJobs(prev =>
        prev.map(j =>
          toPersist.find(p => p.id === j.id) ? { ...j, persisted: true } : j,
        ),
      );
      toast({
        title: "Output sent to HITL Review",
        description: `${toPersist.length} workflow job${toPersist.length !== 1 ? "s" : ""} available in Record-wise and Attribute Category-wise views.`,
      });
    })();
  }, [jobs, session?.user?.id, toast]);

  const enqueue = useCallback((j: RunJob) => {
    setJobs(prev => [j, ...prev]);
  }, []);

  const statChips = [
    { label: "Total Jobs Today", value: (summaryStats.totalToday + jobs.length).toLocaleString(), icon: Clock, sub: "All automation workflows" },
    { label: "Running",   value: jobs.filter(j => j.status === "Running" || j.status === "Queued").length.toString(), icon: Activity, sub: "Currently in progress" },
    { label: "Completed", value: jobs.filter(j => j.status === "Completed").length.toString(), icon: CheckCircle2, sub: "Successfully finished" },
    { label: "Failed",    value: jobs.filter(j => j.status === "Failed").length.toString(), icon: XCircle, sub: "Requires attention" },
  ];

  return (
    <div className="space-y-3">
      <div className="border-l-[3px] border-primary pl-4">
        <h1 className="text-[18px] font-bold text-foreground">Job Configuration</h1>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          {hasSelection
            ? <>Working from <span className="font-semibold text-foreground">{scopedSources.length}</span> assets saved from the Asset Repository.</>
            : "Configure and schedule extraction jobs. Save selections from Asset Repository to scope these dropdowns."}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        {statChips.map(chip => {
          const Icon = chip.icon;
          return (
            <div key={chip.label} className="bg-card border border-border rounded-lg p-3.5 transition-all duration-150 hover:bg-brand-light hover:border-brand-mid hover:shadow-[0_2px_10px_rgba(26,122,74,0.07)] hover:-translate-y-px">
              <div className="flex items-start justify-between mb-2">
                <div className="text-sm font-normal text-foreground leading-tight">{chip.label}</div>
                <Icon className="w-[18px] h-[18px] text-muted-foreground opacity-55" />
              </div>
              <div className="text-[28px] font-normal text-foreground tracking-[-1.5px] leading-none mb-1.5">{chip.value}</div>
              <div className="text-xs text-muted-foreground">{chip.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-3 h-[calc(100vh-280px)] min-h-[560px]">
        <RunBySourcesPane onRun={enqueue} />
        <RunByWorkflowsPane onRun={enqueue} />
        <ExecutionPane jobs={jobs} tick={tick} />
      </div>
    </div>
  );
}
