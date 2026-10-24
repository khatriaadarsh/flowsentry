import { NextResponse } from "next/server";
import {
  searchLogs,
  inspectService,
  checkRecentFailures,
} from "../../../lib/diagnosticTools.js";

export async function POST(request) {
  try {
    const body = await request.json();
    const { toolName, params } = body;

    if (!toolName) {
      return NextResponse.json(
        { error: "Missing 'toolName' parameter" },
        { status: 400 },
      );
    }

    switch (toolName) {
      case "searchLogs": {
        const { incidentId, query } = params || {};
        if (!incidentId)
          return NextResponse.json(
            { error: "incidentId is required" },
            { status: 400 },
          );
        const res = searchLogs(incidentId, query);
        return NextResponse.json(res);
      }
      case "inspectService": {
        const { serviceName } = params || {};
        if (!serviceName)
          return NextResponse.json(
            { error: "serviceName is required" },
            { status: 400 },
          );
        const res = inspectService(serviceName);
        return NextResponse.json(res);
      }
      case "checkRecentFailures": {
        const { serviceName } = params || {};
        if (!serviceName)
          return NextResponse.json(
            { error: "serviceName is required" },
            { status: 400 },
          );
        const res = checkRecentFailures(serviceName);
        return NextResponse.json(res);
      }
      default:
        return NextResponse.json(
          { error: `Tool '${toolName}' is not permitted or unknown` },
          { status: 400 },
        );
    }
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid JSON request payload: " + err.message },
      { status: 400 },
    );
  }
}
