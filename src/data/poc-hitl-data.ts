// Real HITL validation data derived from the POC dataset (1,000 companies + 5,099 personnel).
// Replaces the previous mock-only `sampleRecords` / `attributeCategories` arrays so that
// counts and rows shown in both the Record-wise and Attribute Category-wise sub screens
// match the figures displayed in the Metrics Dashboard.

import {
  pocCompaniesRaw,
  pocPersonnelRaw,
  pocMetrics,
} from "./poc-dataset";
import type {
  ValidationRecord,
  ValidationAttribute,
} from "./hitl-validation-data";
import type { AttributeCategory } from "./attribute-category-data";

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const PAD = (n: number, w = 4) => String(n).padStart(w, "0");

const fmtMoney = (val: string, cur?: string): string => {
  if (!val) return "";
  const n = Number(val);
  if (!isFinite(n)) return `${cur ?? ""} ${val}`.trim();
  if (n >= 1_000_000_000) return `${cur ?? ""} ${(n / 1_000_000_000).toFixed(2)}B`.trim();
  if (n >= 1_000_000) return `${cur ?? ""} ${(n / 1_000_000).toFixed(1)}M`.trim();
  if (n >= 1_000) return `${cur ?? ""} ${(n / 1_000).toFixed(0)}K`.trim();
  return `${cur ?? ""} ${n.toLocaleString()}`.trim();
};

const refs = (...rs: { name: string; url: string }[]) =>
  rs.filter(r => r.url && r.url.trim() !== "");

const captureDateOf = (row: Record<string, string>): string => {
  const d =
    row["Revenue_capture_date"] ||
    row["Company_website_capture_date"] ||
    row["Employee_count_capture_date"] ||
    "";
  return d || "2026-05-13";
};

// -----------------------------------------------------------------------------
// Build per-company personnel rollup
// -----------------------------------------------------------------------------

interface PersonnelRollup {
  count: number;
  ceo?: string;
  cfo?: string;
  chair?: string;
  topTitles: string[];
}

const personnelByCompany = new Map<string, PersonnelRollup>();
for (const p of pocPersonnelRaw) {
  const id = p["Client_company_id"];
  if (!id) continue;
  let r = personnelByCompany.get(id);
  if (!r) {
    r = { count: 0, topTitles: [] };
    personnelByCompany.set(id, r);
  }
  r.count += 1;
  const t = (p["Exec_title_formatted"] || p["Exec_title_raw"] || "").trim();
  const fullName = [p["First name"], p["Middle name"], p["Last name"]]
    .filter(Boolean)
    .join(" ")
    .trim();
  const upper = t.toUpperCase();
  if (!r.ceo && upper.includes("CEO")) r.ceo = fullName;
  if (!r.cfo && upper.includes("CFO")) r.cfo = fullName;
  if (!r.chair && (upper.includes("CHM") || upper.includes("CHAIR"))) r.chair = fullName;
  if (r.topTitles.length < 4 && t) r.topTitles.push(`${fullName} — ${t}`);
}

// -----------------------------------------------------------------------------
// Build ValidationRecord per company
// -----------------------------------------------------------------------------

