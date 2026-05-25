// Attribute-level data for the dual-axis combination chart

export interface AttributeRecord {
  attribute: string;
  group: 'Basic Data' | 'Financial Data' | 'Corporate Hierarchy Data';
  count: number;        // volume (millions)
  accuracy: number;     // percentage 0–100
  lastRefresh: string;  // ISO date
  region: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Tier 4';
  companyStatus: 'Public' | 'Private';
}

export const attributeRecords: AttributeRecord[] = [
  // Basic Data — Public
  { attribute: 'Legal Name', group: 'Basic Data', count: 48.2, accuracy: 99.6, lastRefresh: '2026-03-14', region: 'North America', tier: 'Tier 1', companyStatus: 'Public' },
  { attribute: 'Legal Name', group: 'Basic Data', count: 32.1, accuracy: 97.8, lastRefresh: '2026-03-13', region: 'Europe', tier: 'Tier 1', companyStatus: 'Private' },
  { attribute: 'Legal Name', group: 'Basic Data', count: 11.4, accuracy: 94.2, lastRefresh: '2026-03-10', region: 'APAC', tier: 'Tier 2', companyStatus: 'Public' },
  { attribute: 'Legal Name', group: 'Basic Data', count: 4.8, accuracy: 88.5, lastRefresh: '2026-03-06', region: 'Latin America', tier: 'Tier 3', companyStatus: 'Private' },
  { attribute: 'Legal Name', group: 'Basic Data', count: 2.2, accuracy: 82.1, lastRefresh: '2026-02-28', region: 'Middle East', tier: 'Tier 4', companyStatus: 'Private' },

  { attribute: 'Trade Name', group: 'Basic Data', count: 42.6, accuracy: 96.1, lastRefresh: '2026-03-14', region: 'North America', tier: 'Tier 1', companyStatus: 'Public' },
  { attribute: 'Trade Name', group: 'Basic Data', count: 28.3, accuracy: 93.4, lastRefresh: '2026-03-12', region: 'Europe', tier: 'Tier 1', companyStatus: 'Private' },
  { attribute: 'Trade Name', group: 'Basic Data', count: 9.7, accuracy: 87.9, lastRefresh: '2026-03-08', region: 'APAC', tier: 'Tier 2', companyStatus: 'Public' },
  { attribute: 'Trade Name', group: 'Basic Data', count: 3.5, accuracy: 79.3, lastRefresh: '2026-03-03', region: 'Latin America', tier: 'Tier 3', companyStatus: 'Private' },
  { attribute: 'Trade Name', group: 'Basic Data', count: 1.8, accuracy: 72.6, lastRefresh: '2026-02-25', region: 'Africa', tier: 'Tier 4', companyStatus: 'Private' },

  { attribute: 'Street Address', group: 'Basic Data', count: 44.1, accuracy: 94.8, lastRefresh: '2026-03-13', region: 'North America', tier: 'Tier 1', companyStatus: 'Public' },
  { attribute: 'Street Address', group: 'Basic Data', count: 30.2, accuracy: 91.2, lastRefresh: '2026-03-11', region: 'Europe', tier: 'Tier 1', companyStatus: 'Private' },
  { attribute: 'Street Address', group: 'Basic Data', count: 10.8, accuracy: 85.6, lastRefresh: '2026-03-07', region: 'APAC', tier: 'Tier 2', companyStatus: 'Public' },
  { attribute: 'Street Address', group: 'Basic Data', count: 3.9, accuracy: 74.1, lastRefresh: '2026-02-28', region: 'Middle East', tier: 'Tier 3', companyStatus: 'Private' },
  { attribute: 'Street Address', group: 'Basic Data', count: 1.3, accuracy: 64.8, lastRefresh: '2026-02-20', region: 'Rest of World', tier: 'Tier 4', companyStatus: 'Private' },

  { attribute: 'City', group: 'Basic Data', count: 45.3, accuracy: 96.2, lastRefresh: '2026-03-13', region: 'North America', tier: 'Tier 1', companyStatus: 'Public' },
  { attribute: 'City', group: 'Basic Data', count: 31.0, accuracy: 94.1, lastRefresh: '2026-03-12', region: 'Europe', tier: 'Tier 1', companyStatus: 'Private' },
  { attribute: 'City', group: 'Basic Data', count: 10.2, accuracy: 89.4, lastRefresh: '2026-03-09', region: 'APAC', tier: 'Tier 2', companyStatus: 'Public' },
  { attribute: 'City', group: 'Basic Data', count: 4.1, accuracy: 81.7, lastRefresh: '2026-03-01', region: 'Latin America', tier: 'Tier 3', companyStatus: 'Private' },

  { attribute: 'Country', group: 'Basic Data', count: 48.9, accuracy: 99.1, lastRefresh: '2026-03-14', region: 'North America', tier: 'Tier 1', companyStatus: 'Public' },
  { attribute: 'Country', group: 'Basic Data', count: 33.4, accuracy: 98.7, lastRefresh: '2026-03-14', region: 'Europe', tier: 'Tier 1', companyStatus: 'Private' },
  { attribute: 'Country', group: 'Basic Data', count: 11.9, accuracy: 97.3, lastRefresh: '2026-03-12', region: 'APAC', tier: 'Tier 2', companyStatus: 'Public' },

  { attribute: 'Phone Number', group: 'Basic Data', count: 34.8, accuracy: 88.4, lastRefresh: '2026-03-07', region: 'North America', tier: 'Tier 1', companyStatus: 'Public' },
  { attribute: 'Phone Number', group: 'Basic Data', count: 22.5, accuracy: 84.2, lastRefresh: '2026-03-04', region: 'Europe', tier: 'Tier 2', companyStatus: 'Private' },
  { attribute: 'Phone Number', group: 'Basic Data', count: 8.6, accuracy: 76.9, lastRefresh: '2026-02-28', region: 'APAC', tier: 'Tier 3', companyStatus: 'Public' },
  { attribute: 'Phone Number', group: 'Basic Data', count: 4.6, accuracy: 68.3, lastRefresh: '2026-02-18', region: 'Africa', tier: 'Tier 4', companyStatus: 'Private' },

  { attribute: 'Employee Count', group: 'Basic Data', count: 37.2, accuracy: 82.6, lastRefresh: '2026-03-09', region: 'North America', tier: 'Tier 1', companyStatus: 'Public' },
  { attribute: 'Employee Count', group: 'Basic Data', count: 24.8, accuracy: 78.1, lastRefresh: '2026-03-06', region: 'Europe', tier: 'Tier 2', companyStatus: 'Private' },
  { attribute: 'Employee Count', group: 'Basic Data', count: 9.4, accuracy: 71.4, lastRefresh: '2026-02-26', region: 'APAC', tier: 'Tier 3', companyStatus: 'Public' },
  { attribute: 'Employee Count', group: 'Basic Data', count: 5.4, accuracy: 63.8, lastRefresh: '2026-02-14', region: 'Rest of World', tier: 'Tier 4', companyStatus: 'Private' },

  { attribute: 'NAICS Code', group: 'Basic Data', count: 40.7, accuracy: 96.7, lastRefresh: '2026-03-12', region: 'North America', tier: 'Tier 1', companyStatus: 'Public' },
  { attribute: 'NAICS Code', group: 'Basic Data', count: 27.5, accuracy: 93.8, lastRefresh: '2026-03-10', region: 'Europe', tier: 'Tier 1', companyStatus: 'Private' },
  { attribute: 'NAICS Code', group: 'Basic Data', count: 10.1, accuracy: 88.2, lastRefresh: '2026-03-05', region: 'APAC', tier: 'Tier 2', companyStatus: 'Public' },
  { attribute: 'NAICS Code', group: 'Basic Data', count: 4.6, accuracy: 79.5, lastRefresh: '2026-02-22', region: 'Latin America', tier: 'Tier 3', companyStatus: 'Private' },

  { attribute: 'Website', group: 'Basic Data', count: 27.4, accuracy: 91.2, lastRefresh: '2026-02-22', region: 'North America', tier: 'Tier 1', companyStatus: 'Public' },
  { attribute: 'Website', group: 'Basic Data', count: 17.8, accuracy: 86.5, lastRefresh: '2026-02-18', region: 'Europe', tier: 'Tier 2', companyStatus: 'Private' },
  { attribute: 'Website', group: 'Basic Data', count: 6.3, accuracy: 78.4, lastRefresh: '2026-02-10', region: 'APAC', tier: 'Tier 3', companyStatus: 'Public' },
  { attribute: 'Website', group: 'Basic Data', count: 4.0, accuracy: 66.7, lastRefresh: '2026-02-01', region: 'Middle East', tier: 'Tier 4', companyStatus: 'Private' },

  // Financial Data
  { attribute: 'Revenue', group: 'Financial Data', count: 39.8, accuracy: 98.9, lastRefresh: '2026-03-12', region: 'North America', tier: 'Tier 1', companyStatus: 'Public' },
  { attribute: 'Revenue', group: 'Financial Data', count: 26.4, accuracy: 97.2, lastRefresh: '2026-03-11', region: 'Europe', tier: 'Tier 1', companyStatus: 'Private' },
  { attribute: 'Revenue', group: 'Financial Data', count: 9.8, accuracy: 93.6, lastRefresh: '2026-03-08', region: 'APAC', tier: 'Tier 2', companyStatus: 'Public' },
  { attribute: 'Revenue', group: 'Financial Data', count: 5.6, accuracy: 84.1, lastRefresh: '2026-02-26', region: 'Latin America', tier: 'Tier 3', companyStatus: 'Private' },

  { attribute: 'Sales', group: 'Financial Data', count: 37.1, accuracy: 95.4, lastRefresh: '2026-03-11', region: 'North America', tier: 'Tier 1', companyStatus: 'Public' },
  { attribute: 'Sales', group: 'Financial Data', count: 24.9, accuracy: 92.8, lastRefresh: '2026-03-09', region: 'Europe', tier: 'Tier 1', companyStatus: 'Private' },
  { attribute: 'Sales', group: 'Financial Data', count: 9.2, accuracy: 86.3, lastRefresh: '2026-03-04', region: 'APAC', tier: 'Tier 2', companyStatus: 'Public' },
  { attribute: 'Sales', group: 'Financial Data', count: 6.3, accuracy: 77.9, lastRefresh: '2026-02-20', region: 'Middle East', tier: 'Tier 3', companyStatus: 'Private' },

  { attribute: 'Total Assets', group: 'Financial Data', count: 35.6, accuracy: 97.8, lastRefresh: '2026-03-10', region: 'North America', tier: 'Tier 1', companyStatus: 'Public' },
  { attribute: 'Total Assets', group: 'Financial Data', count: 23.1, accuracy: 95.1, lastRefresh: '2026-03-08', region: 'Europe', tier: 'Tier 1', companyStatus: 'Private' },
  { attribute: 'Total Assets', group: 'Financial Data', count: 8.9, accuracy: 89.7, lastRefresh: '2026-03-03', region: 'APAC', tier: 'Tier 2', companyStatus: 'Public' },
  { attribute: 'Total Assets', group: 'Financial Data', count: 5.7, accuracy: 81.4, lastRefresh: '2026-02-22', region: 'Africa', tier: 'Tier 3', companyStatus: 'Private' },

  { attribute: 'Net Income', group: 'Financial Data', count: 32.8, accuracy: 96.5, lastRefresh: '2026-03-09', region: 'North America', tier: 'Tier 1', companyStatus: 'Public' },
  { attribute: 'Net Income', group: 'Financial Data', count: 21.7, accuracy: 93.9, lastRefresh: '2026-03-07', region: 'Europe', tier: 'Tier 1', companyStatus: 'Private' },
  { attribute: 'Net Income', group: 'Financial Data', count: 8.1, accuracy: 87.2, lastRefresh: '2026-03-01', region: 'APAC', tier: 'Tier 2', companyStatus: 'Public' },
  { attribute: 'Net Income', group: 'Financial Data', count: 5.1, accuracy: 78.6, lastRefresh: '2026-02-18', region: 'Rest of World', tier: 'Tier 4', companyStatus: 'Private' },

  { attribute: 'Ticker & Exchange', group: 'Financial Data', count: 46.2, accuracy: 99.4, lastRefresh: '2026-03-14', region: 'North America', tier: 'Tier 1', companyStatus: 'Public' },
  { attribute: 'Ticker & Exchange', group: 'Financial Data', count: 30.8, accuracy: 98.8, lastRefresh: '2026-03-14', region: 'Europe', tier: 'Tier 1', companyStatus: 'Public' },
  { attribute: 'Ticker & Exchange', group: 'Financial Data', count: 11.2, accuracy: 96.2, lastRefresh: '2026-03-11', region: 'APAC', tier: 'Tier 2', companyStatus: 'Public' },
  { attribute: 'Ticker & Exchange', group: 'Financial Data', count: 5.8, accuracy: 91.5, lastRefresh: '2026-03-04', region: 'Latin America', tier: 'Tier 3', companyStatus: 'Public' },

  // Corporate Hierarchy Data
  { attribute: 'Executive Name', group: 'Corporate Hierarchy Data', count: 30.4, accuracy: 84.2, lastRefresh: '2026-03-06', region: 'North America', tier: 'Tier 1', companyStatus: 'Public' },
  { attribute: 'Executive Name', group: 'Corporate Hierarchy Data', count: 19.8, accuracy: 79.6, lastRefresh: '2026-03-02', region: 'Europe', tier: 'Tier 2', companyStatus: 'Private' },
  { attribute: 'Executive Name', group: 'Corporate Hierarchy Data', count: 7.6, accuracy: 72.1, lastRefresh: '2026-02-24', region: 'APAC', tier: 'Tier 3', companyStatus: 'Public' },
  { attribute: 'Executive Name', group: 'Corporate Hierarchy Data', count: 4.8, accuracy: 61.8, lastRefresh: '2026-02-12', region: 'Middle East', tier: 'Tier 4', companyStatus: 'Private' },

  { attribute: 'Board of Directors', group: 'Corporate Hierarchy Data', count: 27.8, accuracy: 91.5, lastRefresh: '2026-02-28', region: 'North America', tier: 'Tier 1', companyStatus: 'Public' },
  { attribute: 'Board of Directors', group: 'Corporate Hierarchy Data', count: 18.4, accuracy: 87.3, lastRefresh: '2026-02-24', region: 'Europe', tier: 'Tier 2', companyStatus: 'Private' },
  { attribute: 'Board of Directors', group: 'Corporate Hierarchy Data', count: 6.9, accuracy: 78.9, lastRefresh: '2026-02-16', region: 'APAC', tier: 'Tier 3', companyStatus: 'Public' },
  { attribute: 'Board of Directors', group: 'Corporate Hierarchy Data', count: 4.8, accuracy: 68.4, lastRefresh: '2026-02-04', region: 'Rest of World', tier: 'Tier 4', companyStatus: 'Private' },

  { attribute: 'Parent Relationships', group: 'Corporate Hierarchy Data', count: 26.1, accuracy: 88.6, lastRefresh: '2026-02-25', region: 'North America', tier: 'Tier 1', companyStatus: 'Public' },
  { attribute: 'Parent Relationships', group: 'Corporate Hierarchy Data', count: 17.2, accuracy: 83.4, lastRefresh: '2026-02-20', region: 'Europe', tier: 'Tier 2', companyStatus: 'Private' },
  { attribute: 'Parent Relationships', group: 'Corporate Hierarchy Data', count: 6.4, accuracy: 74.8, lastRefresh: '2026-02-12', region: 'APAC', tier: 'Tier 3', companyStatus: 'Public' },
  { attribute: 'Parent Relationships', group: 'Corporate Hierarchy Data', count: 5.0, accuracy: 62.1, lastRefresh: '2026-01-28', region: 'Africa', tier: 'Tier 4', companyStatus: 'Private' },

  { attribute: 'M&A History', group: 'Corporate Hierarchy Data', count: 22.4, accuracy: 79.4, lastRefresh: '2026-02-20', region: 'North America', tier: 'Tier 1', companyStatus: 'Public' },
  { attribute: 'M&A History', group: 'Corporate Hierarchy Data', count: 14.8, accuracy: 74.2, lastRefresh: '2026-02-14', region: 'Europe', tier: 'Tier 2', companyStatus: 'Private' },
  { attribute: 'M&A History', group: 'Corporate Hierarchy Data', count: 5.7, accuracy: 66.8, lastRefresh: '2026-02-04', region: 'APAC', tier: 'Tier 3', companyStatus: 'Public' },
  { attribute: 'M&A History', group: 'Corporate Hierarchy Data', count: 3.7, accuracy: 54.3, lastRefresh: '2026-01-20', region: 'Latin America', tier: 'Tier 4', companyStatus: 'Private' },

  { attribute: 'Competitors', group: 'Corporate Hierarchy Data', count: 19.1, accuracy: 71.8, lastRefresh: '2026-02-15', region: 'North America', tier: 'Tier 1', companyStatus: 'Public' },
  { attribute: 'Competitors', group: 'Corporate Hierarchy Data', count: 12.4, accuracy: 66.5, lastRefresh: '2026-02-08', region: 'Europe', tier: 'Tier 2', companyStatus: 'Private' },
  { attribute: 'Competitors', group: 'Corporate Hierarchy Data', count: 4.9, accuracy: 58.2, lastRefresh: '2026-01-28', region: 'APAC', tier: 'Tier 3', companyStatus: 'Public' },
  { attribute: 'Competitors', group: 'Corporate Hierarchy Data', count: 2.9, accuracy: 47.6, lastRefresh: '2026-01-14', region: 'Middle East', tier: 'Tier 4', companyStatus: 'Private' },
];

