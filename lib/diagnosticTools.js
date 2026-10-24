import incidentsData from "../data/incidents.json" with { type: "json" };
import servicesData from "../data/services.json" with { type: "json" };

/**
 * Diagnostic Tool: Search logs within a specified incident
 */
export function searchLogs(incidentId, query) {
  const incident = incidentsData.find((inc) => inc.id === incidentId);
  if (!incident) {
    return { error: `Incident ${incidentId} not found`, logs: [] };
  }

  const normalizedQuery = (query || "").toLowerCase();
  const matchedLogs = incident.logs.filter((log) => {
    if (!normalizedQuery) return true;
    return (
      log.message.toLowerCase().includes(normalizedQuery) ||
      log.service.toLowerCase().includes(normalizedQuery) ||
      log.level.toLowerCase().includes(normalizedQuery)
    );
  });

  return {
    tool: "searchLogs",
    incidentId,
    query,
    totalFound: matchedLogs.length,
    results: matchedLogs,
  };
}

/**
 * Diagnostic Tool: Inspect service topology and metadata
 */
export function inspectService(serviceName) {
  const service = servicesData.find(
    (s) =>
      s.id.toLowerCase() === serviceName.toLowerCase() ||
      s.name.toLowerCase() === serviceName.toLowerCase(),
  );

  if (!service) {
    return {
      tool: "inspectService",
      serviceName,
      status: "UNKNOWN_SERVICE",
      details: null,
    };
  }

  const upstream = servicesData.find((s) => s.id === service.upstream);
  const downstream = servicesData.find((s) => s.id === service.downstream);

  return {
    tool: "inspectService",
    serviceName: service.name,
    serviceId: service.id,
    type: service.type,
    upstream: upstream ? upstream.name : "None (Entry Point)",
    downstream: downstream ? downstream.name : "None (Terminal Sink)",
  };
}

/**
 * Diagnostic Tool: Check known failure counts & patterns
 */
export function checkRecentFailures(serviceName) {
  const normalized = serviceName.toLowerCase();
  const incident = incidentsData.find(
    (inc) =>
      inc.primaryService.toLowerCase() === normalized ||
      inc.affectedServices.some((s) => s.toLowerCase() === normalized),
  );

  if (!incident) {
    return {
      tool: "checkRecentFailures",
      serviceName,
      failures: [],
    };
  }

  return {
    tool: "checkRecentFailures",
    serviceName,
    failures: incident.knownFailures || [],
  };
}
