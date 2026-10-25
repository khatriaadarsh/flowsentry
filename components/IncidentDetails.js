"use client";

import React, { useState, useMemo } from "react";
import {
  Terminal,
  Search,
  Filter,
  Calendar,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  RotateCcw,
  Clock,
  Layers,
  FileCode2,
} from "lucide-react";

export default function IncidentDetails({ incident }) {
  if (!incident) return null;

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("ALL");
  const [selectedService, setSelectedService] = useState("ALL");

  // Date selection states
  const [inputStartDate, setInputStartDate] = useState("");
  const [inputEndDate, setInputEndDate] = useState("");
  const [appliedStartDate, setAppliedStartDate] = useState("");
  const [appliedEndDate, setAppliedEndDate] = useState("");

  const [expandedLogId, setExpandedLogId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Deriving unique services from current incident logs
  const availableServices = useMemo(() => {
    if (!incident?.logs) return [];
    return Array.from(new Set(incident.logs.map((l) => l.service)));
  }, [incident]);

  // Apply date range filter when "Filter" button is clicked
  const handleApplyDateFilter = () => {
    setAppliedStartDate(inputStartDate);
    setAppliedEndDate(inputEndDate);
  };

  // Reset all filters back to default
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedLevel("ALL");
    setSelectedService("ALL");
    setInputStartDate("");
    setInputEndDate("");
    setAppliedStartDate("");
    setAppliedEndDate("");
    setExpandedLogId(null);
  };

  // Filter logs based on active criteria
  const filteredLogs = useMemo(() => {
    if (!incident?.logs) return [];

    return incident.logs.filter((log) => {
      // 1. Log Level filter
      if (selectedLevel !== "ALL" && log.level !== selectedLevel) {
        return false;
      }

      // 2. Service filter
      if (selectedService !== "ALL" && log.service !== selectedService) {
        return false;
      }

      // 3. Date Range filter (evaluated only from applied dates)
      const logDate = log.timestamp.slice(0, 10);
      if (appliedStartDate && logDate < appliedStartDate) {
        return false;
      }
      if (appliedEndDate && logDate > appliedEndDate) {
        return false;
      }

      // 4. Keyword text search
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesMessage = log.message.toLowerCase().includes(query);
        const matchesId = log.id.toLowerCase().includes(query);
        const matchesTrace =
          log.traceId?.toLowerCase().includes(query) || false;
        const matchesDetails =
          log.details?.toLowerCase().includes(query) || false;
        if (!matchesMessage && !matchesId && !matchesTrace && !matchesDetails) {
          return false;
        }
      }

      return true;
    });
  }, [
    incident,
    searchQuery,
    selectedLevel,
    selectedService,
    appliedStartDate,
    appliedEndDate,
  ]);

  const handleCopyLog = (log, e) => {
    e.stopPropagation();
    const logString = `[${log.timestamp}] [${log.level}] [${log.service}] [${log.id}] ${log.message} ${
      log.details ? `\nDetails: ${log.details}` : ""
    }`;
    navigator.clipboard.writeText(logString);
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isFiltered =
    searchQuery !== "" ||
    selectedLevel !== "ALL" ||
    selectedService !== "ALL" ||
    appliedStartDate !== "" ||
    appliedEndDate !== "" ||
    inputStartDate !== "" ||
    inputEndDate !== "";

  return (
    <div className="bg-[#121826] border border-[#1E2638] rounded-xl p-5 shadow-lg">
      {/* Incident Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#1E2638] pb-4 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs bg-cyan-950 text-cyan-300 border border-cyan-800/80 px-2 py-0.5 rounded">
              {incident.id}
            </span>
            <h2 className="text-base font-bold text-white tracking-tight">
              {incident.title}
            </h2>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed max-w-2xl">
            {incident.summary}
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 text-[11px] font-mono text-gray-400 shrink-0">
          <div className="flex items-center gap-1.5 bg-[#0D121E] px-2.5 py-1 rounded border border-[#1E2638]">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              Target:{" "}
              <strong className="text-gray-200">
                {incident.primaryService}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#0D121E] px-2.5 py-1 rounded border border-[#1E2638]">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>{new Date(incident.timestamp).toUTCString()}</span>
          </div>
        </div>
      </div>

      {/* Interactive Log Controls Toolbar */}
      <div className="bg-[#0A0E18] border border-[#1A2234] rounded-lg p-3.5 mb-3.5 space-y-3">
        {/* Top Row: Search query & Level buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search log messages, Log IDs, trace IDs, SQL errors..."
              className="w-full bg-[#101624] border border-[#20293D] focus:border-cyan-500 text-xs text-gray-200 pl-9 pr-3 py-2 rounded-lg outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-gray-400 font-medium">
              Level:
            </span>
            <div className="flex items-center bg-[#101624] border border-[#20293D] rounded-lg p-0.5">
              {["ALL", "ERROR", "WARN", "INFO"].map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded transition-colors ${
                    selectedLevel === level
                      ? level === "ERROR"
                        ? "bg-rose-950 text-rose-300 border border-rose-800"
                        : level === "WARN"
                          ? "bg-amber-950 text-amber-300 border border-amber-800"
                          : level === "INFO"
                            ? "bg-cyan-950 text-cyan-300 border border-cyan-800"
                            : "bg-[#1C2538] text-white"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row: Date range pickers + Filter Button + Service Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-[#161E2E]">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px]">Time Window:</span>
            </div>

            <input
              type="date"
              value={inputStartDate}
              onChange={(e) => setInputStartDate(e.target.value)}
              className="bg-[#101624] border border-[#20293D] text-[11px] text-gray-200 px-2 py-1 rounded outline-none focus:border-cyan-500"
            />
            <span className="text-gray-500 text-[10px]">to</span>
            <input
              type="date"
              value={inputEndDate}
              onChange={(e) => setInputEndDate(e.target.value)}
              className="bg-[#101624] border border-[#20293D] text-[11px] text-gray-200 px-2 py-1 rounded outline-none focus:border-cyan-500"
            />

            {/* Explicit Filter Button */}
            <button
              onClick={handleApplyDateFilter}
              className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white text-[11px] font-semibold px-3 py-1 rounded shadow-md transition-all ml-1"
            >
              <Filter className="w-3 h-3" />
              <span>Filter</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Service dropdown filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[11px] text-gray-400">Service:</span>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="bg-[#101624] border border-[#20293D] text-[11px] text-gray-200 px-2.5 py-1 rounded outline-none focus:border-cyan-500"
              >
                <option value="ALL">All Services</option>
                {availableServices.map((svc) => (
                  <option key={svc} value={svc}>
                    {svc}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            {isFiltered && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 px-2 py-1 bg-amber-950/30 border border-amber-800/60 rounded transition-colors"
                title="Reset all log filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Structured Log Stream Window */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-300">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Structured Diagnostic Log Stream</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span className="text-gray-400">
              Showing{" "}
              <strong className="text-cyan-300">{filteredLogs.length}</strong>{" "}
              of {incident.logs?.length || 0} entries
            </span>
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="bg-[#080C14] border border-[#1A2234] rounded-lg p-8 text-center text-xs text-gray-500">
            No logs found for the selected time window or filters. Try adjusting
            the dates and clicking <strong>Filter</strong>.
          </div>
        ) : (
          <div className="bg-[#080C14] border border-[#1A2234] rounded-lg p-2 font-mono text-xs max-h-72 overflow-y-auto space-y-1">
            {filteredLogs.map((log) => {
              const isError = log.level === "ERROR";
              const isWarn = log.level === "WARN";
              const isExpanded = expandedLogId === log.id;

              return (
                <div
                  key={log.id}
                  onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                  className={`border rounded p-2 transition-all cursor-pointer ${
                    isExpanded
                      ? "bg-[#101726] border-cyan-700/80"
                      : "bg-[#0B0F19] border-[#151D2C] hover:bg-[#0E1422] hover:border-[#222E44]"
                  }`}
                >
                  {/* Primary log header row */}
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-2 overflow-hidden flex-1">
                      <span className="text-gray-500 select-none">
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                        )}
                      </span>

                      <span className="text-gray-400 font-bold w-16 shrink-0">
                        {log.id}
                      </span>

                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                          isError
                            ? "bg-rose-950 text-rose-300 border border-rose-800"
                            : isWarn
                              ? "bg-amber-950 text-amber-300 border border-amber-800"
                              : "bg-cyan-950 text-cyan-300 border border-cyan-800"
                        }`}
                      >
                        {log.level}
                      </span>

                      <span className="text-gray-400 text-[10px] shrink-0 font-sans">
                        {new Date(log.timestamp).toLocaleDateString([], {
                          month: "short",
                          day: "2-digit",
                        })}{" "}
                        {new Date(log.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>

                      <span className="text-cyan-400/90 font-semibold shrink-0">
                        [{log.service}]
                      </span>

                      {log.traceId && (
                        <span className="text-[10px] text-gray-500 font-mono shrink-0 hidden sm:inline">
                          trace:{log.traceId}
                        </span>
                      )}

                      <span className="text-gray-200 truncate flex-1 leading-snug">
                        {log.message}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleCopyLog(log, e)}
                      className="p-1 rounded text-gray-400 hover:text-cyan-300 hover:bg-[#182236] transition-colors shrink-0"
                      title="Copy raw log line"
                    >
                      {copiedId === log.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Expandable Technical Details & Stack Trace */}
                  {isExpanded && (
                    <div className="mt-2.5 pt-2 border-t border-[#1C263A] text-xs font-mono space-y-1.5 pl-6 bg-[#080B12] p-2.5 rounded">
                      <div className="text-gray-300 flex items-start gap-2">
                        <FileCode2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-gray-200">
                            Log Message:
                          </strong>{" "}
                          {log.message}
                        </div>
                      </div>

                      {log.details && (
                        <div className="text-gray-400 text-[11px] leading-relaxed bg-[#0E131E] p-2 rounded border border-[#192336] mt-1.5">
                          <span className="text-cyan-400 font-semibold block mb-0.5">
                            Payload / Diagnostics:
                          </span>
                          <span className="text-gray-300">{log.details}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[10px] text-gray-500">
                        <div>
                          Service ID:{" "}
                          <span className="text-gray-300">{log.service}</span>
                        </div>
                        <div>
                          Trace ID:{" "}
                          <span className="text-gray-300">
                            {log.traceId || "N/A"}
                          </span>
                        </div>
                        <div>
                          Timestamp:{" "}
                          <span className="text-gray-300">
                            {new Date(log.timestamp).toISOString()}
                          </span>
                        </div>
                        <div>
                          Log ID:{" "}
                          <span className="text-gray-300">{log.id}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
