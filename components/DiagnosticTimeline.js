import React from "react";
import { CheckCircle2, PlayCircle, Clock } from "lucide-react";

export default function DiagnosticTimeline({ steps, isAnalyzing }) {
  return (
    <div className="bg-[#121826] border border-[#1E2638] rounded-xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4 border-b border-[#1E2638] pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
            Agent Diagnostic Tool Execution Sequence
          </h3>
        </div>
        <span className="text-[11px] font-mono text-gray-400">
          Autonomous tool calls
        </span>
      </div>

      {steps.length === 0 && !isAnalyzing ? (
        <div className="text-center py-8 text-xs text-gray-400 bg-[#0E1322] rounded-lg border border-dashed border-[#1E2638]">
          No diagnostic sequence initiated yet. Click{" "}
          <strong className="text-cyan-400">&quot;Analyze Incident&quot;</strong> above to
          invoke tools.
        </div>
      ) : (
        <div className="space-y-3">
          {steps.map((st) => (
            <div
              key={st.step}
              className="bg-[#0B101D] border border-[#1E2638] rounded-lg p-3.5 space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <span className="flex items-center gap-1.5 font-mono text-cyan-300 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Step {st.step}:{" "}
                  <span className="text-white">{st.action}</span>
                </span>
                <span className="text-[11px] text-gray-400">
                  {st.description}
                </span>
              </div>

              <div className="text-[11px] font-mono text-gray-300 bg-[#060A12] p-2.5 rounded border border-[#151D2E] overflow-x-auto max-h-32">
                <pre>{JSON.stringify(st.result, null, 2)}</pre>
              </div>
            </div>
          ))}

          {isAnalyzing && (
            <div className="flex items-center gap-2 text-xs text-cyan-300 bg-cyan-950/40 border border-cyan-800/80 p-3 rounded-lg animate-pulse">
              <PlayCircle className="w-4 h-4 shrink-0 text-cyan-400" />
              <span>
                Diagnostic tools executing: querying log stream and checking
                dependency status...
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
