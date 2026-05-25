export type JobStatus = 'Running' | 'Completed' | 'Failed' | 'Scheduled' | 'Pending';

export interface Job {
  id: string;
  name: string;
  status: JobStatus;
  records: number;
  progress: number;
  group: 'extraction' | 'aggregators' | 'processing' | 'specialized';
  tier: string;
  logs: LogEntry[];
  flowSteps: FlowStep[];
  runtime: string;
  errorRate: string;
}

export interface FlowStep {
  label: string;
  state: 'complete' | 'active' | 'pending' | 'failed';
}

export interface LogEntry {
  time: string;
  level: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR';
  message: string;
}

export interface AlertItem {
  type: 'Error' | 'Event' | 'Warning' | 'Insight';
  severity: 'High' | 'Medium' | 'Info';
  title: string;
  description: string;
  time: string;
  category: 'job' | 'workflow' | 'hitl' | 'macro';
}

export interface ScheduleItem {
  name: string;
  nextRun: string;
  frequency: string;
}

export const summaryStats = {
  totalToday: 6482,
  running: 142,
  completed: 6285,
  failed: 55,
};

export function formatNumber(n: number): string {
  return n.toLocaleString();
}

const defaultFlowComplete: FlowStep[] = [
  { label: 'Source', state: 'complete' },
  { label: 'Extract', state: 'complete' },
  { label: 'Transform', state: 'complete' },
  { label: 'Validate', state: 'complete' },
  { label: 'Load', state: 'complete' },
];

const defaultFlowRunning: FlowStep[] = [
  { label: 'Source', state: 'complete' },
  { label: 'Extract', state: 'complete' },
  { label: 'Transform', state: 'active' },
  { label: 'Validate', state: 'pending' },
  { label: 'Load', state: 'pending' },
];

const defaultFlowFailed: FlowStep[] = [
  { label: 'Source', state: 'complete' },
  { label: 'Extract', state: 'failed' },
  { label: 'Transform', state: 'pending' },
  { label: 'Validate', state: 'pending' },
  { label: 'Load', state: 'pending' },
];

const defaultFlowPending: FlowStep[] = [
  { label: 'Source', state: 'pending' },
  { label: 'Extract', state: 'pending' },
  { label: 'Transform', state: 'pending' },
  { label: 'Validate', state: 'pending' },
  { label: 'Load', state: 'pending' },
];

const sampleLogs: LogEntry[] = [
  { time: '09:14:22', level: 'INFO', message: 'Job initialized. Connecting to data source...' },
  { time: '09:14:25', level: 'SUCCESS', message: 'Connection established. Starting extraction.' },
  { time: '09:15:01', level: 'INFO', message: 'Extracted 12,450 records from EDGAR API.' },
  { time: '09:15:33', level: 'INFO', message: 'Applying transformation rules (v3.2.1)...' },
  { time: '09:16:02', level: 'WARN', message: 'Schema mismatch on 3 records — applying fallback.' },
  { time: '09:16:44', level: 'INFO', message: 'Validation pass: 12,447 of 12,450 records valid.' },
  { time: '09:17:10', level: 'SUCCESS', message: 'Load complete. 12,447 records persisted.' },
];

const failedLogs: LogEntry[] = [
  { time: '10:02:11', level: 'INFO', message: 'Job initialized. Connecting to SEC EDGAR...' },
  { time: '10:02:14', level: 'ERROR', message: 'Authentication token expired for EDGAR API gateway.' },
  { time: '10:02:15', level: 'ERROR', message: 'Retry 1/3 failed. Connection refused.' },
  { time: '10:02:18', level: 'ERROR', message: 'Retry 2/3 failed. Timeout after 3000ms.' },
  { time: '10:02:21', level: 'ERROR', message: 'Retry 3/3 failed. Job terminated.' },
];

