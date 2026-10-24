import React, { useState } from "react";
import { Copy, Check, X, ShieldAlert } from "lucide-react";

export default function IncidentReportModal({
  isOpen,
  onClose,
  reportText,
  incidentId,
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#121826] border border-gray-700 rounded-xl max-w-2xl w-full shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-100">
              Incident Investigation Report — {incidentId}
            </span>
            <span className="text-[10px] bg-amber-950 text-amber-400 border border-amber-800 px-2 py-0.5 rounded font-mono">
              Draft for Human Review
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 font-mono text-xs text-gray-300 bg-[#090D14] m-4 rounded-lg border border-gray-800 whitespace-pre-wrap leading-relaxed">
          {reportText}
        </div>

        <div className="p-4 border-t border-gray-800 flex items-center justify-between bg-[#0F1420] rounded-b-xl">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>
              Remediation must be reviewed by an authorized engineer before
              execution.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-xs px-3 py-1.5 rounded text-gray-400 hover:text-gray-200 border border-gray-700"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs bg-cyan-600 hover:bg-cyan-500 text-white font-medium px-4 py-1.5 rounded transition-all"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-300" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? "Copied to Clipboard" : "Copy Report"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
