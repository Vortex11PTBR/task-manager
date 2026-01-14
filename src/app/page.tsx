import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Zap, Shield, Cpu, ArrowRight } from "lucide-react";

export default async function LandingPage() {
  const session = await auth();
  
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-white dark:bg-deep-blue text-slate-900 dark:text-white selection:bg-blue-500/30 overflow-x-hidden relative transition-colors duration-500">
      
      {/* SCANLINE EFFECT - O toque futurista */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] dark:opacity-[0.05]">
        <div className="w-full h-1 bg-blue-500 animate-scan" />
      </div>

      {/* BACKGROUND ASSETS */}
      <div className="absolute inset-0 bg-grid-white dark:bg-grid-white opacity-20 pointer-events-none" />
      
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 dark:bg-blue-600/20 blur-[120px] rounded-full" />
      <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-emerald-600/5 dark:bg-emerald-600/10 blur-[100px] rounded-full" />

      {/* NAVIGATION */}
      <nav className="relative z-20 flex justify-between items-center max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-linear-to-br from-blue-600 to-emerald-500 rounded-xl rotate-12 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <span className="text-white font-black -rotate-12 text-xl">F</span>
          </div>
          <span className="text-2xl font-black tracking-tighter italic bg-linear-to-r from-blue-600 to-emerald-500 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent uppercase">
            Focus
          </span>
        </div>
        
        <div className="flex gap-6 items-center">
          <ThemeToggle />
          <Link href="/auth/signin" className="hidden md:block text-[10px] font-black tracking-[0.2em] text-slate-500 dark:text-gray-500 hover:text-blue-600 dark:hover:text-white transition-colors uppercase">
            System Login
          </Link>
          <Link href="/auth/register" className="group relative px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] font-black rounded-xl hover:scale-105 transition-all shadow-xl dark:shadow-white/5 uppercase tracking-widest overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              Initialize <ArrowRight size={14} />
            </span>
            <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform" />
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        
        {/* HERO SECTION */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/5 border border-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] font-black tracking-[0.3em] uppercase mb-12 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-blue-500"></span>
          </span>
          Next-Gen Productivity OS v2.0
        </div>

        <h1 className="text-6xl md:text-[9rem] font-black tracking-tighter mb-10 leading-[0.9] animate-slide-up pb-4 transition-all">
          Execute with <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-emerald-500 to-blue-400 dark:from-blue-400 dark:via-emerald-400 dark:to-blue-600 bg-size-[200%_auto] animate-gradient">
            Precision.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-slate-600 dark:text-gray-400 text-lg md:text-xl font-medium mb-20 leading-relaxed">
          The first neural-inspired command center. Designed for high-stakes execution where clarity is the only competitive advantage.
        </p>

        {/* STATS / FEATURES BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-32">
          {[
            { icon: <Zap size={16} />, label: "Deep Work", value: "Enabled" },
            { icon: <Shield size={16} />, label: "Security", value: "Encrypted" },
            { icon: <Cpu size={16} />, label: "Engine", value: "Neural" },
            { icon: <Target size={16} />, label: "Status", value: "Active" }
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col items-center">
              <div className="text-blue-600 dark:text-blue-400 mb-2">{stat.icon}</div>
              <div className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">{stat.label}</div>
              <div className="text-sm font-bold dark:text-white">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* MANIFESTO SECTION */}
        <section className="mt-32 mb-32 text-left grid lg:grid-cols-12 gap-12 border-t border-slate-200 dark:border-white/5 pt-20">
          <div className="lg:col-span-5">
            <h2 className="text-xs font-black tracking-[0.5em] text-blue-600 dark:text-blue-500 uppercase mb-6">The Protocol</h2>
            <h3 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.9] text-slate-900 dark:text-white italic uppercase">Dominate Your Spectrum.</h3>
          </div>
          <div className="lg:col-span-7 space-y-8">
            <p className="text-xl font-bold text-slate-800 dark:text-gray-100 leading-snug tracking-tight">
              Modern productivity is a war of attrition. Every notification, every unorganized thought, and every friction point in your workflow is a leak in your cognitive reservoir.
            </p>
            <p className="text-slate-600 dark:text-gray-400 text-base leading-relaxed font-medium">
              The Focus OS isn&apos;t just an application; it is a declaration of intent. Designed for high-stakes execution where clarity is the only competitive advantage.
            </p>
          </div>
        </section>

        {/* FINAL CONVERSION */}
        <section className="py-32 relative border-t border-slate-200 dark:border-white/5 flex flex-col items-center justify-center text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />
          
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-12 italic leading-tight uppercase relative z-10 dark:text-white text-slate-900">
            Ready to <br /> Initialize?
          </h2>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center relative z-10 w-full">
            <Link 
              href="/auth/register" 
              className="w-full md:w-auto px-16 py-7 bg-slate-900 dark:bg-white text-white dark:text-black font-black text-[11px] uppercase tracking-[0.3em] rounded-full hover:scale-105 transition-all shadow-2xl"
            >
              Create New Profile
            </Link>
            <Link 
              href="/auth/signin" 
              className="w-full md:w-auto px-16 py-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-full hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
            >
              Access Terminal
            </Link>
          </div>
        </section>
      </main>

      {/* STRATEGIC FOOTER */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-white/5 py-24 bg-slate-50/50 dark:bg-gray-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-400 dark:text-gray-600 text-[10px] font-black tracking-[0.3em] uppercase">
          <div className="flex items-center gap-6">
            <span className="text-slate-900 dark:text-white">FOCUS COMMAND</span>
            <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-gray-800" />
            <span>Encrypted Layer v4.1</span>
          </div>
          <p>© 2026 FOCUS. ALL SYSTEMS OPERATIONAL.</p>
        </div>
      </footer>
    </div>
  );
}

// Pequeno componente auxiliar para os ícones das stats
function Target({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}