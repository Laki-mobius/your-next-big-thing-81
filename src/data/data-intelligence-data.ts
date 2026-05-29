// Data Intelligence module — populated from the 1,000-record POC dataset
// Source: LexisNexis_POC_05252026.xlsx + LexisNexis_POC_05252026 - Additional Personnel.xlsx
import {
  pocCompaniesRaw,
  pocPersonnelRaw,
  pocMetrics,
  pocExecSamples,
} from './poc-dataset';

export interface DataGroup {
  id: string;
  label: string;
  icon: string;
  description: string;
  filters: FilterDef[];
  columns: ColumnDef[];
  extraColumns: ColumnDef[];
  sampleRows: Record<string, string | number>[];
  totalRecords: number;
}

export interface FilterDef {
  key: string;
  label: string;
  options: string[];
}

export interface ColumnDef {
  key: string;
  label: string;
  align?: 'left' | 'right';
}

// ── Company Profile — exact columns as uploaded (company-level) ───────────
const companyProfileColumns: ColumnDef[] = [
  { key: 'S.no', label: 'S.no', align: 'right' },
  { key: 'Client_company_id', label: 'Client Company ID' },
  { key: 'Dca_id', label: 'DCA ID' },
  { key: 'Duns_id', label: 'DUNS ID' },
  { key: 'Company_name', label: 'Company Name' },
  { key: 'Country', label: 'Country' },
  { key: 'Match_status', label: 'Match Status' },
  { key: 'Company_website_url', label: 'Company Website URL' },
  { key: 'Company_website_source_url', label: 'Company Website Source URL' },
  { key: 'Company_website_capture_date', label: 'Company Website Capture Date' },
  { key: 'Revenue_value', label: 'Revenue Value', align: 'right' },
  { key: 'Revenue_currency', label: 'Revenue Currency' },
  { key: 'Revenue_fiscal_year', label: 'Revenue Fiscal Year' },
];

const companyProfileExtraColumns: ColumnDef[] = [
  { key: 'Revenue_source_url', label: 'Revenue Source URL' },
  { key: 'Revenue_capture_date', label: 'Revenue Capture Date' },
  { key: 'Revenue_as_of_date', label: 'Revenue As Of Date' },
  { key: 'Revenue_source_type', label: 'Revenue Source Type' },
  { key: 'Employee_count_value', label: 'Employee Count', align: 'right' },
  { key: 'Employee_count_source_url', label: 'Employee Count Source URL' },
  { key: 'Employee_count_capture_date', label: 'Employee Count Capture Date' },
  { key: 'Employee_source_type', label: 'Employee Source Type' },
  { key: 'Employee_count_as_of_date', label: 'Employee Count As Of Date' },
  { key: 'Company_validation source', label: 'Company Validation Source' },
  { key: 'Exception_notes', label: 'Exception Notes' },
  { key: 'Address', label: 'Address' },
  { key: 'City', label: 'City' },
  { key: 'State/Province', label: 'State / Province' },
  { key: 'PostalCode', label: 'Postal Code' },
  { key: 'Country.1', label: 'Country (Address)' },
  { key: 'Company_email', label: 'Company Email' },
  { key: 'Address_source_type', label: 'Address Source Type' },
  { key: 'Address_URL', label: 'Address URL' },
  { key: 'Country Code', label: 'Country Code' },
  { key: 'Phone', label: 'Phone' },
  { key: 'Fax', label: 'Fax' },
  { key: 'TollFree', label: 'Toll Free' },
  { key: 'Phone_Source_Type', label: 'Phone Source Type' },
  { key: 'Phone_URL', label: 'Phone URL' },
  { key: 'Company_LinkedIn', label: 'Company LinkedIn' },
];

// ── Executive Data — exact columns as uploaded (personnel-level) ──────────
const executiveColumns: ColumnDef[] = [
  { key: 'S.no', label: 'S.no', align: 'right' },
  { key: 'Client_company_id', label: 'Client Company ID' },
  { key: 'Company_name', label: 'Company Name' },
  { key: 'Country', label: 'Country' },
  { key: 'First name', label: 'First Name' },
  { key: 'Last name', label: 'Last Name' },
  { key: 'Exec_title_raw', label: 'Executive Title' },
  { key: 'Exec_title_formatted', label: 'Title (Formatted)' },
  { key: 'Personnel_Source_Type', label: 'Source Type' },
  { key: 'Exec_capture_date', label: 'Capture Date' },
];

