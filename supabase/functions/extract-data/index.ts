import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Per-workflow source ownership. Must be kept in sync with
 * src/data/workflow-sources.ts on the frontend.
 */
const WORKFLOW_SOURCES: Record<string, { sourceName: string; sourceUrlHint: string; attributes: string[] }> = {
  company_data: {
    sourceName: "Company Website",
    sourceUrlHint: "the company's official website",
    attributes: [
      "Legal Name", "Trade Name", "Country", "Address", "City", "State",
      "Postal Code", "Website", "Email", "Phone", "Fax",
      "Foundation Year", "Number of Employees", "Business Description",
      "Social Media Profiles",
    ],
  },
  sec_data: {
    sourceName: "SEC EDGAR",
    sourceUrlHint: "https://www.sec.gov/search-filings",
    attributes: [
      "Revenue (USD-normalized)", "Assets", "Liabilities", "Net Income",
      "Fiscal Year End", "NAICS/SIC Codes", "Ticker Symbol",
    ],
  },
  stock_exchange: {
    sourceName: "Nasdaq",
    sourceUrlHint: "https://www.nasdaq.com/market-activity/stocks",
    attributes: [
      "Ticker Symbol", "Stock Exchange", "Status",
    ],
  },
  registry_data: {
    sourceName: "Annual Report (Govt Filing)",
    sourceUrlHint: "the company's most recent annual report (PDF) published on its investor relations site or filed with the relevant government authority",
    attributes: [
      "Registration ID(s)", "Organizational Type",
      "Ultimate Parent", "Subsidiary Company", "Entity Type",
      "Hierarchy Level", "Relationship Type", "Performance Expectation",
    ],
  },
  labor_market: {
    sourceName: "Labor Market Intelligence",
    sourceUrlHint: "publicly available labor market intelligence sources including LinkedIn company pages, job boards, Crunchbase, Glassdoor, and similar workforce/talent data sources",
    attributes: [
      "Industry", "Company Headcount", "Company Name", "Hiring Rate",
      "Attrition Rate", "Growth Rate", "Job Postings", "Sentiment",
      "Founders", "Average Tenure", "Average Salary", "Geography",
      "Keywords", "Skills", "Activities", "Previous Company",
      "Funding Rounds", "Investors",
    ],
  },
};

interface RequestBody {
  /** Optional explicit attributes (legacy). If omitted, derived from selectedWorkflowIds. */
  attributes?: string[];
  /** Workflow ids selected by the user in Run New Job. */
  selectedWorkflowIds?: string[];
  /** Input file headers (preserved verbatim in output). First column = entity identifier. */
  inputHeaders?: string[];
  /** Input rows from the uploaded file (each row a string[] aligned to inputHeaders). */
  inputRows?: string[][];
  /** Legacy: list of company names. Used when no inputRows. */
  companies?: string[];
  /** DB row id of the job to update on completion. */
  jobDbId?: string;
}

function uniqueAttributesForWorkflows(ids: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of ids) {
    const wf = WORKFLOW_SOURCES[id];
    if (!wf) continue;
    for (const a of wf.attributes) {
      if (!seen.has(a)) { seen.add(a); out.push(a); }
    }
  }
  return out;
}

