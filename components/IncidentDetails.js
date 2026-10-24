import React from "react";
import { Terminal } from "lucide-react";

export default function IncidentDetails({ incident }) {
  if (!incident) return null;

  return (
    <div className="bg-[#121826] border border-gray-800 rounded-xl p-5 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-gray-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono font-bold text-cyan-400 text-sm bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
              {incident.id}
            </span>
            <h2 className="text-base font-semibold text-gray-100">
              {incident.title}
            </h2>
          </div>
          <p className="text-xs text-gray-400">{incident.summary}</p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
          <div>
            <span className="text-gray-500">Service:</span>{" "}
            {incident.primaryService}
          </div>
          <div>
            <span className="text-gray-500">Occurred:</span>{" "}
            {new Date(incident.timestamp).toUTCString()}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>
            Synthetic Diagnostic Raw Log Stream ({incident.logs?.length || 0}{" "}
            entries)
          </span>
        </div>

        <div className="bg-[#090D14] border border-gray-800/80 rounded-lg p-3 font-mono text-xs max-h-56 overflow-y-auto space-y-1.5">
          {incident.logs?.map((log) => {
            const isError = log.level === "ERROR";
            const isWarn = log.level === "WARN";

            return (
              <div
                key={log.id}
                className="flex items-start gap-2 text-gray-300 hover:bg-gray-800/30 p-1 rounded"
              >
                <span className="text-gray-500 select-none text-[11px] w-16">
                  {log.id}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    isError
                      ? "bg-rose-950 text-rose-400"
                      : isWarn
                        ? "bg-amber-950 text-amber-400"
                        : "bg-gray-800 text-gray-400"
                  }`}
                >
                  {log.level}
                </span>
                <span className="text-cyan-400/80 text-[11px] w-28 truncate">
                  [{log.service}]
                </span>
                <span className="flex-1 break-all text-gray-300 text-[11px]">
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