const buildCompanyRecord = (row: Record<string, string>, idx: number): ValidationRecord => {
  const companyName = row["Company_name"] || `Entity ${idx + 1}`;
  const websiteUrl = row["Company_website_url"]
    ? (row["Company_website_url"].startsWith("http")
        ? row["Company_website_url"]
        : `https://${row["Company_website_url"].replace(/^\/+/, "").replace(/^www\./i, "")}`)
    : "";
  const revenueUrl = row["Revenue_source_url"] || "";
  const employeeUrl = row["Employee_count_source_url"] || "";
  const addressUrl = row["Address_URL"] || "";
  const phoneUrl = row["Phone_URL"] || "";
  const exceptionNote = (row["Exception_notes"] || "").trim();
  const matchStatus = row["Match_status"] || "";
  const personnel = personnelByCompany.get(row["Client_company_id"] || "");
  const captureDate = captureDateOf(row);

  // Confidence: penalize missing fields & exception flags
  const keyFields = [
    row["Company_website_url"],
    row["Revenue_value"],
    row["Employee_count_value"],
    row["Address"],
    row["City"],
    row["Company_email"] || row["Phone"],
  ];
  const filledKey = keyFields.filter(Boolean).length;
  let confidence = 60 + Math.round((filledKey / keyFields.length) * 38);
  if (exceptionNote) confidence = Math.min(confidence, 72);
  if (matchStatus === "Closed") confidence = 35;
  if (matchStatus === "Merger & Acquisition") confidence = 55;

  // Status mapping:
  //  - "rejected" for Closed match status (2 records)
  //  - "in_review" for exception_notes present (846 records)
  //  - "pending" otherwise
  let status: ValidationRecord["status"] = "pending";
  if (matchStatus === "Closed") status = "rejected";
  else if (exceptionNote) status = "in_review";

  // Determine attribute status. Missing -> "pending", exception -> "flagged", else "validated"
  const attrStatus = (val: string, flagged = false): ValidationAttribute["status"] => {
    if (!val || val.trim() === "") return "pending";
    if (flagged) return "flagged";
    return "validated";
  };

  const websiteRefs = refs(
    { name: "Company Website", url: websiteUrl },
    { name: "Source URL", url: row["Company_website_source_url"] || "" },
  );
  const revenueRefs = refs(
    { name: row["Revenue_source_type"] || "Revenue Source", url: revenueUrl },
  );
  const empRefs = refs(
    { name: row["Employee_source_type"] || "Employee Source", url: employeeUrl },
  );
  const addrRefs = refs(
    { name: row["Address_source_type"] || "Address Source", url: addressUrl },
  );

  const attributes: ValidationAttribute[] = [
    { name: "Company Name", extractedValue: companyName, currentValue: companyName, status: "validated", qcFlag: false, sourceRefs: addrRefs.length ? addrRefs : websiteRefs },
    { name: "Country", extractedValue: row["Country"] || "", currentValue: row["Country"] || "", status: attrStatus(row["Country"]), qcFlag: false, sourceRefs: addrRefs },
    { name: "Website", extractedValue: websiteUrl, currentValue: websiteUrl, status: attrStatus(websiteUrl), qcFlag: !websiteUrl, sourceRefs: websiteRefs },
    { name: "Revenue", extractedValue: fmtMoney(row["Revenue_value"], row["Revenue_currency"]), currentValue: fmtMoney(row["Revenue_value"], row["Revenue_currency"]), status: attrStatus(row["Revenue_value"], !!exceptionNote), qcFlag: !row["Revenue_value"], sourceRefs: revenueRefs },
    { name: "Revenue Fiscal Year", extractedValue: row["Revenue_fiscal_year"] || "", currentValue: row["Revenue_fiscal_year"] || "", status: attrStatus(row["Revenue_fiscal_year"]), qcFlag: false, sourceRefs: revenueRefs },
    { name: "Employee Count", extractedValue: row["Employee_count_value"] || "", currentValue: row["Employee_count_value"] || "", status: attrStatus(row["Employee_count_value"]), qcFlag: !row["Employee_count_value"], sourceRefs: empRefs },
    { name: "Address", extractedValue: row["Address"] || "", currentValue: row["Address"] || "", status: attrStatus(row["Address"]), qcFlag: false, sourceRefs: addrRefs },
    { name: "City", extractedValue: row["City"] || "", currentValue: row["City"] || "", status: attrStatus(row["City"]), qcFlag: false, sourceRefs: addrRefs },
    { name: "State", extractedValue: row["State/Province"] || "", currentValue: row["State/Province"] || "", status: attrStatus(row["State/Province"]), qcFlag: !row["State/Province"], sourceRefs: addrRefs },
    { name: "Zip Code", extractedValue: row["PostalCode"] || "", currentValue: row["PostalCode"] || "", status: attrStatus(row["PostalCode"]), qcFlag: false, sourceRefs: addrRefs },
    { name: "Email ID", extractedValue: row["Company_email"] || "", currentValue: row["Company_email"] || "", status: attrStatus(row["Company_email"]), qcFlag: !row["Company_email"], sourceRefs: websiteRefs },
    { name: "Phone Number", extractedValue: row["Phone"] || "", currentValue: row["Phone"] || "", status: attrStatus(row["Phone"]), qcFlag: !row["Phone"], sourceRefs: refs({ name: row["Phone_Source_Type"] || "Phone Source", url: phoneUrl }) },
    { name: "LinkedIn URL", extractedValue: row["Company_LinkedIn"] || "", currentValue: row["Company_LinkedIn"] || "", status: attrStatus(row["Company_LinkedIn"]), qcFlag: !row["Company_LinkedIn"], sourceRefs: websiteRefs },
    { name: "Entity Type", extractedValue: matchStatus, currentValue: matchStatus, status: matchStatus ? (matchStatus === "Closed" ? "flagged" : "validated") : "pending", qcFlag: matchStatus === "Closed" || matchStatus === "Merger & Acquisition", sourceRefs: addrRefs },
  ];

  if (personnel) {
    if (personnel.ceo) attributes.push({ name: "CEO / Founder", extractedValue: personnel.ceo, currentValue: personnel.ceo, status: "validated", qcFlag: false, sourceRefs: websiteRefs });
    attributes.push({ name: "Executives Identified", extractedValue: String(personnel.count), currentValue: String(personnel.count), status: "validated", qcFlag: false, sourceRefs: websiteRefs });
  } else {
    attributes.push({ name: "Executives Identified", extractedValue: "0", currentValue: "0", status: "pending", qcFlag: true, sourceRefs: [] });
  }

  const sourceList: string[] = Array.from(new Set([
    row["Revenue_source_type"],
    row["Employee_source_type"],
    row["Address_source_type"],
    row["Phone_Source_Type"],
  ].filter(Boolean))) as string[];
  if (sourceList.length === 0) sourceList.push("POC Extraction");

  const fallbackUrl = websiteUrl || addressUrl || revenueUrl || employeeUrl || "";

  return {
    id: `POC-C-${PAD(idx + 1)}`,
    companyName,
    attributeType: "Company",
    status,
    completionPct: Math.round((attributes.filter(a => a.status === "validated").length / attributes.length) * 100),
    confidenceScore: confidence,
    sourceList,
    lastUpdated: `${captureDate} 10:00`,
    existingValue: "",
    suggestedValue: companyName,
    attributes,
    sources: fallbackUrl
      ? [{
          url: fallbackUrl,
          type: "Website" as const,
          snippet: exceptionNote || `Extracted from ${sourceList.join(", ")}`,
          highlightedText: companyName,
        }]
      : [{ url: "#", type: "API" as const, snippet: "POC extraction", highlightedText: companyName }],
  };
};