function buildPrompt(
  entities: string[],
  attributes: string[],
  workflowIds: string[],
): string {
  // Specialized prompt when ONLY the Labor Market workflow is selected
  if (workflowIds.length === 1 && workflowIds[0] === "labor_market") {
    return buildLaborMarketPrompt(entities);
  }

  const sourceLines = workflowIds
    .map((id) => WORKFLOW_SOURCES[id])
    .filter(Boolean)
    .map((wf) => `  - ${wf!.sourceName} (${wf!.sourceUrlHint}) → ${wf!.attributes.join(", ")}`)
    .join("\n");

  return `You are a corporate data extraction assistant. For each company below, extract ONLY the listed attributes from ONLY the selected sources.

Selected sources (each authoritative for its listed attributes):
${sourceLines || "  - (none — use general public knowledge)"}

Output rules:
- Return ONLY a valid JSON array of arrays. No markdown, no commentary.
- Each inner array MUST have exactly ${attributes.length + 1} elements in this order:
  1. Company identifier (echo back exactly as provided)
${attributes.map((a, i) => `  ${i + 2}. ${a}`).join("\n")}
- Use real, factual public data. If a value is unknown or not applicable, return "N/A".
- Normalize Revenue to USD millions when possible.
- Foundation Year as 4-digit year. Status as "Active" / "Inactive" / "Dissolved" etc.

Companies (${entities.length}):
${entities.map((c) => `- ${c}`).join("\n")}

Return ONLY the JSON array.`;
}

