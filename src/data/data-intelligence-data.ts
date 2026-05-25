// Data Intelligence module — dataset groups, filters, and sample data

export interface DataGroup {
  id: string;
  label: string;
  icon: string; // emoji for simplicity
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

export const dataGroups: DataGroup[] = [
  {
    id: 'corporate-hierarchy',
    label: 'Corporate Hierarchy Intelligence',
    icon: '🏢',
    description: 'Parent-subsidiary relationships, ownership chains, and hierarchy links',
    filters: [
      { key: 'geography', label: 'Geography', options: ['All Regions', 'North America', 'Europe', 'APAC', 'Middle East', 'Latin America'] },
      { key: 'companyType', label: 'Company Type', options: ['All Companies', 'Public', 'Private'] },
      { key: 'tier', label: 'Tier', options: ['All Tiers', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'] },
    ],
    columns: [
      { key: 'parentName', label: 'Parent Name' },
      { key: 'subsidiaryName', label: 'Subsidiary Name' },
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
    sampleRows: [
      { parentName: 'Meridian Holdings plc', subsidiaryName: 'Meridian Capital Partners Ltd', entityType: 'Subsidiary', country: 'United Kingdom', ownershipPct: 100, coverageScore: 96.2, lei: '5493001KJTIIGC8Y1R12', incorporationDate: '2004-03-15', status: 'Active', sic: '6411', registrationNo: 'UK-29384756', jurisdiction: 'England & Wales', ultimateParent: 'Meridian Holdings plc', hierarchyLevel: 2 },
      { parentName: 'Atlas Industrial Corp', subsidiaryName: 'Atlas Manufacturing GmbH', entityType: 'Subsidiary', country: 'Germany', ownershipPct: 100, coverageScore: 94.7, lei: '529900T8BM49AURSDO55', incorporationDate: '1998-07-22', status: 'Active', sic: '3559', registrationNo: 'DE-HRB12345', jurisdiction: 'Bavaria', ultimateParent: 'Atlas Industrial Corp', hierarchyLevel: 1 },
      { parentName: 'Atlas Industrial Corp', subsidiaryName: 'Atlas Logistics de México SA', entityType: 'Subsidiary', country: 'Mexico', ownershipPct: 72, coverageScore: 71.3, lei: '2138004WLKZ3GN8CG312', incorporationDate: '2011-01-10', status: 'Active', sic: '4731', registrationNo: 'MX-SAB90123', jurisdiction: 'Mexico City', ultimateParent: 'Atlas Industrial Corp', hierarchyLevel: 2 },
      { parentName: 'Pinnacle Financial Group Inc', subsidiaryName: 'Pinnacle Wealth Advisors LLC', entityType: 'Branch', country: 'United States', ownershipPct: 100, coverageScore: 98.1, lei: '549300MLUDYVRQOOXS22', incorporationDate: '2015-09-01', status: 'Active', sic: '6282', registrationNo: 'US-LLC78456', jurisdiction: 'Delaware', ultimateParent: 'Pinnacle Financial Group Inc', hierarchyLevel: 2 },
      { parentName: 'Northfield Energy plc', subsidiaryName: 'Northfield Renewables BV', entityType: 'Subsidiary', country: 'Netherlands', ownershipPct: 90, coverageScore: 91.5, lei: '213800GKEMVZ91GQ3X44', incorporationDate: '2019-06-18', status: 'Active', sic: '4911', registrationNo: 'NL-KVK67890', jurisdiction: 'Amsterdam', ultimateParent: 'Northfield Energy plc', hierarchyLevel: 2 },
      { parentName: 'Crestview Technologies Inc', subsidiaryName: 'Crestview Cloud Services Ltd', entityType: 'Subsidiary', country: 'Canada', ownershipPct: 100, coverageScore: 95.8, lei: '549300PJNK89G2H7LP61', incorporationDate: '2016-11-30', status: 'Active', sic: '7372', registrationNo: 'CA-BC45678', jurisdiction: 'Ontario', ultimateParent: 'Crestview Technologies Inc', hierarchyLevel: 2 },
      { parentName: 'Crestview Technologies Inc', subsidiaryName: 'Crestview AI Labs KK', entityType: 'Subsidiary', country: 'Japan', ownershipPct: 67, coverageScore: 82.1, lei: '353800XYZ1234ABCDE77', incorporationDate: '2021-04-05', status: 'Active', sic: '7371', registrationNo: 'JP-KK98765', jurisdiction: 'Tokyo', ultimateParent: 'Crestview Technologies Inc', hierarchyLevel: 3 },
      { parentName: 'Hargrove Pharmaceuticals Ltd', subsidiaryName: 'Hargrove Biotech India Pvt Ltd', entityType: 'Subsidiary', country: 'India', ownershipPct: 100, coverageScore: 87.4, lei: '335800HGVBIOTECH9988', incorporationDate: '2013-08-20', status: 'Active', sic: '2836', registrationNo: 'IN-CIN12340', jurisdiction: 'Maharashtra', ultimateParent: 'Hargrove Pharmaceuticals Ltd', hierarchyLevel: 2 },
      { parentName: 'Sovereign Capital SA', subsidiaryName: 'Sovereign Real Estate Holdings BV', entityType: 'Subsidiary', country: 'Netherlands', ownershipPct: 80, coverageScore: 90.2, lei: '213800SVREH0LDINGS55', incorporationDate: '2010-02-14', status: 'Active', sic: '6726', registrationNo: 'NL-KVK11223', jurisdiction: 'Rotterdam', ultimateParent: 'Sovereign Capital SA', hierarchyLevel: 2 },
      { parentName: 'Broadmark Corp', subsidiaryName: 'Broadmark Digital Pty Ltd', entityType: 'Subsidiary', country: 'Australia', ownershipPct: 100, coverageScore: 91.0, lei: '549300BRDMRKDIGTL033', incorporationDate: '2017-12-01', status: 'Active', sic: '7374', registrationNo: 'AU-ACN44556', jurisdiction: 'New South Wales', ultimateParent: 'Broadmark Corp', hierarchyLevel: 2 },
    ],
    totalRecords: 4_800_000,
  },
  {
    id: 'executive-data',
    label: 'Executive Data',
    icon: '👤',
    description: 'C-suite and board-level executive profiles, roles, and tenure',
    filters: [
      { key: 'geography', label: 'Geography', options: ['All Regions', 'North America', 'Europe', 'APAC', 'Middle East', 'Latin America'] },
      { key: 'companyType', label: 'Company Type', options: ['All Companies', 'Public', 'Private'] },
      { key: 'role', label: 'Role', options: ['All Roles', 'CEO', 'CFO', 'COO', 'CTO', 'Board Member'] },
      { key: 'tier', label: 'Tier', options: ['All Tiers', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'] },
    ],
    columns: [
      { key: 'name', label: 'Executive Name' },
      { key: 'title', label: 'Title' },
      { key: 'company', label: 'Company' },
      { key: 'country', label: 'Country' },
      { key: 'tenure', label: 'Tenure (yrs)', align: 'right' },
    ],
    extraColumns: [
      { key: 'education', label: 'Education' },
      { key: 'compensation', label: 'Compensation', align: 'right' },
      { key: 'boardSeats', label: 'Board Seats', align: 'right' },
      { key: 'age', label: 'Age', align: 'right' },
      { key: 'gender', label: 'Gender' },
      { key: 'nationality', label: 'Nationality' },
      { key: 'previousCompany', label: 'Previous Company' },
      { key: 'appointmentDate', label: 'Appointment Date' },
    ],
    sampleRows: [
      { name: 'James Whitfield', title: 'CEO', company: 'Meridian Holdings plc', country: 'United Kingdom', tenure: 8, education: 'Oxford MBA', compensation: '$4.2M', boardSeats: 3, age: 54, gender: 'Male', nationality: 'British', previousCompany: 'Barclays', appointmentDate: '2018-03-15' },
      { name: 'Sarah Chen', title: 'CFO', company: 'Atlas Industrial Corp', country: 'United States', tenure: 5, education: 'Wharton MBA', compensation: '$3.1M', boardSeats: 2, age: 47, gender: 'Female', nationality: 'American', previousCompany: 'Goldman Sachs', appointmentDate: '2021-06-01' },
      { name: 'Michael Torres', title: 'COO', company: 'Pinnacle Financial Group Inc', country: 'United States', tenure: 3, education: 'Harvard MBA', compensation: '$2.8M', boardSeats: 1, age: 51, gender: 'Male', nationality: 'American', previousCompany: 'McKinsey', appointmentDate: '2023-01-10' },
      { name: 'Dr. Ananya Sharma', title: 'CTO', company: 'Crestview Technologies Inc', country: 'Canada', tenure: 6, education: 'MIT PhD', compensation: '$3.5M', boardSeats: 2, age: 42, gender: 'Female', nationality: 'Canadian', previousCompany: 'Google', appointmentDate: '2020-04-22' },
      { name: 'Henrik Müller', title: 'CEO', company: 'Atlas Manufacturing GmbH', country: 'Germany', tenure: 12, education: 'TU Munich', compensation: '€2.9M', boardSeats: 4, age: 61, gender: 'Male', nationality: 'German', previousCompany: 'Siemens', appointmentDate: '2014-08-01' },
      { name: 'Laura Kim', title: 'CFO', company: 'Northfield Energy plc', country: 'United Kingdom', tenure: 4, education: 'LSE MSc', compensation: '£2.1M', boardSeats: 1, age: 44, gender: 'Female', nationality: 'British', previousCompany: 'Deloitte', appointmentDate: '2022-02-14' },
      { name: 'Robert Daniels', title: 'Board Member', company: 'Sovereign Capital SA', country: 'Switzerland', tenure: 7, education: 'INSEAD MBA', compensation: 'CHF 1.8M', boardSeats: 5, age: 58, gender: 'Male', nationality: 'Swiss', previousCompany: 'UBS', appointmentDate: '2019-09-30' },
      { name: 'Emily Zhang', title: 'CTO', company: 'Broadmark Corp', country: 'Australia', tenure: 2, education: 'Stanford MS', compensation: 'A$2.4M', boardSeats: 1, age: 39, gender: 'Female', nationality: 'Australian', previousCompany: 'Microsoft', appointmentDate: '2024-05-15' },
      { name: 'Carlos Rivera', title: 'CEO', company: 'Hargrove Pharmaceuticals Ltd', country: 'Ireland', tenure: 9, education: 'Columbia MBA', compensation: '€5.1M', boardSeats: 3, age: 56, gender: 'Male', nationality: 'Irish', previousCompany: 'Pfizer', appointmentDate: '2017-11-01' },
      { name: 'Fatima Al-Hassan', title: 'COO', company: 'Elysium Group AG', country: 'UAE', tenure: 4, education: 'LBS MBA', compensation: '$3.7M', boardSeats: 2, age: 45, gender: 'Female', nationality: 'Emirati', previousCompany: 'BCG', appointmentDate: '2022-07-20' },
    ],
    totalRecords: 2_100_000,
  },
  {
    id: 'news-events',
    label: 'News & Events',
    icon: '📰',
    description: 'Corporate announcements, M&A activity, regulatory filings, and press releases',
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
    sampleRows: [
      { date: '2026-03-27', company: 'Meridian Holdings plc', eventType: 'M&A', headline: 'Meridian acquires FinTech startup Payvault', region: 'Europe', source: 'Reuters', sentiment: 'Positive', category: 'Acquisition', impactScore: 87, relatedEntities: 'Payvault Ltd', language: 'English', articleUrl: 'reuters.com/article/...', author: 'J. Smith' },
      { date: '2026-03-26', company: 'Atlas Industrial Corp', eventType: 'Earnings', headline: 'Q1 2026 revenue up 12% YoY', region: 'North America', source: 'Bloomberg', sentiment: 'Positive', category: 'Financial', impactScore: 92, relatedEntities: 'Atlas Manufacturing', language: 'English', articleUrl: 'bloomberg.com/news/...', author: 'M. Johnson' },
      { date: '2026-03-25', company: 'Pinnacle Financial Group', eventType: 'Regulatory', headline: 'SEC filing: 10-K annual report submitted', region: 'North America', source: 'SEC Edgar', sentiment: 'Neutral', category: 'Compliance', impactScore: 45, relatedEntities: 'SEC', language: 'English', articleUrl: 'sec.gov/cgi-bin/...', author: '—' },
      { date: '2026-03-24', company: 'Northfield Energy plc', eventType: 'Partnership', headline: 'JV with SolarEdge for EU grid expansion', region: 'Europe', source: 'FT', sentiment: 'Positive', category: 'Strategic', impactScore: 78, relatedEntities: 'SolarEdge Technologies', language: 'English', articleUrl: 'ft.com/content/...', author: 'A. Williams' },
      { date: '2026-03-23', company: 'Crestview Technologies', eventType: 'Product', headline: 'Launches AI-powered analytics platform', region: 'North America', source: 'TechCrunch', sentiment: 'Positive', category: 'Product Launch', impactScore: 81, relatedEntities: 'Crestview AI Labs', language: 'English', articleUrl: 'techcrunch.com/...', author: 'R. Patel' },
      { date: '2026-03-22', company: 'Hargrove Pharmaceuticals', eventType: 'Clinical', headline: 'Phase III trial results for HGV-201 positive', region: 'Europe', source: 'Lancet', sentiment: 'Positive', category: 'Clinical Trial', impactScore: 95, relatedEntities: 'Hargrove Biotech India', language: 'English', articleUrl: 'thelancet.com/...', author: 'Dr. K. Lee' },
      { date: '2026-03-21', company: 'Broadmark Corp', eventType: 'Leadership', headline: 'Appoints new CTO from Google DeepMind', region: 'APAC', source: 'AFR', sentiment: 'Positive', category: 'Leadership', impactScore: 72, relatedEntities: 'Google DeepMind', language: 'English', articleUrl: 'afr.com/...', author: 'S. Turner' },
      { date: '2026-03-20', company: 'Sovereign Capital SA', eventType: 'M&A', headline: 'Acquires majority stake in Nordic RE fund', region: 'Europe', source: 'Bloomberg', sentiment: 'Neutral', category: 'Acquisition', impactScore: 68, relatedEntities: 'Nordic RE Fund AB', language: 'English', articleUrl: 'bloomberg.com/news/...', author: 'L. Berg' },
      { date: '2026-03-19', company: 'Elysium Group AG', eventType: 'Expansion', headline: 'Opens new regional HQ in Dubai', region: 'Middle East', source: 'Gulf News', sentiment: 'Positive', category: 'Expansion', impactScore: 61, relatedEntities: 'DIFC', language: 'English', articleUrl: 'gulfnews.com/...', author: 'N. Abbas' },
      { date: '2026-03-18', company: 'Vanguard Shipping Ltd', eventType: 'Regulatory', headline: 'IMO 2026 compliance certification obtained', region: 'APAC', source: 'Lloyd\'s List', sentiment: 'Neutral', category: 'Compliance', impactScore: 54, relatedEntities: 'IMO', language: 'English', articleUrl: 'lloydslist.com/...', author: 'T. Nakamura' },
    ],
    totalRecords: 8_400_000,
  },
  {
    id: 'company-profile',
    label: 'Company Profile',
    icon: '📋',
    description: 'Core company attributes including name, address, financials, and industry classification',
    filters: [
      { key: 'geography', label: 'Geography', options: ['All Regions', 'North America', 'Europe', 'APAC', 'Middle East', 'Latin America'] },
      { key: 'companyType', label: 'Company Type', options: ['All Companies', 'Public', 'Private'] },
      { key: 'tier', label: 'Tier', options: ['All Tiers', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'] },
    ],
    columns: [
      { key: 'companyName', label: 'Company Name' },
      { key: 'country', label: 'Country' },
      { key: 'industry', label: 'Industry' },
      { key: 'type', label: 'Type' },
      { key: 'employees', label: 'Employees', align: 'right' },
      { key: 'revenue', label: 'Revenue', align: 'right' },
    ],
    extraColumns: [
      { key: 'founded', label: 'Founded', align: 'right' },
      { key: 'hq', label: 'HQ City' },
      { key: 'ticker', label: 'Ticker' },
      { key: 'website', label: 'Website' },
      { key: 'lei', label: 'LEI' },
      { key: 'sic', label: 'SIC Code' },
      { key: 'naics', label: 'NAICS Code' },
      { key: 'marketCap', label: 'Market Cap', align: 'right' },
    ],
    sampleRows: [
      { companyName: 'Meridian Holdings plc', country: 'United Kingdom', industry: 'Financial Services', type: 'Public', employees: 12400, revenue: '$4.2B', founded: 1987, hq: 'London', ticker: 'MRD.L', website: 'meridian.co.uk', lei: '5493001KJTIIGC8Y1R12', sic: '6411', naics: '523110', marketCap: '$8.1B' },
      { companyName: 'Atlas Industrial Corp', country: 'United States', industry: 'Manufacturing', type: 'Public', employees: 34200, revenue: '$8.7B', founded: 1965, hq: 'Chicago', ticker: 'ATLS', website: 'atlasindustrial.com', lei: '529900T8BM49AURSDO55', sic: '3559', naics: '333249', marketCap: '$14.2B' },
      { companyName: 'Pinnacle Financial Group Inc', country: 'United States', industry: 'Insurance', type: 'Public', employees: 8700, revenue: '$3.1B', founded: 1992, hq: 'New York', ticker: 'PNFG', website: 'pinnaclefg.com', lei: '549300MLUDYVRQOOXS22', sic: '6311', naics: '524113', marketCap: '$5.6B' },
      { companyName: 'Northfield Energy plc', country: 'United Kingdom', industry: 'Energy', type: 'Public', employees: 15600, revenue: '$6.4B', founded: 2001, hq: 'Edinburgh', ticker: 'NRG.L', website: 'northfieldenergy.com', lei: '213800GKEMVZ91GQ3X44', sic: '4911', naics: '221112', marketCap: '$11.3B' },
      { companyName: 'Crestview Technologies Inc', country: 'Canada', industry: 'Technology', type: 'Private', employees: 4300, revenue: '$920M', founded: 2010, hq: 'Toronto', ticker: '—', website: 'crestviewtech.ca', lei: '549300PJNK89G2H7LP61', sic: '7372', naics: '511210', marketCap: '—' },
      { companyName: 'Hargrove Pharmaceuticals Ltd', country: 'Ireland', industry: 'Pharmaceuticals', type: 'Public', employees: 21000, revenue: '$5.8B', founded: 1978, hq: 'Dublin', ticker: 'HGV', website: 'hargrovepharma.ie', lei: '335800HGVBIOTECH9988', sic: '2836', naics: '325414', marketCap: '$18.7B' },
      { companyName: 'Sovereign Capital SA', country: 'Switzerland', industry: 'Asset Management', type: 'Private', employees: 1200, revenue: '$480M', founded: 2005, hq: 'Zurich', ticker: '—', website: 'sovereigncap.ch', lei: '213800SVREH0LDINGS55', sic: '6726', naics: '523920', marketCap: '—' },
      { companyName: 'Broadmark Corp', country: 'Australia', industry: 'Technology', type: 'Public', employees: 6800, revenue: '$1.9B', founded: 2008, hq: 'Sydney', ticker: 'BRD.AX', website: 'broadmark.com.au', lei: '549300BRDMRKDIGTL033', sic: '7374', naics: '518210', marketCap: '$3.8B' },
      { companyName: 'Elysium Group AG', country: 'Switzerland', industry: 'Consulting', type: 'Private', employees: 3400, revenue: '$710M', founded: 2003, hq: 'Geneva', ticker: '—', website: 'elysiumgroup.ch', lei: '213800ELYSGRP00AG11', sic: '7389', naics: '541611', marketCap: '—' },
      { companyName: 'Vanguard Shipping Ltd', country: 'Singapore', industry: 'Logistics', type: 'Public', employees: 9200, revenue: '$2.6B', founded: 1990, hq: 'Singapore', ticker: 'VGD.SI', website: 'vanguardshipping.sg', lei: '549300VGDSHPNG0LTD44', sic: '4412', naics: '483111', marketCap: '$4.9B' },
    ],
    totalRecords: 98_700_000,
  },
];

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}
