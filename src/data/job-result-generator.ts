/**
 * Helpers to turn a Run-by-Workflows job into a persisted `jobs` row whose
 * csv_columns / csv_rows can be picked up by the HITL screens.
 *
 * Inputs come from the user (uploaded CSV/TXT or manual text). The first column
 * is treated as the entity identifier (company name).
 *
 * For the "Company Data Extraction" and "People Data Extraction" workflows,
 * output values are pulled from the stored POC dataset (poc-companies.json /
 * poc-personnel.json). If none of the supplied input companies match any
 * record in the stored dataset, the job is reported as failed and no rows
 * are emitted. Other workflows (SEC, Stock Exchange, Annual Report, Labor
 * Market) continue to fall back to plausible synthesized values.
 */

import {
  attributesForWorkflows,
  findWorkflowByLabel,
  resolveWorkflowIdsFromLabels,
  type WorkflowSourceId,
} from "./workflow-sources";
import { pocCompaniesRaw, pocPersonnelRaw } from "./poc-dataset";

/** Parse an uploaded CSV/TXT file into rows of cells. First row may be header. */
export async function parseEntityFile(file: File): Promise<{ header: string[]; rows: string[][] }> {
  const text = await file.text();
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return { header: [], rows: [] };
  const split = (line: string) => line.split(/,|\t|;/).map(c => c.trim().replace(/^"|"$/g, ""));
  const first = split(lines[0]);
  const looksLikeHeader = first.some(c => /company|name|website|url|domain/i.test(c));
  const header = looksLikeHeader ? first : [];
  const dataLines = looksLikeHeader ? lines.slice(1) : lines;
  return { header, rows: dataLines.map(split) };
}

/** Parse the manual textarea entries. One entity per line, comma-separated. */
export function parseManualEntities(text: string): string[][] {
  return text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean)
    .map(l => l.split(/,|\t|;/).map(c => c.trim()));
}

/* ───────────────── Stored-data lookups ───────────────── */

const norm = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "");

type CompanyRec = Record<string, string>;
type PersonRec = Record<string, string>;

/** Find the company in the stored POC dataset that best matches the input. */
function findStoredCompany(input: string): CompanyRec | undefined {
  const n = norm(input);
  if (!n) return undefined;
  // Exact normalized match first.
  let hit = pocCompaniesRaw.find(c => norm(c["Company_name"]) === n);
  if (hit) return hit;
  // Substring match (either direction).
  hit = pocCompaniesRaw.find(c => {
    const cn = norm(c["Company_name"]);
    return cn && (cn.includes(n) || n.includes(cn));
  });
  return hit;
}

function personnelForCompany(company: CompanyRec): PersonRec[] {
  const id = company["Client_company_id"];
  if (id) {
    const byId = pocPersonnelRaw.filter(p => p["Client_company_id"] === id);
    if (byId.length) return byId;
  }
  const cn = norm(company["Company_name"]);
  return pocPersonnelRaw.filter(p => norm(p["Company_name"]) === cn);
}

/* ───────────────── Attribute → field mappings ───────────────── */

function companyAttr(attr: string, c: CompanyRec): string {
  const a = attr.toLowerCase();
  switch (a) {
    case "legal name":
    case "company name":
    case "trade name":
      return c["Company_name"] || "N/A";
    case "country":
      return c["Country.1"] || c["Country"] || "N/A";
    case "address":
      return c["Address"] || "N/A";
    case "city":
      return c["City"] || "N/A";
    case "state":
      return c["State/Province"] || "N/A";
    case "postal code":
      return c["PostalCode"] || "N/A";
    case "website":
      return c["Company_website_url"] || "N/A";
    case "email":
      return c["Company_email"] || "N/A";
    case "phone":
      return c["Phone"] || c["TollFree"] || "N/A";
    case "fax":
      return c["Fax"] || "N/A";
    case "number of employees":
    case "company headcount":
      return c["Employee_count_value"] || "N/A";
    case "social media profiles":
    case "linkedin url":
      return c["Company_LinkedIn"] || "N/A";
    case "foundation year":
      return "N/A";
    case "business description":
      return "N/A";
    case "registration id(s)":
      return c["Duns_id"] || c["Dca_id"] || c["Client_company_id"] || "N/A";
    default:
      return "";
  }
}

