import React from "react";
import { Terminal, Calendar, Server } from "lucide-react";

export default function IncidentDetails({ incident }) {
  if (!incident) return null;

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
            <Server className="w-3 h-3 text-cyan-400" />
            <span>
              Target:{" "}
              <strong className="text-gray-200">
                {incident.primaryService}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#0D121E] px-2.5 py-1 rounded border border-[#1E2638]">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span>{new Date(incident.timestamp).toUTCString()}</span>
          </div>
        </div>
      </div>

      {/* Terminal Log Stream */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-300">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Synthetic Diagnostic Raw Log Stream</span>
          </div>
          <span className="text-[11px] font-mono text-gray-400 bg-[#0E1322] px-2 py-0.5 rounded border border-[#1E2638]">
            {incident.logs?.length || 0} entries
          </span>
        </div>

        <div className="bg-[#080C14] border border-[#1A2234] rounded-lg p-3 font-mono text-xs max-h-60 overflow-y-auto space-y-2">
          {incident.logs?.map((log) => {
            const isError = log.level === "ERROR";
            const isWarn = log.level === "WARN";

            return (
              <div
                key={log.id}
                className="grid grid-cols-12 gap-2 text-gray-300 hover:bg-[#111726] p-1.5 rounded transition-colors items-start"
              >
                <span className="col-span-2 sm:col-span-1 text-gray-400 select-none font-semibold text-[11px]">
                  {log.id}
                </span>

                <div className="col-span-2 sm:col-span-1">
                  <span
                    className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded text-center uppercase ${
                      isError
                        ? "bg-rose-950 text-rose-300 border border-rose-800"
                        : isWarn
                          ? "bg-amber-950 text-amber-300 border border-amber-800"
                          : "bg-gray-800/80 text-gray-400 border border-gray-700"
                    }`}
                  >
                    {log.level}
                  </span>
                </div>

                <span className="col-span-3 sm:col-span-2 text-cyan-400 font-semibold truncate text-[11px]">
                  [{log.service}]
                </span>

                <span className="col-span-12 sm:col-span-8 break-words text-gray-200 text-[11px] leading-snug">
                  {log.message}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
