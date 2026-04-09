"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function Footer() {
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tickerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(".ticker-text", {
        x: "-100%",
        duration: 20,
        ease: "none",
        repeat: -1,
      });
    }, tickerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-6">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div ref={tickerRef} className="overflow-hidden">
          <div className="ticker-text flex whitespace-nowrap text-xs text-slate-500">
            <span className="mx-6">π ≈ 3.1416</span>
            <span className="mx-6">g ≈ 9.81 m/s²</span>
            <span className="mx-6">c ≈ 3 × 10⁸ m/s</span>
            <span className="mx-6">h ≈ 6.626 × 10⁻³⁴ J⋅s</span>
            <span className="mx-6">e ≈ 1.602 × 10⁻¹⁹ C</span>
            <span className="mx-6">π ≈ 3.1416</span>
            <span className="mx-6">g ≈ 9.81 m/s²</span>
            <span className="mx-6">c ≈ 3 × 10⁸ m/s</span>
            <span className="mx-6">h ≈ 6.626 × 10⁻³⁴ J⋅s</span>
            <span className="mx-6">e ≈ 1.602 × 10⁻¹⁹ C</span>
          </div>
        </div>
        <div className="mt-6 text-center text-xs text-slate-600">
          © 2026 Ayoub Essaghyry. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}