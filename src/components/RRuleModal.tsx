"use client";

import React, { useState } from "react";
import { RRule } from "rrule";

type Props = {
  open: boolean;
  initialRRule?: string | null;
  parsedText?: string;
  onAccept: (rrule: string) => void;
  onClose: () => void;
};

export default function RRuleModal({ open, initialRRule, parsedText, onAccept, onClose }: Props) {
  const [editValue, setEditValue] = useState(initialRRule || "");

  if (!open) return null;

  const human = (() => {
    if (!editValue) return parsedText || "Preview";
    try {
      const r = RRule.fromString(editValue);
      return r.toText();
    } catch (e) {
      return editValue;
    }
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-[#071022] rounded-lg p-4 w-[560px] shadow-lg border border-slate-200 dark:border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Recurrence preview</h3>
          <button onClick={onClose} className="text-sm text-slate-500">Close</button>
        </div>

        <div className="mb-2 text-sm text-slate-700 dark:text-slate-300">Parsed from: <span className="font-mono">{parsedText}</span></div>

        <div className="mb-3">
          <label className="text-xs text-slate-500">Human friendly</label>
          <div className="mt-1 p-2 bg-slate-50 dark:bg-slate-900 rounded text-sm">{human}</div>
        </div>

        <div className="mb-3">
          <label className="text-xs text-slate-500">RRULE</label>
          <input value={editValue} onChange={(e) => setEditValue(e.target.value)} placeholder="RRULE:FREQ=WEEKLY;BYDAY=MO" className="mt-1 w-full bg-transparent border border-slate-200 dark:border-white/10 rounded px-2 py-1 text-sm" />
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 text-sm rounded bg-white/5">Cancel</button>
          <button onClick={() => { onAccept(editValue || (initialRRule || "")); }} className="px-3 py-1 text-sm rounded bg-blue-600 text-white">Accept</button>
        </div>
      </div>
    </div>
  );
}
