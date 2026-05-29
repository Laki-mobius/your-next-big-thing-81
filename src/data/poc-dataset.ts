// POC dataset metrics extracted from LexisNexis_POC_05252026.xlsx
// 1,000 company records + 5,099 personnel rows (352 from main + 4,747 additional)

import companiesJson from './poc-companies.json';
import personnelJson from './poc-personnel.json';

export const pocCompaniesRaw = companiesJson as Record<string, string>[];
export const pocPersonnelRaw = personnelJson as Record<string, string>[];

export const pocMetrics = {
  totalRecords: 1000,
  matched: 988, // 986 Matched - Data Enrichment + 2 Matched
  matchedDataEnrichment: 986,
  matchedNoData: 0,
  noMatch: 0,
  mergerAcquisition: 10,
  possibleMatch: 0,
  closed: 2,
  exceptionNotes: 846,
  personnelRows: 5099,
  uniqueCompaniesWithPersonnel: 609,
} as const;

export interface AttrStat {
  name: string;
  filled: number;
  total: number;
  pct: number;
  primarySource: string;
  capturedRange: string;
}

export const pocAttributes: AttrStat[] = [
  { name: 'Company Website', filled: 507, total: 1000, pct: 50.7, primarySource: 'Zoominfo / Website', capturedRange: '2026-05-12 → 2026-05-25' },
  { name: 'Revenue', filled: 516, total: 1000, pct: 51.6, primarySource: 'Zoominfo / SOS / Annual Report', capturedRange: '2026-05-12 → 2026-05-25' },
  { name: 'Employee Count', filled: 553, total: 1000, pct: 55.3, primarySource: 'Zoominfo / Website / LinkedIn', capturedRange: '2026-05-12 → 2026-05-25' },
  { name: 'Personnel', filled: 609, total: 1000, pct: 60.9, primarySource: 'Government Source / Website', capturedRange: '2026-05-12 → 2026-05-23' },
];

export const pocCoverageOverall = 52.5; // Weighted attribute coverage across the new dataset
export const pocAccuracyOverall = 98.2; // Sampled QA accuracy retained
export const pocCurrentnessOverall = 100; // All captures within last 14 days

export const pocCountryBreakdown = [
  { code: 'USA', count: 181 }, { code: 'CHN', count: 158 }, { code: 'IND', count: 109 },
  { code: 'GBR', count: 88 }, { code: 'AUS', count: 72 }, { code: 'DEU', count: 65 },
  { code: 'NLD', count: 64 }, { code: 'JPN', count: 53 }, { code: 'BRA', count: 26 },
  { code: 'CAN', count: 25 }, { code: 'Other', count: 159 },
];

export const pocRevenueSources: { name: string; count: number }[] = [
  { name: 'Other Source', count: 342 }, { name: 'SOS', count: 98 },
  { name: 'Annual Report', count: 52 }, { name: 'Website', count: 17 },
  { name: 'Yahoo Finance', count: 7 },
];

export const pocEmployeeSources: { name: string; count: number }[] = [
  { name: 'Other Source', count: 325 }, { name: 'Website', count: 79 },
  { name: 'LinkedIn', count: 64 }, { name: 'SOS', count: 44 },
  { name: 'Annual Report', count: 32 }, { name: 'Yahoo Finance', count: 8 },
  { name: 'Morningstar', count: 1 },
];

export interface CompanyRow {
  companyName: string; country: string; website: string; revenue: string;
  employees: string; fiscalYear: string; revenueSource: string;
  employeeSource: string; matchStatus: string; lastCaptured: string;
}

// Map the raw company rows into the simplified CompanyRow shape used by legacy components
function fmtRevenue(r: Record<string, string>): string {
  const val = r['Revenue_value']; const cur = r['Revenue_currency'];
  if (!val) return '';
  const n = Number(val);
  if (!isFinite(n)) return `${cur || ''} ${val}`.trim();
  const m = n / 1_000_000;
  return `${cur || ''} ${m.toLocaleString(undefined, { maximumFractionDigits: 1 })}M`.trim();
}

export const pocCompanySamples: CompanyRow[] = pocCompaniesRaw.slice(0, 25).map(r => ({
  companyName: r['Company_name'] || '',
  country: r['Country'] || '',
  website: r['Company_website_url'] || '—',
  revenue: fmtRevenue(r) || '—',
  employees: r['Employee_count_value'] || '—',
  fiscalYear: r['Revenue_fiscal_year'] || '—',
  revenueSource: r['Revenue_source_type'] || '—',
  employeeSource: r['Employee_source_type'] || '—',
  matchStatus: r['Match_status'] || '',
  lastCaptured: r['Revenue_capture_date'] || r['Company_website_capture_date'] || r['Employee_count_capture_date'] || '',
}));

export interface ExecRow {
  name: string; title: string; titleFormatted: string;
  company: string; country: string; source: string; captureDate: string;
}

export const pocExecSamples: ExecRow[] = pocPersonnelRaw.slice(0, 25).map(r => ({
  name: [r['First name'], r['Middle name'], r['Last name']].filter(Boolean).join(' ').trim(),
  title: r['Exec_title_raw'] || '',
  titleFormatted: r['Exec_title_formatted'] || '',
  company: r['Company_name'] || '',
  country: r['Country'] || '',
  source: r['Personnel_Source_Type'] || '—',
  captureDate: r['Exec_capture_date'] || '',
}));

export const pocTitleCategories = [
  { name: 'Board of Directors', count: 1051 },
  { name: 'Director', count: 187 },
  { name: 'CFO', count: 77 },
  { name: 'CEO', count: 69 },
  { name: 'Board & Chairman', count: 67 },
  { name: 'Managing Director', count: 59 },
  { name: 'President', count: 54 },
  { name: 'Secretary', count: 53 },
  { name: 'Co-Managing Director', count: 43 },
  { name: 'Vice President', count: 34 },
];

export const pocMatchStatusBreakdown = [
  { label: 'Matched - Data Enrichment', count: 986, color: '#1A7A4A' },
  { label: 'Matched', count: 2, color: '#185FA5' },
  { label: 'Merger & Acquisition', count: 10, color: '#534AB7' },
  { label: 'Closed', count: 2, color: '#6B7280' },
];