function deriveSeniority(title: string): string {
  const t = (title || "").toLowerCase();
  if (/chief|ceo|cfo|coo|cto|cmo|chair/.test(t)) return "C-Suite";
  if (/president/.test(t)) return "C-Suite";
  if (/vice president|\bvp\b/.test(t)) return "VP";
  if (/director/.test(t)) return "Director";
  if (/manager/.test(t)) return "Manager";
  if (/lead|principal|head/.test(t)) return "Lead";
  return "Senior";
}

function deriveDepartment(title: string): string {
  const t = (title || "").toLowerCase();
  if (/finance|cfo|treasurer/.test(t)) return "Finance";
  if (/engineer|cto|technology/.test(t)) return "Engineering";
  if (/people|hr|human resources/.test(t)) return "People Ops";
  if (/operations|coo/.test(t)) return "Operations";
  if (/product/.test(t)) return "Product";
  if (/sales|marketing|cmo|revenue/.test(t)) return "Sales & Marketing";
  if (/legal|secretary|counsel/.test(t)) return "Legal";
  return "Executive";
}

function personAttr(attr: string, p: PersonRec, c: CompanyRec): string {
  const a = attr.toLowerCase();
  const title = p["Exec_title_formatted"] || p["Exec_title_raw"] || "";
  switch (a) {
    case "full name":
      return [p["Prefix"], p["First name"], p["Middle name"], p["Last name"], p["Suffix"]]
        .filter(Boolean).join(" ").trim() || "N/A";
    case "job title":
      return title || "N/A";
    case "department":
      return deriveDepartment(title);
    case "seniority level":
      return deriveSeniority(title);
    case "location":
      return [c["City"], c["Country.1"] || c["Country"]].filter(Boolean).join(", ") || "N/A";
    case "start date":
      return p["Exec_as_of_date"] || "N/A";
    case "employment type":
      return "Full-time";
    case "email":
    case "phone number":
    case "linkedin url":
    case "reports to":
    case "skills":
      return "N/A";
    default:
      return "";
  }
}

/* ───────────────── Synthesized fallback (for non-DB workflows) ───────────────── */

