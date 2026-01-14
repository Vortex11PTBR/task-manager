"use client";

import { useState, useMemo } from "react";
import { DayPicker } from "react-day-picker";
import { ptBR } from "date-fns/locale";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { trpc } from "@/trpc/client";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { expandTasksForRange } from "@/lib/recurrence";
import "react-day-picker/dist/style.css";

export function TaskCalendar() {
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [showTimeline, setShowTimeline] = useState(false);
  
  const { data: allTasks, isLoading } = trpc.task.getTasks.useQuery();

  const monthRange = useMemo(() => {
    const s = selected ? startOfMonth(selected) : startOfMonth(new Date());
    const e = selected ? endOfMonth(selected) : endOfMonth(new Date());
    return { start: s, end: e };
  }, [selected]);

  const occurrences = useMemo(() => {
    if (!allTasks) return [];
    return expandTasksForRange(
      allTasks as any,
      monthRange.start,
      monthRange.end
    );
  }, [allTasks, monthRange]);

  const dayTasks = useMemo(() => {
    if (!selected) return [];
    return occurrences.filter((o) => {
      const d1 = new Date(o.date);
      return (
        d1.getFullYear() === selected.getFullYear() &&
        d1.getMonth() === selected.getMonth() &&
        d1.getDate() === selected.getDate()
      );
    });
  }, [occurrences, selected]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* SELETOR DE DATA */}
      <div className="p-8 rounded-3xl bg-white dark:bg-[#0a0f1c] border border-slate-200 dark:border-white/5 shadow-2xl flex justify-center">
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={setSelected}
          locale={ptBR}
          className="rdp-custom"
        />
      </div>

      {/* LISTA DE PROTOCOLOS DO DIA */}
      <div className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <CalendarIcon size={14} /> Daily Agenda
          </h3>
          <span className="text-[10px] font-mono text-slate-400 dark:text-gray-600">
            {selected ? format(selected, "dd.MM.yyyy") : "SELECT DATE"}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <label className="text-xs font-mono text-slate-400">View:</label>
          <button onClick={() => setShowTimeline(false)} className={`px-2 py-1 text-xs rounded ${!showTimeline ? 'bg-blue-600 text-white' : 'bg-transparent'}`}>Agenda</button>
          <button onClick={() => setShowTimeline(true)} className={`px-2 py-1 text-xs rounded ${showTimeline ? 'bg-blue-600 text-white' : 'bg-transparent'}`}>24h Timeline</button>
        </div>

        <div className="space-y-4 overflow-y-auto max-h-87.5 pr-2 custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center gap-2 text-xs text-slate-400"><Loader2 size={12} className="animate-spin" /> Syncing...</div>
          ) : dayTasks.length === 0 ? (
            <div className="text-center py-20 opacity-30 italic text-xs uppercase tracking-widest">
              No data for this day.
            </div>
          ) : (
            showTimeline ? (
              <div className="relative w-full h-[880px] bg-gradient-to-b from-white/2 to-transparent rounded-lg overflow-auto border border-slate-100 dark:border-white/5">
                {/* timeline container: 24h * pxPerMinute height; we use 0.6px per minute => ~864px */}
                <div className="relative h-[864px]">
                  {/* hour guides */}
                  {Array.from({ length: 24 }).map((_, hr) => (
                    <div key={hr} className="absolute left-0 right-0 border-t border-slate-100/40 dark:border-white/5 text-xs text-slate-400" style={{ top: `${(hr * 60) * 0.6}px` }}>
                      <div className="ml-3 mt-[-9px] w-max bg-white/5 dark:bg-transparent px-2 text-[11px] font-mono">{String(hr).padStart(2,'0')}:00</div>
                    </div>
                  ))}

                  {/* task blocks */}
                  {dayTasks.map((occ) => {
                    const dt = new Date(occ.date);
                    const minutes = dt.getHours() * 60 + dt.getMinutes();
                    // duration fallback: use totalMinutes if present, otherwise 60
                    const duration = occ.totalMinutes && occ.totalMinutes > 0 ? occ.totalMinutes : 60;
                    const top = minutes * 0.6; // px per minute
                    const height = Math.max(28, duration * 0.6);
                    return (
                      <div key={`${occ.taskId}-${occ.date.toISOString()}`} className="absolute left-6 right-6 rounded-lg p-2 shadow-md bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-white/5" style={{ top: `${top}px`, height: `${height}px` }}>
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{occ.title}</div>
                            <div className="text-xs text-slate-500 font-mono">{format(new Date(occ.date), 'HH:mm')} • {duration}m</div>
                          </div>
                          <div className="text-xs text-slate-400 font-mono">{occ.category}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              dayTasks.map((occ) => (
                <div key={`${occ.taskId}-${occ.date.toISOString()}`} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-white/5 group hover:border-blue-500/30 transition-colors">
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  <div className="flex-1">
                    <div className="text-sm font-bold tracking-tight">{occ.title}</div>
                    <div className="text-xs text-slate-400">{format(new Date(occ.date), 'HH:mm')}</div>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
}