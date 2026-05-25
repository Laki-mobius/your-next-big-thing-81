// Static data for XDAS dashboard

export const covData = [
  { g: 'Basic Data', name: 'Company Name', src: 'SEC EDGAR / Orbis', v: 99.8, cnt: '98.5M', ref: '2026-03-14', st: 'good' as const },
  { g: 'Basic Data', name: 'Organizational Type', src: 'Gov. Registries', v: 97.2, cnt: '96.0M', ref: '2026-03-10', st: 'good' as const },
  { g: 'Basic Data', name: 'Foundation Year', src: 'Orbis / Crunchbase', v: 84.1, cnt: '83.1M', ref: '2026-03-08', st: 'good' as const },
  { g: 'Basic Data', name: 'Street Address', src: 'Gov. Registries', v: 91.4, cnt: '90.3M', ref: '2026-03-13', st: 'good' as const },
  { g: 'Basic Data', name: 'City', src: 'Gov. Registries', v: 92.3, cnt: '91.2M', ref: '2026-03-13', st: 'good' as const },
  { g: 'Basic Data', name: 'Country', src: 'SEC EDGAR / Orbis', v: 99.1, cnt: '97.9M', ref: '2026-03-14', st: 'good' as const },
  { g: 'Basic Data', name: 'Phone Number', src: 'Company Websites', v: 71.3, cnt: '70.5M', ref: '2026-03-07', st: 'warn' as const },
  { g: 'Basic Data', name: 'Number of Employees', src: 'Orbis / Bloomberg', v: 76.8, cnt: '75.9M', ref: '2026-03-09', st: 'warn' as const },
  { g: 'Basic Data', name: 'NAICS Code', src: 'Gov. Registries', v: 83.9, cnt: '82.9M', ref: '2026-03-12', st: 'good' as const },
  { g: 'Basic Data', name: 'Website', src: 'Company Websites', v: 55.6, cnt: '54.9M', ref: '2026-02-22', st: 'low' as const },
  { g: 'Financial Data', name: 'Revenue', src: 'SEC EDGAR / Orbis', v: 82.6, cnt: '81.6M', ref: '2026-03-12', st: 'good' as const },
  { g: 'Financial Data', name: 'Sales', src: 'SEC EDGAR', v: 78.4, cnt: '77.5M', ref: '2026-03-11', st: 'warn' as const },
  { g: 'Financial Data', name: 'Assets', src: 'SEC EDGAR', v: 74.2, cnt: '73.3M', ref: '2026-03-10', st: 'warn' as const },
  { g: 'Financial Data', name: 'Net Income', src: 'SEC EDGAR / Orbis', v: 68.5, cnt: '67.7M', ref: '2026-03-09', st: 'warn' as const },
  { g: 'Financial Data', name: 'Ticker and Exchange', src: 'Bloomberg / SEC', v: 95.1, cnt: '94.0M', ref: '2026-03-14', st: 'good' as const },
  { g: 'Corporate Hierarchy & Governance', name: 'Executive Name', src: 'Company Websites', v: 63.4, cnt: '62.6M', ref: '2026-03-06', st: 'warn' as const },
  { g: 'Corporate Hierarchy & Governance', name: 'Board of Directors', src: 'SEC EDGAR', v: 58.3, cnt: '57.6M', ref: '2026-02-28', st: 'low' as const },
  { g: 'Corporate Hierarchy & Governance', name: 'Parent Company', src: 'Orbis / BvD', v: 54.7, cnt: '54.1M', ref: '2026-02-25', st: 'low' as const },
  { g: 'Corporate Hierarchy & Governance', name: 'Mergers & Acquisition', src: 'Bloomberg / Orbis', v: 47.2, cnt: '46.6M', ref: '2026-02-20', st: 'low' as const },
  { g: 'Corporate Hierarchy & Governance', name: 'Competitors', src: 'Alternative Data', v: 39.8, cnt: '39.3M', ref: '2026-02-15', st: 'low' as const },
];

