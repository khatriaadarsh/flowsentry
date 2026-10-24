import { NextResponse } from "next/server";
import incidentsData from "../../../data/incidents.json";
import { validateIncidentId } from "../../../lib/validation.js";
import { runDiagnosticWorkflow } from "../../../lib/analyzer.js";

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Malformed JSON in request body." },
        { status: 400 },
      );
    }

    const validation = validateIncidentId(body?.incidentId, incidentsData);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.message }, { status: 400 });
    }

    const incident = validation.incident;
    const diagnosisResult = await runDiagnosticWorkflow(incident);

    return NextResponse.json(
      {
        incidentId: incident.id,
        timestamp: new Date().toISOString(),
        ...diagnosisResult,
      },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: "Internal server error during diagnosis: " + err.message,
      },
      { status: 500 },
    );
  }
}
