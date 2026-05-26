// POC dataset metrics extracted from LexisNexis_POC_05222026.xlsx
// 1,000 company records across 4 attributes: Company Website, Revenue, Employee Count, Personnel

export const pocMetrics = {
  totalRecords: 1000,
  matched: 662,
  matchedNoData: 164,
  noMatch: 135,
  mergerAcquisition: 32,
  possibleMatch: 5,
  closed: 2,
  exceptionNotes: 371,
  personnelRows: 5351,
  uniqueCompaniesWithPersonnel: 966,
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
  { name: 'Company Website', filled: 462, total: 1000, pct: 46.2, primarySource: 'Zoominfo / Website', capturedRange: '2026-05-12 → 2026-05-21' },
  { name: 'Revenue', filled: 514, total: 1000, pct: 51.4, primarySource: 'Zoominfo / SOS / Annual Report', capturedRange: '2026-05-12 → 2026-05-22' },
  { name: 'Employee Count', filled: 542, total: 1000, pct: 54.2, primarySource: 'Zoominfo / Website / LinkedIn', capturedRange: '2026-05-12 → 2026-05-22' },
  { name: 'Personnel', filled: 503, total: 1000, pct: 50.3, primarySource: 'Government Source / Website', capturedRange: '2026-05-12 → 2026-05-22' },
];

export const pocCoverageOverall = +(pocAttributes.reduce((s, a) => s + a.pct, 0) / pocAttributes.length).toFixed(1); // 50.5
export const pocAccuracyOverall = +((pocMetrics.matched + pocMetrics.possibleMatch) / (pocMetrics.matched + pocMetrics.possibleMatch + pocMetrics.noMatch) * 100).toFixed(1); // 83.2
export const pocCurrentnessOverall = 100; // All captures within last 14 days

export const pocCountryBreakdown = [
  { code: 'USA', count: 181 }, { code: 'CHN', count: 158 }, { code: 'IND', count: 109 },
  { code: 'GBR', count: 88 }, { code: 'AUS', count: 72 }, { code: 'DEU', count: 65 },
  { code: 'NLD', count: 64 }, { code: 'JPN', count: 53 }, { code: 'BRA', count: 26 },
  { code: 'CAN', count: 25 }, { code: 'Other', count: 159 },
];

export const pocRevenueSources: { name: string; count: number }[] = [
  { name: 'Zoominfo', count: 227 }, { name: 'SOS', count: 98 }, { name: 'Tracxn', count: 55 },
  { name: 'Annual Report', count: 52 }, { name: 'Other Source', count: 33 }, { name: 'Website', count: 17 },
  { name: 'Yahoo Finance', count: 7 }, { name: 'Prospeo', count: 6 }, { name: 'Proff', count: 6 },
  { name: 'Other Registries', count: 13 },
];

export const pocEmployeeSources: { name: string; count: number }[] = [
  { name: 'Zoominfo', count: 197 }, { name: 'Website', count: 79 }, { name: 'LinkedIn', count: 64 },
  { name: 'Other Source', count: 53 }, { name: 'SOS', count: 44 }, { name: 'Annual Report', count: 32 },
  { name: 'Tracxn', count: 29 }, { name: 'Endole', count: 13 }, { name: 'Crunchbase', count: 12 },
  { name: 'Other', count: 19 },
];

export interface CompanyRow {
  companyName: string; country: string; website: string; revenue: string;
  employees: string; fiscalYear: string; revenueSource: string;
  employeeSource: string; matchStatus: string; lastCaptured: string;
}

export const pocCompanySamples: CompanyRow[] = [
  { companyName: 'National Network Digital Schools', country: 'USA', website: 'www.lincolnlearningsolutions.org', revenue: 'USD 31.6M', employees: '201-500', fiscalYear: '—', revenueSource: 'Zoominfo', employeeSource: 'Zoominfo', matchStatus: 'Matched', lastCaptured: '2026-05-12' },
  { companyName: 'Ontario Telemedicine Network', country: 'CAN', website: 'otn.ca', revenue: 'CAD 21.4M', employees: '201-500', fiscalYear: '—', revenueSource: 'Zoominfo', employeeSource: 'Zoominfo', matchStatus: 'Matched', lastCaptured: '2026-05-12' },
  { companyName: 'Aubay Spain S.L.', country: 'ESP', website: 'aubay.es', revenue: 'EUR 601.6M', employees: '51-200', fiscalYear: '2025-12-31', revenueSource: 'Annual Report', employeeSource: 'Zoominfo', matchStatus: 'Matched', lastCaptured: '2026-05-12' },
  { companyName: 'Synechron Inc.', country: 'USA', website: 'www.synechron.com', revenue: 'USD 3,000.0M', employees: '16,850', fiscalYear: '—', revenueSource: 'Zoominfo', employeeSource: 'Website', matchStatus: 'Matched', lastCaptured: '2026-05-12' },
  { companyName: 'KPMG LLP', country: 'CAN', website: 'kpmg.com', revenue: 'CAD 2,000.0M', employees: '10,000', fiscalYear: '2025', revenueSource: 'Zoominfo', employeeSource: 'Zoominfo', matchStatus: 'Matched', lastCaptured: '2026-05-12' },
  { companyName: 'TRUGLOBAL Software India Private Ltd', country: 'IND', website: 'www.truglobal.com', revenue: 'INR 612.0M', employees: '190', fiscalYear: '2025-03-31', revenueSource: 'Tracxn', employeeSource: 'Other', matchStatus: 'Matched', lastCaptured: '2026-05-12' },
  { companyName: 'Arihant Publications (India) Ltd', country: 'IND', website: 'arihantbooks.com', revenue: 'USD 371.7M', employees: '6,000', fiscalYear: '—', revenueSource: 'Zoominfo', employeeSource: 'Website', matchStatus: 'Matched', lastCaptured: '2026-05-12' },
  { companyName: 'droga5, LLC', country: 'USA', website: 'www.droga5.com', revenue: 'USD 126.5M', employees: '501-1000', fiscalYear: '—', revenueSource: 'Zoominfo', employeeSource: 'Zoominfo', matchStatus: 'Matched', lastCaptured: '2026-05-12' },
  { companyName: 'HIT, Co., Ltd.', country: 'JPN', website: 'www.hit-ad.co.jp', revenue: 'JPY 4,419.4M', employees: '89', fiscalYear: '2025-06-30', revenueSource: 'Yahoo Finance', employeeSource: 'Yahoo Finance', matchStatus: 'Matched', lastCaptured: '2026-05-12' },
  { companyName: 'PROMOD', country: 'FRA', website: 'www.promod.com', revenue: 'EUR 313.7M', employees: '11-50', fiscalYear: '2025', revenueSource: 'SOS', employeeSource: 'Crunchbase', matchStatus: 'Matched', lastCaptured: '2026-05-12' },
];

