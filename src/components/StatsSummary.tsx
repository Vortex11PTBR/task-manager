"use client";

import { trpc } from "@/trpc/client";
import { Timer, Target, Trophy } from "lucide-react";

export function StatsSummary() {
  const { data: stats, isLoading } = trpc.task.getStats.useQuery();

  if (isLoading) return <div className="h-24 animate-pulse bg-white/5 rounded-2xl" />;

  const items = [
    { label: "Tempo de Foco", value: `${stats?.totalTime}m`, icon: <Timer size={16}/> },
    { label: "Sessões", value: stats?.totalSessions, icon: <Target size={16}/> },
    { label: "Concluídas", value: `${stats?.completedTasks}/${stats?.totalTasks}`, icon: <Trophy size={16}/> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {items.map((item, i) => (
        <div key={i} className="p-6 rounded-2xl bg-[#0a0f1c] border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{item.label}</p>
            <p className="text-2xl font-black text-white">{item.value}</p>
          </div>
          <div className="text-blue-500">{item.icon}</div>
        </div>
      ))}
    </div>
  );
}