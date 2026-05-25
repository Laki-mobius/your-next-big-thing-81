// Corporate Hierarchy Intelligence data & segment definitions

export interface SegmentCategory {
  label: string;
  key: string;
  options: string[];
}

export const segmentCategories: SegmentCategory[] = [
  { label: 'By Status', key: 'status', options: ['All Companies', 'Public Companies', 'Private Companies'] },
  { label: 'By Tier', key: 'tier', options: ['All Tiers', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'] },
  { label: 'By Region', key: 'region', options: ['All Regions', 'North America', 'Europe', 'APAC', 'Middle East', 'Africa', 'Latin America', 'Rest of World'] },
  { label: 'By Country', key: 'country', options: ['All Countries', 'United States', 'United Kingdom', 'Germany', 'France', 'Netherlands', 'Canada', 'India', 'China', 'Japan', 'Australia', 'Other Countries'] },
  { label: 'By Parent Location', key: 'parent', options: ['Any Parent Location', 'US Parent', 'UK Parent', 'EU Parent', 'Non-US Parent', 'Non-EU Parent', 'APAC Parent'] },
  { label: 'By Subsidiary Location', key: 'subsidiary', options: ['Any Subsidiary Location', 'US Subsidiary', 'UK Subsidiary', 'EU Subsidiaries', 'APAC Subsidiaries', 'Non-US Subsidiaries', 'Offshore Subsidiaries'] },
  { label: 'By Headquarters', key: 'hq', options: ['Any HQ', 'US HQ', 'EU HQ', 'APAC HQ'] },
];

export interface HierarchyRow {
  parentName: string;
  subsidiaryName: string;
  entityType: string;
  country: string;
  ownershipPct: number;
  coverageScore: number;
}

// Simulated dataset — in production this would come from an API
const sampleRows: HierarchyRow[] = [
  { parentName: 'Meridian Holdings plc', subsidiaryName: 'Meridian Capital Partners Ltd', entityType: 'Subsidiary', country: 'United Kingdom', ownershipPct: 100, coverageScore: 96.2 },
  { parentName: 'Meridian Holdings plc', subsidiaryName: 'Meridian Asia Pacific Pte Ltd', entityType: 'Subsidiary', country: 'Singapore', ownershipPct: 85, coverageScore: 88.4 },
  { parentName: 'Atlas Industrial Corp', subsidiaryName: 'Atlas Manufacturing GmbH', entityType: 'Subsidiary', country: 'Germany', ownershipPct: 100, coverageScore: 94.7 },
  { parentName: 'Atlas Industrial Corp', subsidiaryName: 'Atlas Logistics de México SA', entityType: 'Subsidiary', country: 'Mexico', ownershipPct: 72, coverageScore: 71.3 },
  { parentName: 'Pinnacle Financial Group Inc', subsidiaryName: 'Pinnacle Wealth Advisors LLC', entityType: 'Branch', country: 'United States', ownershipPct: 100, coverageScore: 98.1 },
  { parentName: 'Pinnacle Financial Group Inc', subsidiaryName: 'Pinnacle Insurance (Bermuda) Ltd', entityType: 'Subsidiary', country: 'Bermuda', ownershipPct: 100, coverageScore: 62.8 },
  { parentName: 'Northfield Energy plc', subsidiaryName: 'Northfield Renewables BV', entityType: 'Subsidiary', country: 'Netherlands', ownershipPct: 90, coverageScore: 91.5 },
  { parentName: 'Northfield Energy plc', subsidiaryName: 'Northfield Pipeline (Nigeria) Ltd', entityType: 'JV Partner', country: 'Nigeria', ownershipPct: 49, coverageScore: 58.2 },
  { parentName: 'Crestview Technologies Inc', subsidiaryName: 'Crestview Cloud Services Ltd', entityType: 'Subsidiary', country: 'Canada', ownershipPct: 100, coverageScore: 95.8 },
  { parentName: 'Crestview Technologies Inc', subsidiaryName: 'Crestview AI Labs KK', entityType: 'Subsidiary', country: 'Japan', ownershipPct: 67, coverageScore: 82.1 },
  { parentName: 'Hargrove Pharmaceuticals Ltd', subsidiaryName: 'Hargrove Biotech India Pvt Ltd', entityType: 'Subsidiary', country: 'India', ownershipPct: 100, coverageScore: 87.4 },
  { parentName: 'Hargrove Pharmaceuticals Ltd', subsidiaryName: 'Hargrove Clinical Trials AG', entityType: 'Subsidiary', country: 'Switzerland', ownershipPct: 100, coverageScore: 93.6 },
  { parentName: 'Sovereign Capital SA', subsidiaryName: 'Sovereign Fund Management (Cayman) Ltd', entityType: 'Subsidiary', country: 'Cayman Islands', ownershipPct: 100, coverageScore: 54.9 },
  { parentName: 'Sovereign Capital SA', subsidiaryName: 'Sovereign Real Estate Holdings BV', entityType: 'Subsidiary', country: 'Netherlands', ownershipPct: 80, coverageScore: 90.2 },
  { parentName: 'Broadmark Corp', subsidiaryName: 'Broadmark Digital Pty Ltd', entityType: 'Subsidiary', country: 'Australia', ownershipPct: 100, coverageScore: 91.0 },
  { parentName: 'Broadmark Corp', subsidiaryName: 'Broadmark France SAS', entityType: 'Branch', country: 'France', ownershipPct: 100, coverageScore: 89.3 },
  { parentName: 'Vanguard Shipping Ltd', subsidiaryName: 'Vanguard Maritime (HK) Co Ltd', entityType: 'Subsidiary', country: 'China', ownershipPct: 55, coverageScore: 74.6 },
  { parentName: 'Vanguard Shipping Ltd', subsidiaryName: 'Vanguard Ports Brasil Ltda', entityType: 'JV Partner', country: 'Brazil', ownershipPct: 50, coverageScore: 68.1 },
  { parentName: 'Elysium Group AG', subsidiaryName: 'Elysium Consulting DMCC', entityType: 'Subsidiary', country: 'UAE', ownershipPct: 100, coverageScore: 77.5 },
  { parentName: 'Elysium Group AG', subsidiaryName: 'Elysium Tech Solutions Inc', entityType: 'Subsidiary', country: 'United States', ownershipPct: 100, coverageScore: 97.3 },
];

// Simulated record counts per segment tag
const segmentRecordMap: Record<string, number> = {
  'Public Companies': 24_300_000,
  'Private Companies': 74_400_000,
  'Tier 1': 8_600_000,
  'Tier 2': 22_100_000,
  'Tier 3': 38_500_000,
  'Tier 4': 29_500_000,
  'North America': 28_200_000,
  'Europe': 24_800_000,
  'APAC': 19_600_000,
  'Middle East': 6_100_000,
  'Africa': 4_800_000,
  'Latin America': 8_400_000,
  'Rest of World': 6_800_000,
  'United States': 22_400_000,
  'United Kingdom': 7_200_000,
  'Germany': 5_600_000,
  'France': 4_100_000,
  'Netherlands': 2_300_000,
  'Canada': 3_800_000,
  'India': 6_100_000,
  'China': 8_200_000,
  'Japan': 4_900_000,
  'Australia': 2_800_000,
  'Other Countries': 31_200_000,
  'US Parent': 18_700_000,
  'UK Parent': 5_400_000,
  'EU Parent': 12_100_000,
  'Non-US Parent': 46_200_000,
  'Non-EU Parent': 52_800_000,
  'APAC Parent': 14_200_000,
  'US Subsidiary': 16_300_000,
  'UK Subsidiary': 4_800_000,
  'EU Subsidiaries': 11_700_000,
  'APAC Subsidiaries': 13_400_000,
  'Non-US Subsidiaries': 48_600_000,
  'Offshore Subsidiaries': 7_200_000,
  'US HQ': 19_100_000,
  'EU HQ': 14_600_000,
  'APAC HQ': 11_800_000,
};

const hierarchyLinksBase = 312_400_000;

export function getSegmentEstimate(filters: Record<string, string>): { records: number; links: number } {
  const activeFilters = Object.values(filters).filter(v => !v.startsWith('All') && !v.startsWith('Any'));
  if (activeFilters.length === 0) return { records: 98_700_000, links: hierarchyLinksBase };
  const counts = activeFilters.map(s => segmentRecordMap[s] ?? 5_000_000);
  const records = Math.min(...counts);
  const links = Math.round(records * 3.17);
  return { records, links };
}

export function getPreviewRows(_filters: Record<string, string>): HierarchyRow[] {
  return sampleRows;
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}
