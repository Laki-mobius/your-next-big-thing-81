export interface WorkflowDetails {
  benchmark: string;
  shortDescription: string;
  input: string;
  outputFormat: string;
  dataAttributes: string[];
  workflow?: string;
}

const norm = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const RAW: Record<string, WorkflowDetails> = {
  "Annual Report Key Data Extraction": {
    benchmark: "Coverage: 80%, Accuracy: 90%, Runtime (per record): Avg. 20 sec",
    shortDescription: "Extract key company and financial information from annual reports.",
    input: "Annual Report (PDF/HTML)",
    outputFormat: "JSON, CSV",
    dataAttributes: [
      "Company Name (text)", "Fiscal Year (num)", "Revenue (currency)",
      "Gross Profit (currency)", "Operating Income (currency)", "EBITDA (currency)",
      "Net Income (currency)", "Earnings Per Share (currency)", "Dividends Per Share (currency)",
      "Operating Cash Flow (currency)", "Capital Expenditure (currency)", "Total Assets (currency)",
      "Total Liabilities (currency)", "Total Equity (currency)", "Report Currency (text)",
      "Employee Count (num)", "Auditor Name (text)", "CEO Name (text)", "CFO Name (text)",
      "Headquarters Country (text)", "Stock Exchange (text)", "Ticker Symbol (text)",
    ],
  },
  "Company Data Enrichment": {
    benchmark: "Coverage: 85%, Accuracy: 90%, Runtime (per record): Avg. 15 sec",
    shortDescription: "Enrich company profiles using publicly available website information.",
    input: "Company Website",
    outputFormat: "JSON, CSV",
    dataAttributes: [
      "Company Name (text)", "Website (url)", "Street Address (text)", "City (text)",
      "State (text)", "Zipcode (text)", "Phone Number (text - multi value)",
      "Email (text - multi value)", "Started Year (num)",
      "Executive Name (text - multi value)", "Executive Title (text - multi value)",
      "No. of Employees (num)", "Company Description (long text)",
      "SIC Code (num)", "SIC Description (text)",
      "Facebook url (url)", "Twitter/X url (url)", "LinkedIn url (url)",
      "Instagram url (url)", "YouTube url (url)",
    ],
  },
  "Image and Unstructured IDP": {
    benchmark: "Coverage: 75%, Accuracy: 85%, Runtime (per record): Avg. 10 sec",
    shortDescription: "Extract text and key fields from images and unstructured documents.",
    input: "Image, PDF, Scanned Document",
    outputFormat: "JSON, CSV",
    dataAttributes: [
      "Document Title (text)", "Document Type (text)", "Extracted Text (long text)",
      "Person Name (text - multi value)", "Organization Name (text - multi value)",
      "Date (date)", "Address (text - multi value)",
    ],
  },
  "Invoice Data Extraction": {
    benchmark: "Coverage: 90%, Accuracy: 95%, Runtime (per record): Avg. 5 sec",
    shortDescription: "Extract invoice header and line-item details.",
    input: "Invoice PDF/Image",
    outputFormat: "JSON, CSV",
    dataAttributes: [
      "Invoice Number (text)", "Invoice Date (date)", "Vendor Name (text)",
      "Customer Name (text)", "Currency (text)", "Tax Amount (currency)",
      "Total Amount (currency)",
    ],
  },
  "Sourcing Annual Reports": {
    benchmark: "Coverage: 85%, Accuracy: 95%, Runtime (per record): Avg. 15 sec",
    shortDescription: "Identify and source latest annual reports from company websites.",
    input: "Company Name, Website",
    outputFormat: "JSON, CSV",
    dataAttributes: [
      "Company Name (text)", "Annual Report url (url)", "Report Year (num)", "Source url (url)",
    ],
  },
  "UK Company Data Extraction": {
    benchmark: "Coverage: 85%, Accuracy: 90%, Runtime (per record): Avg. 15 sec",
    shortDescription: "Extract company profile information from public UK sources.",
    input: "Company Name, Website",
    outputFormat: "JSON, CSV",
    dataAttributes: [
      "Company Name (text)", "Website (url)", "Street Address (text)", "City (text)",
      "State (text)", "Zipcode (text)", "Phone Number (text - multi value)",
      "Email (text - multi value)", "Started Year (num)",
      "Executive Name (text - multi value)", "Executive Title (text - multi value)",
      "No. of Employees (num)", "Company Description (long text)",
      "SIC Code (num)", "SIC Description (text)",
      "Facebook url (url)", "Twitter/X url (url)", "LinkedIn url (url)",
      "Instagram url (url)", "YouTube url (url)",
    ],
  },
  "UK Company Registry Data Extraction": {
    benchmark: "Coverage: 90%, Accuracy: 95%, Runtime (per record): Avg. 10 sec",
    shortDescription: "Extract company registry information from UK filings.",
    input: "Company Number, Registry URL",
    outputFormat: "JSON, CSV",
    dataAttributes: [
      "Company Name (text)", "Company Number (text)", "Company Status (text)",
      "Incorporation Date (date)", "Registered Office Address (text)",
      "Director Name (text - multi value)",
    ],
  },
  "US Company Data Extraction": {
    benchmark: "Coverage: 85%, Accuracy: 90%, Runtime (per record): Avg. 15 sec",
    shortDescription: "Extract company profile information from public US sources.",
    input: "Company Name, Website",
    outputFormat: "JSON, CSV",
    dataAttributes: [
      "Company Name (text)", "Website (url)", "Street Address (text)", "City (text)",
      "State (text)", "Zipcode (text)", "Phone Number (text - multi value)",
      "Email (text - multi value)", "Started Year (num)",
      "Executive Name (text - multi value)", "Executive Title (text - multi value)",
      "No. of Employees (num)", "Company Description (long text)",
      "SIC Code (num)", "SIC Description (text)",
      "Facebook url (url)", "Twitter/X url (url)", "LinkedIn url (url)",
      "Instagram url (url)", "YouTube url (url)",
    ],
  },
  "NAR1 Form FD Extraction": {
    benchmark: "Coverage: 85%, Accuracy: 90%, Runtime (per record): Avg. 10 sec",
    shortDescription: "Extract key filing details from NAR1 forms.",
    input: "NAR1 Form PDF",
    outputFormat: "JSON, CSV",
    dataAttributes: [
      "Company Name (text)", "Registration Number (text)", "Filing Date (date)",
      "Director Name (text - multi value)", "Registered Address (text)",
    ],
  },
  "ESG Data Extraction": {
    benchmark: "Coverage: 75%, Accuracy: 85%, Runtime (per record): Avg. 20 sec",
    shortDescription: "Extract ESG-related metrics and disclosures from reports.",
    input: "ESG Report, Annual Report",
    outputFormat: "JSON, CSV",
    dataAttributes: [],
  },
  "Website Validation and Addition": {
    benchmark: "Coverage: 90%, Accuracy: 95%, Runtime (per record): Avg. 10 sec",
    shortDescription: "Validate existing company websites and identify missing websites.",
    input: "Company Name, Address",
    outputFormat: "JSON, CSV",
    dataAttributes: [
      "Company Name (text)", "Website url (url)", "Validation Status (text)",
      "Confidence Score (percentage)",
    ],
  },
  "LIEN Document Processing": {
    benchmark: "Coverage: 80%, Accuracy: 90%, Runtime (per record): Avg. 10 sec",
    shortDescription: "Extract structured information from lien documents.",
    input: "Lien Document PDF/Image",
    outputFormat: "JSON, CSV",
    dataAttributes: [
      "Debtor Name (text)", "Creditor Name (text)", "Document Number (text)",
      "Filing Date (date)", "Amount (currency)",
    ],
  },
  "KYC Verification": {
    benchmark: "Coverage: 85%, Accuracy: 90%, Runtime (per record): Avg. 15 sec",
    shortDescription: "Extract and verify customer identification details.",
    input: "ID Proof, Utility Bill, KYC Documents",
    outputFormat: "JSON, CSV",
    dataAttributes: [
      "Full Name (text)", "Date of Birth (date)", "Address (text)",
      "ID Number (text)", "Document Type (text)",
    ],
  },
  "Insurance Document Extraction": {
    benchmark: "Coverage: 85%, Accuracy: 90%, Runtime (per record): Avg. 10 sec",
    shortDescription: "Extract key policy and claim information from insurance documents.",
    input: "Insurance Policy, Claim Form",
    outputFormat: "JSON, CSV",
    dataAttributes: [
      "Policy Number (text)", "Insured Name (text)", "Effective Date (date)",
      "Expiry Date (date)", "Claim Number (text)",
    ],
  },
  "Court Case Data Extraction": {
    benchmark: "Coverage: 80%, Accuracy: 85%, Runtime (per record): Avg. 15 sec",
    shortDescription: "Extract case-related information from court records and judgments.",
    input: "Court Document PDF/HTML",
    outputFormat: "JSON, CSV",
    dataAttributes: [
      "Case Number (text)", "Court Name (text)", "Filing Date (date)",
      "Plaintiff Name (text)", "Defendant Name (text)", "Case Status (text)",
    ],
  },
};

// Aliases — map alternative names found in source-catalog to canonical entries.
const ALIASES: Record<string, string> = {
  "annual report key financial data": "Annual Report Key Data Extraction",
  "sourcing annual report": "Sourcing Annual Reports",
  "uk company register data extraction": "UK Company Registry Data Extraction",
};

const INDEX = new Map<string, WorkflowDetails>();
Object.entries(RAW).forEach(([k, v]) => INDEX.set(norm(k), v));
Object.entries(ALIASES).forEach(([alias, canonical]) => {
  const d = RAW[canonical];
  if (d) INDEX.set(norm(alias), d);
});

export function getWorkflowDetails(name: string): WorkflowDetails | undefined {
  return INDEX.get(norm(name));
}
