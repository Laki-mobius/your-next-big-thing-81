export interface ValidationAttribute {
  name: string;
  extractedValue: string;
  currentValue: string;
  status: "validated" | "pending" | "flagged" | "edited";
  qcFlag: boolean;
  sourceRefs: { name: string; url: string }[];
}

export interface SourceData {
  url: string;
  type: "Website" | "PDF" | "API" | "Database";
  snippet: string;
  highlightedText: string;
}

export interface ValidationRecord {
  id: string;
  companyName: string;
  attributeType: string;
  status: "pending" | "in_review" | "approved" | "rejected";
  completionPct: number;
  confidenceScore: number;
  sourceList: string[];
  lastUpdated: string;
  existingValue: string;
  suggestedValue: string;
  attributes: ValidationAttribute[];
  sources: SourceData[];
}

export interface AuditAction {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  recordRef: string;
}

export const auditTrail: AuditAction[] = [
  { id: "A1", user: "Sarah Chen", action: "Record Approved", timestamp: "2026-03-31 14:45", recordRef: "REC-10041" },
  { id: "A2", user: "James Miller", action: "Attribute Edited", timestamp: "2026-03-31 14:30", recordRef: "REC-10044" },
  { id: "A3", user: "Sarah Chen", action: "QC Flag Raised", timestamp: "2026-03-31 14:12", recordRef: "REC-10048" },
  { id: "A4", user: "Priya Sharma", action: "Record Rejected", timestamp: "2026-03-31 13:58", recordRef: "REC-10044" },
  { id: "A5", user: "James Miller", action: "Record Approved", timestamp: "2026-03-31 13:40", recordRef: "REC-10043" },
  { id: "A6", user: "Sarah Chen", action: "Attribute Edited", timestamp: "2026-03-31 13:15", recordRef: "REC-10046" },
  { id: "A7", user: "Priya Sharma", action: "Record Approved", timestamp: "2026-03-31 12:50", recordRef: "REC-10042" },
];

