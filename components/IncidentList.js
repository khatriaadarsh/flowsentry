import React from "react";
import { AlertCircle, AlertTriangle, ChevronRight } from "lucide-react";

export default function IncidentList({
  incidents,
  selectedId,
  onSelect,
  loading,
}) {
  return (
    <div className="bg-[#121826] border border-[#1E2638] rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3 border-b border-[#1E2638] pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
          Active Incidents
        </h3>
        <span className="text-[11px] bg-cyan-950 text-cyan-300 border border-cyan-800/80 px-2.5 py-0.5 rounded-full font-mono font-medium">
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
              className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs relative overflow-hidden group ${
                isSelected
                  ? "bg-[#152136] border-cyan-500 shadow-md shadow-cyan-950/40"
                  : "bg-[#0E1322] border-[#1E2638] hover:border-gray-600 hover:bg-[#12182B]"
              }`}
            >
              {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400" />
              )}

              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-mono font-bold text-cyan-300 text-xs tracking-wide">
                  {incident.id}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    isCritical
                      ? "bg-rose-950/80 text-rose-300 border border-rose-800"
                      : "bg-amber-950/80 text-amber-300 border border-amber-800"
                  }`}
                >
                  {isCritical ? (
                    <AlertCircle className="w-3 h-3 text-rose-400" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                  )}
                  {incident.severity}
                </span>
              </div>

              <div className="font-semibold text-gray-100 line-clamp-1 mb-1 group-hover:text-cyan-200 transition-colors">
                {incident.title}
              </div>

              <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed mb-3">
                {incident.summary}
              </p>

              <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono border-t border-[#1E2638]/60 pt-2">
                <span>
                  Target:{" "}
                  <span className="text-gray-300">
                    {incident.primaryService}
                  </span>
                </span>
                <span className="text-gray-400 flex items-center gap-1">
                  View <ChevronRight className="w-3 h-3 text-cyan-400" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
