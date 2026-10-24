import React from 'react';
import { ShieldCheck, AlertOctagon, HelpCircle, FileText, CheckCircle, Activity, Info } from 'lucide-react';

export default function DiagnosisPanel({ result, onOpenReport }) {
  if (!result || !result.diagnosis) return null;

  const { mode, model, diagnosis, fallbackReason } = result;
  const isHighConfidence = diagnosis.confidence === 'HIGH';
  const isAiMode = mode.includes('AI Mode');

  return (
    <div className="bg-[#121826] border border-gray-800 rounded-xl p-5 mb-6 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isAiMode ? 'bg-cyan-400' : 'bg-amber-400'} animate-ping`}></span>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-200">
              Diagnostic Finding & Root Cause Analysis
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{diagnosis.incidentSummary}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-mono font-medium px-2.5 py-1 rounded-full border ${
            isAiMode
              ? 'bg-cyan-950 text-cyan-300 border-cyan-700 shadow-sm shadow-cyan-950'
              : 'bg-amber-950/80 text-amber-300 border-amber-700 shadow-sm shadow-amber-950'
          }`}>
            Engine: {mode} ({model})
          </span>
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 text-xs bg-cyan-600 hover:bg-cyan-500 text-white font-medium px-3 py-1 rounded transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            View Incident Report
          </button>
        </div>
      </div>

      {!isAiMode && fallbackReason && (
        <div className="mb-4 p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/80 text-amber-300 text-xs flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Notice: Demo Mode active ({fallbackReason}). Output is deterministic rule-based, not AI-generated.</span>
        </div>
      )}

      <div className="bg-[#0B101D] border-l-4 border-l-rose-500 border border-gray-800 rounded-r-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4" /> Likely Root Cause
          </span>
          <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded border ${
            isHighConfidence
              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
              : 'bg-amber-950 text-amber-400 border-amber-800'
          }`}>
            Confidence: {diagnosis.confidence}
          </span>
        </div>
        <p className="text-xs text-gray-200 leading-relaxed font-sans">{diagnosis.likelyRootCause}</p>

        {diagnosis.impactAssessment && (
          <div className="mt-2.5 pt-2 border-t border-gray-800/80 text-[11px] text-gray-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span><strong className="text-gray-300">Impact Assessment:</strong> {diagnosis.impactAssessment}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0E1320] border border-gray-800/80 rounded-lg p-3.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Grounded Evidence from Logs
          </h4>
          <div className="space-y-2">
            {diagnosis.supportingEvidence?.map((ev, i) => (
              <div key={i} className="text-xs bg-[#090D14] p-2 rounded border border-gray-800">
                <div className="flex items-center justify-between font-mono text-[11px] text-cyan-400/90 mb-1">
                  <span className="font-bold underline decoration-cyan-700">{ev.logId}</span>
                  <span className="text-gray-500">[{ev.service}]</span>
                </div>
                <p className="text-gray-300 text-[11px]">{ev.finding}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0E1320] border border-gray-800/80 rounded-lg p-3.5 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2">
              <CheckCircle className="w-3.5 h-3.5" /> Recommended Actions
            </h4>
            <div className="space-y-2 text-xs text-gray-300">
              {diagnosis.recommendedActions?.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-[#090D14] p-2 rounded border border-gray-800/80 text-[11px]">
                  <span className="text-emerald-500 font-mono font-bold">{idx + 1}.</span>
                  <span className="leading-snug">{step.replace(/^\d+\.\s*/, '')}</span>
                </div>
              ))}
            </div>
          </div>

          {diagnosis.alternativeExplanations?.length > 0 && (
            <div className="mt-3 pt-2 border-t border-gray-800">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold flex items-center gap-1 mb-1">
                <HelpCircle className="w-3 h-3" /> Alternative Hypotheses
              </span>
              <ul className="list-disc list-inside text-[11px] text-gray-400 space-y-0.5">
                {diagnosis.alternativeExplanations.map((alt, i) => (
                  <li key={i}>{alt}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}