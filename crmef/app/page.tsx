import type { ElementType } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Rocket, BookOpen, Atom, Calculator, Beaker, TrendingUp } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { PhysicsCalculator } from "@/components/PhysicsCalculator";
import { EducationalTimeline } from "@/components/EducationalTimeline";
import { skillTiles, highlights } from "@/lib/content";

const iconMap: Record<string, ElementType> = {
  Sparkles,
  Rocket,
  BookOpen,
  Atom,
  Calculator,
  Beaker,
  TrendingUp,
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,82,186,0.12),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(45,212,191,0.08),_transparent_20%),#050816] text-slate-100">
      <HeroSection />

      <section className="px-6 pb-16 sm:px-10 lg:px-12">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-white/10 bg-slate-950/80 px-8 py-12 shadow-[0_40px_120px_rgba(0,0,0,0.24)]">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">À propos d'Ayoub Essaghyry</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
                Passionné par les sciences exactes
              </h2>
              <p className="mt-6 text-base leading-8 text-slate-300">
                Passionné par les sciences exactes depuis mon <strong>Baccalauréat Sciences Expérimentales (2020)</strong>, j'ai consolidé mon expertise avec une <strong>Licence Fondamentale en SMP</strong>. Aujourd'hui, je transmets cette rigueur scientifique à travers un enseignement structuré en Mathématiques et Physique.
              </p>
              <EducationalTimeline />
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {highlights.map((item) => (
                  <div key={item.title} className="rounded-3xl border border-white/10 bg-slate-900/90 p-6">
                    <p className="font-semibold text-slate-100">{item.title}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-6">
              {skillTiles.map((skill) => {
                const Icon = iconMap[skill.icon] ?? Sparkles;
                return (
                  <div key={skill.title} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.15)] backdrop-blur-xl">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950/80 text-cyan-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-slate-50">{skill.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{skill.description}</p>
                    <span className="mt-4 inline-flex rounded-full bg-slate-800/90 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300" style={{ backgroundColor: "rgba(15, 82, 186, 0.12)" }}>
                      Advanced module
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-slate-50">Prêt à améliorer vos notes en sciences ?</h3>
              <p className="mt-3 max-w-xl text-slate-400">Réservez une séance, explorez les ressources guidées, et débloquez un parcours d'apprentissage confiant.</p>
            </div>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              Commencer la réservation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 sm:px-10 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <PhysicsCalculator />
        </div>
      </section>
    </main>
  );
}
