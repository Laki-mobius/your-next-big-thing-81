/**
 * Maps each workflow to its canonical source (name + URL builder) and the
 * attributes it is responsible for extracting.
 *
 * Used by:
 *  - Edge function (to record which workflows a job ran)
 *  - HITL Review (to filter sourceRefs per attribute to only the selected workflows
 *    and to power the "click source → load page on LHS" interaction)
 */

export type WorkflowSourceId =
  | "company_data"
  | "registry_data"
  | "sec_data"
  | "stock_exchange";

export interface WorkflowSource {
  id: WorkflowSourceId;
  /** Workflow label as shown in the Run New Job modal (must match exactly) */
  label: string;
  /** Display name shown next to each attribute as a clickable source pill */
  sourceName: string;
  /** Attributes this workflow is the canonical source for */
  attributes: string[];
  /** Build the LHS iframe URL for a given company name */
  buildUrl: (companyName: string) => string;
}

/**
 * Extract a clean hostname from any input that might be a URL, domain,
 * or plain company name. Strips protocol, www., paths, and query strings.
 * Returns lowercase host (e.g. "microsoft.com") or empty if none detected.
 */
const extractHost = (s: string): string => {
  if (!s) return "";
  let v = s.trim().toLowerCase();
  // Strip protocol
  v = v.replace(/^[a-z]+:\/\//, "");
  // Strip path / query / fragment
  v = v.split(/[\/?#]/)[0];
  // Strip leading www.
  v = v.replace(/^www\./, "");
  // Must look like a domain (contains a dot, no spaces)
  if (/\s/.test(v)) return "";
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(v)) return "";
  return v;
};

/**
 * Build a slug suitable for URL paths from a company name.
 * If the input is a domain, uses the domain's "core" label (e.g. "microsoft.com" -> "microsoft").
 * Otherwise normalizes by replacing non-alphanumerics with hyphens.
 */
const slug = (s: string) => {
  const host = extractHost(s);
  if (host) {
    // Take the part before the first dot ("microsoft.com" -> "microsoft")
    return host.split(".")[0];
  }
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Build the canonical company website URL.
 * - If input already looks like a URL/domain, use that exact host.
 * - Otherwise fall back to "<slug>.com".
 */
const buildCompanyWebsite = (company: string): string => {
  const host = extractHost(company);
  if (host) return `https://${host}`;
  const s = slug(company);
  return s ? `https://www.${s}.com` : "https://www.google.com";
};

/**
 * Per-source attribute ownership.
 *
 * Aligned to the master spec:
 *  Basic Data:        Legal Name, Trade Name, Registration ID(s), Country, Address,
 *                     City, State, Postal Code, Website, Email, Phone, Fax,
 *                     Organizational Type, Foundation Year, Number of Employees,
 *                     Business Description, NAICS/SIC Codes, Social Media Profiles,
 *                     Status, Ticker Symbol, Stock Exchange
 *  Financial Data:    Revenue (USD-normalized), Assets, Liabilities, Net Income,
 *                     Fiscal Year End
 *  Corporate Hierarchy: Ultimate Parent, Subsidiary Company, Entity Type,
 *                       Hierarchy Level, Country, Relationship Type, Performance Expectation
 */
export const workflowSources: WorkflowSource[] = [
  {
    id: "company_data",
    label: "Company Data Extraction",
    sourceName: "Company Website",
    attributes: [
      // Basic Data — owned by company website
      "Legal Name", "Trade Name", "Country", "Address", "City", "State",
      "Postal Code", "Website", "Email", "Phone", "Fax",
      "Foundation Year", "Number of Employees", "Business Description",
      "Social Media Profiles",
    ],
    buildUrl: (company) => buildCompanyWebsite(company),
  },
  {
    id: "sec_data",
    label: "SEC Data",
    sourceName: "SEC EDGAR",
    attributes: [
      // Financial Data — owned by SEC filings
      "Revenue (USD-normalized)", "Assets", "Liabilities", "Net Income",
      "Fiscal Year End",
      // SEC also exposes ticker / NAICS-SIC
      "NAICS/SIC Codes", "Ticker Symbol",
    ],
    buildUrl: (company) => {
      const host = extractHost(company);
      const queryName = host ? host.split(".")[0] : company;
      return `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&company=${encodeURIComponent(queryName)}&type=&dateb=&owner=include&count=40`;
    },
  },
  {
    id: "stock_exchange",
    label: "Stock Exchange Data",
    sourceName: "Nasdaq",
    attributes: [
      // Market identity
      "Ticker Symbol", "Stock Exchange", "Status",
    ],
    buildUrl: (company) => {
      // Nasdaq stock pages need a ticker symbol we don't reliably have;
      // fall back to the search page with the cleaned company name.
      const host = extractHost(company);
      const queryName = host ? host.split(".")[0] : company;
      return `https://www.nasdaq.com/search?q=${encodeURIComponent(queryName)}`;
    },
  },
  {
    id: "registry_data",
    label: "Annual Report Data Extraction",
    sourceName: "Annual Report (Govt Filing)",
    attributes: [
      // Basic Data (registration-side, disclosed in annual report cover pages)
      "Registration ID(s)", "Organizational Type",
      // Corporate Hierarchy (disclosed in annual report subsidiary listings)
      "Ultimate Parent", "Subsidiary Company", "Entity Type",
      "Hierarchy Level", "Relationship Type", "Performance Expectation",
    ],
    buildUrl: (company) => {
      // Annual reports are typically published on the company's investor relations
      // page or as government filings. We surface a stable mock URL so the LHS
      // resolver can match the "annual report" source and render the PDF snapshot.
      const host = extractHost(company);
      const queryName = host ? host.split(".")[0] : company;
      return `https://www.annualreports.com/HostedData/AnnualReports/PDF/${encodeURIComponent(queryName)}-annual-report.pdf`;
    },
  },
];

export const findWorkflowByLabel = (label: string): WorkflowSource | undefined =>
  workflowSources.find((w) => w.label.trim().toLowerCase() === label.trim().toLowerCase());

export const findWorkflowById = (id: string): WorkflowSource | undefined =>
  workflowSources.find((w) => w.id === id);

/**
 * Given an attribute name and the set of workflows that ran for the job,
 * return the source refs (name + URL) the user can click in the HITL review.
 */
export function buildSourceRefsForAttribute(
  attributeName: string,
  selectedWorkflowIds: string[],
  companyName: string,
): { name: string; url: string }[] {
  const refs: { name: string; url: string }[] = [];
  for (const id of selectedWorkflowIds) {
    const wf = findWorkflowById(id);
    if (!wf) continue;
    if (wf.attributes.includes(attributeName)) {
      refs.push({ name: wf.sourceName, url: wf.buildUrl(companyName) });
    }
  }
  return refs;
}

/** Resolve a list of workflow labels (from job.tier) to workflow source IDs. */
export function resolveWorkflowIdsFromLabels(labels: string[]): WorkflowSourceId[] {
  const ids: WorkflowSourceId[] = [];
  for (const label of labels) {
    const wf = findWorkflowByLabel(label);
    if (wf) ids.push(wf.id);
  }
  return ids;
}

/**
 * Aggregate the unique attribute list (in deterministic order) for a set
 * of selected workflow IDs.
 */
export function attributesForWorkflows(selectedIds: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of selectedIds) {
    const wf = findWorkflowById(id);
    if (!wf) continue;
    for (const attr of wf.attributes) {
      if (!seen.has(attr)) {
        seen.add(attr);
        out.push(attr);
      }
    }
  }
  return out;
}
