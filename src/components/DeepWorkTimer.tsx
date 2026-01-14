"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

const DEFAULT_SECONDS = 25 * 60;

export default function DeepWorkTimer() {
  const [seconds, setSeconds] = useState<number>(DEFAULT_SECONDS);
  const [isActive, setIsActive] = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevSecondsRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) return;

    // guarda previous para "voltar" se o usuário quiser
    if (prevSecondsRef.current === null) prevSecondsRef.current = seconds;

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          // finaliza o timer
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // dependemos apenas de isActive; a atualização de `seconds` usa setState funcional
  }, [isActive]);

  const toggle = () => {
    if (seconds === 0) return; // não iniciar se chegou a zero
    setIsActive((v) => !v);
  };

  const reset = () => {
    setIsActive(false);
    setSeconds(DEFAULT_SECONDS);
    prevSecondsRef.current = null;
  };

  const goBack = () => {
    if (prevSecondsRef.current !== null) {
      setSeconds(prevSecondsRef.current);
      prevSecondsRef.current = null;
      setIsActive(false);
    }
  };

  const changeMinutes = (deltaMin: number) => {
    setSeconds((s) => Math.max(0, s + deltaMin * 60));
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="p-8 rounded-3xl bg-linear-to-br from-blue-600 to-indigo-700 text-white shadow-2xl shadow-blue-500/20">
      <div className="text-center space-y-4">
        <span className="text-[10px] font-black tracking-[0.4em] uppercase opacity-70">Deep Work Engine</span>
        <div className="text-7xl font-black tracking-tighter tabular-nums">{formatTime(seconds)}</div>

        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={() => changeMinutes(-5)}
            aria-label="Diminuir 5 minutos"
            className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
          >
            -5m
          </button>

          <button
            onClick={toggle}
            aria-pressed={isActive}
            aria-label={isActive ? "Pausar" : "Iniciar"}
            className="p-4 bg-white/20 hover:bg-white/30 rounded-2xl transition-all"
          >
            {isActive ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
          </button>

          <button
            onClick={reset}
            aria-label="Resetar"
            className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
          >
            <RotateCcw size={24} />
          </button>

          <button
            onClick={goBack}
            aria-label="Voltar para sessão anterior"
            className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
          >
            Prev
          </button>

          <button
            onClick={() => changeMinutes(5)}
            aria-label="Aumentar 5 minutos"
            className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
          >
            +5m
          </button>
        </div>
      </div>
    </div>
  );
}