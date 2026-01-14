"use client";

import { trpc } from "@/trpc/client";
import { CheckCircle2, Circle, Clock, Loader2, Zap } from "lucide-react";

export function TaskList() {
  const utils = trpc.useUtils();
  
  // 1. Busca os dados reais
  const { data: tasks, isLoading } = trpc.task.getTasks.useQuery();

  // 2. Opcional: Adicionar uma mutation para marcar como feito (precisaria criar no taskRouter)
  // const toggleMutation = trpc.task.toggleComplete.useMutation({
  //   onSuccess: () => utils.task.getTasks.invalidate(),
  // });

  if (isLoading) return (
    <div className="flex items-center gap-3 text-blue-500/50 font-mono text-[10px] tracking-widest uppercase p-4">
      <Loader2 className="animate-spin" size={14} /> 
      <span>Syncing Neural Link...</span>
    </div>
  );

  if (!tasks || tasks.length === 0) return (
    <div className="p-8 border border-dashed border-slate-200 dark:border-white/5 rounded-2xl text-center">
      <Zap size={20} className="mx-auto mb-3 text-slate-300 dark:text-white/10" />
      <p className="text-slate-500 text-xs font-mono uppercase tracking-tighter">
        No active protocols found.
      </p>
    </div>
  );

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div 
          key={task.id} 
          className="group relative flex items-center justify-between p-4 rounded-xl bg-white dark:bg-[#0a0f1c] border border-slate-200 dark:border-white/5 transition-all duration-300 hover:border-blue-500/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] overflow-hidden"
        >
          {/* Efeito de brilho lateral no hover */}
          <div className="absolute left-0 top-0 h-full w-0.5 bg-blue-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />

          <div className="flex items-center gap-4 relative z-10">
            <button 
              className="transition-transform active:scale-90"
              // onClick={() => toggleMutation.mutate({ id: task.id })}
            >
              {task.completed ? (
                <CheckCircle2 size={20} className="text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
              ) : (
                <Circle size={20} className="text-slate-400 dark:text-white/20 hover:text-blue-500 transition-colors" />
              )}
            </button>
            
            <div>
              <p className={`text-sm font-bold transition-all ${
                task.completed 
                ? "text-slate-400 line-through dark:text-white/30" 
                : "text-slate-800 dark:text-white group-hover:text-blue-500"
              }`}>
                {task.title}
              </p>
              
              <div className="flex gap-4 mt-1 text-[9px] font-mono text-slate-500 dark:text-gray-500 uppercase tracking-widest">
                <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                  <Clock size={10} className="text-blue-500" /> 
                  {task.totalMinutes}m logged
                </span>
                <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                  <Zap size={10} className="text-emerald-500" /> 
                  {task.focusSessions} focus sessions
                </span>
              </div>
            </div>
          </div>

          {/* Badge de Status Opcional */}
          {!task.completed && (
            <div className="hidden md:block text-[8px] font-black px-2 py-1 rounded bg-blue-500/10 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity uppercase">
              In Queue
            </div>
          )}
        </div>
      ))}
    </div>
  );
}