function buildLaborMarketPrompt(entities: string[]): string {
  const wf = WORKFLOW_SOURCES.labor_market;
  const sourceLine = `  - ${wf.sourceName} (${wf.sourceUrlHint}) → ${wf.attributes.join(", ")}`;

  return `You are a Labor Market Intelligence Extraction Assistant. For each company below, extract workforce, hiring, talent, and company-growth intelligence attributes ONLY from the selected sources.

Selected sources (each authoritative for its listed attributes):
${sourceLine}

Attributes to extract (in the exact order below):
1. Industry (text)
2. Company Headcount (number)
3. Company Name (text)
4. Hiring Rate (percentage)
5. Attrition Rate (percentage)
6. Growth Rate (percentage)
7. Job Postings (number / multi-value if applicable)
8. Sentiment (text)
9. Founders (text / multi-value)
10. Average Tenure (number)
11. Average Salary (currency)
12. Geography (text)
13. Keywords (text / multi-value)
14. Skills (text / multi-value)
15. Activities (text / multi-value)
16. Previous Company (text / multi-value)
17. Funding Rounds (text / multi-value)
18. Investors (text / multi-value)

Output Rules:
- Return ONLY a valid JSON array of arrays. No markdown, explanations, notes, or commentary.
- Each inner array MUST contain exactly 19 elements in the following order:
  1. Company Identifier (echo back exactly as provided)
  2. Industry
  3. Company Headcount
  4. Company Name
  5. Hiring Rate
  6. Attrition Rate
  7. Growth Rate
  8. Job Postings
  9. Sentiment
  10. Founders
  11. Average Tenure
  12. Average Salary
  13. Geography
  14. Keywords
  15. Skills
  16. Activities
  17. Previous Company
  18. Funding Rounds
  19. Investors
- Use real, factual, publicly available data only from the selected sources.
- Do not infer, estimate, or fabricate values.
- If a value is unavailable, unknown, or not applicable, return "N/A".
- For multi-value attributes, return a semicolon-separated string.
- Company Headcount and Job Postings should be numeric values where available.
- Hiring Rate, Attrition Rate, and Growth Rate should be returned as percentages.
- Average Salary should include the currency symbol/code where available.
- Preserve company names exactly as found in the source.

Companies (${entities.length}):
${entities.map((c) => `- ${c}`).join("\n")}

Return ONLY the JSON array.`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as RequestBody;

    // Resolve entities from inputRows (preferred) or legacy companies array
    const inputHeaders = body.inputHeaders ?? [];
    const inputRows = body.inputRows ?? [];
    const entities: string[] = inputRows.length > 0
      ? inputRows.map((r) => (r[0] || "").toString().trim()).filter(Boolean)
      : (body.companies ?? []).map((c) => c.toString().trim()).filter(Boolean);

    // Resolve attributes: per-workflow union (preferred) or explicit list
    const workflowIds = (body.selectedWorkflowIds ?? []).filter((id) => WORKFLOW_SOURCES[id]);
    const attributes = workflowIds.length > 0
      ? uniqueAttributesForWorkflows(workflowIds)
      : (body.attributes ?? []);

    if (entities.length === 0 || attributes.length === 0) {
      return new Response(JSON.stringify({ error: "Missing entities or attributes" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cappedEntities = entities.slice(0, 50);
    const prompt = buildPrompt(cappedEntities, attributes, workflowIds);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a corporate data extraction assistant. Always respond with valid JSON only." },
          { role: "user", content: prompt },
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI Gateway error:", errText);
      return new Response(JSON.stringify({ error: "AI extraction failed" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResult = await response.json();
    const content = aiResult.choices?.[0]?.message?.content || "[]";

    // Parse the JSON from the AI response
    let aiRows: string[][];
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      aiRows = JSON.parse(cleaned);
      if (!Array.isArray(aiRows)) throw new Error("not array");
    } catch {
      console.error("Failed to parse AI response:", content);
      aiRows = cappedEntities.map((c) => [c, ...attributes.map(() => "N/A")]);
    }

    // Index AI results by entity (column 0) for stable joining back to input rows
    const aiByEntity = new Map<string, string[]>();
    for (const row of aiRows) {
      if (!Array.isArray(row) || row.length === 0) continue;
      const key = String(row[0] || "").trim();
      // Pad to attributes.length + 1
      const padded = [key, ...attributes.map((_, i) => String(row[i + 1] ?? "N/A"))];
      aiByEntity.set(key, padded);
    }

    // Build output: preserve input headers + prepend "Company Name" + append extracted attributes
    const inputHeadersFinal = inputHeaders.length > 0 ? inputHeaders : ["Company"];
    const columns = [...inputHeadersFinal, "Company Name", ...attributes];

    // Index of Legal Name within the extracted attributes (if present)
    const legalNameIdx = attributes.findIndex((a) => a.toLowerCase() === "legal name");

    /**
     * Resolve "Company Name" per spec:
     *  - If extracted entity name (AI key) matches Legal Name → use Legal Name
     *  - Else fall back to the value from the uploaded input file (first column)
     */
    const resolveCompanyName = (
      inputValue: string,
      aiKey: string | null,
      extracted: string[],
    ): string => {
      const legalName = legalNameIdx >= 0 ? String(extracted[legalNameIdx] ?? "").trim() : "";
      const isValidLegal = legalName && legalName.toUpperCase() !== "N/A";
      const aiKeyTrim = (aiKey ?? "").trim();
      if (isValidLegal && aiKeyTrim && aiKeyTrim.toLowerCase() === legalName.toLowerCase()) {
        return legalName;
      }
      return (inputValue || "").trim() || legalName || aiKeyTrim;
    };

    let rows: string[][];
    if (inputRows.length > 0) {
      rows = inputRows.map((inputRow) => {
        const key = String(inputRow[0] || "").trim();
        const ai = aiByEntity.get(key);
        const extracted = ai ? ai.slice(1) : attributes.map(() => "N/A");
        const paddedInput = inputHeadersFinal.map((_, i) => String(inputRow[i] ?? ""));
        const companyName = resolveCompanyName(paddedInput[0], ai ? String(ai[0]) : null, extracted);
        return [...paddedInput, companyName, ...extracted];
      });
    } else {
      rows = cappedEntities.map((entity) => {
        const ai = aiByEntity.get(entity);
        const extracted = ai ? ai.slice(1) : attributes.map(() => "N/A");
        const companyName = resolveCompanyName(entity, ai ? String(ai[0]) : entity, extracted);
        return [entity, companyName, ...extracted];
      });
    }

    // Persist to Supabase if jobDbId provided
    if (body.jobDbId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

      await supabaseAdmin.from("jobs").update({
        csv_columns: columns,
        csv_rows: rows,
        status: "Completed",
        progress: 100,
        error_rate: "0.00%",
      }).eq("id", body.jobDbId);
    }

    return new Response(JSON.stringify({ columns, rows }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
