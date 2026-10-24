import React from "react";
import {
  ArrowRight,
  Server,
  Database,
  Layers,
  Cpu,
  ShieldCheck,
} from "lucide-react";

const serviceNodes = [
  {
    id: "payment-api",
    name: "Payment API",
    icon: ShieldCheck,
    type: "API Gateway",
  },
  { id: "iib-ace", name: "IBM IIB / ACE", icon: Layers, type: "ESB / Bus" },
  { id: "msg-queue", name: "Message Queue", icon: Cpu, type: "AMQP Broker" },
  {
    id: "banking-service",
    name: "Banking Service",
    icon: Server,
    type: "Core App",
  },
  { id: "core-database", name: "Core DB", icon: Database, type: "PostgreSQL" },
];

export default function IntegrationFlow({ serviceStatuses }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Healthy":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Healthy
          </span>
        );
      case "Degraded":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-700/80">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Degraded
          </span>
        );
      case "Failed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-950/90 text-rose-300 border border-rose-600/90 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-800 text-gray-400">
            Idle
          </span>
        );
    }
  };

  const getNodeBorder = (status) => {
    switch (status) {
      case "Healthy":
        return "border-[#233529] hover:border-emerald-600/60 bg-[#0F181B]";
      case "Degraded":
        return "border-[#3D3019] hover:border-amber-600/60 bg-[#171616]";
      case "Failed":
        return "border-rose-800/90 shadow-lg shadow-rose-950/50 bg-[#1D1318]";
      default:
        return "border-[#1E2638] bg-[#121826]";
    }
  };

  return (
    <div className="bg-[#121826] border border-[#1E2638] rounded-xl p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-[#1E2638]/70 pb-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-300">
            Integration Topology Flow
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Live health projection derived directly from verified telemetry
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Normal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> High
            Latency
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Outage
          </span>
        </div>
      </div>

      {/* Service Nodes Horizontal Pipeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 relative">
        {serviceNodes.map((node, index) => {
          const Icon = node.icon;
          const status = serviceStatuses ? serviceStatuses[node.id] : "Idle";

          return (
            <div
              key={node.id}
              className={`flex flex-col items-center justify-between p-4 rounded-xl border transition-all duration-200 ${getNodeBorder(
                status,
              )}`}
            >
              <div className="flex items-center gap-2 mb-2 w-full justify-center">
                <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-xs font-bold text-gray-200 truncate">
                  {node.name}
                </span>
              </div>
              <span className="text-[10px] font-mono text-gray-400 mb-3 uppercase tracking-wide">
                {node.type}
              </span>
              <div>{getStatusBadge(status)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
