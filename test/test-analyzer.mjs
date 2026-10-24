import assert from "node:assert/strict";
import incidentsData from "../data/incidents.json" with { type: "json" };
import {
  searchLogs,
  inspectService,
  checkRecentFailures,
} from "../lib/diagnosticTools.js";
import { runDiagnosticWorkflow } from "../lib/analyzer.js";
import {
  validateIncidentId,
  validateDiagnosisSchema,
} from "../lib/validation.js";

console.log("🧪 Starting FlowSentry Hosted Gemma MVP Test Suite...\n");

// 1. Tool execution: searchLogs
console.log("Test 1: searchLogs queries synthetic logs properly...");
const logsResult = searchLogs("INC-8021", "HikariPool");
assert.equal(logsResult.totalFound >= 1, true);
assert.equal(logsResult.results[0].id, "LOG-104");
console.log("✅ searchLogs passed.");

// 2. Tool execution: inspectService
console.log("Test 2: inspectService evaluates topology...");
const serviceResult = inspectService("banking-service");
assert.equal(serviceResult.serviceName, "Banking Service");
assert.equal(serviceResult.downstream, "Core Settlement DB");
console.log("✅ inspectService passed.");

// 3. Tool execution: checkRecentFailures
console.log("Test 3: checkRecentFailures returns failure counts...");
const failuresResult = checkRecentFailures("banking-service");
assert.equal(failuresResult.failures.length > 0, true);
assert.equal(failuresResult.failures[0].errorType, "HikariPool-1 Exhaustion");
console.log("✅ checkRecentFailures passed.");

// 4. Missing key / Demo Mode Fallback for INC-8021
console.log(
  "Test 4: Workflow runs safely and triggers Demo Mode when API key is missing...",
);
delete process.env.GEMINI_API_KEY;
const resultInc1 = await runDiagnosticWorkflow(incidentsData[0]);
assert.equal(resultInc1.mode, "Demo Mode (Rule-Based Fallback)");
assert.equal(resultInc1.diagnosis.confidence, "HIGH");
assert.equal(
  resultInc1.diagnosis.supportingEvidence.some((e) => e.logId === "LOG-104"),
  true,
);
assert.equal(validateDiagnosisSchema(resultInc1.diagnosis), true);
console.log("✅ INC-8021 Demo Mode passed.");

// 5. Missing key / Demo Mode Fallback for INC-8022
console.log("Test 5: Workflow runs safely for INC-8022 in Demo Mode...");
const resultInc2 = await runDiagnosticWorkflow(incidentsData[1]);
assert.equal(resultInc2.mode, "Demo Mode (Rule-Based Fallback)");
assert.equal(
  resultInc2.diagnosis.supportingEvidence.some((e) => e.logId === "LOG-206"),
  true,
);
assert.equal(validateDiagnosisSchema(resultInc2.diagnosis), true);
console.log("✅ INC-8022 Demo Mode passed.");

// 6. Validation testing
console.log("Test 6: Safe handling of invalid incident IDs...");
const invalidCheck = validateIncidentId("INC-NONEXISTENT", incidentsData);
assert.equal(invalidCheck.valid, false);
console.log("✅ Input validation passed.");

console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY!");