export const sampleRecords: ValidationRecord[] = [
  {
    id: "REC-10041",
    companyName: "Acme Corp",
    attributeType: "Financial",
    status: "in_review",
    completionPct: 72,
    confidenceScore: 87,
    sourceList: ["SEC EDGAR", "Bloomberg", "Web Crawl"],
    lastUpdated: "2026-03-31 14:22",
    existingValue: "$4.0B",
    suggestedValue: "$4.2B",
    attributes: [
      // Basic Data
      { name: "Company Name", extractedValue: "Acme Corp", currentValue: "Acme Corp", status: "validated", qcFlag: false, sourceRefs: [{ name: "SEC EDGAR", url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=ACME" }, { name: "Bloomberg", url: "https://bloomberg.com/profile/acme" }] },
      { name: "Legal Name", extractedValue: "Acme Corporation Inc.", currentValue: "Acme Corporation Inc.", status: "validated", qcFlag: false, sourceRefs: [{ name: "SEC EDGAR", url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=ACME" }] },
      { name: "Website URL", extractedValue: "https://acmecorp.com", currentValue: "https://acmecorp.com", status: "validated", qcFlag: false, sourceRefs: [{ name: "Web Crawl", url: "https://acmecorp.com" }] },
      { name: "Industry / Sector", extractedValue: "Technology", currentValue: "Technology", status: "pending", qcFlag: false, sourceRefs: [{ name: "Bloomberg", url: "https://bloomberg.com/profile/acme" }, { name: "Reuters", url: "https://reuters.com/companies/acme" }] },
      { name: "Address", extractedValue: "100 Market St", currentValue: "100 Market St", status: "validated", qcFlag: false, sourceRefs: [{ name: "SEC EDGAR", url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=ACME" }] },
      { name: "City", extractedValue: "San Francisco", currentValue: "San Francisco", status: "validated", qcFlag: false, sourceRefs: [{ name: "Company Website", url: "https://acmecorp.com/about" }] },
      { name: "State", extractedValue: "CA", currentValue: "CA", status: "validated", qcFlag: false, sourceRefs: [{ name: "Company Website", url: "https://acmecorp.com/about" }] },
      { name: "Country", extractedValue: "United States", currentValue: "United States", status: "validated", qcFlag: false, sourceRefs: [{ name: "SEC EDGAR", url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=ACME" }] },
      { name: "Phone Number", extractedValue: "+1 (415) 555-0100", currentValue: "+1 (415) 555-0100", status: "pending", qcFlag: false, sourceRefs: [{ name: "Web Crawl", url: "https://acmecorp.com/contact" }] },
      { name: "Email ID", extractedValue: "info@acmecorp.com", currentValue: "info@acmecorp.com", status: "pending", qcFlag: false, sourceRefs: [{ name: "Web Crawl", url: "https://acmecorp.com/contact" }] },
      { name: "Registration Number", extractedValue: "C1234567", currentValue: "C1234567", status: "validated", qcFlag: false, sourceRefs: [{ name: "SEC EDGAR", url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=ACME" }] },
      { name: "Entity Type", extractedValue: "Public Corporation", currentValue: "Public Corporation", status: "validated", qcFlag: false, sourceRefs: [{ name: "SEC EDGAR", url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=ACME" }] },
      { name: "Ticker Symbol", extractedValue: "ACM", currentValue: "ACM", status: "validated", qcFlag: false, sourceRefs: [{ name: "Bloomberg", url: "https://bloomberg.com/profile/acme" }] },
      { name: "Exchange Name", extractedValue: "NYSE", currentValue: "NYSE", status: "validated", qcFlag: false, sourceRefs: [{ name: "Bloomberg", url: "https://bloomberg.com/profile/acme" }] },
      { name: "CIK", extractedValue: "0001234567", currentValue: "0001234567", status: "validated", qcFlag: false, sourceRefs: [{ name: "SEC EDGAR", url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=ACME" }] },
      { name: "SIC Code", extractedValue: "7372", currentValue: "7372", status: "pending", qcFlag: false, sourceRefs: [{ name: "SEC EDGAR", url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=ACME" }] },
      { name: "CEO / Founder", extractedValue: "John Smith", currentValue: "John Smith", status: "pending", qcFlag: false, sourceRefs: [{ name: "Bloomberg", url: "https://bloomberg.com/profile/acme" }, { name: "LinkedIn", url: "https://linkedin.com/company/acme" }] },
      { name: "LinkedIn URL", extractedValue: "https://linkedin.com/company/acme", currentValue: "https://linkedin.com/company/acme", status: "pending", qcFlag: false, sourceRefs: [{ name: "Web Crawl", url: "https://linkedin.com/company/acme" }] },
      { name: "Company Status", extractedValue: "Active", currentValue: "Active", status: "validated", qcFlag: false, sourceRefs: [{ name: "SEC EDGAR", url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=ACME" }] },
      // Financial Data
      { name: "Revenue", extractedValue: "$4.2B", currentValue: "$4.2B", status: "flagged", qcFlag: true, sourceRefs: [{ name: "SEC EDGAR 10-K", url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=ACME" }, { name: "FactSet", url: "https://factset.com/company/acme" }] },
      { name: "Net Income", extractedValue: "$890M", currentValue: "$890M", status: "pending", qcFlag: false, sourceRefs: [{ name: "SEC EDGAR 10-K", url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=ACME" }] },
      { name: "EBITDA", extractedValue: "$1.4B", currentValue: "$1.4B", status: "pending", qcFlag: false, sourceRefs: [{ name: "FactSet", url: "https://factset.com/company/acme" }] },
      { name: "Total Assets", extractedValue: "$12.8B", currentValue: "$12.8B", status: "pending", qcFlag: false, sourceRefs: [{ name: "SEC EDGAR 10-K", url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=ACME" }] },
      { name: "Liabilities", extractedValue: "$7.1B", currentValue: "$7.1B", status: "pending", qcFlag: false, sourceRefs: [{ name: "SEC EDGAR 10-K", url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=ACME" }] },
      { name: "Market Capitalization", extractedValue: "$18.5B", currentValue: "$18.5B", status: "validated", qcFlag: false, sourceRefs: [{ name: "Bloomberg", url: "https://bloomberg.com/profile/acme" }] },
      { name: "Stock Price (Current)", extractedValue: "$142.50", currentValue: "$142.50", status: "pending", qcFlag: false, sourceRefs: [{ name: "Bloomberg", url: "https://bloomberg.com/profile/acme" }] },
      { name: "Shares Outstanding", extractedValue: "129.8M", currentValue: "129.8M", status: "pending", qcFlag: false, sourceRefs: [{ name: "SEC EDGAR 10-K", url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=ACME" }] },
      // Corporate Hierarchy
      { name: "Ultimate Parent", extractedValue: "Acme Holdings plc", currentValue: "Acme Holdings plc", status: "pending", qcFlag: false, sourceRefs: [{ name: "D&B", url: "https://dnb.com/company/acme" }, { name: "Orbis", url: "https://orbis.bvdinfo.com/acme" }] },
      { name: "Parent Name", extractedValue: "Acme Group Inc", currentValue: "Acme Group Inc", status: "pending", qcFlag: false, sourceRefs: [{ name: "D&B", url: "https://dnb.com/company/acme" }] },
      { name: "Subsidiary Name", extractedValue: "Acme Solutions LLC", currentValue: "Acme Solutions LLC", status: "pending", qcFlag: false, sourceRefs: [{ name: "SEC EDGAR", url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=ACME" }] },
      { name: "Hierarchy Level", extractedValue: "2", currentValue: "2", status: "pending", qcFlag: false, sourceRefs: [{ name: "D&B", url: "https://dnb.com/company/acme" }] },
      { name: "Coverage", extractedValue: "Global", currentValue: "Global", status: "pending", qcFlag: false, sourceRefs: [{ name: "Orbis", url: "https://orbis.bvdinfo.com/acme" }] },
    ],
    sources: [
      { url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=ACME", type: "API", snippet: "Acme Corp (CIK: 0001234567) filed its annual report 10-K reporting total revenue of $4.2 billion for fiscal year 2025…", highlightedText: "total revenue of $4.2 billion" },
      { url: "https://acmecorp.com/about", type: "Website", snippet: "Founded in 1998, Acme Corp is headquartered in San Francisco, California. With over 12,000 employees worldwide…", highlightedText: "headquartered in San Francisco, California" },
    ],
  },
  {
    id: "REC-10042",
    companyName: "GlobalTech Inc",
    attributeType: "Contact",
    status: "pending",
    completionPct: 0,
    confidenceScore: 72,
    sourceList: ["NYSE", "Reuters", "Web Crawl"],
    lastUpdated: "2026-03-31 09:15",
    existingValue: "New York, NY",
    suggestedValue: "New York City, NY",
    attributes: [
      // Basic Data
      { name: "Company Name", extractedValue: "GlobalTech Inc", currentValue: "GlobalTech Inc", status: "pending", qcFlag: false, sourceRefs: [{ name: "NYSE", url: "https://nyse.com/quote/GLBT" }, { name: "Reuters", url: "https://reuters.com/companies/glbt" }] },
      { name: "Legal Name", extractedValue: "GlobalTech International Inc.", currentValue: "GlobalTech International Inc.", status: "pending", qcFlag: false, sourceRefs: [{ name: "NYSE", url: "https://nyse.com/quote/GLBT" }] },
      { name: "Website URL", extractedValue: "https://globaltech.io", currentValue: "https://globaltech.io", status: "pending", qcFlag: false, sourceRefs: [{ name: "Web Crawl", url: "https://globaltech.io" }] },
      { name: "Industry / Sector", extractedValue: "Financial Services", currentValue: "Financial Services", status: "pending", qcFlag: false, sourceRefs: [{ name: "Reuters", url: "https://reuters.com/companies/glbt" }, { name: "Bloomberg", url: "https://bloomberg.com/profile/glbt" }] },
      { name: "Address", extractedValue: "200 Park Ave", currentValue: "200 Park Ave", status: "pending", qcFlag: false, sourceRefs: [{ name: "NYSE", url: "https://nyse.com/quote/GLBT" }] },
      { name: "City", extractedValue: "New York", currentValue: "New York", status: "pending", qcFlag: false, sourceRefs: [{ name: "Web Crawl", url: "https://globaltech.io/about" }] },
      { name: "State", extractedValue: "NY", currentValue: "NY", status: "pending", qcFlag: false, sourceRefs: [{ name: "Web Crawl", url: "https://globaltech.io/about" }] },
      { name: "Country", extractedValue: "United States", currentValue: "United States", status: "pending", qcFlag: false, sourceRefs: [{ name: "NYSE", url: "https://nyse.com/quote/GLBT" }] },
      { name: "Phone Number", extractedValue: "+1 (212) 555-0200", currentValue: "+1 (212) 555-0200", status: "pending", qcFlag: false, sourceRefs: [{ name: "Web Crawl", url: "https://globaltech.io/contact" }] },
      { name: "Ticker Symbol", extractedValue: "GLBT", currentValue: "GLBT", status: "pending", qcFlag: false, sourceRefs: [{ name: "NYSE", url: "https://nyse.com/quote/GLBT" }] },
      { name: "Exchange Name", extractedValue: "NYSE", currentValue: "NYSE", status: "pending", qcFlag: false, sourceRefs: [{ name: "NYSE", url: "https://nyse.com/quote/GLBT" }] },
      // Financial Data
      { name: "Revenue", extractedValue: "$890M", currentValue: "$890M", status: "pending", qcFlag: false, sourceRefs: [{ name: "SEC EDGAR 10-K", url: "https://www.sec.gov/cgi-bin/browse-edgar?CIK=GLBT" }, { name: "FactSet", url: "https://factset.com/company/globaltech" }] },
      { name: "Net Income", extractedValue: "$120M", currentValue: "$120M", status: "pending", qcFlag: false, sourceRefs: [{ name: "SEC EDGAR 10-K", url: "https://www.sec.gov/cgi-bin/browse-edgar?CIK=GLBT" }] },
      { name: "Total Assets", extractedValue: "$5.4B", currentValue: "$5.4B", status: "pending", qcFlag: false, sourceRefs: [{ name: "SEC EDGAR 10-K", url: "https://www.sec.gov/cgi-bin/browse-edgar?CIK=GLBT" }] },
      { name: "Liabilities", extractedValue: "$3.2B", currentValue: "$3.2B", status: "pending", qcFlag: false, sourceRefs: [{ name: "FactSet", url: "https://factset.com/company/globaltech" }] },
      { name: "Market Capitalization", extractedValue: "$6.8B", currentValue: "$6.8B", status: "pending", qcFlag: false, sourceRefs: [{ name: "Bloomberg", url: "https://bloomberg.com/profile/glbt" }] },
      { name: "Shares Outstanding", extractedValue: "45.2M", currentValue: "45.2M", status: "pending", qcFlag: false, sourceRefs: [{ name: "NYSE", url: "https://nyse.com/quote/GLBT" }] },
      // Corporate Hierarchy
      { name: "Ultimate Parent", extractedValue: "GlobalTech Holdings Ltd", currentValue: "GlobalTech Holdings Ltd", status: "pending", qcFlag: false, sourceRefs: [{ name: "D&B", url: "https://dnb.com/company/globaltech" }] },
      { name: "Parent Name", extractedValue: "GlobalTech Group Inc", currentValue: "GlobalTech Group Inc", status: "pending", qcFlag: false, sourceRefs: [{ name: "D&B", url: "https://dnb.com/company/globaltech" }] },
      { name: "Subsidiary Name", extractedValue: "GT Financial Services LLC", currentValue: "GT Financial Services LLC", status: "pending", qcFlag: false, sourceRefs: [{ name: "SEC EDGAR", url: "https://www.sec.gov/cgi-bin/browse-edgar?CIK=GLBT" }] },
      { name: "Hierarchy Level", extractedValue: "2", currentValue: "2", status: "pending", qcFlag: false, sourceRefs: [{ name: "D&B", url: "https://dnb.com/company/globaltech" }] },
      { name: "Coverage", extractedValue: "North America", currentValue: "North America", status: "pending", qcFlag: false, sourceRefs: [{ name: "D&B", url: "https://dnb.com/company/globaltech" }] },
    ],
    sources: [
      { url: "https://www.sec.gov/cgi-bin/browse-edgar?CIK=GLBT", type: "API", snippet: "GlobalTech Inc (CIK: 0009876543) annual report shows revenue of $890 million…", highlightedText: "revenue of $890 million" },
    ],
  },
  {
    id: "REC-10043",
    companyName: "Northern Resources Ltd",
    attributeType: "Corporate",
    status: "approved",
    completionPct: 100,
    confidenceScore: 95,
    sourceList: ["SEDAR+", "LinkedIn"],
    lastUpdated: "2026-03-30 16:40",
    existingValue: "CAD $1.0B",
    suggestedValue: "CAD $1.1B",
    attributes: [
      { name: "Company Name", extractedValue: "Northern Resources Ltd", currentValue: "Northern Resources Ltd", status: "validated", qcFlag: false, sourceRefs: [{ name: "SEDAR+", url: "https://sedarplus.ca/filings/northern-resources" }] },
      { name: "Legal Name", extractedValue: "Northern Resources Limited", currentValue: "Northern Resources Limited", status: "validated", qcFlag: false, sourceRefs: [{ name: "SEDAR+", url: "https://sedarplus.ca/filings/northern-resources" }] },
      { name: "Industry / Sector", extractedValue: "Mining & Resources", currentValue: "Mining & Resources", status: "validated", qcFlag: false, sourceRefs: [{ name: "SEDAR+", url: "https://sedarplus.ca/filings/northern-resources" }, { name: "Reuters", url: "https://reuters.com/companies/northern" }] },
      { name: "Country", extractedValue: "Canada", currentValue: "Canada", status: "validated", qcFlag: false, sourceRefs: [{ name: "SEDAR+", url: "https://sedarplus.ca/filings/northern-resources" }] },
      { name: "Revenue", extractedValue: "CAD $1.1B", currentValue: "CAD $1.1B", status: "validated", qcFlag: false, sourceRefs: [{ name: "SEDAR+ Filing", url: "https://sedarplus.ca/filings/northern-resources" }] },
      { name: "Net Income", extractedValue: "CAD $180M", currentValue: "CAD $180M", status: "validated", qcFlag: false, sourceRefs: [{ name: "SEDAR+ Filing", url: "https://sedarplus.ca/filings/northern-resources" }] },
      { name: "Total Assets", extractedValue: "CAD $6.2B", currentValue: "CAD $6.2B", status: "validated", qcFlag: false, sourceRefs: [{ name: "SEDAR+ Filing", url: "https://sedarplus.ca/filings/northern-resources" }] },
      { name: "Ultimate Parent", extractedValue: "Northern Holdings Corp", currentValue: "Northern Holdings Corp", status: "validated", qcFlag: false, sourceRefs: [{ name: "SEDAR+", url: "https://sedarplus.ca/filings/northern-resources" }] },
      { name: "Subsidiary Name", extractedValue: "Northern Mining Co", currentValue: "Northern Mining Co", status: "validated", qcFlag: false, sourceRefs: [{ name: "SEDAR+", url: "https://sedarplus.ca/filings/northern-resources" }] },
      { name: "Hierarchy Level", extractedValue: "1", currentValue: "1", status: "validated", qcFlag: false, sourceRefs: [{ name: "SEDAR+", url: "https://sedarplus.ca/filings/northern-resources" }] },
    ],
    sources: [
      { url: "https://sedarplus.ca/filings/northern-resources", type: "PDF", snippet: "Northern Resources Ltd — Annual Information Form 2025. Revenue: CAD $1.1 billion…", highlightedText: "Revenue: CAD $1.1 billion" },
    ],
  },
  {
    id: "REC-10044",
    companyName: "Pacific Holdings",
    attributeType: "Financial",
    status: "rejected",
    completionPct: 45,
    confidenceScore: 54,
    sourceList: ["FactSet", "D&B", "U.S. SOS"],
    lastUpdated: "2026-03-30 11:08",
    existingValue: "Pacific Holdings Inc",
    suggestedValue: "Pacific Holdings LLC",
    attributes: [
      { name: "Company Name", extractedValue: "Pacific Holdings LLC", currentValue: "Pacific Holdings LLC", status: "flagged", qcFlag: true, sourceRefs: [{ name: "U.S. SOS", url: "https://sos.ca.gov/business/pacific-holdings" }, { name: "D&B", url: "https://dnb.com/company/pacific-holdings" }] },
      { name: "Industry / Sector", extractedValue: "Real Estate", currentValue: "Real Estate", status: "pending", qcFlag: false, sourceRefs: [{ name: "D&B", url: "https://dnb.com/company/pacific-holdings" }, { name: "Bloomberg", url: "https://bloomberg.com/profile/pacific" }] },
      { name: "City", extractedValue: "Los Angeles", currentValue: "Los Angeles", status: "edited", qcFlag: false, sourceRefs: [{ name: "Company Website", url: "https://pacificholdings.com/about" }] },
      { name: "State", extractedValue: "CA", currentValue: "CA", status: "edited", qcFlag: false, sourceRefs: [{ name: "Company Website", url: "https://pacificholdings.com/about" }] },
      { name: "Country", extractedValue: "United States", currentValue: "United States", status: "pending", qcFlag: false, sourceRefs: [{ name: "D&B", url: "https://dnb.com/company/pacific-holdings" }] },
      { name: "Revenue", extractedValue: "$320M", currentValue: "$320M", status: "flagged", qcFlag: true, sourceRefs: [{ name: "FactSet", url: "https://factset.com/company/pacific-holdings" }, { name: "SEC EDGAR", url: "https://sec.gov/pacific-holdings" }] },
      { name: "Net Income", extractedValue: "$28M", currentValue: "$28M", status: "pending", qcFlag: false, sourceRefs: [{ name: "FactSet", url: "https://factset.com/company/pacific-holdings" }] },
      { name: "Total Assets", extractedValue: "$2.1B", currentValue: "$2.1B", status: "pending", qcFlag: false, sourceRefs: [{ name: "FactSet", url: "https://factset.com/company/pacific-holdings" }] },
      { name: "Ultimate Parent", extractedValue: "Pacific Group International", currentValue: "Pacific Group International", status: "flagged", qcFlag: true, sourceRefs: [{ name: "D&B", url: "https://dnb.com/company/pacific-holdings" }] },
      { name: "Subsidiary Name", extractedValue: "Pacific Realty Inc", currentValue: "Pacific Realty Inc", status: "pending", qcFlag: false, sourceRefs: [{ name: "U.S. SOS", url: "https://sos.ca.gov/business/pacific-holdings" }] },
    ],
    sources: [
      { url: "https://factset.com/company/pacific-holdings", type: "Database", snippet: "Pacific Holdings LLC | Revenue: $320M (est.) | Sector: Real Estate…", highlightedText: "Revenue: $320M" },
    ],
  },
  {
    id: "REC-10045",
    companyName: "Zenith Retail Group",
    attributeType: "Contact",
    status: "pending",
    completionPct: 0,
    confidenceScore: 68,
    sourceList: ["Companies House", "Orbis", "Web Crawl"],
    lastUpdated: "2026-03-31 08:00",
    existingValue: "Consumer Goods",
    suggestedValue: "Consumer Retail",
    attributes: [
      { name: "Company Name", extractedValue: "Zenith Retail Group", currentValue: "Zenith Retail Group", status: "pending", qcFlag: false, sourceRefs: [{ name: "Companies House", url: "https://beta.companieshouse.gov.uk/company/zenith-retail" }, { name: "Orbis", url: "https://orbis.bvdinfo.com/zenith" }] },
      { name: "Industry / Sector", extractedValue: "Consumer Retail", currentValue: "Consumer Retail", status: "pending", qcFlag: true, sourceRefs: [{ name: "Orbis", url: "https://orbis.bvdinfo.com/zenith" }, { name: "D&B", url: "https://dnb.com/company/zenith" }] },
      { name: "City", extractedValue: "London", currentValue: "London", status: "pending", qcFlag: false, sourceRefs: [{ name: "Company Website", url: "https://zenithretail.com/about" }] },
      { name: "Country", extractedValue: "United Kingdom", currentValue: "United Kingdom", status: "pending", qcFlag: false, sourceRefs: [{ name: "Companies House", url: "https://beta.companieshouse.gov.uk/company/zenith-retail" }] },
      { name: "Revenue", extractedValue: "£240M", currentValue: "£240M", status: "pending", qcFlag: false, sourceRefs: [{ name: "Companies House", url: "https://beta.companieshouse.gov.uk/company/zenith-retail" }] },
      { name: "Net Income", extractedValue: "£18M", currentValue: "£18M", status: "pending", qcFlag: false, sourceRefs: [{ name: "Companies House", url: "https://beta.companieshouse.gov.uk/company/zenith-retail" }] },
      { name: "Total Assets", extractedValue: "£890M", currentValue: "£890M", status: "pending", qcFlag: false, sourceRefs: [{ name: "Companies House", url: "https://beta.companieshouse.gov.uk/company/zenith-retail" }] },
      { name: "Ultimate Parent", extractedValue: "Zenith Group plc", currentValue: "Zenith Group plc", status: "pending", qcFlag: false, sourceRefs: [{ name: "Orbis", url: "https://orbis.bvdinfo.com/zenith" }] },
      { name: "Subsidiary Name", extractedValue: "Zenith Online Ltd", currentValue: "Zenith Online Ltd", status: "pending", qcFlag: false, sourceRefs: [{ name: "Companies House", url: "https://beta.companieshouse.gov.uk/company/zenith-retail" }] },
      { name: "Hierarchy Level", extractedValue: "1", currentValue: "1", status: "pending", qcFlag: false, sourceRefs: [{ name: "Orbis", url: "https://orbis.bvdinfo.com/zenith" }] },
    ],
    sources: [
      { url: "https://beta.companieshouse.gov.uk/company/zenith-retail", type: "API", snippet: "Zenith Retail Group PLC — Annual turnover: £240M…", highlightedText: "Annual turnover: £240M" },
    ],
  },
  {
    id: "REC-10046",
    companyName: "Maple Finance Co",
    attributeType: "Financial",
    status: "in_review",
    completionPct: 50,
    confidenceScore: 81,
    sourceList: ["FDIC", "FFIEC", "LinkedIn"],
    lastUpdated: "2026-03-31 13:55",
    existingValue: "$540M",
    suggestedValue: "$560M",
    attributes: [
      { name: "Company Name", extractedValue: "Maple Finance Co", currentValue: "Maple Finance Co", status: "validated", qcFlag: false, sourceRefs: [{ name: "FDIC", url: "https://fdic.gov/institution/maple-finance" }, { name: "FFIEC", url: "https://ffiec.gov/maple-finance" }] },
      { name: "Industry / Sector", extractedValue: "Banking", currentValue: "Banking", status: "validated", qcFlag: false, sourceRefs: [{ name: "FDIC", url: "https://fdic.gov/institution/maple-finance" }] },
      { name: "City", extractedValue: "Chicago", currentValue: "Chicago", status: "validated", qcFlag: false, sourceRefs: [{ name: "FDIC", url: "https://fdic.gov/institution/maple-finance" }] },
      { name: "State", extractedValue: "IL", currentValue: "IL", status: "validated", qcFlag: false, sourceRefs: [{ name: "FDIC", url: "https://fdic.gov/institution/maple-finance" }] },
      { name: "Country", extractedValue: "United States", currentValue: "United States", status: "validated", qcFlag: false, sourceRefs: [{ name: "FDIC", url: "https://fdic.gov/institution/maple-finance" }] },
      { name: "Revenue", extractedValue: "$560M", currentValue: "$560M", status: "pending", qcFlag: false, sourceRefs: [{ name: "FFIEC", url: "https://ffiec.gov/maple-finance" }, { name: "SEC EDGAR", url: "https://sec.gov/maple-finance" }] },
      { name: "Total Assets", extractedValue: "$8.2B", currentValue: "$8.2B", status: "validated", qcFlag: false, sourceRefs: [{ name: "FDIC", url: "https://fdic.gov/institution/maple-finance" }] },
      { name: "Liabilities", extractedValue: "$7.5B", currentValue: "$7.5B", status: "pending", qcFlag: false, sourceRefs: [{ name: "FFIEC", url: "https://ffiec.gov/maple-finance" }] },
      { name: "Net Income", extractedValue: "$45M", currentValue: "$45M", status: "pending", qcFlag: false, sourceRefs: [{ name: "SEC EDGAR", url: "https://sec.gov/maple-finance" }] },
      { name: "Ultimate Parent", extractedValue: "Maple Financial Group", currentValue: "Maple Financial Group", status: "validated", qcFlag: false, sourceRefs: [{ name: "FDIC", url: "https://fdic.gov/institution/maple-finance" }] },
      { name: "Subsidiary Name", extractedValue: "Maple Wealth Management", currentValue: "Maple Wealth Management", status: "pending", qcFlag: false, sourceRefs: [{ name: "FFIEC", url: "https://ffiec.gov/maple-finance" }] },
      { name: "Hierarchy Level", extractedValue: "2", currentValue: "2", status: "pending", qcFlag: false, sourceRefs: [{ name: "FDIC", url: "https://fdic.gov/institution/maple-finance" }] },
    ],
    sources: [
      { url: "https://fdic.gov/institution/maple-finance", type: "Database", snippet: "Maple Finance Co — FDIC Certificate #12345. Total Assets: $8.2B. HQ: Chicago, IL…", highlightedText: "HQ: Chicago, IL" },
    ],
  },
  {
    id: "REC-10047",
    companyName: "SilverLine Media",
    attributeType: "Corporate",
    status: "pending",
    completionPct: 0,
    confidenceScore: 63,
    sourceList: ["D&B", "Web Crawl"],
    lastUpdated: "2026-03-31 07:30",
    existingValue: "SilverLine Media Corp",
    suggestedValue: "SilverLine Media Inc",
    attributes: [
      { name: "Company Name", extractedValue: "SilverLine Media Inc", currentValue: "SilverLine Media Inc", status: "pending", qcFlag: false, sourceRefs: [{ name: "Web Crawl", url: "https://silverlinemedia.com/about" }, { name: "D&B", url: "https://dnb.com/company/silverline" }] },
      { name: "Industry / Sector", extractedValue: "Media & Entertainment", currentValue: "Media & Entertainment", status: "pending", qcFlag: false, sourceRefs: [{ name: "D&B", url: "https://dnb.com/company/silverline" }, { name: "Bloomberg", url: "https://bloomberg.com/profile/silverline" }] },
      { name: "City", extractedValue: "Austin", currentValue: "Austin", status: "pending", qcFlag: false, sourceRefs: [{ name: "Web Crawl", url: "https://silverlinemedia.com/about" }] },
      { name: "State", extractedValue: "TX", currentValue: "TX", status: "pending", qcFlag: false, sourceRefs: [{ name: "Web Crawl", url: "https://silverlinemedia.com/about" }] },
      { name: "Country", extractedValue: "United States", currentValue: "United States", status: "pending", qcFlag: false, sourceRefs: [{ name: "D&B", url: "https://dnb.com/company/silverline" }] },
      { name: "Revenue", extractedValue: "$78M", currentValue: "$78M", status: "pending", qcFlag: false, sourceRefs: [{ name: "D&B", url: "https://dnb.com/company/silverline" }] },
      { name: "Net Income", extractedValue: "$5.2M", currentValue: "$5.2M", status: "pending", qcFlag: false, sourceRefs: [{ name: "D&B", url: "https://dnb.com/company/silverline" }] },
      { name: "Total Assets", extractedValue: "$210M", currentValue: "$210M", status: "pending", qcFlag: false, sourceRefs: [{ name: "D&B", url: "https://dnb.com/company/silverline" }] },
      { name: "Parent Name", extractedValue: "SilverLine Holdings", currentValue: "SilverLine Holdings", status: "pending", qcFlag: false, sourceRefs: [{ name: "D&B", url: "https://dnb.com/company/silverline" }] },
      { name: "Hierarchy Level", extractedValue: "3", currentValue: "3", status: "pending", qcFlag: false, sourceRefs: [{ name: "D&B", url: "https://dnb.com/company/silverline" }] },
    ],
    sources: [
      { url: "https://silverlinemedia.com/about", type: "Website", snippet: "SilverLine Media Inc — digital-first media company headquartered in Austin, Texas…", highlightedText: "headquartered in Austin, Texas" },
    ],
  },
  {
    id: "REC-10048",
    companyName: "TechFlow Solutions",
    attributeType: "Financial",
    status: "in_review",
    completionPct: 30,
    confidenceScore: 76,
    sourceList: ["SEC EDGAR", "FactSet", "LinkedIn"],
    lastUpdated: "2026-03-31 12:10",
    existingValue: "$1.6B",
    suggestedValue: "$1.8B",
    attributes: [
      { name: "Company Name", extractedValue: "TechFlow Solutions", currentValue: "TechFlow Solutions", status: "validated", qcFlag: false, sourceRefs: [{ name: "SEC EDGAR", url: "https://www.sec.gov/cgi-bin/browse-edgar?CIK=TFLW" }, { name: "Bloomberg", url: "https://bloomberg.com/profile/techflow" }] },
      { name: "Industry / Sector", extractedValue: "Cloud Computing", currentValue: "Cloud Computing", status: "pending", qcFlag: false, sourceRefs: [{ name: "FactSet", url: "https://factset.com/company/techflow" }, { name: "Reuters", url: "https://reuters.com/companies/techflow" }] },
      { name: "Website URL", extractedValue: "https://techflow.io", currentValue: "https://techflow.io", status: "pending", qcFlag: false, sourceRefs: [{ name: "Web Crawl", url: "https://techflow.io" }] },
      { name: "Ticker Symbol", extractedValue: "TFLW", currentValue: "TFLW", status: "validated", qcFlag: false, sourceRefs: [{ name: "Bloomberg", url: "https://bloomberg.com/profile/techflow" }] },
      { name: "Exchange Name", extractedValue: "NASDAQ", currentValue: "NASDAQ", status: "validated", qcFlag: false, sourceRefs: [{ name: "Bloomberg", url: "https://bloomberg.com/profile/techflow" }] },
      { name: "Revenue", extractedValue: "$1.8B", currentValue: "$1.8B", status: "flagged", qcFlag: true, sourceRefs: [{ name: "SEC EDGAR 10-K", url: "https://www.sec.gov/cgi-bin/browse-edgar?CIK=TFLW" }, { name: "FactSet", url: "https://factset.com/company/techflow" }] },
      { name: "Net Income", extractedValue: "$220M", currentValue: "$220M", status: "pending", qcFlag: false, sourceRefs: [{ name: "SEC EDGAR 10-K", url: "https://www.sec.gov/cgi-bin/browse-edgar?CIK=TFLW" }] },
      { name: "EBITDA", extractedValue: "$480M", currentValue: "$480M", status: "pending", qcFlag: false, sourceRefs: [{ name: "FactSet", url: "https://factset.com/company/techflow" }] },
      { name: "Total Assets", extractedValue: "$5.6B", currentValue: "$5.6B", status: "pending", qcFlag: false, sourceRefs: [{ name: "SEC EDGAR 10-K", url: "https://www.sec.gov/cgi-bin/browse-edgar?CIK=TFLW" }] },
      { name: "Market Capitalization", extractedValue: "$12.4B", currentValue: "$12.4B", status: "pending", qcFlag: false, sourceRefs: [{ name: "Bloomberg", url: "https://bloomberg.com/profile/techflow" }] },
      { name: "Shares Outstanding", extractedValue: "88.5M", currentValue: "88.5M", status: "pending", qcFlag: false, sourceRefs: [{ name: "SEC EDGAR 10-K", url: "https://www.sec.gov/cgi-bin/browse-edgar?CIK=TFLW" }] },
      { name: "Ultimate Parent", extractedValue: "TechFlow Holdings Corp", currentValue: "TechFlow Holdings Corp", status: "pending", qcFlag: false, sourceRefs: [{ name: "D&B", url: "https://dnb.com/company/techflow" }] },
      { name: "Subsidiary Name", extractedValue: "TechFlow Cloud Services Inc", currentValue: "TechFlow Cloud Services Inc", status: "pending", qcFlag: false, sourceRefs: [{ name: "SEC EDGAR", url: "https://www.sec.gov/cgi-bin/browse-edgar?CIK=TFLW" }] },
      { name: "Hierarchy Level", extractedValue: "1", currentValue: "1", status: "pending", qcFlag: false, sourceRefs: [{ name: "D&B", url: "https://dnb.com/company/techflow" }] },
      { name: "Coverage", extractedValue: "Global", currentValue: "Global", status: "pending", qcFlag: false, sourceRefs: [{ name: "D&B", url: "https://dnb.com/company/techflow" }] },
    ],
    sources: [
      { url: "https://www.sec.gov/cgi-bin/browse-edgar?CIK=TFLW", type: "API", snippet: "TechFlow Solutions Inc — Latest 10-K filing. Revenue: $1.8 billion…", highlightedText: "Revenue: $1.8 billion" },
    ],
  },
];
