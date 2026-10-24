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
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-950 text-emerald-400 border border-emerald-800">
            Healthy
          </span>
        );
      case "Degraded":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-950 text-amber-400 border border-amber-800">
            Degraded
          </span>
        );
      case "Failed":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-950 text-rose-400 border border-rose-800 animate-pulse">
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-800 text-gray-400">
            Idle
          </span>
        );
    }
  };

  const getBorderColor = (status) => {
    switch (status) {
      case "Healthy":
        return "border-emerald-800/60 shadow-emerald-950/20";
      case "Degraded":
        return "border-amber-600/70 shadow-amber-950/40";
      case "Failed":
        return "border-rose-500 shadow-rose-950/50";
      default:
        return "border-gray-800";
    }
  };

  return (
    <div className="bg-[#121826] border border-gray-800 rounded-xl p-5 mb-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            Integration Topology Flow
          </h3>
          <p className="text-xs text-gray-500">
            Live health projection derived directly from verified incident
            telemetry
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Normal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> High
            Latency
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Outage
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-2 overflow-x-auto py-2">
        {serviceNodes.map((node, index) => {
          const Icon = node.icon;
          const status = serviceStatuses ? serviceStatuses[node.id] : "Idle";

          return (
            <React.Fragment key={node.id}>
              <div
                className={`flex flex-col items-center justify-center p-3.5 rounded-lg bg-[#0F1420] border ${getBorderColor(status)} w-full lg:w-48 transition-all duration-200`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-gray-200">
                    {node.name}
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 mb-2">
                  {node.type}
                </span>
                {getStatusBadge(status)}
              </div>

              {index < serviceNodes.length - 1 && (
                <div className="hidden lg:flex items-center justify-center text-gray-600 px-1">
                  <ArrowRight className="w-4 h-4 animate-pulse text-cyan-500/70" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
