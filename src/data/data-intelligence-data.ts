// Data Intelligence module — populated from the 1,000-record POC dataset
import { pocCompanySamples, pocExecSamples, pocMetrics } from './poc-dataset';

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

// ── Company Profile rows mirror the "Website, Revenue & Emp Count" sheet ─
const companyProfileRows = pocCompanySamples.map(c => ({
  companyName: c.companyName,
  country: c.country,
  website: c.website,
  revenue: c.revenue,
  employees: c.employees,
  fiscalYear: c.fiscalYear,
  revenueSource: c.revenueSource,
  employeeSource: c.employeeSource,
  matchStatus: c.matchStatus,
  lastCaptured: c.lastCaptured,
}));

// ── Executive rows mirror the "Personnel" sheet ───────────────────────────
const executiveRows = pocExecSamples.map(e => ({
  name: e.name,
  title: e.title,
  titleFormatted: e.titleFormatted,
  company: e.company,
  country: e.country,
  source: e.source,
  captureDate: e.captureDate,
}));

// News & Events synthesized from POC dataset events (M&A + match status)
const newsRows = [
  { date: '2026-05-22', company: 'KPMG LLP', eventType: 'M&A', headline: 'Merger & acquisition activity reported in POC dataset', region: 'CAN', source: 'Government source', sentiment: 'Neutral', category: 'Acquisition', impactScore: 70, relatedEntities: '—', language: 'English', articleUrl: '—', author: '—' },
  { date: '2026-05-21', company: 'Synechron Inc.', eventType: 'Earnings', headline: 'Revenue reported: USD 3,000.0M', region: 'USA', source: 'Zoominfo', sentiment: 'Positive', category: 'Financial', impactScore: 82, relatedEntities: '—', language: 'English', articleUrl: 'www.synechron.com', author: '—' },
  { date: '2026-05-21', company: 'Aubay Spain S.L.', eventType: 'Earnings', headline: 'FY2025 revenue: EUR 601.6M', region: 'ESP', source: 'Annual Report', sentiment: 'Positive', category: 'Financial', impactScore: 78, relatedEntities: '—', language: 'English', articleUrl: 'aubay.es', author: '—' },
  { date: '2026-05-20', company: 'Infinis Energy Group Holdings Limited', eventType: 'Leadership', headline: 'Director appointments captured from website', region: 'GBR', source: 'Website', sentiment: 'Neutral', category: 'Leadership', impactScore: 60, relatedEntities: '—', language: 'English', articleUrl: '—', author: '—' },
  { date: '2026-05-19', company: 'Hassop Investments Topco Limited', eventType: 'Regulatory', headline: 'Board of directors filing recorded', region: 'GBR', source: 'Government source', sentiment: 'Neutral', category: 'Compliance', impactScore: 45, relatedEntities: '—', language: 'English', articleUrl: '—', author: '—' },
  { date: '2026-05-19', company: 'Ontario Telemedicine Network', eventType: 'Earnings', headline: 'Revenue captured: CAD 21.4M', region: 'CAN', source: 'Zoominfo', sentiment: 'Positive', category: 'Financial', impactScore: 55, relatedEntities: '—', language: 'English', articleUrl: 'otn.ca', author: '—' },
  { date: '2026-05-18', company: 'TRUGLOBAL Software India Private Ltd', eventType: 'Earnings', headline: 'FY2025 revenue: INR 612.0M', region: 'IND', source: 'Tracxn', sentiment: 'Positive', category: 'Financial', impactScore: 50, relatedEntities: '—', language: 'English', articleUrl: 'www.truglobal.com', author: '—' },
  { date: '2026-05-17', company: 'PROMOD', eventType: 'Earnings', headline: 'FY2025 revenue: EUR 313.7M', region: 'FRA', source: 'SOS', sentiment: 'Positive', category: 'Financial', impactScore: 58, relatedEntities: '—', language: 'English', articleUrl: 'www.promod.com', author: '—' },
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
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'title', label: 'Title' },
      { key: 'titleFormatted', label: 'Title Formatted' },
      { key: 'company', label: 'Company' },
      { key: 'country', label: 'Country' },
      { key: 'source', label: 'Source' },
      { key: 'captureDate', label: 'Captured Date' },
    ],
    extraColumns: [],
    sampleRows: executiveRows,
    totalRecords: pocMetrics.personnelRows,
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
    columns: [
      { key: 'companyName', label: 'Company Name' },
      { key: 'country', label: 'Country' },
      { key: 'website', label: 'Website' },
      { key: 'revenue', label: 'Revenue', align: 'right' },
      { key: 'employees', label: 'Employees', align: 'right' },
      { key: 'fiscalYear', label: 'Fiscal Year' },
      { key: 'revenueSource', label: 'Revenue Source' },
      { key: 'employeeSource', label: 'Employee Source' },
      { key: 'matchStatus', label: 'Match Status' },
      { key: 'lastCaptured', label: 'Last Captured' },
    ],
    extraColumns: [
      { key: 'revenueFiscalYear', label: 'Revenue Fiscal Year' },
      { key: 'annualReport', label: 'Annual Report' },
      { key: 'hq', label: 'HQ City' },
      { key: 'industry', label: 'Industry' },
      { key: 'founded', label: 'Founded', align: 'right' },
      { key: 'ticker', label: 'Ticker' },
      { key: 'lei', label: 'LEI' },
      { key: 'sic', label: 'SIC Code' },
      { key: 'naics', label: 'NAICS Code' },
      { key: 'marketCap', label: 'Market Cap', align: 'right' },
    ],
    sampleRows: companyProfileRows,
    totalRecords: pocMetrics.totalRecords,
  },
];

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}