function syntheticValue(attr: string, company: string, idx: number): string {
  const seed = (company.length + idx) % 7;
  const a = attr.toLowerCase();
  if (a.includes("revenue")) return ["$3.6M", "$210M", "$84M", "$1.2B", "$56M", "$430M", "$12.8M"][seed];
  if (a.includes("assets")) return ["$18M", "$1.1B", "$320M", "$9.4B", "$72M", "$2.1B", "$48M"][seed];
  if (a.includes("liabilities")) return ["$7M", "$640M", "$190M", "$5.6B", "$31M", "$1.3B", "$22M"][seed];
  if (a.includes("net income")) return ["$0.8M", "$54M", "$11M", "$320M", "$3.2M", "$98M", "$1.4M"][seed];
  if (a.includes("fiscal year end")) return ["Mar 31", "Dec 31", "Jun 30", "Sep 30", "Dec 31", "Mar 31", "Dec 31"][seed];
  if (a.includes("naics") || a.includes("sic")) return ["541511", "522110", "621111", "336411", "454110", "511210", "517110"][seed];
  if (a.includes("ticker")) return ["ACME", "BLUE", "CORE", "DELT", "EAST", "FOLD", "GROV"][seed];
  if (a.includes("stock exchange")) return ["NASDAQ", "NYSE", "LSE", "TSX", "ASX", "TYO", "NSE"][seed];
  if (a.includes("status")) return ["Active", "Active", "Active", "In Review", "Active", "Active", "Active"][seed];
  if (a.includes("organizational type")) return ["Corporation", "LLC", "PLC", "Pvt Ltd", "GmbH", "S.A.", "Inc."][seed];
  if (a.includes("ultimate parent")) return [company, "—", company, "—", company, "—", company][seed];
  if (a.includes("subsidiary")) return ["—", "Subsidiary A", "—", "Subsidiary B", "—", "Subsidiary C", "—"][seed];
  if (a.includes("entity type")) return ["Holding", "Operating", "JV", "SPV", "Branch", "Subsidiary", "Holding"][seed];
  if (a.includes("hierarchy level")) return ["1", "2", "1", "3", "2", "1", "2"][seed];
  if (a.includes("relationship type")) return ["Owned", "Affiliated", "Owned", "Controlled", "Owned", "Joint", "Owned"][seed];
  if (a.includes("performance expectation")) return ["On Track", "Above", "Below", "On Track", "Above", "On Track", "Below"][seed];
  // Labor-market specific
  if (a.includes("industry")) return ["Software", "Financial Services", "Healthcare", "Industrials", "Retail", "Media", "Telecom"][seed];
  if (a.includes("hiring rate")) return ["4.2%", "1.1%", "6.8%", "2.5%", "9.0%", "3.7%", "5.4%"][seed];
  if (a.includes("attrition")) return ["12.4%", "8.1%", "15.6%", "5.9%", "11.2%", "7.8%", "10.0%"][seed];
  if (a.includes("growth rate")) return ["18%", "−3%", "32%", "9%", "47%", "5%", "12%"][seed];
  if (a.includes("job postings")) return ["48 open", "12 open", "203 open", "6 open", "412 open", "21 open", "87 open"][seed];
  if (a.includes("sentiment")) return ["Positive", "Neutral", "Mixed", "Positive", "Cautious", "Positive", "Neutral"][seed];
  if (a.includes("founders")) return ["A. Patel; J. Wu", "M. Olsen", "R. Chen; S. Khan", "K. Müller", "T. Nakamura", "L. Costa", "D. Singh; H. Park"][seed];
  if (a.includes("average tenure")) return ["3.4 yrs", "5.1 yrs", "2.2 yrs", "6.8 yrs", "1.9 yrs", "4.7 yrs", "3.0 yrs"][seed];
  if (a.includes("average salary") || a.includes("salary")) return ["$148,000", "$92,000", "$176,500", "$64,200", "$210,800", "$118,000", "$135,400"][seed];
  if (a.includes("key word") || a === "keyword") return ["AI; Cloud; Data", "Fintech; Payments", "Genomics; Trials", "Logistics; Supply", "Commerce; D2C", "Streaming; Content", "5G; Networks"][seed];
  if (a.includes("geography")) return ["North America", "EMEA", "APAC", "LATAM", "EMEA", "APAC", "North America"][seed];
  if (a.includes("activities")) return ["Hiring spree", "Layoffs reported", "New office opened", "Stable", "Series C closed", "Stable", "Acquisition announced"][seed];
  if (a.includes("previous company")) return ["Stripe; Google", "Morgan Stanley", "Meta; Datadog", "Workday", "Amazon; Salesforce", "Netflix", "Cisco; Oracle"][seed];
  if (a.includes("funding rounds")) return ["Seed; A; B; C", "A; B", "Seed; A; B; C; D", "Bootstrapped", "A; B; C", "B; C", "Seed; A"][seed];
  if (a.includes("investors")) return ["Sequoia; a16z", "Index Ventures", "Tiger; SoftBank", "—", "Accel; Benchmark", "Bessemer; Lightspeed", "Greylock; NEA"][seed];
  if (a.includes("skills")) return ["Leadership; Strategy", "FP&A; SaaS Metrics", "Distributed Systems", "Talent; OKRs", "Operations; Scale", "Product; UX", "Sales; GTM"][seed];
  return "N/A";
}

/* ───────────────── Public types ───────────────── */

export interface JobResult {
  jobId: string;
  name: string;
  tier: string;
  records: number;
  attributesCount: number;
  csvColumns: string[];
  csvRows: string[][];
  /** True if the job should be marked Failed (e.g. no matched records in stored DB). */
  failed?: boolean;
  /** Human-readable reason when `failed` is true. */
  failureReason?: string;
}

/* ───────────────── Build ───────────────── */

