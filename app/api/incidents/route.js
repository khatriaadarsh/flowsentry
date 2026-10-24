import { NextResponse } from "next/server";
import incidentsData from "../../../data/incidents.json";

export async function GET() {
  const summarized = incidentsData.map((inc) => ({
    id: inc.id,
    title: inc.title,
    timestamp: inc.timestamp,
    severity: inc.severity,
    primaryService: inc.primaryService,
    summary: inc.summary,
    serviceStatuses: inc.serviceStatuses,
    logCount: inc.logs.length,
  }));

  return NextResponse.json(summarized, { status: 200 });
}
