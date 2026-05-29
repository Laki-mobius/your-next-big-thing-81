// Static data for XDAS dashboard

// POC attributes — ordered per requested display sequence
export const covData = [
  { g: 'Basic Data', name: 'Company Name', src: 'POC Input', v: 100, cnt: '1000', ref: '2026-05-25', st: 'good' as const },
  { g: 'Basic Data', name: 'Address', src: 'SOS / Government Source', v: 92.9, cnt: '929', ref: '2026-05-25', st: 'good' as const },
  { g: 'Basic Data', name: 'City', src: 'SOS / Government Source', v: 95.1, cnt: '951', ref: '2026-05-25', st: 'good' as const },
  { g: 'Basic Data', name: 'State/Province', src: 'SOS / Government Source', v: 66.8, cnt: '668', ref: '2026-05-25', st: 'warn' as const },
  { g: 'Basic Data', name: 'PostalCode', src: 'SOS / Government Source', v: 87.5, cnt: '875', ref: '2026-05-25', st: 'good' as const },
  { g: 'Basic Data', name: 'Country', src: 'SOS / Government Source', v: 97.3, cnt: '973', ref: '2026-05-25', st: 'good' as const },
  { g: 'Basic Data', name: 'Company_email', src: 'Website / Zoominfo', v: 26.4, cnt: '264', ref: '2026-05-25', st: 'low' as const },
  { g: 'Basic Data', name: 'Country Code', src: 'Website / Zoominfo', v: 35.5, cnt: '355', ref: '2026-05-25', st: 'low' as const },
  { g: 'Basic Data', name: 'Phone', src: 'Website / Zoominfo', v: 46.1, cnt: '461', ref: '2026-05-25', st: 'low' as const },
  { g: 'Basic Data', name: 'Fax', src: 'Website / Zoominfo', v: 10.6, cnt: '106', ref: '2026-05-25', st: 'low' as const },
  { g: 'Basic Data', name: 'TollFree', src: 'Website / Zoominfo', v: 5.5, cnt: '55', ref: '2026-05-25', st: 'low' as const },
  { g: 'Basic Data', name: 'Company_LinkedIn', src: 'LinkedIn / Website', v: 28.7, cnt: '287', ref: '2026-05-25', st: 'low' as const },
  { g: 'Basic Data', name: 'Website', src: 'Zoominfo / Website', v: 50.7, cnt: '507', ref: '2026-05-25', st: 'low' as const },
  { g: 'Corporate Hierarchy & Governance', name: 'First Name', src: 'Government Source / Website', v: 100, cnt: '5099', ref: '2026-05-23', st: 'good' as const },
  { g: 'Corporate Hierarchy & Governance', name: 'Middle Name', src: 'Government Source / Website', v: 19.7, cnt: '1002', ref: '2026-05-23', st: 'low' as const },
  { g: 'Corporate Hierarchy & Governance', name: 'Last Name', src: 'Government Source / Website', v: 100, cnt: '5099', ref: '2026-05-23', st: 'good' as const },
  { g: 'Corporate Hierarchy & Governance', name: 'Suffix', src: 'Government Source / Website', v: 0.4, cnt: '18', ref: '2026-05-23', st: 'low' as const },
  { g: 'Corporate Hierarchy & Governance', name: 'Executive Title', src: 'Government Source / Website', v: 100, cnt: '5099', ref: '2026-05-23', st: 'good' as const },
  { g: 'Basic Data', name: 'Number of Employees', src: 'Zoominfo / Website / LinkedIn', v: 55.3, cnt: '553', ref: '2026-05-25', st: 'low' as const },
  { g: 'Financial Data', name: 'Revenue', src: 'Zoominfo / SOS / Annual Report', v: 51.6, cnt: '516', ref: '2026-05-25', st: 'low' as const },
  { g: 'Financial Data', name: 'Revenue Currency', src: 'Zoominfo / SOS / Annual Report', v: 51.6, cnt: '516', ref: '2026-05-25', st: 'low' as const },
  { g: 'Financial Data', name: 'Revenue Fiscal Year', src: 'Annual Report / SOS', v: 26.0, cnt: '260', ref: '2026-05-25', st: 'low' as const },
  { g: 'Financial Data', name: 'Annual Report', src: 'Annual Report', v: 5.2, cnt: '52', ref: '2026-05-25', st: 'low' as const },
];