const buildPersonnelRecord = (row: Record<string, string>, idx: number): ValidationRecord => {
  const fullName = [row["First name"], row["Middle name"], row["Last name"]]
    .filter(Boolean)
    .join(" ")
    .trim() || `Person ${idx + 1}`;
  const titleRaw = row["Exec_title_raw"] || "";
  const titleFmt = row["Exec_title_formatted"] || "";
  const company = row["Company_name"] || "";
  const sourceUrl = row["Personnel_Source"] || "";
  const sourceType = row["Personnel_Source_Type"] || "Source";
  const captureDate = row["Exec_capture_date"] || "2026-05-12";

  const sourceRefs = refs({ name: sourceType, url: sourceUrl });
  const attrs = (val: string): ValidationAttribute["status"] =>
    val && val.trim() !== "" ? "validated" : "pending";

  const attributes: ValidationAttribute[] = [
    { name: "Company Name", extractedValue: company, currentValue: company, status: attrs(company), qcFlag: false, sourceRefs },
    { name: "Country", extractedValue: row["Country"] || "", currentValue: row["Country"] || "", status: attrs(row["Country"]), qcFlag: false, sourceRefs },
    { name: "First Name", extractedValue: row["First name"] || "", currentValue: row["First name"] || "", status: attrs(row["First name"]), qcFlag: false, sourceRefs },
    { name: "Middle Name", extractedValue: row["Middle name"] || "", currentValue: row["Middle name"] || "", status: attrs(row["Middle name"]), qcFlag: false, sourceRefs },
    { name: "Last Name", extractedValue: row["Last name"] || "", currentValue: row["Last name"] || "", status: attrs(row["Last name"]), qcFlag: false, sourceRefs },
    { name: "Executive Title (Raw)", extractedValue: titleRaw, currentValue: titleRaw, status: attrs(titleRaw), qcFlag: false, sourceRefs },
    { name: "Executive Title (Formatted)", extractedValue: titleFmt, currentValue: titleFmt, status: attrs(titleFmt), qcFlag: !titleFmt, sourceRefs },
  ];

  const allFilled = attributes.every(a => a.status === "validated");
  const status: ValidationRecord["status"] = allFilled ? "pending" : "in_review";
  const confidence = allFilled ? 94 : 78;

  return {
    id: `POC-P-${PAD(idx + 1, 5)}`,
    companyName: `${fullName} · ${company}`,
    attributeType: "Personnel",
    status,
    completionPct: Math.round((attributes.filter(a => a.status === "validated").length / attributes.length) * 100),
    confidenceScore: confidence,
    sourceList: [sourceType],
    lastUpdated: `${captureDate} 10:00`,
    existingValue: "",
    suggestedValue: titleFmt || titleRaw,
    attributes,
    sources: sourceUrl
      ? [{ url: sourceUrl, type: "Website" as const, snippet: `${fullName} — ${titleFmt || titleRaw}`, highlightedText: fullName }]
      : [{ url: "#", type: "API" as const, snippet: "Personnel extraction", highlightedText: fullName }],
  };
};

