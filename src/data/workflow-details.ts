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
  "People Data Extraction": {
    benchmark: "Coverage: 80%, Accuracy: 90%, Runtime (per record): Avg. 12 sec",
    shortDescription: "Extract key personnel and executive information from public sources and company websites.",
    input: "Company Name, Website",
    outputFormat: "JSON, CSV",
    dataAttributes: [
      "Full Name (text)", "Job Title (text)", "Department (text)",
      "Email (text - multi value)", "Phone Number (text - multi value)",
      "LinkedIn URL (url)", "Start Date (date)", "Location (text)",
      "Reports To (text)", "Employment Type (text)", "Seniority Level (text)",
      "Skills (text - multi value)",
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
      "Date (date)", "Address (text - multi value)", "Email Address (text - multi value)",
      "Phone Number (text - multi value)", "URL (url - multi value)", "Reference Number (text - multi value)",
      "Currency Amount (currency - multi value)", "Language (text)", "Page Count (num)",
      "Confidence Score (percentage)", "Source File Name (text)",
    ],
  },
  "Invoice Data Extraction": {
    benchmark: "Coverage: 90%, Accuracy: 95%, Runtime (per record): Avg. 5 sec",
    shortDescription: "Extract invoice header and line-item details.",
    input: "Invoice PDF/Image",
    outputFormat: "JSON, CSV",
    dataAttributes: [
      "Invoice Number (text)", "Invoice Date (date)", "Due Date (date)",
      "PO Number (text)", "Vendor Name (text)", "Vendor Address (text)",
      "Vendor Tax ID (text)", "Customer Name (text)", "Customer Address (text)",
      "Currency (text)", "Subtotal Amount (currency)", "Discount Amount (currency)",
      "Tax Amount (currency)", "Tax Rate (percentage)", "Total Amount (currency)",
      "Payment Terms (text)", "Bank Account / IBAN (text)", "Line Items (text - multi value)",
      "Payment Status (text)",
    ],
  },
  "Sourcing Annual Reports": {
    benchmark: "Coverage: 85%, Accuracy: 95%, Runtime (per record): Avg. 15 sec",
    shortDescription: "Identify and source latest annual reports from company websites.",
    input: "Company Name, Website",
    outputFormat: "JSON, CSV",
    dataAttributes: [
      "Company Name (text)", "Company Website (url)", "Annual Report URL (url)",
      "IR Page URL (url)", "Source URL (url)", "Report Year (num)",
      "Publication Date (date)", "Report Language (text)", "Report Format (text)",
      "File Size (text)", "Validation Status (text)", "Confidence Score (percentage)",
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
    input: "Registry URL",
    outputFormat: "JSON, CSV",
    dataAttributes: [
      "Company Name (text)", "Company Number (text)", "Company Type (text)",
      "Company Status (text)", "Incorporation Date (date)", "Dissolved Date (date)",
      "Previous Company Name (text - multi value)", "Registered Office Address (text)",
      "Jurisdiction (text)", "SIC Code (text - multi value)", "Nature of Business (text)",
      "Director Name (text - multi value)", "Shareholder Name (text - multi value)",
      "PSC Name (text - multi value)", "Last Accounts Date (date)", "Next Accounts Due Date (date)",
      "Last Confirmation Statement Date (date)",
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
      "Company Name (text)", "Company Type (text)", "Country of Incorporation (text)",
      "Nature of Business (text)", "Registration Number (text)", "Filing Date (date)",
      "Financial Year End (date)", "Registered Address (text)", "Director Name (text - multi value)",
      "Secretary Name (text - multi value)", "Shareholder Name (text - multi value)",
      "Signatory Name (text)", "Share Capital (currency)", "Number of Shares (num)",
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
      "Company Name (text)", "Website URL (url)", "Domain Name (text)",
      "Domain Registration Date (date)", "Domain Expiry Date (date)", "SSL Certificate Status (text)",
      "Website Status (text)", "Company Email (text)", "Phone Number (text)",
      "Social Media URLs (url - multi value)", "Website Language (text)", "Country (text)",
      "Validation Status (text)", "Confidence Score (percentage)", "Validation Notes (text)",
    ],
  },
  "LIEN Document Processing": {
    benchmark: "Coverage: 80%, Accuracy: 90%, Runtime (per record): Avg. 10 sec",
    shortDescription: "Extract structured information from lien documents.",
    input: "Lien Document PDF/Image",
    outputFormat: "JSON, CSV",
    dataAttributes: [
      "Document Number (text)", "Lien Type (text)", "Lien Status (text)",
      "Debtor Name (text)", "Debtor Address (text)", "Creditor Name (text)",
      "Creditor Address (text)", "Filing Date (date)", "Expiry Date (date)",
      "Release Date (date)", "Amount (currency)", "Interest Rate (percentage)",
      "Property Description (text)", "Property Address (text)", "Jurisdiction (text)",
      "Recording Office (text)",
    ],
  },
  "KYC Verification": {
    benchmark: "Coverage: 85%, Accuracy: 90%, Runtime (per record): Avg. 15 sec",
    shortDescription: "Extract and verify customer identification details.",
    input: "ID Proof, Utility Bill, KYC Documents",
    outputFormat: "JSON, CSV",
    dataAttributes: [
      "Full Name (text)", "Date of Birth (date)", "Place of Birth (text)",
      "Gender (text)", "Nationality (text)", "Address (text)", "ID Number (text)",
      "Document Type (text)", "Issue Date (date)", "Expiry Date (date)",
      "Issuing Authority (text)", "Issuing Country (text)", "MRZ Code (text)",
      "Email Address (text)", "Phone Number (text)", "Tax ID / PAN (text)",
      "Verification Status (text)",
    ],
  },
  "Insurance Document Extraction": {
    benchmark: "Coverage: 85%, Accuracy: 90%, Runtime (per record): Avg. 10 sec",
    shortDescription: "Extract key policy and claim information from insurance documents.",
    input: "Insurance Policy, Claim Form",
    outputFormat: "JSON, CSV",
    dataAttributes: [
      "Policy Number (text)", "Policy Type (text)", "Insured Name (text)",
      "Insured DOB (date)", "Insured Address (text)", "Insurer Name (text)",
      "Agent Name (text)", "Beneficiary Name (text)", "Effective Date (date)",
      "Expiry Date (date)", "Premium Amount (currency)", "Coverage Amount (currency)",
      "Deductible Amount (currency)", "Claim Number (text)", "Claim Date (date)",
      "Claim Amount (currency)", "Claim Status (text)", "Vehicle / Property Description (text)",
    ],
  },
  "Court Case Data Extraction": {
    benchmark: "Coverage: 80%, Accuracy: 85%, Runtime (per record): Avg. 15 sec",
    shortDescription: "Extract case-related information from court records and judgments.",
    input: "Court Document PDF/HTML",
    outputFormat: "JSON, CSV",
    dataAttributes: [
      "Case Number", "Case Type", "Case Filed Date", "Case Status",
      "Date Range Number", "Defendant", "Plaintiff (text)", "Attorney for Defendant (text)",
      "Attorney for Plaintiff (text)", "Presiding Judge (text)", "Court Name (text)",
      "Jurisdiction (text)", "Count Number", "Offense Date", "Charge",
      "Statute Number", "Degree", "Hearing Date (date)", "Next Hearing Date (date)",
      "Disposition", "Disposition Date", "Verdict (text)", "Sentence (text)",
      "Fine Amount (currency)",
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

export function getAllWorkflowAttributeNames(): string[] {
  const set = new Set<string>();
  Object.values(RAW).forEach(wf => {
    wf.dataAttributes.forEach(attr => {
      const clean = attr.replace(/\s*\([^)]+\)\s*(?:-\s*multi\s+value)?\s*$/, "").trim();
      if (clean) set.add(clean);
    });
  });
  return Array.from(set);
}