export const accData = [
  { g: 'Basic Data', name: 'Company Name', src: 'SEC EDGAR', v: 99.6, cnt: '98.3M', ref: '2026-03-14', st: 'good' as const },
  { g: 'Basic Data', name: 'Country', src: 'SEC EDGAR / Orbis', v: 99.1, cnt: '97.9M', ref: '2026-03-14', st: 'good' as const },
  { g: 'Basic Data', name: 'Foundation Year', src: 'Orbis', v: 95.2, cnt: '94.2M', ref: '2026-03-08', st: 'good' as const },
  { g: 'Basic Data', name: 'Phone Number', src: 'Company Websites', v: 88.4, cnt: '87.5M', ref: '2026-03-07', st: 'low' as const },
  { g: 'Basic Data', name: 'NAICS Code', src: 'Gov. Registries', v: 96.7, cnt: '95.6M', ref: '2026-03-12', st: 'good' as const },
  { g: 'Financial Data', name: 'Revenue', src: 'SEC EDGAR', v: 98.9, cnt: '97.8M', ref: '2026-03-12', st: 'good' as const },
  { g: 'Financial Data', name: 'Assets', src: 'SEC EDGAR', v: 97.8, cnt: '96.8M', ref: '2026-03-10', st: 'good' as const },
  { g: 'Financial Data', name: 'Net Income', src: 'SEC EDGAR', v: 96.5, cnt: '95.5M', ref: '2026-03-09', st: 'good' as const },
  { g: 'Financial Data', name: 'Ticker and Exchange', src: 'Bloomberg', v: 99.4, cnt: '98.3M', ref: '2026-03-14', st: 'good' as const },
  { g: 'Corporate Hierarchy & Governance', name: 'Executive Name', src: 'Company Websites', v: 84.2, cnt: '83.3M', ref: '2026-03-06', st: 'low' as const },
  { g: 'Corporate Hierarchy & Governance', name: 'Board of Directors', src: 'SEC EDGAR', v: 91.5, cnt: '90.5M', ref: '2026-02-28', st: 'warn' as const },
  { g: 'Corporate Hierarchy & Governance', name: 'Parent Company', src: 'Orbis / BvD', v: 88.6, cnt: '87.7M', ref: '2026-02-25', st: 'low' as const },
  { g: 'Corporate Hierarchy & Governance', name: 'Mergers & Acquisition', src: 'Bloomberg', v: 79.4, cnt: '78.5M', ref: '2026-02-20', st: 'low' as const },
];

export const compData = [
  { g: 'Basic Data', name: 'Company Name', v: 99.8, cnt: '98.5M', ref: '2026-03-14' },
  { g: 'Basic Data', name: 'Country', v: 99.1, cnt: '97.9M', ref: '2026-03-14' },
  { g: 'Basic Data', name: 'City', v: 92.3, cnt: '91.2M', ref: '2026-03-13' },
  { g: 'Basic Data', name: 'NAICS Code', v: 83.9, cnt: '82.9M', ref: '2026-03-12' },
  { g: 'Basic Data', name: 'Phone Number', v: 71.3, cnt: '70.5M', ref: '2026-03-07' },
  { g: 'Basic Data', name: 'Website', v: 55.6, cnt: '54.9M', ref: '2026-02-22' },
  { g: 'Financial Data', name: 'Revenue', v: 82.6, cnt: '81.6M', ref: '2026-03-12' },
  { g: 'Financial Data', name: 'Assets', v: 74.2, cnt: '73.3M', ref: '2026-03-10' },
  { g: 'Financial Data', name: 'Net Income', v: 68.5, cnt: '67.7M', ref: '2026-03-09' },
  { g: 'Financial Data', name: 'Ticker and Exchange', v: 95.1, cnt: '94.0M', ref: '2026-03-14' },
  { g: 'Corporate Hierarchy & Governance', name: 'Executive Name', v: 63.4, cnt: '62.6M', ref: '2026-03-06' },
  { g: 'Corporate Hierarchy & Governance', name: 'Board of Directors', v: 58.3, cnt: '57.6M', ref: '2026-02-28' },
  { g: 'Corporate Hierarchy & Governance', name: 'Parent Company', v: 54.7, cnt: '54.1M', ref: '2026-02-25' },
  { g: 'Corporate Hierarchy & Governance', name: 'Mergers & Acquisition', v: 47.2, cnt: '46.6M', ref: '2026-02-20' },
];

