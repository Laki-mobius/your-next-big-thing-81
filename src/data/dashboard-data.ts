// Static data for XDAS dashboard

// Scoped to the 4 POC attributes from LexisNexis dataset (1,000 records)
export const covData = [
  { g: 'Basic Data', name: 'Company Website', src: 'Zoominfo / Website', v: 46.2, cnt: '462', ref: '2026-05-21', st: 'low' as const },
  { g: 'Financial Data', name: 'Revenue', src: 'Zoominfo / SOS / Annual Report', v: 51.4, cnt: '514', ref: '2026-05-22', st: 'low' as const },
  { g: 'Basic Data', name: 'Employee Count', src: 'Zoominfo / Website / LinkedIn', v: 54.2, cnt: '542', ref: '2026-05-22', st: 'low' as const },
  { g: 'Corporate Hierarchy & Governance', name: 'Personnel', src: 'Government Source / Website', v: 50.3, cnt: '503', ref: '2026-05-22', st: 'low' as const },
];

export const accData = [
  { g: 'Basic Data', name: 'Company Website', src: 'Zoominfo / Website', v: 95.4, cnt: '441', ref: '2026-05-21', st: 'good' as const },
  { g: 'Financial Data', name: 'Revenue', src: 'Zoominfo / SOS / Annual Report', v: 92.2, cnt: '474', ref: '2026-05-22', st: 'warn' as const },
  { g: 'Basic Data', name: 'Employee Count', src: 'Zoominfo / Website / LinkedIn', v: 89.1, cnt: '483', ref: '2026-05-22', st: 'warn' as const },
  { g: 'Corporate Hierarchy & Governance', name: 'Personnel', src: 'Government Source / Website', v: 96.6, cnt: '486', ref: '2026-05-22', st: 'good' as const },
];

export const compData = [
  { g: 'Basic Data', name: 'Company Website', v: 100, cnt: '462', ref: '2026-05-21' },
  { g: 'Financial Data', name: 'Revenue', v: 100, cnt: '514', ref: '2026-05-22' },
  { g: 'Basic Data', name: 'Employee Count', v: 100, cnt: '542', ref: '2026-05-22' },
  { g: 'Corporate Hierarchy & Governance', name: 'Personnel', v: 100, cnt: '503', ref: '2026-05-22' },
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