export const accData = [
  { g: 'Basic Data', name: 'Company Name', src: 'POC Input', v: 100, cnt: '1000', ref: '2026-05-25', st: 'good' as const },
  { g: 'Basic Data', name: 'Address', src: 'SOS / Government Source', v: 98.0, cnt: '910', ref: '2026-05-25', st: 'good' as const },
  { g: 'Basic Data', name: 'City', src: 'SOS / Government Source', v: 99.0, cnt: '941', ref: '2026-05-25', st: 'good' as const },
  { g: 'Basic Data', name: 'State/Province', src: 'SOS / Government Source', v: 98.1, cnt: '655', ref: '2026-05-25', st: 'good' as const },
  { g: 'Basic Data', name: 'PostalCode', src: 'SOS / Government Source', v: 99.0, cnt: '866', ref: '2026-05-25', st: 'good' as const },
  { g: 'Basic Data', name: 'Country', src: 'SOS / Government Source', v: 99.0, cnt: '963', ref: '2026-05-25', st: 'good' as const },
  { g: 'Basic Data', name: 'Company_email', src: 'Website / Zoominfo', v: 97.0, cnt: '256', ref: '2026-05-25', st: 'good' as const },
  { g: 'Basic Data', name: 'Country Code', src: 'Website / Zoominfo', v: 98.9, cnt: '351', ref: '2026-05-25', st: 'good' as const },
  { g: 'Basic Data', name: 'Phone', src: 'Website / Zoominfo', v: 98.0, cnt: '452', ref: '2026-05-25', st: 'good' as const },
  { g: 'Basic Data', name: 'Fax', src: 'Website / Zoominfo', v: 96.2, cnt: '102', ref: '2026-05-25', st: 'good' as const },
  { g: 'Basic Data', name: 'TollFree', src: 'Website / Zoominfo', v: 96.4, cnt: '53', ref: '2026-05-25', st: 'good' as const },
  { g: 'Basic Data', name: 'Company_LinkedIn', src: 'LinkedIn / Website', v: 96.9, cnt: '278', ref: '2026-05-25', st: 'good' as const },
  { g: 'Basic Data', name: 'Website', src: 'Zoominfo / Website', v: 98.0, cnt: '497', ref: '2026-05-25', st: 'good' as const },
  { g: 'Corporate Hierarchy & Governance', name: 'First Name', src: 'Government Source / Website', v: 99.0, cnt: '5048', ref: '2026-05-23', st: 'good' as const },
  { g: 'Corporate Hierarchy & Governance', name: 'Middle Name', src: 'Government Source / Website', v: 97.0, cnt: '972', ref: '2026-05-23', st: 'good' as const },
  { g: 'Corporate Hierarchy & Governance', name: 'Last Name', src: 'Government Source / Website', v: 99.0, cnt: '5048', ref: '2026-05-23', st: 'good' as const },
  { g: 'Corporate Hierarchy & Governance', name: 'Suffix', src: 'Government Source / Website', v: 94.4, cnt: '17', ref: '2026-05-23', st: 'good' as const },
  { g: 'Corporate Hierarchy & Governance', name: 'Executive Title', src: 'Government Source / Website', v: 98.0, cnt: '4997', ref: '2026-05-23', st: 'good' as const },
  { g: 'Basic Data', name: 'Number of Employees', src: 'Zoominfo / Website / LinkedIn', v: 98.0, cnt: '542', ref: '2026-05-25', st: 'good' as const },
  { g: 'Financial Data', name: 'Revenue', src: 'Zoominfo / SOS / Annual Report', v: 98.0, cnt: '506', ref: '2026-05-25', st: 'good' as const },
  { g: 'Financial Data', name: 'Revenue Currency', src: 'Zoominfo / SOS / Annual Report', v: 99.5, cnt: '513', ref: '2026-05-25', st: 'good' as const },
  { g: 'Financial Data', name: 'Revenue Fiscal Year', src: 'Annual Report / SOS', v: 97.6, cnt: '254', ref: '2026-05-25', st: 'good' as const },
  { g: 'Financial Data', name: 'Annual Report', src: 'Annual Report', v: 93.8, cnt: '15', ref: '2026-05-25', st: 'good' as const },
];