// 1,000 company records + 5,099 personnel records = 6,099 total — matches Metrics Dashboard.
export const pocValidationRecords: ValidationRecord[] = [
  ...pocCompaniesRaw.map((r, i) => buildCompanyRecord(r, i)),
  ...pocPersonnelRaw.map((r, i) => buildPersonnelRecord(r, i)),
];

// -----------------------------------------------------------------------------
// Attribute categories — counts come from real POC fill rates.
// -----------------------------------------------------------------------------

const TOTAL = pocCompaniesRaw.length; // 1,000

const countFilled = (key: string) =>
  pocCompaniesRaw.filter(r => (r[key] || "").trim() !== "").length;
const countMissing = (key: string) => TOTAL - countFilled(key);

const sumMissing = (...keys: string[]) =>
  keys.reduce((acc, k) => acc + countMissing(k), 0);

const severityFor = (missing: number, scale = TOTAL): AttributeCategory["severity"] => {
  const pct = missing / scale;
  if (pct >= 0.5) return "CRITICAL";
  if (pct >= 0.25) return "HIGH";
  if (pct >= 0.1) return "MEDIUM";
  return "LOW";
};

const companiesWithoutPersonnel = TOTAL - personnelByCompany.size; // 391

// Define category specs against actual POC fields
interface CategorySpec {
  id: string;
  name: string;
  subAttributes: string;
  group: string;
  /** POC field keys whose missingness drives totalChanges */
  fields?: string[];
  /** Override totalChanges/severity (used for personnel-derived categories) */
  totalChanges?: number;
  severity?: AttributeCategory["severity"];
  totalSources: number;
  detected: string;
}

