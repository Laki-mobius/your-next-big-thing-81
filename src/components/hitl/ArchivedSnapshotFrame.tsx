import { useEffect, useRef, useState } from "react";
import type { ValidationRecord, ValidationAttribute } from "@/data/hitl-validation-data";

interface ArchivedSnapshotFrameProps {
  record: ValidationRecord;
  sourceName: string;
  sourceUrl: string;
  highlightedField: { fieldName: string; value: string } | null;
}

/* ── Resolve which snapshot template to use per source ─────────── */
function resolveSnapshot(sourceName: string, sourceUrl: string): { src: string; label: string } {
  const n = (sourceName + " " + sourceUrl).toLowerCase();
  // Annual Report extraction → render the multi-page PDF-style snapshot
  if (
    n.includes("annual report") ||
    n.includes("annualreport") ||
    n.includes("govt filing") ||
    n.includes("government filing") ||
    /\.pdf(\?|$|#)/.test(n)
  ) {
    return { src: "/snapshots/annual-report.html", label: "Annual Report · PDF document" };
  }
  if (n.includes("sec") || n.includes("edgar")) {
    return { src: "/snapshots/sec-edgar.html", label: "SEC EDGAR · Archived snapshot" };
  }
  if (n.includes("nyse") || n.includes("nasdaq") || n.includes("exchange") || n.includes("stock")) {
    return { src: "/snapshots/nyse.html", label: "Stock Exchange · Archived snapshot" };
  }
  return { src: "/snapshots/generic.html", label: "Source Document · Archived snapshot" };
}

/* ── Map RHS field names → data-field attribute keys in snapshots ─ */
const fieldNameToDataKey: Record<string, string> = {
  "Company Name": "companyName",
  "Legal Name": "legalName",
  "Trade Name": "tradeName",
  "Registration ID(s)": "registrationId",
  "Registration Number": "registrationId",
  "CIK": "registrationId",
  "Ticker Symbol": "ticker",
  "Stock Exchange": "exchange",
  "Exchange Name": "exchange",
  "Status": "entityStatus",
  "Organizational Type": "orgType",
  "Entity Type": "entityType",
  "Country": "country",
  "Address": "address",
  "City": "city",
  "State": "state",
  "Postal Code": "postalCode",
  "Phone": "phone",
  "Phone Number": "phone",
  "Fax": "fax",
  "Email": "email",
  "Email ID": "email",
  "Website": "website",
  "Website URL": "website",
  "Social Media Profiles": "socialMedia",
  "Foundation Year": "foundationYear",
  "Number of Employees": "numEmployees",
  "NAICS/SIC Codes": "naicsSic",
  "SIC Code": "naicsSic",
  "Fiscal Year End": "fiscalYearEnd",
  "Business Description": "description",
  "Description": "description",
  "Revenue": "revenue",
  "Revenue (USD-normalized)": "revenue",
  "Assets": "assets",
  "Liabilities": "liabilities",
  "Net Income": "netIncome",
  "Ultimate Parent": "ultimateParent",
  "Subsidiary Company": "subsidiary",
  "Hierarchy Level": "hierarchyLevel",
  "Relationship Type": "relationshipType",
  "Performance Expectation": "perfExpectation",
};

const HIGHLIGHT_CLASS = "__xdas_hl__";
const HIGHLIGHT_PULSE = "__xdas_hl_pulse__";

export default function ArchivedSnapshotFrame({
  record,
  sourceName,
  sourceUrl,
  highlightedField,
}: ArchivedSnapshotFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const snapshot = resolveSnapshot(sourceName, sourceUrl);
  const [ready, setReady] = useState(false);

  /* Personalize the iframe DOM after load — replace placeholders and fill data-field values */
  const personalize = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;

    const company = record.companyName || "Acme Corp";
    const short = company.split(/\s+/)[0] || company;
    const tickerAttr = record.attributes.find(a => /ticker/i.test(a.name));
    const ticker = tickerAttr?.currentValue || tickerAttr?.extractedValue ||
      short.replace(/[^A-Z]/gi, "").slice(0, 4).toUpperCase() || "XYZ";

    // Replace placeholder tokens in text nodes
    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
    const replacements: { node: Text; text: string }[] = [];
    let n: Node | null;
    while ((n = walker.nextNode())) {
      const t = n as Text;
      if (t.nodeValue && (t.nodeValue.includes("__COMPANY__") || t.nodeValue.includes("__SHORT__") || t.nodeValue.includes("__TICKER__"))) {
        replacements.push({
          node: t,
          text: t.nodeValue
            .split("__COMPANY__").join(company)
            .split("__SHORT__").join(short)
            .split("__TICKER__").join(ticker),
        });
      }
    }
    replacements.forEach(({ node, text }) => { node.nodeValue = text; });

    // Fill data-field elements with actual extracted values when present
    record.attributes.forEach(attr => {
      const key = fieldNameToDataKey[attr.name];
      if (!key) return;
      const value = (attr.currentValue || attr.extractedValue || "").trim();
      if (!value) return;
      doc.querySelectorAll<HTMLElement>(`[data-field="${key}"]`).forEach(el => {
        // Preserve original markup if value is the same; otherwise replace text
        if (el.textContent !== value) el.textContent = value;
      });
    });

    setReady(true);
  };

  /* Apply / clear highlight when active field changes */
  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc || !ready) return;

    // Clear previous highlights
    doc.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach(el => {
      el.classList.remove(HIGHLIGHT_CLASS, HIGHLIGHT_PULSE);
    });

    if (!highlightedField) return;
    const key = fieldNameToDataKey[highlightedField.fieldName];
    if (!key) return;

    const targets = doc.querySelectorAll<HTMLElement>(`[data-field="${key}"]`);
    targets.forEach(el => el.classList.add(HIGHLIGHT_CLASS, HIGHLIGHT_PULSE));

    const first = targets[0];
    if (first) {
      first.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlightedField?.fieldName, highlightedField?.value, ready]);

  /* Reload when snapshot src changes (different source) */
  useEffect(() => {
    setReady(false);
  }, [snapshot.src]);

  return (
    <div className="relative w-full h-full bg-white">
      <iframe
        ref={iframeRef}
        src={snapshot.src}
        title="Source page"
        onLoad={personalize}
        className="w-full h-full border-0"
        sandbox="allow-same-origin"
      />
    </div>
  );
}
