"use client";

import { useActionState, useState } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2, Send } from "lucide-react";
import "react-day-picker/dist/style.css";

const timeSlots = [
  "09:00 AM",
  "11:00 AM",
  "01:30 PM",
  "03:30 PM",
  "05:30 PM",
];

interface BookingFormProps {
  action: (prevState: { success?: boolean; error?: string } | null, formData: FormData) => Promise<{ success?: boolean; error?: string }>;
}

export function BookingForm({ action }: BookingFormProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-[0_36px_100px_rgba(0,0,0,0.2)]"
    >
      <div className="mb-8 flex items-center gap-4">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-400/10 text-cyan-300 shadow-lg shadow-cyan-400/10">
          <CalendarDays className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-cyan-300">Réservation de tutorat</p>
          <h2 className="text-2xl font-semibold text-slate-50">Réservez votre séance privée</h2>
        </div>
      </div>

      <form action={formAction} className="grid gap-6 text-slate-100">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm">
            Nom de l'étudiant
            <input
              required
              name="studentName"
              type="text"
              placeholder="Nom complet"
              className="rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-slate-50 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
            />
          </label>
          <label className="grid gap-2 text-sm">
            Numéro de téléphone
            <input
              required
              name="studentPhone"
              type="tel"
              placeholder="+212 6 12 34 56 78"
              className="rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-slate-50 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm">
          Sujet / matière
          <textarea
            required
            name="subjectTopic"
            rows={3}
            placeholder="Décrivez le sujet ou le chapitre que vous souhaitez réviser"
            className="min-h-[120px] rounded-[1.75rem] border border-white/10 bg-slate-950/90 px-4 py-4 text-slate-50 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
          />
        </label>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-5">
            <p className="text-sm font-medium text-slate-200">Sélectionnez une date</p>
            <div className="mt-4 rounded-[1.75rem] bg-slate-950/95 p-4">
              <DayPicker
                mode="single"
                selected={date}
                disabled={{ before: new Date() }}
                onSelect={setDate}
                className="rounded-3xl bg-slate-900/90 p-4 text-slate-100"
              />
            </div>
            <input name="selectedDate" type="hidden" value={date?.toISOString() ?? ""} />
          </div>

          <label className="grid gap-3 rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-6">
            <span className="text-sm font-medium text-slate-200">Créneau horaire</span>
            <div className="grid gap-3">
              {timeSlots.map((slot) => (
                <label key={slot} className="flex items-center gap-3 rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-300/40 hover:bg-slate-900/90">
                  <input type="radio" name="timeSlot" value={slot} className="h-4 w-4 accent-cyan-300" required />
                  {slot}
                </label>
              ))}
            </div>
          </label>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {isPending ? "Envoi en cours..." : "Planifier la séance"}
        </button>

        {state?.success ? (
          <div className="inline-flex items-center gap-2 rounded-3xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">
            <CheckCircle2 className="h-4 w-4 text-cyan-300" />
            Demande de réservation soumise. Vous recevrez une confirmation bientôt.
          </div>
        ) : state?.error ? (
          <div className="inline-flex items-center gap-2 rounded-3xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {state.error}
          </div>
        ) : null}
      </form>
    </motion.div>
  );
}