const categorySpecs: CategorySpec[] = [
  // COMPANY INFORMATION
  {
    id: "ac-company-id",
    name: "Company Identification",
    subAttributes: "Company Name · Country · DUNS ID · Client Company ID",
    group: "COMPANY INFORMATION",
    fields: ["Company_name", "Country"],
    totalSources: 3,
    detected: "2m ago",
  },
  {
    id: "ac-match-status",
    name: "Match & Enrichment Status",
    subAttributes: "Match Status · Closed Records · Merger & Acquisition flags",
    group: "COMPANY INFORMATION",
    totalChanges:
      pocMetrics.closed +
      pocMetrics.mergerAcquisition +
      pocMetrics.exceptionNotes,
    severity: "HIGH",
    totalSources: 2,
    detected: "5m ago",
  },
  // COMPANY CONTACT DATA
  {
    id: "ac-address",
    name: "Physical / Mailing Address",
    subAttributes: "Address · City · State/Province · Postal Code · Country",
    group: "COMPANY CONTACT DATA",
    fields: ["Address", "City", "State/Province", "PostalCode"],
    totalSources: 4,
    detected: "3m ago",
  },
  {
    id: "ac-phone",
    name: "Phone & Communication",
    subAttributes: "Phone · Fax · Toll Free · Phone Source",
    group: "COMPANY CONTACT DATA",
    fields: ["Phone", "Fax", "TollFree"],
    totalSources: 3,
    detected: "8m ago",
  },
  {
    id: "ac-web-email",
    name: "Email & Web Presence",
    subAttributes: "Company Website URL · Company Email · Website Source",
    group: "COMPANY CONTACT DATA",
    fields: ["Company_website_url", "Company_email"],
    totalSources: 3,
    detected: "4m ago",
  },
  {
    id: "ac-social",
    name: "Social Media Profiles",
    subAttributes: "LinkedIn URL",
    group: "COMPANY CONTACT DATA",
    fields: ["Company_LinkedIn"],
    totalSources: 1,
    detected: "12m ago",
  },
  // COMPANY FINANCIAL DATA
  {
    id: "ac-revenue",
    name: "Revenue Disclosure",
    subAttributes: "Revenue Value · Currency · Fiscal Year · Revenue Source · As-of Date",
    group: "COMPANY FINANCIAL DATA",
    fields: ["Revenue_value", "Revenue_fiscal_year"],
    totalSources: 5,
    detected: "1m ago",
  },
  {
    id: "ac-employee",
    name: "Employee Headcount",
    subAttributes: "Employee Count · Employee Source · As-of Date",
    group: "COMPANY FINANCIAL DATA",
    fields: ["Employee_count_value", "Employee_count_as_of_date"],
    totalSources: 6,
    detected: "3m ago",
  },
  // COMPANY BUSINESS DESCRIPTION DATA
  {
    id: "ac-exception-notes",
    name: "Exception Notes Review",
    subAttributes: "Exception flags raised during extraction",
    group: "COMPANY BUSINESS DESCRIPTION DATA",
    totalChanges: pocMetrics.exceptionNotes, // 846
    severity: "CRITICAL",
    totalSources: 2,
    detected: "1m ago",
  },
  // TRADITIONAL SUPPLEMENTAL ADD-ONS
  {
    id: "ac-personnel-coverage",
    name: "Personnel / Executives Coverage",
    subAttributes: "Companies missing personnel · CEO · CFO · Chairman",
    group: "TRADITIONAL SUPPLEMENTAL ADD-ONS",
    totalChanges: companiesWithoutPersonnel, // 391
    severity: "CRITICAL",
    totalSources: 3,
    detected: "2m ago",
  },
  {
    id: "ac-personnel-titles",
    name: "Executive Title Standardization",
    subAttributes: "Title (Raw) · Title (Formatted) · Source Type",
    group: "TRADITIONAL SUPPLEMENTAL ADD-ONS",
    totalChanges: pocPersonnelRaw.filter(p => !(p["Exec_title_formatted"] || "").trim()).length,
    severity: "MEDIUM",
    totalSources: 4,
    detected: "6m ago",
  },
  // OTHER SUPPLEMENTAL ADD-ONS
  {
    id: "ac-source-attribution",
    name: "Source Attribution",
    subAttributes: "Address Source · Revenue Source · Employee Source · Phone Source",
    group: "OTHER SUPPLEMENTAL ADD-ONS",
    fields: ["Address_source_type", "Revenue_source_type", "Employee_source_type", "Phone_Source_Type"],
    totalSources: 6,
    detected: "9m ago",
  },
];

export const pocAttributeCategories: AttributeCategory[] = categorySpecs.map(spec => {
  const totalChanges =
    spec.totalChanges !== undefined
      ? spec.totalChanges
      : sumMissing(...(spec.fields ?? []));
  const severity = spec.severity ?? severityFor(totalChanges, (spec.fields?.length ?? 1) * TOTAL);
  return {
    id: spec.id,
    name: spec.name,
    subAttributes: spec.subAttributes,
    totalChanges,
    severity,
    totalSources: spec.totalSources,
    detected: spec.detected,
    group: spec.group,
  };
});

