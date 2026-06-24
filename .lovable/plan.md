## Goal
Make Company / People Data Extraction resolve more input names to stored DB records, so near-miss spellings (legal suffixes, punctuation, partial words, alternate IDs) still match.

## Matching rules (applied in order, first hit wins)

1. **Exact normalized match** — lowercase, strip non-alphanumerics. _(already supported)_
2. **Stripped-suffix match** — drop common legal/entity suffixes before comparing on both sides:
   `inc, inc., incorporated, llc, l.l.c., ltd, ltd., limited, plc, gmbh, s.a., sa, ag, co, co., corp, corp., corporation, company, holdings, holding, group, the, pte, pty, bv, n.v., nv, srl, kk, kabushiki kaisha, sas, sarl, oy, ab, asa, sp z o.o.`
   Also strip leading articles (`the`).
3. **Substring match (either direction)** — e.g. `Branford Castle` ↔ `Branford Castle, Inc.`. _(already supported, kept as-is.)_
4. **Token-overlap match** — split into significant tokens (drop stopwords + suffixes from step 2, drop tokens ≤2 chars). Match when ≥80% of input tokens appear in a stored company's tokens **and** at least 2 tokens overlap (or all tokens if input has only 1). Pick the candidate with the highest overlap; ties broken by shortest stored name.
5. **Identifier match** — if the input is purely numeric or matches the shape of a `Client_company_id` / `Duns_id` / `Dca_id`, look those up directly.
6. **Website/domain match** — if the input or the row's website column contains a hostname, compare to `Company_website_url` host (ignoring `www.`). Useful when the user uploads `acme.com` instead of "Acme Corporation".

If still no hit → unmatched (job fails as today, with the reason listing which inputs didn't resolve).

## Where it changes

- `src/data/job-result-generator.ts`
  - Replace `findStoredCompany` with the layered matcher above.
  - Add small helpers: `stripSuffixes`, `tokenize`, `findByIdentifier`, `findByDomain`.
  - Pass the input row's website cell into the matcher so rule 6 can use it.
  - Build a one-time in-memory index over `pocCompaniesRaw` (normalized name, suffix-stripped name, token set, ids, hostname) to keep matching O(1)–O(n) per input without re-scanning per rule.
  - When the job fails, list the specific unmatched inputs in `failureReason` (currently only shows a count) so the user can fix typos.

- `src/components/JobStatusDashboard.tsx` _(small)_
  - No logic change; failure toast already surfaces `failureReason`. Verify the longer reason still renders cleanly in the toast and the job row's error chip.

## Out of scope

- HITL Review screens (not changing column composition this round).
- Fuzzy/edit-distance matching (Levenshtein) — deferred unless token-overlap proves insufficient.
- Server-side matching — stays client-side over the bundled POC JSON.

## Verification

- Run with the user's 5 inputs → all resolve (Branford via substring/token rule).
- Run with deliberately mangled inputs: `branford castle inc`, `ernst young services trust`, `ontario telemed`, `hassop topco`, `national digital schools` → expect matches via suffix-strip + token-overlap.
- Run with garbage input `Foo Bar Baz Quux` → job fails, reason lists the input name.
- Run with a domain-only input `ey.com` against a row whose website is `https://www.ey.com` → matches via rule 6.
