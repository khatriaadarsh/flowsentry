/**
 * Validate incoming diagnostic requests
 */
export function validateIncidentId(incidentId, incidents) {
  if (!incidentId || typeof incidentId !== "string") {
    return {
      valid: false,
      message: "Invalid or missing incidentId parameter.",
    };
  }
  const found = incidents.find((i) => i.id === incidentId);
  if (!found) {
    return {
      valid: false,
      message: `Incident with ID '${incidentId}' does not exist.`,
    };
  }
  return { valid: true, incident: found };
}

/**
 * Verify that AI-generated structured diagnosis conforms to requirements
 */
export function validateDiagnosisSchema(data) {
  if (!data || typeof data !== "object") return false;

  const requiredKeys = [
    "incidentSummary",
    "likelyRootCause",
    "confidence",
    "supportingEvidence",
    "alternativeExplanations",
    "recommendedActions",
    "impactAssessment",
    "incidentReport",
  ];

  const hasAllKeys = requiredKeys.every((key) => key in data);
  if (!hasAllKeys) return false;

  const validEvidence =
    Array.isArray(data.supportingEvidence) &&
    data.supportingEvidence.every(
      (ev) => typeof ev.logId === "string" && typeof ev.finding === "string",
    );

  const validArrays =
    Array.isArray(data.alternativeExplanations) &&
    Array.isArray(data.recommendedActions);

  return validEvidence && validArrays;
}
