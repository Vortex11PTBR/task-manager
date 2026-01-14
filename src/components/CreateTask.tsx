"use client";

import { useState } from "react";
import { trpc } from "@/trpc/client";
import { Plus, Loader2, Sparkles } from "lucide-react";
import { RRule } from "rrule";
import RRuleModal from "./RRuleModal";

export function CreateTask() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10); // yyyy-mm-dd
  });
  const [nlp, setNlp] = useState<string>("");
  const [parsedDoDate, setParsedDoDate] = useState<Date | null>(null);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [recurrenceRule, setRecurrenceRule] = useState<string | undefined>(undefined);
  const [showRRuleModal, setShowRRuleModal] = useState(false);
  const [candidateRRule, setCandidateRRule] = useState<string | null>(null);
  const [reminders, setReminders] = useState<string[]>([]);
  const [reminderInput, setReminderInput] = useState<string>("");
  const utils = trpc.useUtils();

  const mutation = trpc.task.createTask.useMutation({
    onSuccess: () => {
      setTitle(""); // Limpa o input
      utils.task.getTasks.invalidate(); // Atualiza a lista automaticamente
      // Invalida a query diária do dia selecionado (se existir)
      try {
        utils.task.getTasksByDate.invalidate({ date: new Date(date) });
      } catch (e) {
        // noop
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || mutation.isPending) return;
    const dueDate = date ? new Date(date + "T00:00:00") : undefined;
    mutation.mutate({
      title,
      dueDate,
      doDate: parsedDoDate || undefined,
      isRecurring: isRecurring || undefined,
      recurrenceRule: recurrenceRule,
      reminders: reminders,
    });
  };

  const handleParseNLP = async () => {
    if (!nlp.trim()) return;
    // if starts with every -> try to build RRULE
    if (/^every\b/i.test(nlp.trim())) {
      try {
        const mod = await import("@/lib/rruleify");
        const r = mod.rruleFromText(nlp.trim());
        if (r) {
          // show modal to preview/edit
          setCandidateRRule(r);
          setShowRRuleModal(true);
          return;
        }
      } catch (e) {
        // ignore and fallback
      }
      // fallback: show modal with raw
      setCandidateRRule(nlp.trim());
      setShowRRuleModal(true);
      return;
    }

    // parse a single date/time (doDate)
    try {
      const chrono = (await import('chrono-node')) as typeof import('chrono-node');
      const parsed = chrono.parseDate(nlp);
      if (parsed) {
        setParsedDoDate(parsed);
        setDate(parsed.toISOString().slice(0, 10));
      }
    } catch (e) {
      // noop
    }
  };
  
  const addReminder = () => {
    const v = reminderInput.trim();
    if (!v) return;
    // allow minutes like "30" or ISO datetime
    setReminders((r) => [...r, v]);
    setReminderInput("");
  };

  const renderRecurrenceHuman = () => {
    if (!recurrenceRule) return null;
    try {
      const rule = RRule.fromString(recurrenceRule);
      return rule.toText();
    } catch (e) {
      return recurrenceRule;
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="relative group mb-6"
    >
      <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-emerald-500 rounded-2xl blur-sm opacity-20 group-focus-within:opacity-40 transition duration-500" />
      
      <div className="relative flex items-center bg-white dark:bg-[#0a0f1c] border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden px-4 py-2">
        <Sparkles size={16} className="text-blue-500 mr-3 animate-pulse" />
        
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="INITIALIZE NEW PROTOCOL..."
          className="flex-1 bg-transparent border-none outline-none text-sm font-mono tracking-wider dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20 py-2"
          disabled={mutation.isPending}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="ml-2 mr-2 bg-transparent border-none outline-none text-sm font-mono tracking-wider dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20 py-2"
          name="dueDate"
        />

        <input
          type="text"
          placeholder="when? e.g. 'tomorrow 9am' or 'every monday 9'"
          value={nlp}
          onChange={(e) => setNlp(e.target.value)}
          className="ml-2 mr-2 bg-transparent border-none outline-none text-sm font-mono tracking-wider dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20 py-2 max-w-xs"
        />

        <button
          type="button"
          onClick={handleParseNLP}
          className="ml-1 mr-1 px-2 py-1 bg-white/5 rounded text-sm hover:bg-white/10 transition"
        >
          Parse
        </button>

        <div className="ml-2 mr-2 flex items-center gap-2">
          <input
            type="text"
            placeholder="reminder min (e.g. 30)"
            value={reminderInput}
            onChange={(e) => setReminderInput(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-mono text-slate-400 w-24"
          />
          <button
            type="button"
            onClick={addReminder}
            className="px-2 py-1 bg-white/5 rounded text-sm hover:bg-white/10 transition"
          >
            +
          </button>
        </div>
        <div className="ml-2 mr-2 flex gap-2">
          {reminders.map((r, i) => (
            <span key={i} className="text-xs bg-blue-600/10 text-blue-600 px-2 py-1 rounded">{r}</span>
          ))}
        </div>

        <div className="ml-4 mr-2 flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={!!isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} />
            <span>Recurring</span>
          </label>
          {recurrenceRule && (
            <div className="text-xs text-slate-400">{renderRecurrenceHuman()}</div>
          )}
          {isRecurring && !recurrenceRule && (
            <input
              value={recurrenceRule || ""}
              onChange={(e) => setRecurrenceRule(e.target.value)}
              placeholder="RRULE:FREQ=WEEKLY;BYDAY=MO"
              className="bg-transparent border-none outline-none text-sm text-slate-400 w-48"
            />
          )}
          {showRRuleModal && (
            <RRuleModal
              open={showRRuleModal}
              initialRRule={candidateRRule}
              parsedText={nlp}
              onAccept={(r) => {
                setRecurrenceRule(r);
                setIsRecurring(true);
                setShowRRuleModal(false);
                setCandidateRRule(null);
              }}
              onClose={() => { setShowRRuleModal(false); setCandidateRRule(null); }}
            />
          )}
        </div>

        <button
          type="submit"
          disabled={!title.trim() || mutation.isPending}
          className="ml-2 p-2 bg-slate-900 dark:bg-blue-600 text-white rounded-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          {mutation.isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Plus size={16} />
          )}
        </button>
      </div>
    </form>
  );
}