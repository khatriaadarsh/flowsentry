"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  Activity,
  Layers,
  RefreshCw,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";
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
    <div className="min-h-screen bg-[#0B0F19] text-gray-100">
      {/* Top Navbar */}
      <nav className="border-b border-[#1E2638] bg-[#0E1322]/80 backdrop-blur-md sticky top-0 z-30 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/40">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">
                  FlowSentry
                </span>
                <span className="text-[10px] font-mono uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 px-2 py-0.5 rounded-full font-semibold">
                  Hosted Gemma API
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Autonomous Diagnostic Agent for Enterprise Integration & Payment
                Pipelines
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono bg-[#141A29] border border-[#232D42] px-3 py-1.5 rounded-lg text-gray-300">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Simulated Pipeline Active</span>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !selectedIncidentId}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 active:scale-95 disabled:bg-gray-800 disabled:text-gray-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-cyan-950/50 transition-all"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Running Diagnostics...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Analyze Incident</span>
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Error notification */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-3 shadow-lg">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="flex-1 font-medium">{errorMsg}</div>
          </div>
        )}

        {/* Integration Topology Pipeline */}
        <IntegrationFlow serviceStatuses={activeIncident?.serviceStatuses} />

        {/* Dashboard Grid Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Incidents list (4 cols) */}
          <div className="lg:col-span-4 sticky top-20">
            <IncidentList
              incidents={incidents}
              selectedId={selectedIncidentId}
              onSelect={handleSelectIncident}
              loading={isAnalyzing}
            />
          </div>

          {/* Right Column: Detailed Diagnostics & Agent Work (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <IncidentDetails incident={activeIncident} />

            <DiagnosticTimeline
              steps={timelineSteps}
              isAnalyzing={isAnalyzing}
            />

            {analysisResult && (
              <DiagnosisPanel
                result={analysisResult}
                onOpenReport={() => setReportModalOpen(true)}
              />
            )}
          </div>
        </div>
      </main>

      {/* Structured Incident Report Modal */}
      <IncidentReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        reportText={analysisResult?.diagnosis?.incidentReport || ""}
        incidentId={selectedIncidentId || ""}
      />
    </div>
  );
}