// -----------------------------------------------------------------------------
// Build per-category "records for review" for the Attribute Category Review Modal.
// Each record references a real company in the POC dataset.
// -----------------------------------------------------------------------------

export interface PocCategoryChange {
  attribute: string;
  oldValue: string;
  newValue: string;
  confidence: number;
}

export interface PocCategoryRecord {
  id: string;
  companyName: string;
  changes: PocCategoryChange[];
  source: string;
  sourceUrl: string;
}

const fieldLabel: Record<string, string> = {
  Company_name: "Company Name",
  Country: "Country",
  Address: "Address",
  City: "City",
  "State/Province": "State / Province",
  PostalCode: "Postal Code",
  Phone: "Phone",
  Fax: "Fax",
  TollFree: "Toll Free",
  Company_website_url: "Website URL",
  Company_email: "Email",
  Company_LinkedIn: "LinkedIn URL",
  Revenue_value: "Revenue",
  Revenue_fiscal_year: "Revenue Fiscal Year",
  Employee_count_value: "Employee Count",
  Employee_count_as_of_date: "Employee As-of Date",
  Address_source_type: "Address Source",
  Revenue_source_type: "Revenue Source",
  Employee_source_type: "Employee Source",
  Phone_Source_Type: "Phone Source",
};

const formatValue = (key: string, row: Record<string, string>): string => {
  const raw = (row[key] || "").trim();
  if (!raw) return "";
  if (key === "Revenue_value") return fmtMoney(raw, row["Revenue_currency"]);
  return raw;
};

const buildRecordsFromFields = (
  catId: string,
  fields: string[],
  sourceUrlKey: string,
  sourceTypeKey: string,
): PocCategoryRecord[] => {
  const out: PocCategoryRecord[] = [];
  pocCompaniesRaw.forEach((row, idx) => {
    const changes: PocCategoryChange[] = [];
    for (const f of fields) {
      const val = (row[f] || "").trim();
      const isMissing = val === "";
      // Surface rows that are missing OR rows with exception notes (changed/flagged)
      const note = (row["Exception_notes"] || "").trim();
      if (!isMissing && !note) continue;
      changes.push({
        attribute: fieldLabel[f] || f,
        oldValue: isMissing ? "—" : "",
        newValue: isMissing ? "(needs review)" : formatValue(f, row),
        confidence: isMissing ? 45 : 72,
      });
    }
    if (changes.length === 0) return;
    out.push({
      id: `${catId}-R${PAD(idx + 1)}`,
      companyName: row["Company_name"] || `Entity ${idx + 1}`,
      changes,
      source: row[sourceTypeKey] || "POC Extraction",
      sourceUrl: row[sourceUrlKey] || row["Address_URL"] || row["Revenue_source_url"] || "",
    });
  });
  return out;
};