export function buildJobResult(opts: {
  jobId: string;
  jobName: string;
  workflowLabels: string[];
  entityRows: string[][];
  inputHeader?: string[];
}): JobResult {
  const { jobId, jobName, workflowLabels, entityRows, inputHeader = [] } = opts;
  const ids = resolveWorkflowIdsFromLabels(workflowLabels);
  const attrs = attributesForWorkflows(ids);

  // Owner lookup: which workflow id owns each attribute (first match wins)
  const ownerByAttr = new Map<string, WorkflowSourceId>();
  for (const label of workflowLabels) {
    const wf = findWorkflowByLabel(label);
    if (!wf) continue;
    for (const a of wf.attributes) {
      if (!ownerByAttr.has(a)) ownerByAttr.set(a, wf.id);
    }
  }

  const usesCompanyDb = ids.includes("company_data");
  const usesPeopleDb = ids.includes("people_data");
  const dbBackedOnly =
    (usesCompanyDb || usesPeopleDb) &&
    ids.every(id => id === "company_data" || id === "people_data");

  const websiteIdx = inputHeader.findIndex(c => /website|url|domain|homepage|site/i.test(c));
  const columns = ["Company"];
  if (websiteIdx >= 0) columns.push("Website");
  columns.push(...attrs);

  // De-duplicate input by company name (case-insensitive).
  const seen = new Set<string>();
  const uniqueEntities: { company: string; website: string }[] = [];
  for (const r of entityRows) {
    const company = (r[0] || "").trim();
    if (!company) continue;
    const key = company.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    uniqueEntities.push({
      company,
      website: websiteIdx >= 0 ? (r[websiteIdx] || "").trim() : "",
    });
  }

  const rows: string[][] = [];
  let matchedAny = false;

  uniqueEntities.forEach(({ company, website }, idx) => {
    const stored = (usesCompanyDb || usesPeopleDb) ? findStoredCompany(company) : undefined;

    if (usesPeopleDb) {
      // One row per personnel record for matched companies.
      if (!stored) return;
      matchedAny = true;
      const people = personnelForCompany(stored);
      if (people.length === 0) return;
      for (const person of people) {
        const out: string[] = [stored["Company_name"] || company];
        if (websiteIdx >= 0) out.push(website || stored["Company_website_url"] || "");
        for (const attr of attrs) {
          const owner = ownerByAttr.get(attr);
          if (owner === "people_data") out.push(personAttr(attr, person, stored));
          else if (owner === "company_data") out.push(companyAttr(attr, stored));
          else out.push(syntheticValue(attr, stored["Company_name"] || company, idx));
        }
        rows.push(out);
      }
      return;
    }

    if (usesCompanyDb) {
      if (!stored) return;
      matchedAny = true;
      const out: string[] = [stored["Company_name"] || company];
      if (websiteIdx >= 0) out.push(website || stored["Company_website_url"] || "");
      for (const attr of attrs) {
        const owner = ownerByAttr.get(attr);
        if (owner === "company_data") out.push(companyAttr(attr, stored));
        else out.push(syntheticValue(attr, stored["Company_name"] || company, idx));
      }
      rows.push(out);
      return;
    }

    // No DB-backed workflow selected — purely synthesized output.
    const out: string[] = [company];
    if (websiteIdx >= 0) out.push(website);
    for (const attr of attrs) out.push(syntheticValue(attr, company, idx));
    rows.push(out);
  });

  // Fail the job when the selection is DB-backed and nothing matched the stored
  // dataset. The caller should mark the job as Failed and skip simulation.
  if (dbBackedOnly && !matchedAny) {
    const which = usesPeopleDb && usesCompanyDb
      ? "Company / People Data Extraction"
      : usesPeopleDb ? "People Data Extraction" : "Company Data Extraction";
    return {
      jobId,
      name: jobName,
      tier: workflowLabels.join(", "),
      records: 0,
      attributesCount: attrs.length,
      csvColumns: columns,
      csvRows: [],
      failed: true,
      failureReason: `${which} requires input records that exist in the stored company database. None of the supplied ${uniqueEntities.length || 0} entit${uniqueEntities.length === 1 ? "y" : "ies"} matched a stored company record.`,
    };
  }

  return {
    jobId,
    name: jobName,
    tier: workflowLabels.join(", "),
    records: rows.length,
    attributesCount: attrs.length,
    csvColumns: columns,
    csvRows: rows,
  };
}
