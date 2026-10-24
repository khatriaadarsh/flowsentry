"use client";

import React, { useState, useEffect } from "react";
import { Play, Activity, Layers, RefreshCw, AlertCircle } from "lucide-react";
import IntegrationFlow from "../components/IntegrationFlow";
import IncidentList from "../components/IncidentList";
import IncidentDetails from "../components/IncidentDetails";
import DiagnosticTimeline from "../components/DiagnosticTimeline";
import DiagnosisPanel from "../components/DiagnosisPanel";
import IncidentReportModal from "../components/IncidentReportModal";

export default function FlowSentryDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [rawIncidentsMap, setRawIncidentsMap] = useState({});
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [timelineSteps, setTimelineSteps] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/incidents");
        const data = await res.json();
        setIncidents(data);
        if (data.length > 0) {
          setSelectedIncidentId(data[0].id);
        }

        const fullRes = await import("../data/incidents.json");
        const map = {};
        fullRes.default.forEach((inc) => {
          map[inc.id] = inc;
        });
        setRawIncidentsMap(map);
      } catch (err) {
        setErrorMsg("Failed to initialize incident store: " + err.message);
      }
    }
    loadData();
  }, []);

  const activeIncident = rawIncidentsMap[selectedIncidentId] || null;

  const handleSelectIncident = (id) => {
    setSelectedIncidentId(id);
    setAnalysisResult(null);
    setTimelineSteps([]);
    setErrorMsg(null);
  };

  const handleAnalyze = async () => {
    if (!selectedIncidentId) return;
    setIsAnalyzing(true);
    setErrorMsg(null);
    setAnalysisResult(null);
    setTimelineSteps([]);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ incidentId: selectedIncidentId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Diagnostic run encountered a failure.");
      }

      setTimelineSteps(data.steps || []);
      setAnalysisResult(data);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-gray-800 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/30">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                FlowSentry
                <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-full">
                  Direct Hosted Gemma
                </span>
              </h1>
              <p className="text-xs text-gray-400">
                Autonomous Diagnostic Agent for Enterprise Integration & Payment
                Pipelines
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono bg-[#121826] border border-gray-800 px-3 py-1.5 rounded-lg text-gray-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Telemetry: Simulated Pipeline</span>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !selectedIncidentId}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-800 disabled:text-gray-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-cyan-950/50 transition-all duration-150"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Diagnostics...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Analyze Incident</span>
              </>
            )}
          </button>
        </div>
      </header>

      {errorMsg && (
        <div className="mb-6 p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <IntegrationFlow serviceStatuses={activeIncident?.serviceStatuses} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <IncidentList
            incidents={incidents}
            selectedId={selectedIncidentId}
            onSelect={handleSelectIncident}
            loading={isAnalyzing}
          />
        </div>

        <div className="lg:col-span-8 space-y-6">
          <IncidentDetails incident={activeIncident} />

          <DiagnosticTimeline steps={timelineSteps} isAnalyzing={isAnalyzing} />

          {analysisResult && (
            <DiagnosisPanel
              result={analysisResult}
              onOpenReport={() => setReportModalOpen(true)}
            />
          )}
        </div>
      </div>

      <IncidentReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        reportText={analysisResult?.diagnosis?.incidentReport || ""}
        incidentId={selectedIncidentId || ""}
      />
    </div>
  );
}