export const jobsData: Job[] = [
  { id: 'JOB-7842', name: 'SEC Data', status: 'Running', records: 12450, progress: 67, group: 'extraction', tier: 'Tier 1', flowSteps: defaultFlowRunning, logs: sampleLogs, runtime: '1h 45m 12s', errorRate: '0.02%' },
  { id: 'JOB-7841', name: 'Stock Exchanges', status: 'Completed', records: 8920, progress: 100, group: 'extraction', tier: 'Tier 1, 2', flowSteps: defaultFlowComplete, logs: sampleLogs, runtime: '0h 52m 08s', errorRate: '0.00%' },
  { id: 'JOB-7840', name: 'SEDAR+ Canada', status: 'Completed', records: 6340, progress: 100, group: 'extraction', tier: 'Tier 2', flowSteps: defaultFlowComplete, logs: sampleLogs, runtime: '0h 38m 44s', errorRate: '0.01%' },
  { id: 'JOB-7839', name: 'Data Extraction - Websites (IR)', status: 'Failed', records: 0, progress: 12, group: 'extraction', tier: 'Tier 1, 2', flowSteps: defaultFlowFailed, logs: failedLogs, runtime: '0h 00m 10s', errorRate: '100%' },
  { id: 'JOB-7838', name: 'Data Extraction - Websites (Basic)', status: 'Running', records: 3200, progress: 45, group: 'extraction', tier: 'Tier 3, 4', flowSteps: defaultFlowRunning, logs: sampleLogs, runtime: '0h 22m 15s', errorRate: '0.03%' },
  { id: 'JOB-7837', name: 'Data Extraction - Reports (XBRL/HTML)', status: 'Scheduled', records: 0, progress: 0, group: 'extraction', tier: 'Tier 1', flowSteps: defaultFlowPending, logs: [], runtime: '—', errorRate: '—' },
  { id: 'JOB-7836', name: 'Data Extraction - Reports (PDF/Unstructured)', status: 'Pending', records: 0, progress: 0, group: 'extraction', tier: 'Tier 2, 3, 4', flowSteps: defaultFlowPending, logs: [], runtime: '—', errorRate: '—' },
  { id: 'JOB-7849', name: 'Registry Data', status: 'Running', records: 87400, progress: 56, group: 'extraction', tier: 'Tier 3, 4', flowSteps: defaultFlowRunning, logs: sampleLogs, runtime: '1h 58m 40s', errorRate: '0.08%' },
  { id: 'JOB-7848', name: 'Web Crawling', status: 'Completed', records: 62100, progress: 100, group: 'extraction', tier: 'Tier 3, 4', flowSteps: defaultFlowComplete, logs: sampleLogs, runtime: '1h 42m 12s', errorRate: '0.02%' },
  { id: 'JOB-7847', name: 'Event Monitoring', status: 'Running', records: 34500, progress: 41, group: 'extraction', tier: 'Tier 1, 2', flowSteps: defaultFlowRunning, logs: sampleLogs, runtime: '0h 55m 30s', errorRate: '0.06%' },
  { id: 'JOB-7835', name: 'Third-party Aggregators (Financial DBs)', status: 'Running', records: 245000, progress: 78, group: 'aggregators', tier: 'All Tiers', flowSteps: defaultFlowRunning, logs: sampleLogs, runtime: '3h 12m 05s', errorRate: '0.04%' },
  { id: 'JOB-7834', name: 'Third-party Aggregators (D&B)', status: 'Completed', records: 189400, progress: 100, group: 'aggregators', tier: 'Tier 3', flowSteps: defaultFlowComplete, logs: sampleLogs, runtime: '2h 08m 33s', errorRate: '0.01%' },
  { id: 'JOB-7833', name: 'Third-party Aggregators (Orbis/Creditsafe)', status: 'Completed', records: 54200, progress: 100, group: 'aggregators', tier: 'Tier 4', flowSteps: defaultFlowComplete, logs: sampleLogs, runtime: '1h 15m 20s', errorRate: '0.00%' },
  { id: 'JOB-7832', name: 'Specialized Sources (Banking)', status: 'Pending', records: 0, progress: 0, group: 'specialized', tier: 'Tier 1', flowSteps: defaultFlowPending, logs: [], runtime: '—', errorRate: '—' },
  { id: 'JOB-7831', name: 'Specialized Sources (Tax)', status: 'Running', records: 18700, progress: 33, group: 'specialized', tier: 'Tier 3', flowSteps: defaultFlowRunning, logs: sampleLogs, runtime: '0h 45m 11s', errorRate: '0.05%' },
  { id: 'JOB-7846', name: 'Specialized Sources (UCC/Liens)', status: 'Failed', records: 1200, progress: 8, group: 'specialized', tier: 'Tier 3, 4', flowSteps: defaultFlowFailed, logs: failedLogs, runtime: '0h 02m 18s', errorRate: '45.2%' },
  { id: 'JOB-7830', name: 'Scoring & Refresh', status: 'Running', records: 98200, progress: 62, group: 'processing', tier: 'All Tiers', flowSteps: defaultFlowRunning, logs: sampleLogs, runtime: '2h 10m 05s', errorRate: '0.01%' },
  { id: 'JOB-7829', name: 'Data Consolidation', status: 'Completed', records: 156000, progress: 100, group: 'processing', tier: 'All Tiers', flowSteps: defaultFlowComplete, logs: sampleLogs, runtime: '1h 42m 12s', errorRate: '0.02%' },
  { id: 'JOB-7828', name: 'Deduplication', status: 'Running', records: 34500, progress: 41, group: 'processing', tier: 'All Tiers', flowSteps: defaultFlowRunning, logs: sampleLogs, runtime: '0h 55m 30s', errorRate: '0.06%' },
  { id: 'JOB-7827', name: 'QC Validation', status: 'Completed', records: 142000, progress: 100, group: 'processing', tier: 'All Tiers', flowSteps: defaultFlowComplete, logs: sampleLogs, runtime: '1h 18m 44s', errorRate: '0.00%' },
  { id: 'JOB-7826', name: 'Hierarchy Impact', status: 'Scheduled', records: 0, progress: 0, group: 'processing', tier: 'All Tiers', flowSteps: defaultFlowPending, logs: [], runtime: '—', errorRate: '—' },
];

