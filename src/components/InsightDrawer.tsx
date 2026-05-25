import { useState } from "react";
import { cn } from "@/lib/utils";
import { X, Download, RotateCcw, TrendingUp, TrendingDown, ShieldCheck, Building2, Globe, FileText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from "recharts";
import type { AlertItem } from "@/data/job-status-data";

export type ActivityType = "growth" | "structure" | "risk";

export function getActivityType(alert: AlertItem): ActivityType {
  const t = alert.title.toLowerCase();
  if (t.includes("hierarchy") || t.includes("m&a") || t.includes("ubo")) return "structure";
  if (t.includes("stale") || t.includes("reliability") || t.includes("dormant")) return "risk";
  return "growth";
}

/* ── Confidence Ring ── */
function ConfidenceRing({ percent }: { percent: number }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <div className="flex items-center gap-2">
      <svg width="64" height="64" viewBox="0 0 64 64" className="shrink-0">
        <circle cx="32" cy="32" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="5" />
        <circle
          cx="32" cy="32" r={r} fill="none"
          stroke="hsl(var(--primary))" strokeWidth="5"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 32 32)"
          className="transition-all duration-700"
        />
        <text x="32" y="36" textAnchor="middle" className="fill-foreground text-[11px] font-bold">{percent}%</text>
      </svg>
      <div>
        <p className="text-[11px] font-semibold text-foreground">Verified Accuracy</p>
        <p className="text-[10px] text-muted-foreground">Cross-source validated</p>
      </div>
    </div>
  );
}

