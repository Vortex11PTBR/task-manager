import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";
import { createTask, toggleTaskStatus, deleteTask } from "@/lib/actions";
import { redirect } from "next/navigation";
import CommandCenter from "@/components/CommandCenter";
import { format } from "date-fns";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/api/auth/signin");

  const params = await searchParams;
  const query = params.q || "";
  const categoryFilter = params.cat || "";

  const tasks = await db.task.findMany({
    where: { 
      userId: session.user?.id,
      title: { contains: query, mode: 'insensitive' },
      ...(categoryFilter && { category: categoryFilter })
    },
    orderBy: { createdAt: "desc" },
  });

  const progress = tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0;
  const categories = ["General", "Operations", "Strategic", "Urgent"];

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4 md:p-12 relative overflow-hidden selection:bg-blue-500/30">
      {/* BACKGROUND TECH GRID - FIXED MASK */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* INTELLIGENCE COMPONENT (Shortcuts & Focus Mode) */}
      <CommandCenter />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
        
        {/* Sidebar - Tactical Status */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-gray-900/50 backdrop-blur-xl p-8 rounded-4xl border border-white/5 shadow-2xl sticky top-8">
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
              <span className="text-[10px] font-black text-emerald-500 tracking-[0.2em] uppercase">System Online</span>
            </div>
            <h1 className="text-3xl font-black bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent italic tracking-tighter">FOCUS</h1>
            <p className="text-gray-500 text-[10px] font-mono mt-2 truncate uppercase tracking-widest border-b border-white/5 pb-4">{session.user?.email}</p>
            
            <div className="mt-8">
              <div className="flex justify-between text-[10px] font-black tracking-widest mb-3">
                <span className="text-gray-400">OPERATIONAL EFFICIENCY</span>
                <span className="text-emerald-400">{progress}%</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-linear-to-r from-blue-500 to-emerald-500 transition-all duration-1000" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-3">Quick Protocols</p>
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                    <span>New Objective</span>
                    <span className="text-blue-500 bg-blue-500/10 px-1.5 rounded text-[9px]">[N]</span>
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-2">
                    <span>Deep Work</span>
                    <span className="text-blue-500 bg-blue-500/10 px-1.5 rounded text-[9px]">[F]</span>
                </div>
            </div>

            <form action={async () => { "use server"; await signOut(); }} className="mt-8">
              <button className="w-full py-4 rounded-2xl bg-red-500/5 text-red-500 border border-red-500/10 hover:bg-red-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest cursor-pointer">Abort Session</button>
            </form>
          </div>
        </aside>

        {/* Command Center Main View */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Data Query Input */}
          <div className="flex flex-col md:flex-row gap-4">
            <form className="flex-1 flex gap-3">
              <input 
                name="q" 
                placeholder="Querying encrypted database..." 
                defaultValue={query} 
                className="flex-1 bg-gray-900/40 border border-white/5 rounded-2xl px-6 py-4 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-700 font-medium text-sm" 
              />
              <button className="bg-gray-900 border border-white/5 px-6 rounded-2xl hover:bg-gray-800 transition-all cursor-pointer">🔍</button>
            </form>
          </div>

          {/* Protocol Filters */}
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            <a href="/dashboard" className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${!categoryFilter ? 'bg-white text-black border-white' : 'bg-gray-900 border-white/5 text-gray-500 hover:border-white/20'}`}>All_Sectors</a>
            {categories.map(cat => (
              <a key={cat} href={`?cat=${cat}`} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${categoryFilter === cat ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-900 border-white/5 text-gray-500 hover:border-white/20'}`}>{cat}</a>
            ))}
          </div>

          {/* New Objective Deployment */}
          <form action={createTask} className="bg-linear-to-b from-gray-900 to-gray-950 p-8 rounded-4xl border border-white/5 shadow-inner group transition-all hover:border-blue-500/20 relative overflow-hidden">
            <input 
              name="title" 
              required 
              placeholder="Initialize new high-priority objective..." 
              className="w-full bg-transparent text-2xl font-bold outline-none mb-4 placeholder:text-gray-800 tracking-tight relative z-10" 
            />
            <div className="flex gap-3 mb-4">
              <input name="dueDate" type="date" className="bg-gray-800 px-4 py-2 rounded-xl" />
              <select name="recurrence" className="bg-gray-800 text-[10px] font-black uppercase px-3 py-2 rounded-xl outline-none border border-white/5 tracking-tighter cursor-pointer">
                <option value="none">No Repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <input name="reminders" placeholder="reminders e.g. 30,1440" className="bg-gray-800 px-4 py-2 rounded-xl flex-1" />
            </div>
            <div className="flex justify-between items-center relative z-10">
              <select name="category" className="bg-gray-800 text-[10px] font-black uppercase px-4 py-2 rounded-xl outline-none border border-white/5 tracking-tighter cursor-pointer">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button type="submit" className="bg-blue-600 hover:bg-blue-400 text-white px-10 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-95 cursor-pointer">Deploy Task</button>
            </div>
          </form>

          {/* Task Grid with Scan Effect */}
          <div className="grid grid-cols-1 gap-4">
            {tasks.map(task => (
                <div key={task.id} className="relative z-10 overflow-hidden rounded-2xl bg-white/5 dark:bg-[#071022] border border-white/6 hover:shadow-lg hover:scale-[1.01] transition-transform duration-200">
                  <div className="p-5 flex gap-4 items-start">
                
                {/* SCAN EFFECT */}
                <div className="absolute inset-0 z-0 bg-linear-to-b from-transparent via-blue-500/10 to-transparent h-full w-full -translate-y-full group-hover:animate-scan pointer-events-none" />

                <div className="flex items-center gap-6 relative z-10">
                  <form action={toggleTaskStatus.bind(null, task.id, task.completed)}>
                    <button className={`h-10 w-10 rounded-2xl border-2 flex items-center justify-center transition-all cursor-pointer ${task.completed ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-gray-800 hover:border-blue-500'}`}>
                      {task.completed && <span className="text-white text-xs font-bold">✓</span>}
                    </button>
                  </form>
                  <div>
                    <p className={`text-xl font-bold tracking-tight ${task.completed ? 'line-through text-gray-700' : 'text-gray-100'}`}>{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500/60">{task.category}</span>
                    </div>
                    {task.dueDate && (
                      <div className="mt-2 text-[11px] font-mono text-slate-400">Due: {format(new Date(task.dueDate), 'dd MMM yyyy')}</div>
                    )}
                  </div>
                </div>
                <form action={deleteTask.bind(null, task.id)} className="relative z-10">
                  <button className="opacity-0 group-hover:opacity-100 p-4 text-gray-700 hover:text-red-500 transition-all cursor-pointer transform hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </form>
              </div>

              <div className="px-5 py-3 border-t border-white/5 bg-transparent flex items-center justify-between">
                <div className="text-xs text-slate-400 font-mono">Created {format(new Date(task.createdAt), 'dd MMM yyyy')}</div>
                <div className="flex items-center gap-3">
                  <form action={deleteTask.bind(null, task.id)}>
                    <button className="text-xs px-3 py-1 rounded hover:bg-red-500/10 text-red-400 transition-colors">Delete</button>
                  </form>
                  <a href={`#`} className="text-xs px-3 py-1 rounded border border-blue-600 text-blue-600 font-black hover:bg-blue-600 hover:text-white transition-all">Open</a>
                </div>
              </div>
            </div>
            ))}
            
            {tasks.length === 0 && (
              <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-4xl">
                <p className="text-gray-600 font-mono text-xs uppercase tracking-[0.3em]">No objectives found in current sector</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}