export const alertsData: AlertItem[] = [
  { type: 'Error', severity: 'High', title: 'Job Failed: SEC Data Ingest', description: 'Authentication token expired for EDGAR API gateway.', time: '2 min ago', category: 'job' },
  { type: 'Event', severity: 'Info', title: 'IPO Detected: TechFlow Inc', description: 'New S-1 filing detected for TechFlow Solutions Group.', time: '8 min ago', category: 'workflow' },
  { type: 'Warning', severity: 'Medium', title: 'Degraded Performance: Orbis', description: 'API latency increased above threshold (>2.5s).', time: '15 min ago', category: 'job' },
  { type: 'Event', severity: 'Medium', title: 'Delisting: Zenith Retail', description: 'Nasdaq delisting notice issued for ticker ZENR.', time: '22 min ago', category: 'workflow' },
  { type: 'Warning', severity: 'Medium', title: 'HITL Review Pending: Acme Corp', description: '3 fields flagged for manual review on entity Acme Corp.', time: '30 min ago', category: 'hitl' },
  { type: 'Event', severity: 'Info', title: 'HITL Batch Approved: Q4 Filings', description: '12 records approved in batch review cycle.', time: '45 min ago', category: 'hitl' },
  { type: 'Insight', severity: 'Info', title: 'Hierarchy Links Re-validated', description: '35,400 parent-subsidiary relationships refreshed this month across all tiers.', time: '1h ago', category: 'macro' },
  { type: 'Insight', severity: 'Medium', title: 'M&A Volume Detected', description: '128 global M&A events identified, affecting 4,500 subsidiary records.', time: '2h ago', category: 'macro' },
  { type: 'Insight', severity: 'Info', title: 'UBO Transparency Index', description: 'Percentage of entities with confirmed Ultimate Beneficial Owners increased by 2.4%.', time: '3h ago', category: 'macro' },
  { type: 'Insight', severity: 'Info', title: 'Completeness Gain', description: "Average 'Basic Data' coverage for Tier 3 entities improved from 82% to 88%.", time: '4h ago', category: 'macro' },
  { type: 'Insight', severity: 'Info', title: 'Accuracy Delta', description: "Aggregate accuracy for 'Financial Data' group rose by 1.2% following the Q1 filing cycle.", time: '5h ago', category: 'macro' },
  { type: 'Event', severity: 'Info', title: 'Stale Data Cleanup', description: "150,000 records successfully archived or marked 'Dormant' based on inactivity triggers.", time: '6h ago', category: 'macro' },
  { type: 'Insight', severity: 'Info', title: 'Automation vs. Manual (HITL)', description: "92% of this month's updates were processed via AI-Workflows; 8% required Human-in-the-Loop validation.", time: '8h ago', category: 'macro' },
  { type: 'Warning', severity: 'Medium', title: 'Source Reliability Alert', description: 'Latency detected in European Registry feeds; refresh cycles for 12,000 records delayed by 48 hours.', time: '10h ago', category: 'macro' },
];

export const scheduleData: ScheduleItem[] = [
  { name: 'EDGAR Sync', nextRun: '12:00 PM', frequency: 'Every 2h' },
  { name: 'CH Bulk Update', nextRun: '02:30 PM', frequency: 'Daily' },
  { name: 'News Aggregator', nextRun: '11:15 AM', frequency: 'Every 15m' },
];
