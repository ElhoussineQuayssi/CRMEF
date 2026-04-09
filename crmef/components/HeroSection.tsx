"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowRight, Atom, Sparkles } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".hero-float", {
        y: 18,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.15,
      });
      gsap.from(".hero-cta", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.35,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative isolate overflow-hidden px-6 py-16 sm:px-10 lg:px-12" ref={heroRef}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,82,186,0.18),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.16),_transparent_30%)]" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
        <div className="hero-float max-w-2xl">
          <span className="hero-float inline-flex items-center gap-3 rounded-full border border-slate-500/15 bg-white/5 px-4 py-2 text-sm text-slate-200 shadow-[0_0_0_1px_rgba(255,255,255,0.05)] backdrop-blur-lg">
            <Atom className="h-4 w-4 text-cyan-300" />
            Expert en Mathématiques & Physique
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
            Ayoub Essaghyry — L'Excellence en Mathématiques & Physique.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
            Accompagnement pédagogique de haut niveau pour les bacheliers. De la compréhension des concepts à la maîtrise des examens.
          </p>
          <div className="hero-cta mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center rounded-full bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Réserver une séance de soutien
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/resources"
              className="inline-flex items-center justify-center rounded-full border border-slate-500/30 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-50 transition hover:border-slate-300/50 hover:bg-white/10"
            >
              Explorer les ressources (PDF/Vidéos)
            </Link>
          </div>
        </div>

        <div className="hero-float grid max-w-xl grid-cols-2 gap-4">
          {[
            { label: "Mathématiques avancées", icon: <Sparkles className="h-5 w-5 text-cyan-300" /> },
            { label: "Physique appliquée", icon: <Atom className="h-5 w-5 text-slate-100" /> },
          ].map((item) => (
            <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950/70 text-cyan-300 shadow-lg shadow-cyan-500/5">
                {item.icon}
              </div>
              <p className="mt-5 text-base leading-7 text-slate-200">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
