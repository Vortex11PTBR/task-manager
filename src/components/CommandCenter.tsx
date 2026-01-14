"use client"

import { useState, useEffect } from "react";
import DeepWorkTimer from "./DeepWorkTimer";

export default function CommandCenter() {
  const [isFocusMode, setIsFocusMode] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Atalho 'N': Foca no input de nova tarefa
      if (e.key.toLowerCase() === "n" && (e.target as HTMLElement).tagName !== "INPUT") {
        e.preventDefault();
        document.querySelector<HTMLInputElement>("input[name=\"title\"]")?.focus();
      }
      // Atalho 'F': Alterna Modo Foco
      if (e.key.toLowerCase() === "f" && (e.target as HTMLElement).tagName !== "INPUT") {
        setIsFocusMode((s) => !s);
      }
      // Esc: fecha o modo foco
      if (e.key === "Escape") {
        setIsFocusMode(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isFocusMode) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-950/95 backdrop-blur-3xl flex flex-col items-center justify-center animate-in fade-in duration-500">
      <button
        onClick={() => setIsFocusMode(false)}
        className="absolute top-10 right-10 text-gray-500 hover:text-white font-black text-xs tracking-widest uppercase border border-white/10 px-4 py-2 rounded-xl"
      >
        Esc ⎋ Sair
      </button>

      <div className="w-full max-w-2xl px-6">
        <div className="text-center space-y-8">
          <div className="text-blue-500 font-black tracking-[0.5em] text-sm uppercase animate-pulse">Deep Work Active</div>
          <DeepWorkTimer />
          <p className="text-gray-400 max-w-md mx-auto italic font-medium">
            "Focus is the ability to say no to a thousand things." — Steve Jobs
          </p>
        </div>
      </div>
    </div>
  );
}