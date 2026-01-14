'use client'
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black italic tracking-tighter bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-2">RESTRICTED ACCESS</h1>
          <p className="text-gray-500 text-[10px] font-mono uppercase tracking-[0.3em]">Authorized Uplink Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Credentials</label>
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

          <button type="submit" className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-400 transition-all shadow-xl shadow-blue-900/20 text-[10px] uppercase tracking-[0.2em] mt-6 cursor-pointer">
            Authorize Uplink
          </button>
        </form>

        <p className="text-center mt-8 text-xs text-gray-500 font-medium font-mono uppercase tracking-widest">
          No profile? <Link href="/auth/register" className="text-emerald-400 hover:underline">Initialize One</Link>
        </p>
      </div>
    </div>
  );
}