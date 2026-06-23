import { useState, useMemo, useCallback } from "react";
import { ArrowLeft, ExternalLink, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Pencil, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { type AttributeCategory } from "@/data/attribute-category-data";
import { toast } from "sonner";

interface AttributeChange {
  attribute: string;
  oldValue: string;
  newValue: string;
  confidence: number;
}

interface CategoryRecord {
  id: string;
  companyName: string;
  changes: AttributeChange[];
  source: string;
  sourceUrl: string;
}

interface Props {
  category: AttributeCategory;
  onClose: () => void;
}

const sources = [
  { name: "SEC Filing", url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany" },
  { name: "Company Registry", url: "https://www.gleif.org/en/lei/search" },
  { name: "GLEIF Database", url: "https://search.gleif.org" },
  { name: "News Feed", url: "https://finance.yahoo.com" },
  { name: "Stock Exchange", url: "https://www.nyse.com/listings" },
  { name: "Annual Report", url: "https://www.annualreports.com" },
];

const companies = [
  "Berkshire Hathaway Inc.", "Apple Inc.", "JPMorgan Chase & Co.", "Goldman Sachs Group Inc.",
  "Microsoft Corp.", "Amazon.com Inc.", "Tesla Inc.", "Meta Platforms Inc.",
  "Alphabet Inc.", "Johnson & Johnson", "Procter & Gamble Co.", "ExxonMobil Corp.",
  "Visa Inc.", "Mastercard Inc.", "Walt Disney Co.", "Intel Corp.",
  "Cisco Systems Inc.", "Pfizer Inc.", "Coca-Cola Co.", "PepsiCo Inc.",
  "Netflix Inc.", "Adobe Systems Inc.", "Salesforce Inc.", "Oracle Corp.",
  "NVIDIA Corp.", "PayPal Holdings Inc.", "Uber Technologies Inc.", "Airbnb Inc.",
  "Snowflake Inc.", "Shopify Inc.",
];

// Sample old/new value generators per attribute type
const attrValueMap: Record<string, [string, string][]> = {
  "Enterprise Number": [["ENT-00412", "ENT-00412-A"], ["ENT-99831", "ENT-99831-B"], ["ENT-55210", "ENT-55210-C"]],
  "Company Type": [["Private", "Public"], ["LLC", "Corporation"], ["Partnership", "S-Corp"]],
  "Reportage Level": [["Subsidiary", "Parent"], ["Branch", "Headquarters"], ["Division", "Standalone"]],
  "Former Name": [["Acme Corp.", "Acme Holdings Inc."], ["DataCo LLC", "DataCo Corp."], ["TechVen Inc.", "TechVentures Inc."]],
  "Former Name Creation Date": [["2019-03-15", "2020-06-01"], ["2018-11-22", "2021-01-10"], ["2017-07-08", "2022-04-15"]],
  "Bankruptcy/DBAs": [["N/A", "DBA: GlobalTech"], ["Active", "Filed Ch. 11"], ["DBA: OldBrand", "DBA: NewBrand"]],
  "Ultimate Parent Co ID": [["UP-1001", "UP-1001-R"], ["UP-2044", "UP-2044-R"], ["UP-3398", "UP-3398-R"]],
  "Parent Co ID": [["PC-5501", "PC-5501-A"], ["PC-6620", "PC-6620-B"], ["PC-7789", "PC-7789-C"]],
  "Parent Name": [["Holdco Inc.", "Holdco International"], ["GroupCo LLC", "GroupCo Corp."], ["ParentX", "ParentX Global"]],
  "Enterprise Numbers": [["EN-100", "EN-100-V2"], ["EN-245", "EN-245-V3"], ["EN-389", "EN-389-V2"]],
  "Street Address": [["123 Main St", "125 Main St, Ste 200"], ["456 Oak Ave", "456 Oak Ave, Fl 10"], ["789 Elm Blvd", "790 Elm Blvd"]],
  "CBSA Code": [["31080", "31084"], ["35620", "35614"], ["16980", "16984"]],
  "CBSA Description": [["LA-Long Beach", "Los Angeles-Long Beach-Anaheim"], ["NY-Newark", "New York-Newark-Jersey City"], ["Chicago-Naperville", "Chicago-Naperville-Elgin"]],
  "State/Place of Incorporation": [["Delaware", "Nevada"], ["California", "Delaware"], ["New York", "Wyoming"]],
  "Telephone": [["(212) 555-0100", "(212) 555-0142"], ["(415) 555-0200", "(415) 555-0288"], ["(312) 555-0300", "(312) 555-0365"]],
  "Fax": [["(212) 555-0101", "N/A"], ["(415) 555-0201", "(415) 555-0289"], ["N/A", "(312) 555-0366"]],
  "Toll Free": [["1-800-555-0001", "1-800-555-0010"], ["N/A", "1-888-555-0020"], ["1-877-555-0030", "1-877-555-0035"]],
  "Email": [["info@oldco.com", "contact@newco.com"], ["admin@legacy.org", "admin@brand.com"], ["support@abc.net", "help@abc.com"]],
  "Website URL": [["http://oldco.com", "https://newco.com"], ["http://legacy.org", "https://brand.com"], ["http://abc.net", "https://abc.com"]],
  "Facebook": [["fb.com/oldpage", "fb.com/newpage"], ["N/A", "fb.com/company"], ["fb.com/legacy", "fb.com/brand"]],
  "LinkedIn": [["linkedin.com/old", "linkedin.com/new"], ["N/A", "linkedin.com/company"], ["linkedin.com/v1", "linkedin.com/v2"]],
  "Twitter": [["@oldhandle", "@newhandle"], ["N/A", "@company"], ["@legacy", "@brand"]],
  "YouTube": [["youtube.com/old", "youtube.com/new"], ["N/A", "youtube.com/co"], ["youtube.com/v1", "youtube.com/v2"]],
  "Pinterest": [["N/A", "pinterest.com/co"], ["pinterest.com/old", "pinterest.com/new"], ["N/A", "N/A"]],
  "Google+": [["plus.google.com/old", "N/A"], ["N/A", "N/A"], ["plus.google.com/co", "N/A"]],
  "Revenue Type": [["Estimated", "Actual"], ["Modeled", "Reported"], ["Projected", "Audited"]],
  "Sales": [["$12.4M", "$14.8M"], ["$890K", "$1.2M"], ["$5.6B", "$5.9B"]],
  "Net Income": [["$1.2M", "$1.8M"], ["$-500K", "$120K"], ["$3.4B", "$3.1B"]],
  "Assets": [["$45M", "$52M"], ["$2.1B", "$2.4B"], ["$890M", "$920M"]],
  "Liabilities": [["$22M", "$19M"], ["$1.1B", "$980M"], ["$450M", "$470M"]],
  "Net Worth": [["$23M", "$33M"], ["$1.0B", "$1.42B"], ["$440M", "$450M"]],
  "Sales Range": [["$10-50M", "$10-50M"], ["$500M-1B", "$1-5B"], ["$1-5M", "$5-10M"]],
  "Full Fiscal Year End": [["Dec 2023", "Dec 2024"], ["Mar 2024", "Mar 2025"], ["Jun 2023", "Jun 2024"]],
  "Partial Fiscal Year End": [["Sep 2023", "Sep 2024"], ["N/A", "Jun 2024"], ["Dec 2023", "Mar 2024"]],
  "Latest Financial Statement": [["10-K 2023", "10-K 2024"], ["Annual 2022", "Annual 2023"], ["Q3 2023", "Q4 2024"]],
  "Ticker Symbol": [["BRKA", "BRK.A"], ["AAPL", "AAPL"], ["GOOG", "GOOGL"]],
  "Exchange Abbreviation": [["NYSE", "NYSE"], ["NASDQ", "NASDAQ"], ["AMEX", "NYSE"]],
  "Exchange Full Name": [["New York Stck Exchange", "New York Stock Exchange"], ["NASDQ Global", "NASDAQ Global Select"], ["American SE", "NYSE American"]],
  "CUSIP Number": [["084670108", "084670702"], ["037833100", "037833100"], ["38259P508", "38259P706"]],
  "Pension Ending Date": [["12/31/2022", "12/31/2023"], ["06/30/2023", "06/30/2024"], ["N/A", "12/31/2024"]],
  "Employees with Full Benefits": [["12,500", "13,200"], ["45,000", "42,800"], ["8,900", "9,100"]],
  "Pension Assets": [["$2.1B", "$2.3B"], ["$890M", "$920M"], ["$450M", "$480M"]],
  "Primary & Secondary SIC": [["7372/7371", "7372/7379"], ["6020/6022", "6021/6022"], ["3674/3672", "3674/3679"]],
  "Primary & Secondary NAICS": [["511210/541511", "511210/541512"], ["522110/522120", "522110/522130"], ["334413/334412", "334413/334419"]],
  "Descriptions": [["Prepackaged Software", "Software Publishers"], ["Commercial Banking", "Depository Credit"], ["Semiconductor Mfg", "Electronic Components"]],
  "Standard Description": [["Tech company", "Technology solutions provider"], ["Financial svc", "Financial services corporation"], ["Retail co", "Retail & e-commerce company"]],
  "Extended Description": [["Develops software products", "Develops and markets enterprise software solutions"], ["Provides banking services", "Full-service commercial and investment banking"], ["Sells consumer goods", "Multi-channel retail and e-commerce platform"]],
  "Import/Export Status": [["Importer", "Importer/Exporter"], ["N/A", "Exporter"], ["Exporter", "Importer/Exporter"]],
  "Directors": [["John Smith (CEO)", "Jane Doe (CEO)"], ["Robert Lee (CFO)", "Robert Lee (CFO/COO)"], ["N/A", "Maria Garcia (CTO)"]],
  "Executive Email": [["ceo@old.com", "ceo@new.com"], ["cfo@co.com", "cfo@newco.com"], ["N/A", "cto@co.com"]],
  "Title": [["Chief Exec Officer", "Chief Executive Officer"], ["VP Finance", "SVP & CFO"], ["Director IT", "CTO"]],
  "Board Activity": [["Active", "Active"], ["Resigned 2023", "Replaced 2024"], ["N/A", "Appointed Q1 2024"]],
  "Social Media": [["linkedin.com/in/old", "linkedin.com/in/new"], ["N/A", "twitter.com/exec"], ["twitter.com/old", "twitter.com/new"]],
  "Company Competitors": [["CompA, CompB", "CompA, CompB, CompC"], ["CompX", "CompX, CompY"], ["N/A", "CompM, CompN"]],
  "Auditors": [["Deloite", "Deloitte"], ["PWC", "PricewaterhouseCoopers"], ["KMPG", "KPMG"]],
  "Transfer Agents": [["ComputerShare", "Computershare Trust"], ["BNY Melon", "BNY Mellon"], ["N/A", "American Stock Transfer"]],
  "Registrars": [["Agent A", "Agent A Inc."], ["N/A", "Registrar Corp."], ["RegCo", "RegCo International"]],
  "Brands": [["BrandA", "BrandA, BrandB"], ["Legacy Brand", "New Brand"], ["N/A", "SubBrand"]],
  "Merger & Acquisition Reports": [["Pending M&A", "Completed Acquisition"], ["N/A", "Merger Announced"], ["Divested Unit", "Acquired SubCo"]],
  "Ceased Operations": [["Active", "Dissolved"], ["Operating", "Ceased Q2 2024"], ["N/A", "Wound Down"]],
  "Shareholder Meetings": [["AGM May 2023", "AGM Jun 2024"], ["N/A", "Special Meeting Q3 2024"], ["EGM Nov 2023", "AGM Apr 2024"]],
  "Minority Ownership": [["15%", "22%"], ["N/A", "10%"], ["8%", "12%"]],
  "Associations": [["IEEE", "IEEE, ACM"], ["ABA", "ABA, SIFMA"], ["N/A", "NAM"]],
  "Awards": [["N/A", "Fortune 500 2024"], ["Best CEO 2022", "Best CEO 2024"], ["N/A", "Industry Leader Award"]],
  "Certifications": [["ISO 9001", "ISO 9001, ISO 27001"], ["SOC 2", "SOC 2 Type II"], ["N/A", "PCI DSS"]],
  "Education": [["Harvard MBA", "Harvard MBA, Stanford PhD"], ["Wharton BS", "Wharton MBA"], ["MIT MS", "MIT PhD"]],
  "Former Career": [["VP at CompA", "CEO at CompB, VP at CompA"], ["Analyst at BankX", "Director at BankY"], ["N/A", "Partner at ConsultCo"]],
  "Federal Tax ID": [["XX-1234567", "XX-1234568"], ["XX-9876543", "XX-9876544"], ["N/A", "XX-5551234"]],
  "Fortune 1000": [["#450", "#380"], ["N/A", "#920"], ["#120", "#115"]],
  "Forbes Global 2000": [["#1200", "#1100"], ["N/A", "#1800"], ["#350", "#340"]],
  "Inc 5000": [["#3200", "#2800"], ["N/A", "#4500"], ["#890", "#750"]],
  "Company Social URLs": [["fb.com/co", "fb.com/co, linkedin.com/co"], ["N/A", "twitter.com/co"], ["linkedin.com/co", "linkedin.com/co, youtube.com/co"]],
};

const generateRecords = (cat: AttributeCategory): CategoryRecord[] => {
  const subAttrs = cat.subAttributes.split(" · ");
  const count = Math.max(Math.min(cat.totalChanges, 30), 15);

  return Array.from({ length: count }, (_, i) => {
    const src = sources[i % sources.length];
    const company = companies[i % companies.length];

    // Generate changes for a random subset of sub-attributes (at least 2)
    const numChanges = Math.min(subAttrs.length, 2 + (i % Math.max(subAttrs.length - 1, 1)));
    const changes: AttributeChange[] = subAttrs.slice(0, numChanges).map((attr, ai) => {
      const vals = attrValueMap[attr];
      if (vals) {
        const pair = vals[(i + ai) % vals.length];
        return { attribute: attr, oldValue: pair[0], newValue: pair[1], confidence: Math.round(60 + Math.random() * 35) };
      }
      return { attribute: attr, oldValue: `Previous ${attr}`, newValue: `Updated ${attr}`, confidence: Math.round(60 + Math.random() * 35) };
    });

    return {
      id: `${cat.id}-R${String(i + 1).padStart(3, "0")}`,
      companyName: company,
      changes,
      source: src.name,
      sourceUrl: src.url,
    };
  });
};

const PAGE_SIZE = 15;

export default function AttributeCategoryReviewModal({ category, onClose }: Props) {
  const [records, setRecords] = useState(() => generateRecords(category));
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [expandedRecordIds, setExpandedRecordIds] = useState<Set<string>>(new Set());
  const [activeSourceUrl, setActiveSourceUrl] = useState<string>("");
  const [activeSourceName, setActiveSourceName] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCell, setEditingCell] = useState<{ recordId: string; changeIdx: number } | null>(null);
  const [editValue, setEditValue] = useState("");

  const totalPages = Math.ceil(records.length / PAGE_SIZE);
  const paginatedRecords = useMemo(
    () => records.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [records, currentPage]
  );

  const handleRecordClick = (rec: CategoryRecord) => {
    setSelectedRecordId(rec.id);
    setActiveSourceUrl(rec.sourceUrl);
    setActiveSourceName(rec.source);
    // Toggle expand
    setExpandedRecordIds(prev => {
      const next = new Set(prev);
      if (next.has(rec.id)) next.delete(rec.id);
      else next.add(rec.id);
      return next;
    });
  };

  const handleSourceClick = (src: { name: string; url: string }) => {
    setActiveSourceUrl(src.url);
    setActiveSourceName(src.name);
  };

  const startEdit = useCallback((recordId: string, changeIdx: number, currentVal: string) => {
    setEditingCell({ recordId, changeIdx });
    setEditValue(currentVal);
  }, []);

  const saveEdit = useCallback(() => {
    if (!editingCell) return;
    setRecords(prev => prev.map(r => {
      if (r.id !== editingCell.recordId) return r;
      const newChanges = [...r.changes];
      newChanges[editingCell.changeIdx] = { ...newChanges[editingCell.changeIdx], newValue: editValue };
      return { ...r, changes: newChanges };
    }));
    toast.success("Value updated");
    setEditingCell(null);
  }, [editingCell, editValue]);

  const cancelEdit = useCallback(() => {
    setEditingCell(null);
  }, []);

  const handleSubmit = () => {
    toast.success(`${records.length} records submitted for ${category.name}`);
    onClose();
  };

  const subAttrs = category.subAttributes.split(" · ");

  return (
    <div className="fixed inset-0 z-[300] flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Queue
          </button>
          <div className="h-4 w-px bg-border" />
          <div>
            <span className="text-[13px] font-semibold text-foreground">{category.name}</span>
            <span className="text-[11px] text-muted-foreground ml-2">Records: {records.length}</span>
            <span className="text-[11px] text-muted-foreground ml-2">· Attributes: {subAttrs.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-muted-foreground">Category: <span className="font-semibold text-foreground">{category.group}</span></span>
          <span className="text-muted-foreground">Severity: <span className={cn("font-semibold", category.severity === "CRITICAL" ? "text-destructive" : category.severity === "HIGH" ? "text-status-amber" : "text-brand")}>{category.severity}</span></span>
        </div>
      </div>

      {/* Split pane */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* LHS: Sources + Webpage */}
        <div className="w-1/2 border-r border-border flex flex-col overflow-hidden">
          {/* Source list bar */}
          <div className="px-3 py-1.5 border-b border-border bg-muted/30">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Workflow Sources</div>
            <div className="flex flex-wrap gap-1.5">
              {sources.map((src) => (
                <button
                  key={src.name}
                  onClick={() => handleSourceClick(src)}
                  className={cn(
                    "px-2 py-0.5 text-[10px] rounded border transition-colors",
                    activeSourceName === src.name
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                  )}
                >
                  {src.name}
                </button>
              ))}
            </div>
          </div>

          {/* URL bar */}
          <div className="px-3 py-1.5 border-b border-border bg-muted/10 flex items-center gap-2">
            <ExternalLink className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground truncate flex-1">
              {activeSourceUrl || "Click a source or company to load webpage"}
            </span>
            {activeSourceUrl && (
              <a href={activeSourceUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline shrink-0">
                Open ↗
              </a>
            )}
          </div>

          {/* Iframe */}
          <div className="flex-1 overflow-hidden">
            {activeSourceUrl ? (
              <iframe
                src={activeSourceUrl}
                title="Source page"
                className="w-full h-full border-0"
                sandbox="allow-same-origin allow-scripts"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <ExternalLink className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-[12px] text-muted-foreground">Select a company or source to load the webpage</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RHS: Excel-style spreadsheet with multi-attribute rows */}
        <div className="w-1/2 flex flex-col overflow-hidden">
          {/* Title bar */}
          <div className="px-3 py-1.5 border-b border-border bg-primary/10 flex items-center justify-between">
            <span className="text-[12px] font-semibold text-foreground">{category.name} — Records for Review</span>
            <span className="text-[10px] text-muted-foreground">
              Page {currentPage} of {totalPages} · {records.length} total records
            </span>
          </div>

          {/* Attribute legend */}
          <div className="px-3 py-1 border-b border-border bg-muted/20">
            <div className="text-[9px] text-muted-foreground">
              <span className="font-semibold uppercase tracking-wider">Attributes tracked:</span>{" "}
              {subAttrs.map((a, i) => (
                <span key={a}>
                  <span className="text-foreground font-medium">{a}</span>
                  {i < subAttrs.length - 1 && <span className="text-border mx-1">·</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="min-w-full border-collapse text-[11px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted/60 border-b border-border">
                  <th className="px-2 py-2 text-left text-[11px] font-semibold text-muted-foreground border-r border-border/50 whitespace-nowrap w-[32px]">#</th>
                  <th className="px-2 py-2 text-left text-[11px] font-semibold text-muted-foreground border-r border-border/50 whitespace-nowrap">Company Name</th>
                  <th className="px-2 py-2 text-left text-[11px] font-semibold text-muted-foreground border-r border-border/50 whitespace-nowrap">Attribute</th>
                  <th className="px-2 py-2 text-left text-[11px] font-semibold text-muted-foreground border-r border-border/50 whitespace-nowrap">Previous Value</th>
                  <th className="px-2 py-2 text-left text-[11px] font-semibold text-muted-foreground border-r border-border/50 whitespace-nowrap">Current Value</th>
                  <th className="px-2 py-2 text-center text-[11px] font-semibold text-muted-foreground whitespace-nowrap w-[56px]">Conf.</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecords.map((rec, idx) => {
                  const isExpanded = expandedRecordIds.has(rec.id);
                  const isSelected = selectedRecordId === rec.id;
                  const rowNum = (currentPage - 1) * PAGE_SIZE + idx + 1;
                  const firstChange = rec.changes[0];
                  const hasMultiple = rec.changes.length > 1;

                  return [
                    <tr
                      key={`${rec.id}-primary`}
                      onClick={() => handleRecordClick(rec)}
                      className={cn(
                        "border-b border-border/40 cursor-pointer transition-colors hover:bg-accent/30 group/row",
                        isSelected && "bg-primary/5 ring-1 ring-inset ring-primary/20"
                      )}
                    >
                      <td className="px-2 py-2 text-[11px] text-muted-foreground border-r border-border/30 text-center whitespace-nowrap align-top">
                        {rowNum}
                      </td>
                      <td className="px-2 py-2 text-[11px] font-medium text-foreground border-r border-border/30 whitespace-nowrap align-top">
                        <div className="flex items-center gap-1">
                          {hasMultiple && (
                            isExpanded
                              ? <ChevronUp className="w-3 h-3 text-muted-foreground shrink-0" />
                              : <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />
                          )}
                          <span className="hover:text-primary hover:underline cursor-pointer">{rec.companyName}</span>
                          {hasMultiple && (
                            <span className="text-[9px] text-muted-foreground shrink-0">({rec.changes.length})</span>
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-2 text-[11px] border-r border-border/30 whitespace-nowrap align-top">
                        <span className="font-medium text-primary/80">{firstChange.attribute}</span>
                      </td>
                      <td className="px-2 py-2 text-[11px] text-destructive/80 border-r border-border/30 whitespace-nowrap line-through decoration-destructive/30 align-top">
                        {firstChange.oldValue}
                      </td>
                      <td className="px-2 py-2 text-[11px] border-r border-border/30 whitespace-nowrap align-top">
                        {editingCell?.recordId === rec.id && editingCell?.changeIdx === 0 ? (
                          <div className="flex items-center gap-1">
                            <input
                              value={editValue}
                              onChange={e => setEditValue(e.target.value)}
                              className="flex-1 text-[11px] bg-background border border-primary/40 rounded px-1.5 py-0.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                              autoFocus
                              onKeyDown={e => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") cancelEdit(); }}
                            />
                            <button onClick={saveEdit} className="p-0.5 text-brand hover:text-brand/80" title="Save"><Check className="w-3.5 h-3.5" /></button>
                            <button onClick={cancelEdit} className="p-0.5 text-destructive hover:text-destructive/80" title="Cancel"><X className="w-3.5 h-3.5" /></button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <span className="text-brand font-medium">{firstChange.newValue}</span>
                            <button
                              onClick={e => { e.stopPropagation(); startEdit(rec.id, 0, firstChange.newValue); }}
                              className="p-0.5 opacity-0 group-hover/row:opacity-100 hover:bg-accent rounded transition-all" title="Edit"
                            >
                              <Pencil className="w-3 h-3 text-muted-foreground" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-2 py-2 text-center whitespace-nowrap align-top">
                        <span className={cn(
                          "text-[11px] font-bold",
                          firstChange.confidence >= 80 ? "text-brand" : firstChange.confidence >= 60 ? "text-status-amber" : "text-destructive"
                        )}>
                          {firstChange.confidence}%
                        </span>
                      </td>
                    </tr>,
                    ...(isExpanded
                      ? rec.changes.slice(1).map((change, ci) => (
                          <tr
                            key={`${rec.id}-sub-${ci}`}
                            className="border-b border-border/20 bg-muted/10 group/row"
                          >
                            <td className="border-r border-border/30" />
                            <td className="px-2 py-1.5 text-[11px] border-r border-border/30 whitespace-nowrap">
                              <span className="text-muted-foreground pl-4">↳</span>
                            </td>
                            <td className="px-2 py-1.5 text-[11px] border-r border-border/30 whitespace-nowrap">
                              <span className="font-medium text-primary/80">{change.attribute}</span>
                            </td>
                            <td className="px-2 py-1.5 text-[11px] text-destructive/80 border-r border-border/30 whitespace-nowrap line-through decoration-destructive/30">
                              {change.oldValue}
                            </td>
                            <td className="px-2 py-1.5 text-[11px] border-r border-border/30 whitespace-nowrap">
                              {editingCell?.recordId === rec.id && editingCell?.changeIdx === ci + 1 ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    value={editValue}
                                    onChange={e => setEditValue(e.target.value)}
                                    className="flex-1 text-[11px] bg-background border border-primary/40 rounded px-1.5 py-0.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                    autoFocus
                                    onKeyDown={e => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") cancelEdit(); }}
                                  />
                                  <button onClick={saveEdit} className="p-0.5 text-brand hover:text-brand/80" title="Save"><Check className="w-3.5 h-3.5" /></button>
                                  <button onClick={cancelEdit} className="p-0.5 text-destructive hover:text-destructive/80" title="Cancel"><X className="w-3.5 h-3.5" /></button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <span className="text-brand font-medium">{change.newValue}</span>
                                  <button
                                    onClick={e => { e.stopPropagation(); startEdit(rec.id, ci + 1, change.newValue); }}
                                    className="p-0.5 opacity-0 group-hover/row:opacity-100 hover:bg-accent rounded transition-all" title="Edit"
                                  >
                                    <Pencil className="w-3 h-3 text-muted-foreground" />
                                  </button>
                                </div>
                              )}
                            </td>
                            <td className="px-2 py-1.5 text-center whitespace-nowrap">
                              <span className={cn(
                                "text-[11px] font-bold",
                                change.confidence >= 80 ? "text-brand" : change.confidence >= 60 ? "text-status-amber" : "text-destructive"
                              )}>
                                {change.confidence}%
                              </span>
                            </td>
                          </tr>
                        ))
                      : []),
                  ];
                })}
              </tbody>
            </table>
          </div>

          {/* Footer with pagination + submit */}
          <div className="px-3 py-2 border-t border-border bg-muted/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={cn(
                    "w-6 h-6 rounded text-[10px] font-medium transition-colors",
                    p === currentPage
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent"
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              onClick={handleSubmit}
              className="px-6 py-1.5 text-[12px] font-semibold bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