export const pocCategoryRecords: Record<string, PocCategoryRecord[]> = {
  "ac-company-id": pocCompaniesRaw.map((row, idx) => ({
    id: `ac-company-id-R${PAD(idx + 1)}`,
    companyName: row["Company_name"] || `Entity ${idx + 1}`,
    changes: [
      { attribute: "Country", oldValue: "", newValue: row["Country"] || "—", confidence: row["Country"] ? 92 : 50 },
      { attribute: "DUNS ID", oldValue: "", newValue: row["Duns_id"] || "—", confidence: row["Duns_id"] ? 90 : 55 },
      { attribute: "Client Company ID", oldValue: "", newValue: row["Client_company_id"] || "—", confidence: 95 },
    ],
    source: "Client Master File",
    sourceUrl: row["Address_URL"] || "",
  })).slice(0, 200),

  "ac-match-status": pocCompaniesRaw
    .filter(r => r["Match_status"] && r["Match_status"] !== "Matched - Data Enrichment")
    .map((row, idx) => ({
      id: `ac-match-status-R${PAD(idx + 1)}`,
      companyName: row["Company_name"] || `Entity ${idx + 1}`,
      changes: [
        { attribute: "Match Status", oldValue: "Matched - Data Enrichment", newValue: row["Match_status"], confidence: row["Match_status"] === "Closed" ? 35 : 60 },
        ...(row["Exception_notes"] ? [{ attribute: "Exception", oldValue: "", newValue: row["Exception_notes"], confidence: 55 }] : []),
      ],
      source: "Match Engine",
      sourceUrl: row["Address_URL"] || "",
    })),

  "ac-address": buildRecordsFromFields(
    "ac-address",
    ["Address", "City", "State/Province", "PostalCode"],
    "Address_URL",
    "Address_source_type",
  ),
  "ac-phone": buildRecordsFromFields(
    "ac-phone",
    ["Phone", "Fax", "TollFree"],
    "Phone_URL",
    "Phone_Source_Type",
  ),
  "ac-web-email": buildRecordsFromFields(
    "ac-web-email",
    ["Company_website_url", "Company_email"],
    "Company_website_source_url",
    "Address_source_type",
  ),
  "ac-social": buildRecordsFromFields(
    "ac-social",
    ["Company_LinkedIn"],
    "Address_URL",
    "Address_source_type",
  ),
  "ac-revenue": buildRecordsFromFields(
    "ac-revenue",
    ["Revenue_value", "Revenue_fiscal_year"],
    "Revenue_source_url",
    "Revenue_source_type",
  ),
  "ac-employee": buildRecordsFromFields(
    "ac-employee",
    ["Employee_count_value", "Employee_count_as_of_date"],
    "Employee_count_source_url",
    "Employee_source_type",
  ),
  "ac-exception-notes": pocCompaniesRaw
    .filter(r => (r["Exception_notes"] || "").trim() !== "")
    .map((row, idx) => ({
      id: `ac-exception-notes-R${PAD(idx + 1)}`,
      companyName: row["Company_name"] || `Entity ${idx + 1}`,
      changes: [{ attribute: "Exception Note", oldValue: "", newValue: row["Exception_notes"], confidence: 50 }],
      source: "Extraction Pipeline",
      sourceUrl: row["Address_URL"] || row["Revenue_source_url"] || "",
    })),

  "ac-personnel-coverage": (() => {
    const haveIds = new Set(personnelByCompany.keys());
    return pocCompaniesRaw
      .filter(r => !haveIds.has(r["Client_company_id"] || ""))
      .map((row, idx) => ({
        id: `ac-personnel-coverage-R${PAD(idx + 1)}`,
        companyName: row["Company_name"] || `Entity ${idx + 1}`,
        changes: [
          { attribute: "Executives Found", oldValue: "", newValue: "0", confidence: 30 },
          { attribute: "Recommended Action", oldValue: "", newValue: "Re-run personnel extraction", confidence: 55 },
        ],
        source: "Personnel Extraction",
        sourceUrl: row["Address_URL"] || "",
      }));
  })(),

  "ac-personnel-titles": pocPersonnelRaw
    .filter(p => !(p["Exec_title_formatted"] || "").trim())
    .slice(0, 500)
    .map((p, idx) => {
      const fullName = [p["First name"], p["Middle name"], p["Last name"]].filter(Boolean).join(" ").trim();
      return {
        id: `ac-personnel-titles-R${PAD(idx + 1)}`,
        companyName: `${fullName} · ${p["Company_name"] || ""}`.trim(),
        changes: [
          { attribute: "Title (Raw)", oldValue: "", newValue: p["Exec_title_raw"] || "—", confidence: 70 },
          { attribute: "Title (Formatted)", oldValue: "", newValue: "(needs standardization)", confidence: 40 },
        ],
        source: p["Personnel_Source_Type"] || "Website",
        sourceUrl: p["Personnel_Source"] || "",
      };
    }),

  "ac-source-attribution": buildRecordsFromFields(
    "ac-source-attribution",
    ["Address_source_type", "Revenue_source_type", "Employee_source_type", "Phone_Source_Type"],
    "Address_URL",
    "Address_source_type",
  ),
};
