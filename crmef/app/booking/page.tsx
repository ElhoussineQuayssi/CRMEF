import type { Metadata } from "next";
import { BookingForm } from "@/components/BookingForm";
import { createBooking } from "@/actions/booking";

export const metadata: Metadata = {
  title: "Réserver une séance | Tutorat Mathématiques & Physique",
  description: "Réservez une séance privée de tutorat en Mathématiques et Physique avec un formulaire de réservation élégant et un calendrier.",
};

export default async function BookingPage() {
  return (
    <main className="bg-[radial-gradient(circle_at_top,_rgba(15,82,186,0.14),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.08),_transparent_25%),#050816] text-slate-100 min-h-screen">
      <section className="px-6 pt-24 sm:px-10 lg:px-12">
        <div className="mx-auto max-w-6xl rounded-[2.5rem] border border-white/10 bg-slate-950/80 px-8 py-12 shadow-[0_40px_120px_rgba(0,0,0,0.24)]">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">Réservation</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
            Planifiez votre prochaine séance de Mathématiques ou Physique.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300">
            Utilisez le calendrier ci-dessous pour choisir une date, puis sélectionnez le créneau horaire qui vous convient le mieux. Votre demande est envoyée directement au tableau de bord de réservation de l'enseignant.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-10 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <BookingForm action={createBooking} />
        </div>
      </section>
    </main>
  );
}