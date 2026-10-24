import React from "react";
import { CheckCircle2, PlayCircle, Clock } from "lucide-react";

export default function DiagnosticTimeline({ steps, isAnalyzing }) {
  return (
    <div className="bg-[#121826] border border-gray-800 rounded-xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
            Agent Diagnostic Tool Execution Sequence
          </h3>
        </div>
        <span className="text-xs text-gray-500">Autonomous tool calls</span>
      </div>

      {steps.length === 0 && !isAnalyzing ? (
        <div className="text-center py-6 text-xs text-gray-500">
          No diagnostic sequence initiated yet. Click{" "}
          <span className="text-cyan-400">&quot;Analyze Incident&quot;</span> to invoke
          diagnostic tools.
        </div>
      ) : (
        <div className="space-y-3">
          {steps.map((st) => (
            <div
              key={st.step}
              className="bg-[#0A0E17] border border-gray-800/80 rounded-lg p-3"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 font-mono text-cyan-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Step {st.step}: {st.action}
                </span>
                <span className="text-[10px] text-gray-500">
                  {st.description}
                </span>
              </div>
              <div className="mt-1 text-[11px] font-mono text-gray-400 bg-[#06080E] p-2 rounded border border-gray-900 overflow-x-auto max-h-24">
                <pre>{JSON.stringify(st.result, null, 2)}</pre>
              </div>
            </div>
          ))}

          {isAnalyzing && (
            <div className="flex items-center gap-2 text-xs text-cyan-400 animate-pulse bg-cyan-950/20 border border-cyan-800/50 p-2.5 rounded-lg">
              <PlayCircle className="w-4 h-4" />
              <span>
                Diagnostic tools executing: evaluating service dependency graph
                & log correlation...
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