export const heatmapRegions = [
  { name: 'North America', data: [8.2, 7.9, 8.8, 9.1, 9.4, 10.2, 11.3, 10.8, 9.7, 9.2, 8.6, 8.1] },
  { name: 'Europe', data: [5.9, 5.4, 6.2, 6.8, 7.1, 7.6, 8.4, 8.0, 7.3, 6.9, 6.1, 5.7] },
  { name: 'Asia Pacific', data: [4.1, 3.8, 4.5, 5.0, 5.3, 5.8, 7.2, 6.6, 5.5, 5.1, 4.4, 4.0] },
  { name: 'Latin America', data: [1.4, 1.2, 1.6, 1.9, 2.1, 2.3, 2.8, 2.5, 2.0, 1.8, 1.5, 1.1] },
  { name: 'MEA', data: [0.7, 0.6, 0.9, 1.0, 1.1, 1.3, 1.7, 1.5, 1.2, 0.9, 0.7, 0.5] },
  { name: 'Rest of World', data: [0.3, 0.3, 0.4, 0.5, 0.6, 0.7, 0.9, 0.8, 0.6, 0.5, 0.4, 0.3] },
];

export const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export const geoQuality = [
  { region: 'North America', score: '96.4%' },
  { region: 'Europe', score: '93.1%' },
  { region: 'Asia Pacific', score: '88.7%' },
  { region: 'Latin America', score: '79.2%' },
  { region: 'MEA', score: '71.5%' },
  { region: 'Rest of World', score: '65.3%' },
];

export type StatusType = 'good' | 'warn' | 'low';

export const dataGroups = ['Basic Data', 'Financial Data', 'Corporate Hierarchy & Governance'];

// Color helpers
export function getColorForValue(v: number): string {
  return v >= 80 ? '#1A7A4A' : v >= 60 ? '#C97A00' : '#C0392B';
}

export function getAccuracyColor(v: number): string {
  return v >= 95 ? '#1A7A4A' : v >= 90 ? '#C97A00' : '#C0392B';
}

// Heatmap color interpolation
const colorStops = [
  { pos: 0, r: 192, g: 57, b: 43 },
  { pos: 0.2, r: 230, g: 126, b: 34 },
  { pos: 0.4, r: 241, g: 196, b: 15 },
  { pos: 0.65, r: 130, g: 200, b: 100 },
  { pos: 0.82, r: 39, g: 174, b: 96 },
  { pos: 1, r: 15, g: 79, b: 46 },
];

const allValues = heatmapRegions.flatMap(r => r.data);
const minVal = Math.min(...allValues);
const maxVal = Math.max(...allValues);

export function getHeatmapColor(v: number): string {
  const t = (v - minVal) / (maxVal - minVal);
  let i = 0;
  for (let k = 0; k < colorStops.length - 1; k++) {
    if (t >= colorStops[k].pos && t <= colorStops[k + 1].pos) { i = k; break; }
  }
  const a = colorStops[i], b = colorStops[Math.min(i + 1, colorStops.length - 1)];
  const f = (t - a.pos) / ((b.pos - a.pos) || 1);
  return `rgb(${Math.round(a.r + (b.r - a.r) * f)},${Math.round(a.g + (b.g - a.g) * f)},${Math.round(a.b + (b.b - a.b) * f)})`;
}

export function getScaleLabel(v: number): string {
  const s = ((v - minVal) / (maxVal - minVal)) * 100;
  if (s < 20) return 'Very low';
  if (s < 40) return 'Low';
  if (s < 60) return 'Moderate';
  if (s < 75) return 'Good';
  if (s < 90) return 'Strong';
  return 'Excellent';
}

export function getFreshnessPill(dateStr: string): { label: string; class: string } {
  const days = (Date.now() - new Date(dateStr).getTime()) / 86400000;
  if (days < 30) return { label: 'Fresh', class: 'good' };
  if (days < 90) return { label: 'Aging', class: 'warn' };
  return { label: 'Stale', class: 'low' };
}
