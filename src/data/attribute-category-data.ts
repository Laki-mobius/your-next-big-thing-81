export interface AttributeCategory {
  id: string;
  name: string;
  subAttributes: string;
  totalChanges: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  totalSources: number;
  detected: string;
  group: string;
}

export const attributeCategoryGroups = [
  "COMPANY INFORMATION",
  "COMPANY CONTACT DATA",
  "COMPANY FINANCIAL DATA",
  "COMPANY BUSINESS DESCRIPTION DATA",
  "TRADITIONAL SUPPLEMENTAL ADD-ONS",
  "OTHER SUPPLEMENTAL ADD-ONS",
];

export const attributeCategories: AttributeCategory[] = [
  // COMPANY INFORMATION
  { id: "ac-1", name: "Root Identification", subAttributes: "Enterprise Number · Company Type · Reportage Level", totalChanges: 342, severity: "CRITICAL", totalSources: 4, detected: "2m ago", group: "COMPANY INFORMATION" },
  { id: "ac-2", name: "Full Company Name", subAttributes: "Former Name · Former Name Creation Date · Bankruptcy/DBAs", totalChanges: 187, severity: "HIGH", totalSources: 3, detected: "5m ago", group: "COMPANY INFORMATION" },
  { id: "ac-3", name: "Parent / Ultimate Parent", subAttributes: "Ultimate Parent Co ID · Parent Co ID · Parent Name · Enterprise Numbers", totalChanges: 89, severity: "HIGH", totalSources: 2, detected: "8m ago", group: "COMPANY INFORMATION" },
  // COMPANY CONTACT DATA
  { id: "ac-4", name: "Physical / Mailing Address", subAttributes: "Street Address · CBSA Code · CBSA Description · State/Place of Incorporation", totalChanges: 203, severity: "MEDIUM", totalSources: 5, detected: "3m ago", group: "COMPANY CONTACT DATA" },
  { id: "ac-5", name: "Phone / Email / Web", subAttributes: "Telephone · Fax · Toll Free · Email · Website URL", totalChanges: 64, severity: "LOW", totalSources: 3, detected: "12m ago", group: "COMPANY CONTACT DATA" },
  { id: "ac-6", name: "Social Media URLs", subAttributes: "Facebook · LinkedIn · Twitter · YouTube · Pinterest · Google+", totalChanges: 31, severity: "LOW", totalSources: 2, detected: "18m ago", group: "COMPANY CONTACT DATA" },
  // COMPANY FINANCIAL DATA
  { id: "ac-7", name: "Revenue / Earnings / Net Income", subAttributes: "Revenue Type · Sales · Net Income · Assets · Liabilities · Net Worth · Sales Range", totalChanges: 412, severity: "CRITICAL", totalSources: 6, detected: "1m ago", group: "COMPANY FINANCIAL DATA" },
  { id: "ac-8", name: "Fiscal Year / Financial Statements", subAttributes: "Full Fiscal Year End · Partial Fiscal Year End · Latest Financial Statement", totalChanges: 156, severity: "HIGH", totalSources: 4, detected: "4m ago", group: "COMPANY FINANCIAL DATA" },
  { id: "ac-9", name: "Stock / Securities", subAttributes: "Ticker Symbol · Exchange Abbreviation · Exchange Full Name · CUSIP Number", totalChanges: 78, severity: "MEDIUM", totalSources: 3, detected: "6m ago", group: "COMPANY FINANCIAL DATA" },
  { id: "ac-10", name: "Pension Information", subAttributes: "Pension Ending Date · Employees with Full Benefits · Pension Assets", totalChanges: 22, severity: "LOW", totalSources: 2, detected: "25m ago", group: "COMPANY FINANCIAL DATA" },
  // COMPANY BUSINESS DESCRIPTION DATA
  { id: "ac-11", name: "SIC / NAICS Codes", subAttributes: "Primary & Secondary SIC · Primary & Secondary NAICS · Descriptions", totalChanges: 94, severity: "MEDIUM", totalSources: 3, detected: "10m ago", group: "COMPANY BUSINESS DESCRIPTION DATA" },
  { id: "ac-12", name: "Business Description / Import-Export", subAttributes: "Standard Description · Extended Description · Import/Export Status", totalChanges: 47, severity: "LOW", totalSources: 2, detected: "14m ago", group: "COMPANY BUSINESS DESCRIPTION DATA" },
  // TRADITIONAL SUPPLEMENTAL ADD-ONS
  { id: "ac-13", name: "Board of Directors / Personnel", subAttributes: "Directors · Executive Email · Title · Board Activity · Social Media", totalChanges: 284, severity: "CRITICAL", totalSources: 5, detected: "1m ago", group: "TRADITIONAL SUPPLEMENTAL ADD-ONS" },
  { id: "ac-14", name: "Competitors / OSF / Trade Names", subAttributes: "Company Competitors · Auditors · Transfer Agents · Registrars · Brands", totalChanges: 53, severity: "MEDIUM", totalSources: 3, detected: "20m ago", group: "TRADITIONAL SUPPLEMENTAL ADD-ONS" },
  // OTHER SUPPLEMENTAL ADD-ONS
  { id: "ac-15", name: "M&A / Kill Reports / Shareholders", subAttributes: "Merger & Acquisition Reports · Ceased Operations · Shareholder Meetings · Minority Ownership", totalChanges: 118, severity: "HIGH", totalSources: 4, detected: "3m ago", group: "OTHER SUPPLEMENTAL ADD-ONS" },
  { id: "ac-16", name: "Directors' Biographical Data", subAttributes: "Associations · Awards · Certifications · Education · Former Career", totalChanges: 67, severity: "MEDIUM", totalSources: 3, detected: "9m ago", group: "OTHER SUPPLEMENTAL ADD-ONS" },
  { id: "ac-17", name: "FEIN / Top Business Lists / Social Media", subAttributes: "Federal Tax ID · Fortune 1000 · Forbes Global 2000 · Inc 5000 · Company Social URLs", totalChanges: 41, severity: "LOW", totalSources: 2, detected: "22m ago", group: "OTHER SUPPLEMENTAL ADD-ONS" },
];