const executiveExtraColumns: ColumnDef[] = [
  { key: 'Prefix', label: 'Prefix' },
  { key: 'Middle name', label: 'Middle Name' },
  { key: 'Suffix', label: 'Suffix' },
  { key: 'Personnel_Source', label: 'Source URL' },
  { key: 'Exec_as_of_date', label: 'As Of Date' },
];

// News & Events synthesized from POC dataset events (M&A + match status)
const newsRows = [
  { date: '2026-05-24', company: 'Hassop Investments Topco Limited', eventType: 'Regulatory', headline: 'Board of directors filing recorded with Companies House', region: 'GBR', source: 'Government source', sentiment: 'Neutral', category: 'Compliance', impactScore: 45, relatedEntities: '—', language: 'English', articleUrl: 'find-and-update.company-information.service.gov.uk', author: '—' },
  { date: '2026-05-23', company: 'National Network Digital Schools', eventType: 'Leadership', headline: 'New CEO Bob Clements confirmed via website', region: 'USA', source: 'Website', sentiment: 'Positive', category: 'Leadership', impactScore: 65, relatedEntities: '—', language: 'English', articleUrl: 'lincolnlearningsolutions.org', author: '—' },
  { date: '2026-05-22', company: 'Synechron Inc.', eventType: 'Earnings', headline: 'Revenue captured: USD 3,000.0M', region: 'USA', source: 'Zoominfo', sentiment: 'Positive', category: 'Financial', impactScore: 82, relatedEntities: '—', language: 'English', articleUrl: 'www.synechron.com', author: '—' },
  { date: '2026-05-22', company: 'Aubay Spain S.L.', eventType: 'Earnings', headline: 'FY2025 revenue: EUR 601.6M', region: 'ESP', source: 'Annual Report', sentiment: 'Positive', category: 'Financial', impactScore: 78, relatedEntities: '—', language: 'English', articleUrl: 'aubay.es', author: '—' },
  { date: '2026-05-21', company: 'KPMG LLP', eventType: 'M&A', headline: 'Merger & acquisition activity reported in POC dataset', region: 'CAN', source: 'Government source', sentiment: 'Neutral', category: 'Acquisition', impactScore: 70, relatedEntities: '—', language: 'English', articleUrl: 'kpmg.com', author: '—' },
  { date: '2026-05-20', company: 'Ontario Telemedicine Network', eventType: 'Earnings', headline: 'Revenue captured: CAD 21.4M', region: 'CAN', source: 'Zoominfo', sentiment: 'Positive', category: 'Financial', impactScore: 55, relatedEntities: '—', language: 'English', articleUrl: 'otn.ca', author: '—' },
  { date: '2026-05-19', company: 'TRUGLOBAL Software India Private Ltd', eventType: 'Earnings', headline: 'FY2025 revenue: INR 612.0M', region: 'IND', source: 'Tracxn', sentiment: 'Positive', category: 'Financial', impactScore: 50, relatedEntities: '—', language: 'English', articleUrl: 'www.truglobal.com', author: '—' },
  { date: '2026-05-18', company: 'PROMOD', eventType: 'Earnings', headline: 'FY2025 revenue: EUR 313.7M', region: 'FRA', source: 'SOS', sentiment: 'Positive', category: 'Financial', impactScore: 58, relatedEntities: '—', language: 'English', articleUrl: 'www.promod.com', author: '—' },
  { date: '2026-05-17', company: 'droga5, LLC', eventType: 'Earnings', headline: 'Revenue captured: USD 126.5M', region: 'USA', source: 'Zoominfo', sentiment: 'Positive', category: 'Financial', impactScore: 60, relatedEntities: '—', language: 'English', articleUrl: 'www.droga5.com', author: '—' },
  { date: '2026-05-16', company: 'HIT, Co., Ltd.', eventType: 'Earnings', headline: 'FY2025 revenue: JPY 4,419.4M', region: 'JPN', source: 'Yahoo Finance', sentiment: 'Positive', category: 'Financial', impactScore: 52, relatedEntities: '—', language: 'English', articleUrl: 'www.hit-ad.co.jp', author: '—' },
];

// Corporate Hierarchy synthesized from POC personnel & company links
const hierarchyRows = pocExecSamples.slice(0, 10).map(e => ({
  parentName: e.company,
  subsidiaryName: e.name,
  entityType: 'Director',
  country: e.country,
  ownershipPct: '—',
  coverageScore: 90,
  lei: '—',
  incorporationDate: '—',
  status: 'Active',
  sic: '—',
  registrationNo: '—',
  jurisdiction: e.country,
  ultimateParent: e.company,
  hierarchyLevel: 1,
}));

