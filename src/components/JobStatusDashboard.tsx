import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Clock, Activity, CheckCircle2, XCircle, Play, ChevronDown,
  ExternalLink, Database, Workflow, RefreshCw, AlertTriangle, Loader2, CalendarClock,
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
  const { scopedSources } = useAssetSelection();
  const { toast } = useToast();

  const [regions, setRegions] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [names, setNames] = useState<string[]>([]);
  const [selectedAttrs, setSelectedAttrs] = useState<string[]>([]);
  const [jobName, setJobName] = useState("");
  const [schedule, setSchedule] = useState<ScheduleConfig | null>(null);

  // Pool of available sources is scoped by the Asset Repository selection
  const scopedRegions = useMemo(
    () => Array.from(new Set(scopedSources.map(s => s.region))).filter(r => r !== "Any").sort(),
    [scopedSources],
  );
  const allowedRegions = scopedRegions.length ? scopedRegions : rawRegions.filter(r => r !== "Any");

  const localFilter = (opts: Parameters<typeof filterSources>[0]) =>
    filterSources(opts).filter(s => scopedSources.includes(s));

  const countryOptions = useMemo(() => {
    const pool = localFilter({ regions });
    return Array.from(new Set(pool.map(s => s.country))).sort();
  }, [regions, scopedSources]);

  const typeOptions = useMemo(() => {
    const pool = localFilter({ regions, countries });
    return Array.from(new Set(pool.map(s => s.sourceType))).sort();
  }, [regions, countries, scopedSources]);

  const nameOptions = useMemo(() => {
    const pool = localFilter({ regions, countries, sourceTypes: types });
    return Array.from(new Set(pool.map(s => s.sourceName))).sort();
  }, [regions, countries, types, scopedSources]);

  useEffect(() => { setCountries(c => c.filter(x => countryOptions.includes(x))); }, [countryOptions]);
  useEffect(() => { setTypes(t => t.filter(x => typeOptions.includes(x))); }, [typeOptions]);
  useEffect(() => { setNames(n => n.filter(x => nameOptions.includes(x))); }, [nameOptions]);

  // Source Name is the FINAL dropdown — URLs & attributes only show once it has selections
  const namesPicked = names.length > 0;

  const matched: SourceRecord[] = useMemo(
    () => localFilter({ regions, countries, sourceTypes: types, sourceNames: names }),
    [regions, countries, types, names, scopedSources],
  );

  const availableAttrs = useMemo(() => {
    if (!namesPicked) return [];
    const set = new Set<string>();
    matched.forEach(s => s.attributes.forEach(a => set.add(a)));
    return Array.from(set).sort();
  }, [matched, namesPicked]);

  useEffect(() => {
    setSelectedAttrs(prev => prev.filter(a => availableAttrs.includes(a)));
  }, [availableAttrs]);

  const toggleAttr = (a: string) =>
    setSelectedAttrs(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  const canRun = matched.length > 0 && selectedAttrs.length > 0 && jobName.trim().length > 0;

  const handleRun = () => {
    onRun({
      id: `SRC-${Date.now().toString(36).toUpperCase()}`,
      kind: "sources",
      jobName: jobName.trim(),
      label: `${matched.length} source${matched.length !== 1 ? "s" : ""} · ${selectedAttrs.length} attribute${selectedAttrs.length !== 1 ? "s" : ""}`,
      status: "Queued",
      progress: 0,
      startedAt: Date.now(),
      sourcesCount: matched.length,
      attributesCount: selectedAttrs.length,
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
        <div className="grid grid-cols-2 gap-2">
          <MultiSelect label="Region" options={allowedRegions} selected={regions} onChange={setRegions} />
          <MultiSelect label="Country" options={countryOptions} selected={countries} onChange={setCountries} />
          <MultiSelect label="Source Type" options={typeOptions} selected={types} onChange={setTypes} />
          <MultiSelect label="Source Name" options={nameOptions} selected={names} onChange={setNames} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Source URLs</span>
            <Badge variant="secondary" className="text-[10px]">{namesPicked ? matched.length : 0}</Badge>
          </div>
          <div className="border rounded-md max-h-28 overflow-y-auto bg-muted/10">
            {!namesPicked ? (
              <div className="px-2.5 py-2 text-[11px] text-muted-foreground">Select Source Name(s) to reveal URLs.</div>
            ) : (
              <ul className="divide-y">
                {matched.slice(0, 80).map((s, i) => (
                  <li key={i} className="flex items-center gap-2 px-2.5 py-1.5 text-[11px]">
                    <span className="font-medium text-foreground truncate flex-1">{s.sourceName}</span>
                    <a href={s.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline truncate max-w-[55%]">
                      <span className="truncate">{s.sourceUrl}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </li>
                ))}
                {matched.length > 80 && (
                  <li className="px-2.5 py-1.5 text-[10px] text-muted-foreground italic">+ {matched.length - 80} more</li>
                )}
              </ul>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Data Attributes</span>
            <div className="flex items-center gap-2">
              <button className="text-[10px] text-primary hover:underline" onClick={() => setSelectedAttrs(availableAttrs)} disabled={!availableAttrs.length}>Select all</button>
              <button className="text-[10px] text-muted-foreground hover:underline" onClick={() => setSelectedAttrs([])}>Clear</button>
            </div>
          </div>
          <div className="border rounded-md max-h-48 overflow-y-auto">
            {!namesPicked ? (
              <div className="px-2.5 py-2 text-[11px] text-muted-foreground">Select Source Name(s) to reveal attributes.</div>
            ) : availableAttrs.length === 0 ? (
              <div className="px-2.5 py-2 text-[11px] text-muted-foreground">No attributes available.</div>
            ) : (
              <Table className="text-[11px]">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="h-7 w-8 px-2.5"></TableHead>
                    <TableHead className="h-7 text-[10px] py-1">Attribute</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableAttrs.map(a => (
                    <TableRow key={a} className="cursor-pointer" onClick={() => toggleAttr(a)}>
                      <TableCell className="py-1 px-2.5">
                        <Checkbox checked={selectedAttrs.includes(a)} onCheckedChange={() => toggleAttr(a)} />
                      </TableCell>
                      <TableCell className="py-1 text-[11px]">{a}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>
      <div className="px-3 py-2.5 border-t bg-muted/10 flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground truncate">
          {matched.length} src · {selectedAttrs.length} attrs
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
  const { scopedSources } = useAssetSelection();
  const { toast } = useToast();

  const [regions, setRegions] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [wfTypes, setWfTypes] = useState<string[]>([]);
  const [wfNames, setWfNames] = useState<string[]>([]);
  const [selectedAttrs, setSelectedAttrs] = useState<string[]>([]);
  const [jobName, setJobName] = useState("");
  const [schedule, setSchedule] = useState<ScheduleConfig | null>(null);

  const scopedRegions = useMemo(
    () => Array.from(new Set(scopedSources.map(s => s.region))).filter(r => r !== "Any").sort(),
    [scopedSources],
  );
  const allowedRegions = scopedRegions.length ? scopedRegions : rawRegions.filter(r => r !== "Any");

  const localFilter = (opts: Parameters<typeof filterSources>[0]) =>
    filterSources(opts).filter(s => scopedSources.includes(s));

  const countryOptions = useMemo(() => {
    const pool = localFilter({ regions });
    return Array.from(new Set(pool.map(s => s.country))).sort();
  }, [regions, scopedSources]);

  const wfTypeOptions = useMemo(() => {
    const pool = localFilter({ regions, countries });
    return Array.from(new Set(pool.map(s => s.sourceType))).sort();
  }, [regions, countries, scopedSources]);

  const wfNameOptions = useMemo(() => {
    const pool = localFilter({ regions, countries, sourceTypes: wfTypes });
    const wfs = new Set<string>();
    pool.forEach(p => p.workflows.forEach(w => wfs.add(w)));
    return Array.from(wfs).sort();
  }, [regions, countries, wfTypes, scopedSources]);

  useEffect(() => { setCountries(c => c.filter(x => countryOptions.includes(x))); }, [countryOptions]);
  useEffect(() => { setWfTypes(t => t.filter(x => wfTypeOptions.includes(x))); }, [wfTypeOptions]);
  useEffect(() => { setWfNames(n => n.filter(x => wfNameOptions.includes(x))); }, [wfNameOptions]);

  const namesPicked = wfNames.length > 0;

  const matched: SourceRecord[] = useMemo(
    () => localFilter({ regions, countries, sourceTypes: wfTypes, workflows: wfNames }),
    [regions, countries, wfTypes, wfNames, scopedSources],
  );

  const availableAttrs = useMemo(() => {
    if (!namesPicked) return [];
    const set = new Set<string>();
    matched.forEach(s => s.attributes.forEach(a => set.add(a)));
    return Array.from(set).sort();
  }, [matched, namesPicked]);

  useEffect(() => {
    setSelectedAttrs(prev => prev.filter(a => availableAttrs.includes(a)));
  }, [availableAttrs]);

  const toggleAttr = (a: string) =>
    setSelectedAttrs(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  const canRun = wfNames.length > 0 && selectedAttrs.length > 0 && jobName.trim().length > 0;

  const handleRun = () => {
    onRun({
      id: `WF-${Date.now().toString(36).toUpperCase()}`,
      kind: "workflows",
      jobName: jobName.trim(),
      label: `${wfNames.length} workflow${wfNames.length !== 1 ? "s" : ""} · ${matched.length} source${matched.length !== 1 ? "s" : ""}`,
      status: "Queued",
      progress: 0,
      startedAt: Date.now(),
      sourcesCount: matched.length,
      attributesCount: selectedAttrs.length,
      attributesExtracted: 0,
      errors: [],
      schedule,
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
        <div className="grid grid-cols-2 gap-2">
          <MultiSelect label="Region" options={allowedRegions} selected={regions} onChange={setRegions} />
          <MultiSelect label="Country" options={countryOptions} selected={countries} onChange={setCountries} />
          <MultiSelect label="Workflow Type" options={wfTypeOptions} selected={wfTypes} onChange={setWfTypes} />
          <MultiSelect label="Workflow Name" options={wfNameOptions} selected={wfNames} onChange={setWfNames} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Workflow Details · Associated Sources</span>
            <Badge variant="secondary" className="text-[10px]">{namesPicked ? matched.length : 0}</Badge>
          </div>
          <div className="border rounded-md max-h-28 overflow-y-auto bg-muted/10">
            {!namesPicked ? (
              <div className="px-2.5 py-2 text-[11px] text-muted-foreground">Select Workflow Name(s) to reveal linked sources.</div>
            ) : (
              <ul className="divide-y">
                {wfNames.map(w => {
                  const linked = matched.filter(s => s.workflows.includes(w));
                  return (
                    <li key={w} className="px-2.5 py-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-foreground">{w}</span>
                        <Badge variant="outline" className="text-[9px]">{linked.length} sources</Badge>
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {linked.slice(0, 4).map(l => l.sourceName).join(" · ")}
                        {linked.length > 4 && ` +${linked.length - 4}`}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Data Attributes</span>
            <div className="flex items-center gap-2">
              <button className="text-[10px] text-primary hover:underline" onClick={() => setSelectedAttrs(availableAttrs)} disabled={!availableAttrs.length}>Select all</button>
              <button className="text-[10px] text-muted-foreground hover:underline" onClick={() => setSelectedAttrs([])}>Clear</button>
            </div>
          </div>
          <div className="border rounded-md max-h-48 overflow-y-auto">
            {!namesPicked ? (
              <div className="px-2.5 py-2 text-[11px] text-muted-foreground">Select Workflow Name(s) to reveal attributes.</div>
            ) : availableAttrs.length === 0 ? (
              <div className="px-2.5 py-2 text-[11px] text-muted-foreground">No attributes available.</div>
            ) : (
              <Table className="text-[11px]">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="h-7 w-8 px-2.5"></TableHead>
                    <TableHead className="h-7 text-[10px] py-1">Attribute</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableAttrs.map(a => (
                    <TableRow key={a} className="cursor-pointer" onClick={() => toggleAttr(a)}>
                      <TableCell className="py-1 px-2.5">
                        <Checkbox checked={selectedAttrs.includes(a)} onCheckedChange={() => toggleAttr(a)} />
                      </TableCell>
                      <TableCell className="py-1 text-[11px]">{a}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>
      <div className="px-3 py-2.5 border-t bg-muted/10 flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground truncate">
          {wfNames.length} wf · {selectedAttrs.length} attrs
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
        {jobs.map(job => (
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
        ))}
      </div>
    </Card>
  );
}

/* ───────────────── Main dashboard ───────────────── */
export default function JobStatusDashboard() {
  const { hasSelection, scopedSources } = useAssetSelection();
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
