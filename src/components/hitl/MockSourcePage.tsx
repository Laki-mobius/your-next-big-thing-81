import { useEffect, useRef } from "react";
import { Building2, FileText, Globe, Database, ExternalLink } from "lucide-react";
import type { ValidationRecord, ValidationAttribute } from "@/data/hitl-validation-data";

interface MockSourcePageProps {
  record: ValidationRecord;
  sourceName: string;
  sourceUrl: string;
  highlightedField: { fieldName: string; value: string } | null;
}

/* Categorize attributes for the source-styled layout */
const sectionGroups: { title: string; attrs: string[] }[] = [
  {
    title: "Company Identification",
    attrs: [
      "Company Name", "Legal Name", "Trade Name", "Registration Number",
      "Registration ID(s)", "CIK", "Entity Type", "Organizational Type", "Status",
    ],
  },
  {
    title: "Contact & Location",
    attrs: [
      "Address", "City", "State", "Postal Code", "Country",
      "Website URL", "Website", "Email ID", "Email", "Phone Number", "Phone", "Fax",
    ],
  },
  {
    title: "Market & Listing",
    attrs: [
      "Ticker Symbol", "Exchange Name", "Stock Exchange",
      "Industry / Sector", "NAICS/SIC Codes", "SIC Code",
    ],
  },
  {
    title: "Business Profile",
    attrs: [
      "CEO / Founder", "Foundation Year", "Number of Employees",
      "Business Description", "Description", "Social Media Profiles",
    ],
  },
  {
    title: "Financial Highlights",
    attrs: [
      "Revenue", "Revenue (USD-normalized)", "Assets", "Liabilities",
      "Net Income", "Fiscal Year End",
    ],
  },
  {
    title: "Corporate Hierarchy",
    attrs: [
      "Ultimate Parent", "Subsidiary Company", "Hierarchy Level",
      "Relationship Type", "Performance Expectation",
    ],
  },
];

/* Detect source type for theming */
function getSourceTheme(name: string, url: string) {
  const n = (name + " " + url).toLowerCase();
  if (n.includes("sec") || n.includes("edgar")) {
    return {
      brand: "SEC EDGAR",
      tagline: "U.S. Securities and Exchange Commission",
      docType: "Form 10-K · Annual Report",
      headerBg: "bg-[#003366]",
      headerText: "text-white",
      accent: "border-[#003366]",
      icon: FileText,
    };
  }
  if (n.includes("nasdaq")) {
    return {
      brand: "Nasdaq",
      tagline: "Stock Market | Quotes & Company Info",
      docType: "Company Quote Page",
      headerBg: "bg-[#0092C9]",
      headerText: "text-white",
      accent: "border-[#0092C9]",
      icon: Database,
    };
  }
  if (n.includes("nyse")) {
    return {
      brand: "NYSE",
      tagline: "New York Stock Exchange · Listings",
      docType: "Listed Company Profile",
      headerBg: "bg-[#0033A0]",
      headerText: "text-white",
      accent: "border-[#0033A0]",
      icon: Database,
    };
  }
  if (n.includes("bloomberg")) {
    return {
      brand: "Bloomberg",
      tagline: "Business & Financial News",
      docType: "Company Overview",
      headerBg: "bg-black",
      headerText: "text-white",
      accent: "border-black",
      icon: Database,
    };
  }
  if (n.includes("linkedin")) {
    return {
      brand: "LinkedIn",
      tagline: "Professional Network · Company Page",
      docType: "Company Page",
      headerBg: "bg-[#0A66C2]",
      headerText: "text-white",
      accent: "border-[#0A66C2]",
      icon: Building2,
    };
  }
  if (n.includes("reuters")) {
    return {
      brand: "Reuters",
      tagline: "Business News & Market Data",
      docType: "Company Profile",
      headerBg: "bg-[#FF8000]",
      headerText: "text-white",
      accent: "border-[#FF8000]",
      icon: Database,
    };
  }
  return {
    brand: name || "Company Website",
    tagline: "Official Source Page",
    docType: "Company About Page",
    headerBg: "bg-slate-700",
    headerText: "text-white",
    accent: "border-slate-700",
    icon: Globe,
  };
}

const HIGHLIGHT_ID = "mock-source-highlighted-field";