export const dataGroups: DataGroup[] = [
  {
    id: 'company-profile',
    label: 'Company Profile',
    icon: '📋',
    description: 'Company-level attributes captured for the 1,000 POC records',
    filters: [
      { key: 'geography', label: 'Geography', options: ['All Regions', 'North America', 'Europe', 'APAC', 'Middle East', 'Latin America'] },
      { key: 'companyType', label: 'Company Type', options: ['All Companies', 'Public', 'Private'] },
      { key: 'tier', label: 'Tier', options: ['All Tiers', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'] },
    ],
    columns: companyProfileColumns,
    extraColumns: companyProfileExtraColumns,
    sampleRows: pocCompaniesRaw as Record<string, string>[],
    totalRecords: pocMetrics.totalRecords,
  },
  {
    id: 'executive-data',
    label: 'Executive Data',
    icon: '👤',
    description: 'Personnel and director records captured from the POC dataset',
    filters: [
      { key: 'geography', label: 'Geography', options: ['All Regions', 'North America', 'Europe', 'APAC', 'Middle East', 'Latin America'] },
      { key: 'companyType', label: 'Company Type', options: ['All Companies', 'Public', 'Private'] },
      { key: 'role', label: 'Role', options: ['All Roles', 'CEO', 'CFO', 'COO', 'CTO', 'Board Member'] },
      { key: 'tier', label: 'Tier', options: ['All Tiers', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'] },
    ],
    columns: executiveColumns,
    extraColumns: executiveExtraColumns,
    sampleRows: pocPersonnelRaw as Record<string, string>[],
    totalRecords: pocMetrics.personnelRows,
  },
  {
    id: 'corporate-hierarchy',
    label: 'Corporate Hierarchy Intelligence',
    icon: '🏢',
    description: 'Parent–director and company linkages extracted from the POC dataset',
    filters: [
      { key: 'geography', label: 'Geography', options: ['All Regions', 'North America', 'Europe', 'APAC', 'Middle East', 'Latin America'] },
      { key: 'companyType', label: 'Company Type', options: ['All Companies', 'Public', 'Private'] },
      { key: 'tier', label: 'Tier', options: ['All Tiers', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'] },
    ],
    columns: [
      { key: 'parentName', label: 'Company' },
      { key: 'subsidiaryName', label: 'Director / Subsidiary' },
      { key: 'entityType', label: 'Entity Type' },
      { key: 'country', label: 'Country' },
      { key: 'ownershipPct', label: 'Ownership %', align: 'right' },
      { key: 'coverageScore', label: 'Coverage', align: 'right' },
    ],
    extraColumns: [
      { key: 'lei', label: 'LEI' },
      { key: 'incorporationDate', label: 'Inc. Date' },
      { key: 'status', label: 'Status' },
      { key: 'sic', label: 'SIC Code' },
      { key: 'registrationNo', label: 'Reg. Number' },
      { key: 'jurisdiction', label: 'Jurisdiction' },
      { key: 'ultimateParent', label: 'Ultimate Parent' },
      { key: 'hierarchyLevel', label: 'Hierarchy Level', align: 'right' },
    ],
    sampleRows: hierarchyRows,
    totalRecords: pocMetrics.uniqueCompaniesWithPersonnel,
  },
  {
    id: 'news-events',
    label: 'News & Events',
    icon: '📰',
    description: 'Financial, M&A and leadership events derived from the POC dataset',
    filters: [
      { key: 'geography', label: 'Geography', options: ['All Regions', 'North America', 'Europe', 'APAC', 'Middle East', 'Latin America'] },
      { key: 'companyType', label: 'Company Type', options: ['All Companies', 'Public', 'Private'] },
      { key: 'tier', label: 'Tier', options: ['All Tiers', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'] },
    ],
    columns: [
      { key: 'date', label: 'Date' },
      { key: 'company', label: 'Company' },
      { key: 'eventType', label: 'Event Type' },
      { key: 'headline', label: 'Headline' },
      { key: 'region', label: 'Region' },
    ],
    extraColumns: [
      { key: 'source', label: 'Source' },
      { key: 'sentiment', label: 'Sentiment' },
      { key: 'category', label: 'Category' },
      { key: 'impactScore', label: 'Impact Score', align: 'right' },
      { key: 'relatedEntities', label: 'Related Entities' },
      { key: 'language', label: 'Language' },
      { key: 'articleUrl', label: 'Article URL' },
      { key: 'author', label: 'Author' },
    ],
    sampleRows: newsRows,
    totalRecords: pocMetrics.mergerAcquisition,
  },
];

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}