export const filterOptions = {
  companyStatus: ['All Companies', 'Public Companies', 'Private Companies'] as const,
  tier: ['All Tiers', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'] as const,
  dataGroup: ['All Groups', 'Basic Data', 'Financial Data', 'Corporate Hierarchy Data'] as const,
  region: ['All Regions', 'North America', 'Europe', 'APAC', 'Middle East', 'Africa', 'Latin America', 'Rest of World'] as const,
};

export type FilterKey = keyof typeof filterOptions;

export interface ChartDataPoint {
  attribute: string;
  group: string;
  count: number;
  accuracy: number;
  lastRefresh: string;
}

export function aggregateByFilters(
  filters: { companyStatus: string; tier: string; dataGroup: string; region: string }
): ChartDataPoint[] {
  let filtered = attributeRecords;

  if (filters.companyStatus !== 'All Companies') {
    const status = filters.companyStatus.replace(' Companies', '') as 'Public' | 'Private';
    filtered = filtered.filter(r => r.companyStatus === status);
  }
  if (filters.tier !== 'All Tiers') {
    filtered = filtered.filter(r => r.tier === filters.tier);
  }
  if (filters.dataGroup !== 'All Groups') {
    filtered = filtered.filter(r => r.group === filters.dataGroup);
  }
  if (filters.region !== 'All Regions') {
    filtered = filtered.filter(r => r.region === filters.region);
  }

  // Aggregate by attribute
  const map = new Map<string, { count: number; accSum: number; accCount: number; group: string; lastRefresh: string }>();

  for (const r of filtered) {
    const existing = map.get(r.attribute);
    if (existing) {
      existing.count += r.count;
      existing.accSum += r.accuracy;
      existing.accCount += 1;
      if (r.lastRefresh > existing.lastRefresh) existing.lastRefresh = r.lastRefresh;
    } else {
      map.set(r.attribute, { count: r.count, accSum: r.accuracy, accCount: 1, group: r.group, lastRefresh: r.lastRefresh });
    }
  }

  // Order: Basic Data → Financial Data → Corporate Hierarchy Data
  const groupOrder = ['Basic Data', 'Financial Data', 'Corporate Hierarchy Data'];
  return Array.from(map.entries())
    .map(([attr, d]) => ({
      attribute: attr,
      group: d.group,
      count: Math.round(d.count * 10) / 10,
      accuracy: Math.round((d.accSum / d.accCount) * 10) / 10,
      lastRefresh: d.lastRefresh,
    }))
    .sort((a, b) => {
      const gi = groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group);
      if (gi !== 0) return gi;
      return b.count - a.count; // within group, sort by volume desc
    });
}
