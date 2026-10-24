import React from "react";
import { AlertCircle, AlertTriangle } from "lucide-react";

export default function IncidentList({
  incidents,
  selectedId,
  onSelect,
  loading,
}) {
  return (
    <div className="bg-[#121826] border border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3 border-b border-gray-800 pb-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
          Active Incidents
        </h3>
        <span className="text-xs bg-cyan-950 text-cyan-400 border border-cyan-800/60 px-2 py-0.5 rounded-full font-mono">
          {incidents.length} Simulated
        </span>
      </div>

      <div className="space-y-2.5">
        {incidents.map((incident) => {
          const isSelected = incident.id === selectedId;
          const isCritical = incident.severity === "CRITICAL";

          return (
            <button
              key={incident.id}
              onClick={() => onSelect(incident.id)}
              disabled={loading}
              className={`w-full text-left p-3.5 rounded-lg border transition-all duration-150 ${
                isSelected
                  ? "bg-cyan-950/30 border-cyan-500/80 shadow-md shadow-cyan-950/30"
                  : "bg-[#0F1420] border-gray-800/80 hover:border-gray-700 hover:bg-[#141b2c]"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold text-cyan-400">
                  {incident.id}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                    isCritical
                      ? "bg-rose-950 text-rose-400 border border-rose-800"
                      : "bg-amber-950 text-amber-400 border border-amber-800"
                  }`}
                >
                  {isCritical ? (
                    <AlertCircle className="w-3 h-3" />
                  ) : (
                    <AlertTriangle className="w-3 h-3" />
                  )}
                  {incident.severity}
                </span>
              </div>

              <div className="text-xs font-medium text-gray-200 line-clamp-1 mb-1">
                {incident.title}
              </div>
              <div className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                {incident.summary}
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                <span>Target: {incident.primaryService}</span>
                <span>
                  {new Date(incident.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
