import type { Metadata } from "next";
import { ResourcePreview } from "@/components/ResourcePreview";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Ressources | Portfolio Enseignant Mathématiques & Physique",
    description: "Explorez des guides PDF en Mathématiques et Physique et des leçons vidéo pour les bacheliers et étudiants avancés.",
  };
}

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,82,186,0.12),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(45,212,191,0.08),_transparent_30%),#050816] text-slate-100">
      <section className="pt-24 px-6 sm:px-10 lg:px-12">
        <div className="mx-auto max-w-6xl rounded-[2.5rem] border border-white/10 bg-slate-950/80 px-8 py-12 shadow-[0_40px_120px_rgba(0,0,0,0.24)]">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">Bibliothèque</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
            Ressources en Mathématiques et Physique pour tous les niveaux.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300">
            Filtrez par niveau, explorez des cahiers téléchargeables et regardez des vidéos de leçons conçues pour les apprenants modernes.
          </p>
        </div>
      </section>

      <ResourcePreview />
    </main>
  );
}