export default function MockSourcePage({ record, sourceName, sourceUrl, highlightedField }: MockSourcePageProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const theme = getSourceTheme(sourceName, sourceUrl);
  const Icon = theme.icon;

  // Build attribute lookup that only includes attributes whose sources include this source
  const attrMap = new Map<string, ValidationAttribute>();
  record.attributes.forEach((a) => {
    const matchesSource = a.sourceRefs.some(
      (s) => s.name === sourceName || (sourceUrl && s.url === sourceUrl),
    );
    if (matchesSource) attrMap.set(a.name, a);
  });
  // Fallback: if nothing matched (e.g., sourceName mismatch), include all attributes
  if (attrMap.size === 0) {
    record.attributes.forEach((a) => attrMap.set(a.name, a));
  }

  // Auto-scroll to highlighted element
  useEffect(() => {
    if (!highlightedField) return;
    // Defer to next paint
    const t = setTimeout(() => {
      const el = scrollRef.current?.querySelector(`#${HIGHLIGHT_ID}`);
      if (el && "scrollIntoView" in el) {
        (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 50);
    return () => clearTimeout(t);
  }, [highlightedField?.fieldName, highlightedField?.value]);

  const renderRow = (label: string, value: string) => {
    const isHighlighted =
      highlightedField &&
      (highlightedField.fieldName === label ||
        highlightedField.fieldName.toLowerCase() === label.toLowerCase());
    return (
      <div
        key={label}
        id={isHighlighted ? HIGHLIGHT_ID : undefined}
        className={`flex items-start gap-3 py-1.5 px-2 -mx-2 rounded transition-colors ${
          isHighlighted ? "bg-amber-100 dark:bg-amber-900/30 ring-1 ring-amber-400" : ""
        }`}
      >
        <span className="text-[11px] font-medium text-muted-foreground w-[180px] shrink-0 leading-relaxed">
          {label}
        </span>
        <span className="text-[12px] text-foreground leading-relaxed flex-1">
          {isHighlighted ? (
            <mark className="bg-amber-300 dark:bg-amber-500/60 text-foreground px-1 rounded font-semibold">
              {value || "—"}
            </mark>
          ) : (
            value || <span className="text-muted-foreground italic">—</span>
          )}
        </span>
      </div>
    );
  };

  return (
    <div ref={scrollRef} className="w-full h-full overflow-auto bg-white dark:bg-slate-950">
      {/* Source-style header */}
      <div className={`${theme.headerBg} ${theme.headerText} px-5 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2.5">
          <Icon className="w-5 h-5" />
          <div>
            <div className="text-[14px] font-bold leading-tight">{theme.brand}</div>
            <div className="text-[10px] opacity-80">{theme.tagline}</div>
          </div>
        </div>
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] opacity-90 hover:opacity-100 hover:underline"
          >
            View live <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Document title */}
      <div className={`px-5 py-3 border-b-2 ${theme.accent} bg-slate-50 dark:bg-slate-900/50`}>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
          {theme.docType}
        </div>
        <h1 className="text-[18px] font-bold text-foreground mt-0.5">{record.companyName}</h1>
        <div className="text-[11px] text-muted-foreground mt-0.5">
          Filing reference: {record.id} · Last updated: {record.lastUpdated}
        </div>
      </div>

      {/* Body sections */}
      <div className="px-5 py-4 space-y-5">
        {sectionGroups.map((section) => {
          const rows = section.attrs
            .map((name) => {
              const attr = attrMap.get(name);
              if (!attr) return null;
              const val = attr.currentValue || attr.extractedValue || "";
              return { label: name, value: val };
            })
            .filter((r): r is { label: string; value: string } => r !== null);

          if (rows.length === 0) return null;

          return (
            <section key={section.title}>
              <h2 className="text-[12px] font-bold text-foreground uppercase tracking-wide mb-2 pb-1 border-b border-border">
                {section.title}
              </h2>
              <div className="space-y-0.5">
                {rows.map((r) => renderRow(r.label, r.value))}
              </div>
            </section>
          );
        })}

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-border text-[10px] text-muted-foreground">
          <p>
            This page is a structured rendering of the data extracted from{" "}
            <span className="font-semibold">{theme.brand}</span> for validation purposes.
            Click "View live" above to open the original source.
          </p>
        </div>
      </div>
    </div>
  );
}
