// Data Intelligence module — POC dataset (LexisNexis 05/22/2026, 1,000 companies)
import { pocCompanySamples, pocExecSamples } from './poc-dataset';

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

export interface FilterDef { key: string; label: string; options: string[]; }
export interface ColumnDef { key: string; label: string; align?: 'left' | 'right'; }

const geoOptions = ['All Regions', 'USA', 'China', 'India', 'UK', 'Australia', 'Germany', 'Netherlands', 'Japan', 'Brazil', 'Canada'];
const matchOptions = ['All Statuses', 'Matched', 'Matched – Data Not Found', 'No Match', 'Merger & Acquisition', 'Possible Match', 'Closed'];

export const dataGroups: DataGroup[] = [
  {
    id: 'company-profile',
    label: 'Company Profile Search',
    icon: '🏛️',
    description: 'Company website, revenue, employee count — sourced and verified per company',
    filters: [
      { key: 'geography', label: 'Country', options: geoOptions },
      { key: 'match', label: 'Match Status', options: matchOptions },
      { key: 'source', label: 'Source', options: ['All Sources', 'Zoominfo', 'SOS', 'Tracxn', 'Annual Report', 'Website', 'Yahoo Finance'] },
    ],
    columns: [
      { key: 'companyName', label: 'Company Name' },
      { key: 'country', label: 'Country' },
      { key: 'website', label: 'Website' },
      { key: 'revenue', label: 'Revenue', align: 'right' },
      { key: 'employees', label: 'Employees', align: 'right' },
      { key: 'matchStatus', label: 'Match Status' },
    ],
    extraColumns: [
      { key: 'fiscalYear', label: 'Fiscal Year' },
      { key: 'revenueSource', label: 'Revenue Source' },
      { key: 'employeeSource', label: 'Employee Source' },
      { key: 'lastCaptured', label: 'Last Captured' },
    ],
    sampleRows: pocCompanySamples as unknown as Record<string, string | number>[],
    totalRecords: 1000,
  },
  {
    id: 'executive-data',
    label: 'Executive Data Search',
    icon: '👤',
    description: 'Board members, C-suite, and director-level personnel sourced from official registries',
    filters: [
      { key: 'geography', label: 'Country', options: geoOptions },
      { key: 'titleCategory', label: 'Title Category', options: ['All Titles', 'Board of Directors', 'CEO', 'CFO', 'President', 'Managing Director', 'Vice President', 'Secretary'] },
      { key: 'source', label: 'Source', options: ['All Sources', 'Government source', 'Website', 'Annual report', 'Zoom info', 'Tracxn'] },
    ],
    columns: [
      { key: 'name', label: 'Executive Name' },
      { key: 'titleFormatted', label: 'Title (Standardised)' },
      { key: 'company', label: 'Company' },
      { key: 'country', label: 'Country' },
      { key: 'source', label: 'Source' },
    ],
    extraColumns: [
      { key: 'title', label: 'Original Title' },
      { key: 'captureDate', label: 'Captured On' },
    ],
    sampleRows: pocExecSamples as unknown as Record<string, string | number>[],
    totalRecords: 5351,
  },
  {
    id: 'news-events',
    label: 'News & Events',
    icon: '📰',
    description: 'M&A activity, status changes, and regulatory events flagged during enrichment',
    filters: [
      { key: 'geography', label: 'Country', options: geoOptions },
      { key: 'eventType', label: 'Event Type', options: ['All Events', 'Merger & Acquisition', 'Closure', 'No Match', 'Status Change'] },
    ],
    columns: [
      { key: 'date', label: 'Date' },
      { key: 'company', label: 'Company' },
      { key: 'eventType', label: 'Event Type' },
      { key: 'headline', label: 'Headline' },
      { key: 'country', label: 'Country' },
    ],
    extraColumns: [
      { key: 'source', label: 'Source' },
      { key: 'sentiment', label: 'Sentiment' },
      { key: 'impactScore', label: 'Impact', align: 'right' },
    ],
    sampleRows: [
      { date: '2026-05-22', company: 'Branford Castle, Inc.', eventType: 'Closure', headline: 'Marked Matched – Data Not Found; site archive review pending', country: 'USA', source: 'Exception Log', sentiment: 'Neutral', impactScore: 40 },
      { date: '2026-05-22', company: 'Ernst & Young Services Trust', eventType: 'Status Change', headline: 'Trust structure flagged; ABR lookup completed', country: 'AUS', source: 'ABR', sentiment: 'Neutral', impactScore: 35 },
      { date: '2026-05-20', company: 'Multiple (32 records)', eventType: 'Merger & Acquisition', headline: '32 POC companies flagged as M&A during enrichment', country: 'Global', source: 'Match Engine', sentiment: 'Neutral', impactScore: 78 },
      { date: '2026-05-19', company: 'Multiple (135 records)', eventType: 'No Match', headline: '135 POC companies could not be matched to source registries', country: 'Global', source: 'Match Engine', sentiment: 'Negative', impactScore: 65 },
      { date: '2026-05-18', company: 'Multiple (164 records)', eventType: 'Status Change', headline: '164 companies matched but no extractable attributes available', country: 'Global', source: 'Match Engine', sentiment: 'Neutral', impactScore: 55 },
    ],
    totalRecords: 173,
  },
  {
    id: 'corporate-hierarchy',
    label: 'Corporate Hierarchy Intelligence',
    icon: '🏢',
    description: 'Parent–subsidiary relationships and Director/Officer governance links inferred from personnel data',
    filters: [
      { key: 'geography', label: 'Country', options: geoOptions },
      { key: 'tier', label: 'Hierarchy Tier', options: ['All Tiers', 'Ultimate Parent', 'Direct Subsidiary', 'Branch'] },
    ],
    columns: [
      { key: 'parentName', label: 'Parent / Company' },
      { key: 'execName', label: 'Director / Officer' },
      { key: 'role', label: 'Role' },
      { key: 'country', label: 'Country' },
      { key: 'source', label: 'Source' },
    ],
    extraColumns: [
      { key: 'duns', label: 'D-U-N-S' },
      { key: 'capturedOn', label: 'Captured On' },
    ],
    sampleRows: [
      { parentName: 'Hassop Investments Topco Limited', execName: 'John Andrew Hill', role: 'Bd of Dirs', country: 'GBR', source: 'Government', duns: '230614958', capturedOn: '2026-05-13' },
      { parentName: 'Hassop Investments Topco Limited', execName: 'Holly Louise Pattenden', role: 'Bd of Dirs', country: 'GBR', source: 'Government', duns: '230614958', capturedOn: '2026-05-13' },
      { parentName: 'Infinis Energy Group Holdings Limited', execName: 'Bruce Michael Heppenstall', role: 'Bd of Dirs & CEO', country: 'GBR', source: 'Website', duns: '222142662', capturedOn: '2026-05-12' },
      { parentName: 'Infinis Energy Group Holdings Limited', execName: 'Keith Alan Reid', role: 'Bd of Dirs & CFO', country: 'GBR', source: 'Website', duns: '222142662', capturedOn: '2026-05-12' },
      { parentName: 'Infinis Energy Group Holdings Limited', execName: 'James Huxley Milne', role: 'Bd of Dirs & Chief Comml Officer', country: 'GBR', source: 'Website', duns: '222142662', capturedOn: '2026-05-12' },
      { parentName: 'Infinis Energy Group Holdings Limited', execName: 'Robert Tomlins', role: 'Dir-Ops', country: 'GBR', source: 'Website', duns: '222142662', capturedOn: '2026-05-12' },
    ],
    totalRecords: 966,
  },
];

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}