/* ── Growth View ── */
function GrowthView() {
  const tierData = [
    { name: "Tier 1", value: 3200, fill: "hsl(var(--primary))" },
    { name: "Tier 2", value: 5800, fill: "hsl(var(--brand))" },
    { name: "Tier 3", value: 8400, fill: "hsl(var(--status-warning))" },
    { name: "Tier 4", value: 2100, fill: "hsl(var(--muted-foreground))" },
  ];
  const industries = [
    { name: "Financial Services", pct: "34%" },
    { name: "Technology", pct: "22%" },
    { name: "Healthcare", pct: "14%" },
  ];
  const sources = [
    { source: "Registries", pct: 62 },
    { source: "Web Scraping", pct: 38 },
  ];

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-3">Distribution by Tier</p>
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tierData} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }} width={50} />
              <Tooltip
                contentStyle={{ fontSize: 11, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                formatter={(v: number) => [v.toLocaleString(), "Records"]}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18}>
                {tierData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-2">Top 3 Industries</p>
        <div className="space-y-1.5">
          {industries.map((ind) => (
            <div key={ind.name} className="flex items-center justify-between py-1.5 px-3 rounded-md bg-muted/30">
              <span className="text-[12px] text-foreground">{ind.name}</span>
              <Badge variant="secondary" className="text-[10px]">{ind.pct}</Badge>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-2">Source Breakdown</p>
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="bg-muted/40">
                <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Source</th>
                <th className="text-right px-3 py-2 font-semibold text-muted-foreground">Contribution</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((s) => (
                <tr key={s.source} className="border-t border-border">
                  <td className="px-3 py-2 text-foreground">{s.source}</td>
                  <td className="px-3 py-2 text-right font-mono font-semibold text-foreground">{s.pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Structure View ── */
function StructureView() {
  const donutData = [
    { name: "Parent", value: 42, fill: "hsl(var(--primary))" },
    { name: "Subsidiary", value: 38, fill: "hsl(var(--brand))" },
    { name: "Affiliate", value: 20, fill: "hsl(var(--status-warning))" },
  ];
  const crossBorder = 12;
  const primarySources = ["SEC EDGAR", "Companies House"];

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-3">Relationship Type</p>
        <div className="flex items-center gap-6">
          <div className="h-[140px] w-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} dataKey="value" cx="50%" cy="50%" innerRadius={36} outerRadius={58} strokeWidth={2} stroke="hsl(var(--card))">
                  {donutData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ fontSize: 11, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                  formatter={(v: number) => [`${v}%`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {donutData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: d.fill }} />
                <span className="text-[11px] text-foreground">{d.name}</span>
                <span className="text-[11px] font-semibold text-muted-foreground ml-auto">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Card className="p-3.5 bg-muted/20">
        <div className="flex items-center gap-2 mb-1">
          <Globe className="w-4 h-4 text-primary" />
          <span className="text-[12px] font-semibold text-foreground">Cross-Border Impact</span>
        </div>
        <p className="text-[24px] font-bold text-foreground leading-none">{crossBorder}%</p>
        <p className="text-[10px] text-muted-foreground mt-1">of changes involved international entities</p>
      </Card>

      <div>
        <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-2">Primary Sources</p>
        <div className="flex gap-2">
          {primarySources.map((src) => (
            <div key={src} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card">
              <FileText className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-medium text-foreground">{src}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Risk View ── */
function RiskView() {
  const reasons = [
    { name: "Insolvency", value: 42, fill: "hsl(var(--destructive))" },
    { name: "Registry Dissolution", value: 31, fill: "hsl(var(--status-warning))" },
    { name: "Web-404", value: 18, fill: "hsl(var(--muted-foreground))" },
    { name: "Regulatory", value: 9, fill: "hsl(var(--primary))" },
  ];
  const hierarchyImpact = 1247;
  const regions = [
    { flag: "🇺🇸", name: "United States", pct: "38%" },
    { flag: "🇬🇧", name: "United Kingdom", pct: "22%" },
    { flag: "🇩🇪", name: "Germany", pct: "15%" },
    { flag: "🇸🇬", name: "Singapore", pct: "10%" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-3">Reason for Inactivity</p>
        <div className="h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reasons} margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{ fontSize: 11, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                formatter={(v: number) => [`${v}%`, "Share"]}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={28}>
                {reasons.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <Card className="p-3.5 bg-destructive/5 border-destructive/20">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-4 h-4 text-destructive" />
          <span className="text-[12px] font-semibold text-foreground">Hierarchy Impact Score</span>
        </div>
        <p className="text-[24px] font-bold text-foreground leading-none">{hierarchyImpact.toLocaleString()}</p>
        <p className="text-[10px] text-muted-foreground mt-1">active entities connected to closed records</p>
      </Card>

      <div>
        <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-2">Primary Regions Affected</p>
        <div className="space-y-1.5">
          {regions.map((r) => (
            <div key={r.name} className="flex items-center gap-2.5 py-1.5 px-3 rounded-md bg-muted/30">
              <span className="text-[16px]">{r.flag}</span>
              <span className="text-[12px] text-foreground flex-1">{r.name}</span>
              <Badge variant="secondary" className="text-[10px]">{r.pct}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main Drawer ── */
interface InsightDrawerProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  alert: AlertItem | null;
}

export default function InsightDrawer({ open, onOpenChange, alert }: InsightDrawerProps) {
  const [refreshing, setRefreshing] = useState(false);

  if (!alert) return null;

  const activityType = getActivityType(alert);

  const trendMap: Record<ActivityType, { label: string; positive: boolean }> = {
    growth: { label: "+12% vs last month", positive: true },
    structure: { label: "+8% vs last quarter", positive: true },
    risk: { label: "-5% vs last month", positive: false },
  };
  const confidenceMap: Record<ActivityType, number> = {
    growth: 98.4,
    structure: 96.7,
    risk: 91.2,
  };
  const countMap: Record<ActivityType, string> = {
    growth: "19,500",
    structure: "4,628",
    risk: "1,247",
  };

  const trend = trendMap[activityType];
  const confidence = confidenceMap[activityType];
  const totalCount = countMap[activityType];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[38vw] min-w-[360px] max-w-[520px] p-0 flex flex-col z-[100]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-[15px] font-bold text-foreground leading-snug pr-2">
                {alert.title}
              </SheetTitle>
              <SheetDescription className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                {alert.description}
              </SheetDescription>
            </div>
            <Badge variant="secondary" className="text-[10px] font-semibold shrink-0">{totalCount} Total</Badge>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 mt-3">
            <Badge
              className={cn(
                "text-[10px] font-semibold border",
                trend.positive
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                  : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800"
              )}
            >
              {trend.positive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {trend.label}
            </Badge>
            <ConfidenceRing percent={confidence} />
          </div>
        </div>

        {/* Dynamic content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {activityType === "growth" && <GrowthView />}
          {activityType === "structure" && <StructureView />}
          {activityType === "risk" && <RiskView />}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-border flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-[11px] gap-1.5 flex-1" onClick={() => {}}>
            <Download className="w-3.5 h-3.5" /> Download Aggregate Summary (CSV)
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-[11px] gap-1.5"
            disabled={refreshing}
            onClick={handleRefresh}
          >
            <RotateCcw className={cn("w-3.5 h-3.5", refreshing && "animate-spin")} />
            {refreshing ? "Scanning…" : "Re-scan Segment"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
