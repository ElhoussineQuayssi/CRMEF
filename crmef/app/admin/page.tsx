import type { Metadata } from "next";
import { AdminPanel } from "@/components/AdminPanel";

export const metadata: Metadata = {
  title: "Tableau de bord de l'enseignant | Gestion des réservations",
  description: "Tableau de bord protégé pour gérer les réservations de tutorat en Mathématiques et Physique.",
};

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,82,186,0.14),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(45,212,191,0.08),_transparent_25%),#050816] text-slate-100">
      <AdminPanel />
    </main>
  );
}