export interface ExecRow {
  name: string; title: string; titleFormatted: string;
  company: string; country: string; source: string; captureDate: string;
}

export const pocExecSamples: ExecRow[] = [
  { name: 'John Andrew Hill', title: 'Director', titleFormatted: 'Bd of Dirs', company: 'Hassop Investments Topco Limited', country: 'GBR', source: 'Government source', captureDate: '2026-05-13' },
  { name: 'Holly Louise Pattenden', title: 'Director', titleFormatted: 'Bd of Dirs', company: 'Hassop Investments Topco Limited', country: 'GBR', source: 'Government source', captureDate: '2026-05-13' },
  { name: 'Bruce Michael Heppenstall', title: 'Chief Executive Officer & Director', titleFormatted: 'Bd of Dirs & CEO', company: 'Infinis Energy Group Holdings Limited', country: 'GBR', source: 'Website', captureDate: '2026-05-12' },
  { name: 'Keith Alan Reid', title: 'Chief Financial Officer & Director', titleFormatted: 'Bd of Dirs & CFO', company: 'Infinis Energy Group Holdings Limited', country: 'GBR', source: 'Website', captureDate: '2026-05-12' },
  { name: 'James Huxley Milne', title: 'Chief Commercial Officer & Director', titleFormatted: 'Bd of Dirs & Chief Comml Officer', company: 'Infinis Energy Group Holdings Limited', country: 'GBR', source: 'Website', captureDate: '2026-05-12' },
  { name: 'Robert Tomlins', title: 'Director of Operations', titleFormatted: 'Dir-Ops', company: 'Infinis Energy Group Holdings Limited', country: 'GBR', source: 'Website', captureDate: '2026-05-12' },
  { name: 'Andrew Leeding', title: 'Director of Development and Construction', titleFormatted: 'Dir-Dev & Construction', company: 'Infinis Energy Group Holdings Limited', country: 'GBR', source: 'Website', captureDate: '2026-05-12' },
  { name: 'Su Ruthven', title: 'Director of HSQE & Sustainability', titleFormatted: 'Dir-HSQE & Sustainability', company: 'Infinis Energy Group Holdings Limited', country: 'GBR', source: 'Website', captureDate: '2026-05-12' },
  { name: 'John Okninski', title: 'Director of HR', titleFormatted: 'Dir-HR', company: 'Infinis Energy Group Holdings Limited', country: 'GBR', source: 'Website', captureDate: '2026-05-12' },
  { name: 'Tim Short', title: 'Director', titleFormatted: 'Bd of Dirs', company: 'Infinis Energy Group Holdings Limited', country: 'GBR', source: 'Government source', captureDate: '2026-05-12' },
];

export const pocTitleCategories = [
  { name: 'Board of Directors', count: 1057 },
  { name: 'Director (Functional)', count: 136 },
  { name: 'CFO', count: 75 },
  { name: 'Board & Chairman', count: 62 },
  { name: 'Secretary', count: 53 },
  { name: 'CEO', count: 50 },
  { name: 'President', count: 46 },
  { name: 'Managing Director', count: 45 },
  { name: 'Co-Managing Director', count: 43 },
  { name: 'Vice President', count: 32 },
];

export const pocMatchStatusBreakdown = [
  { label: 'Matched', count: 662, color: '#1A7A4A' },
  { label: 'Matched – Data Not Found', count: 164, color: '#C97A00' },
  { label: 'No Match', count: 135, color: '#C0392B' },
  { label: 'Merger & Acquisition', count: 32, color: '#534AB7' },
  { label: 'Possible Match', count: 5, color: '#185FA5' },
  { label: 'Closed', count: 2, color: '#6B7280' },
];
