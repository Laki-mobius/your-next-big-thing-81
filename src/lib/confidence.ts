/**
 * Shared confidence-score logic used by both:
 *  - the HITL Record Review screen (Record Details RHS / Company Profile Viewer)
 *  - the Job Status download (output file confidence columns)
 *
 * Rules:
 *   - validated → 96
 *   - edited    → 98
 *   - flagged   → 50
 *   - pending (default — also used for freshly-extracted job rows that have
 *     no HITL status yet): score is deterministically derived from
 *     (fieldName, value) so the SAME field+value always yields the SAME
 *     score everywhere it's shown.
 *       * empty / "N/A" / single-char → 52
 *       * meaningful value → stable score in [60, 94]
 *
 * This guarantees the score shown on the HITL RHS for a pending attribute
 * matches the score written to the downloaded output file for that same
 * extracted value, which is what users expect since the underlying value
 * is identical in both surfaces.
 */
export type AttrStatus = "validated" | "pending" | "flagged" | "edited";

/** Stable 32-bit hash of a string (FNV-1a-ish, sufficient for bucketing). */
function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) - h + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * Deterministic pending-confidence score for a (fieldName, value) pair.
 * Returns an integer in [60, 94] for meaningful values, 52 otherwise.
 * Same inputs ALWAYS produce the same output — used by both HITL RHS and
 * the Job Status download to keep scores in sync.
 */
export function getPendingConfidence(
  fieldName: string,
  value: string | null | undefined,
): number {
  const v = (value ?? "").toString().trim();
  if (!v || v.toUpperCase() === "N/A" || v.length <= 1) return 52;

  // 35 buckets → range [60, 94] inclusive
  const key = `${fieldName.trim().toLowerCase()}|${v.toLowerCase()}`;
  return 60 + (hashString(key) % 35);
}

export function getConfidenceScoreFromStatus(
  status: AttrStatus,
  value: string | null | undefined,
  fieldName = "",
): number {
  switch (status) {
    case "validated": return 96;
    case "edited":    return 98;
    case "flagged":   return 50;
    default:
      return getPendingConfidence(fieldName, value);
  }
}

/** Confidence score for a freshly-extracted value (no HITL status yet). */
export function getExtractedValueConfidence(
  fieldName: string,
  value: string | null | undefined,
): number {
  return getPendingConfidence(fieldName, value);
}

/** Suffix used for confidence columns in downloaded job output. */
export const CONFIDENCE_COLUMN_SUFFIX = "Confidence Score Percentage";

export function confidenceColumnName(fieldName: string): string {
  return `${fieldName} ${CONFIDENCE_COLUMN_SUFFIX}`;
}