export const compData = [
  { g: 'Basic Data', name: 'Company Name', v: 100, cnt: '1000', ref: '2026-05-25' },
  { g: 'Basic Data', name: 'Address', v: 92.9, cnt: '929', ref: '2026-05-25' },
  { g: 'Basic Data', name: 'City', v: 95.1, cnt: '951', ref: '2026-05-25' },
  { g: 'Basic Data', name: 'State/Province', v: 66.8, cnt: '668', ref: '2026-05-25' },
  { g: 'Basic Data', name: 'PostalCode', v: 87.5, cnt: '875', ref: '2026-05-25' },
  { g: 'Basic Data', name: 'Country', v: 97.3, cnt: '973', ref: '2026-05-25' },
  { g: 'Basic Data', name: 'Company_email', v: 26.4, cnt: '264', ref: '2026-05-25' },
  { g: 'Basic Data', name: 'Country Code', v: 35.5, cnt: '355', ref: '2026-05-25' },
  { g: 'Basic Data', name: 'Phone', v: 46.1, cnt: '461', ref: '2026-05-25' },
  { g: 'Basic Data', name: 'Fax', v: 10.6, cnt: '106', ref: '2026-05-25' },
  { g: 'Basic Data', name: 'TollFree', v: 5.5, cnt: '55', ref: '2026-05-25' },
  { g: 'Basic Data', name: 'Company_LinkedIn', v: 28.7, cnt: '287', ref: '2026-05-25' },
  { g: 'Basic Data', name: 'Website', v: 50.7, cnt: '507', ref: '2026-05-25' },
  { g: 'Corporate Hierarchy & Governance', name: 'First Name', v: 100, cnt: '5099', ref: '2026-05-23' },
  { g: 'Corporate Hierarchy & Governance', name: 'Middle Name', v: 19.7, cnt: '1002', ref: '2026-05-23' },
  { g: 'Corporate Hierarchy & Governance', name: 'Last Name', v: 100, cnt: '5099', ref: '2026-05-23' },
  { g: 'Corporate Hierarchy & Governance', name: 'Suffix', v: 0.4, cnt: '18', ref: '2026-05-23' },
  { g: 'Corporate Hierarchy & Governance', name: 'Executive Title', v: 100, cnt: '5099', ref: '2026-05-23' },
  { g: 'Basic Data', name: 'Number of Employees', v: 55.3, cnt: '553', ref: '2026-05-25' },
  { g: 'Financial Data', name: 'Revenue', v: 51.6, cnt: '516', ref: '2026-05-25' },
  { g: 'Financial Data', name: 'Revenue Currency', v: 51.6, cnt: '516', ref: '2026-05-25' },
  { g: 'Financial Data', name: 'Revenue Fiscal Year', v: 26.0, cnt: '260', ref: '2026-05-25' },
  { g: 'Financial Data', name: 'Annual Report', v: 5.2, cnt: '52', ref: '2026-05-25' },
];


export const heatmapRegions = [
  { name: 'North America', data: [82, 79, 88, 91, 94, 102, 113, 108, 97, 92, 86, 81] },
  { name: 'Europe', data: [59, 54, 62, 68, 71, 76, 84, 80, 73, 69, 61, 57] },
  { name: 'Asia Pacific', data: [41, 38, 45, 50, 53, 58, 72, 66, 55, 51, 44, 40] },
  { name: 'Latin America', data: [14, 12, 16, 19, 21, 23, 28, 25, 20, 18, 15, 11] },
  { name: 'MEA', data: [7, 6, 9, 10, 11, 13, 17, 15, 12, 9, 7, 5] },
  { name: 'Rest of World', data: [3, 3, 4, 5, 6, 7, 9, 8, 6, 5, 4, 3] },
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
