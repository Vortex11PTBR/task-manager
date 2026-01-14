import Link from "next/link";
import { registerOperator } from "@/lib/auth-actions"; // Vamos criar essa action abaixo

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black italic tracking-tighter bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-2">INITIALIZE IDENTITY</h1>
          <p className="text-gray-500 text-[10px] font-mono uppercase tracking-[0.3em]">Deploy your operator profile</p>
        </div>

        <form action={registerOperator} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Full Name</label>
            <input name="name" required type="text" placeholder="John Doe"
              className="w-full bg-gray-900/50 border border-white/5 rounded-2xl px-6 py-4 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-700"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">System Email</label>
            <input name="email" required type="email" placeholder="operator@nexus.com"
              className="w-full bg-gray-900/50 border border-white/5 rounded-2xl px-6 py-4 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-700"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Security Key</label>
            <input name="password" required type="password" placeholder="••••••••"
              className="w-full bg-gray-900/50 border border-white/5 rounded-2xl px-6 py-4 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-700"
            />
          </div>

          <button type="submit" className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-blue-500 hover:text-white transition-all shadow-xl shadow-white/5 text-[10px] uppercase tracking-[0.2em] mt-6 cursor-pointer">
            Deploy Account
          </button>
        </form>

        <p className="text-center mt-8 text-xs text-gray-500 font-medium font-mono uppercase tracking-widest">
          Already active? <Link href="/auth/signin" className="text-blue-400 hover:underline">Uplink Terminal</Link>
        </p>
      </div>
    </div>
  );
}