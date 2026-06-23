/**
 * Helpers to turn a Run-by-Workflows job into a persisted `jobs` row whose
 * csv_columns / csv_rows can be picked up by the HITL screens.
 *
 * Inputs come from the user (uploaded CSV/TXT or manual text). The first column
 * is treated as the entity identifier (company name). Output rows synthesize
 * plausible values for each attribute listed by the workflow(s) that ran.
 */

import {
  attributesForWorkflows,
  resolveWorkflowIdsFromLabels,
} from "./workflow-sources";

/** Parse an uploaded CSV/TXT file into rows of cells. First row may be header. */
export async function parseEntityFile(file: File): Promise<{ header: string[]; rows: string[][] }> {
  const text = await file.text();
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return { header: [], rows: [] };
  const split = (line: string) => line.split(/,|\t|;/).map(c => c.trim().replace(/^"|"$/g, ""));
  const first = split(lines[0]);
  // Heuristic: if first row looks like a header (has "company" or "name" token), strip it.
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

/** Generate a plausible value for an attribute, varied by company seed. */
function valueFor(attr: string, company: string, idx: number): string {
  const seed = (company.length + idx) % 7;
  const a = attr.toLowerCase();
  if (a.includes("name") && a.includes("full")) return ["John Carter", "Priya Shah", "Marcus Lee", "Emma Russo", "Liam Cohen", "Yuki Tanaka", "Sofia Mendes"][seed];
  if (a === "company name" || a.includes("legal name") || a.includes("trade name")) return company;
  if (a.includes("job title") || a.includes("title")) return ["CEO", "CFO", "VP Engineering", "Head of People", "COO", "Director", "Founder"][seed];
  if (a.includes("department")) return ["Executive", "Finance", "Engineering", "People Ops", "Operations", "Product", "Sales"][seed];
  if (a.includes("email")) return `contact@${company.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
  if (a.includes("phone")) return ["+1 415 555 0142", "+44 20 7946 0312", "+91 22 6789 1234", "+49 30 12345678", "+81 3 9876 5432", "+55 11 3456 7890", "+1 212 555 8899"][seed];
  if (a.includes("linkedin")) return `https://www.linkedin.com/company/${company.toLowerCase().replace(/[^a-z0-9]/g, "-")}/`;
  if (a.includes("start date") || a.includes("date")) return ["2019-03-15", "2020-08-01", "2021-01-12", "2018-06-22", "2022-11-04", "2017-09-09", "2023-02-18"][seed];
  if (a.includes("location") || a.includes("geography")) return ["San Francisco, CA", "London, UK", "Bengaluru, IN", "Berlin, DE", "Tokyo, JP", "São Paulo, BR", "Toronto, CA"][seed];
  if (a.includes("reports to")) return ["CEO", "CFO", "COO", "CTO", "Board", "President", "Founder"][seed];
  if (a.includes("employment type")) return ["Full-time", "Contractor", "Part-time", "Full-time", "Full-time", "Advisor", "Full-time"][seed];
  if (a.includes("seniority")) return ["C-Suite", "VP", "Director", "Manager", "Senior", "Lead", "Principal"][seed];
  if (a.includes("skills")) return ["Leadership; Strategy; M&A", "FP&A; SaaS Metrics", "Distributed Systems; Go", "Talent; OKRs", "Operations; Scale", "Product; UX", "Sales; GTM"][seed];
  if (a.includes("industry")) return ["Software", "Financial Services", "Healthcare", "Industrials", "Retail", "Media", "Telecom"][seed];
  if (a.includes("headcount") || a.includes("employees")) return ["1,250", "320", "8,400", "76", "15,200", "540", "2,800"][seed];
  if (a.includes("hiring rate")) return ["4.2%", "1.1%", "6.8%", "2.5%", "9.0%", "3.7%", "5.4%"][seed];
  if (a.includes("attrition")) return ["12.4%", "8.1%", "15.6%", "5.9%", "11.2%", "7.8%", "10.0%"][seed];
  if (a.includes("growth rate")) return ["18%", "−3%", "32%", "9%", "47%", "5%", "12%"][seed];
  if (a.includes("job postings")) return ["48 open", "12 open", "203 open", "6 open", "412 open", "21 open", "87 open"][seed];
  if (a.includes("sentiment")) return ["Positive", "Neutral", "Mixed", "Positive", "Cautious", "Positive", "Neutral"][seed];
  if (a.includes("founders")) return ["A. Patel; J. Wu", "M. Olsen", "R. Chen; S. Khan", "K. Müller", "T. Nakamura", "L. Costa", "D. Singh; H. Park"][seed];
  if (a.includes("average tenure")) return ["3.4 yrs", "5.1 yrs", "2.2 yrs", "6.8 yrs", "1.9 yrs", "4.7 yrs", "3.0 yrs"][seed];
  if (a.includes("average salary") || a.includes("salary")) return ["$148,000", "$92,000", "$176,500", "$64,200", "$210,800", "$118,000", "$135,400"][seed];
  if (a.includes("key word") || a === "keyword") return ["AI; Cloud; Data", "Fintech; Payments", "Genomics; Trials", "Logistics; Supply", "Commerce; D2C", "Streaming; Content", "5G; Networks"][seed];
  if (a.includes("activities")) return ["Hiring spree", "Layoffs reported", "New office opened", "Stable", "Series C closed", "Stable", "Acquisition announced"][seed];
  if (a.includes("previous company")) return ["Stripe; Google", "Morgan Stanley", "Meta; Datadog", "Workday", "Amazon; Salesforce", "Netflix", "Cisco; Oracle"][seed];
  if (a.includes("funding rounds")) return ["Seed; A; B; C", "A; B", "Seed; A; B; C; D", "Bootstrapped", "A; B; C", "B; C", "Seed; A"][seed];
  if (a.includes("investors")) return ["Sequoia; a16z", "Index Ventures", "Tiger; SoftBank", "—", "Accel; Benchmark", "Bessemer; Lightspeed", "Greylock; NEA"][seed];
  return "N/A";
}

export interface JobResult {
  jobId: string;
  name: string;
  tier: string;       // comma-joined workflow labels
  records: number;
  attributesCount: number;
  csvColumns: string[];
  csvRows: string[][];
}

/**
 * Build a job-result payload from a set of workflow labels and the entity rows
 * the user provided (each row's first cell is treated as the company name).
 */
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
  // First column is the entity identifier (company). Keep an optional Website
  // column if present in the input so HITL can use it as the live source URL.
  const websiteIdx = inputHeader.findIndex(c => /website|url|domain|homepage|site/i.test(c));
  const columns = ["Company"];
  if (websiteIdx >= 0) columns.push("Website");
  columns.push(...attrs);

  // De-duplicate by company name to avoid double-counting on re-upload.
  const seen = new Set<string>();
  const rows: string[][] = [];
  entityRows.forEach((r, i) => {
    const company = (r[0] || "").trim();
    if (!company || seen.has(company.toLowerCase())) return;
    seen.add(company.toLowerCase());
    const out: string[] = [company];
    if (websiteIdx >= 0) out.push((r[websiteIdx] || "").trim() || "");
    attrs.forEach((a, j) => out.push(valueFor(a, company, i + j)));
    rows.push(out);
  });

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
