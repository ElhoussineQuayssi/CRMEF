"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Download, PlayCircle, FileText, Video } from "lucide-react";

type ResourceItem = {
  id: string;
  title: string;
  type: "pdf" | "video";
  level: string;
  date: string;
  description: string;
  url: string;
  thumbnail: string;
  videoId?: string;
};

const iconMap: Record<string, typeof FileText> = {
  pdf: FileText,
  video: Video,
};

export function ResourceCard({ resource }: { resource: ResourceItem }) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    const hoverTween = gsap.to(node, {
      y: -8,
      boxShadow: "0 32px 70px rgba(15, 23, 42, 0.18)",
      duration: 0.35,
      ease: "power3.out",
      paused: true,
    });

    const onEnter = () => hoverTween.play();
    const onLeave = () => hoverTween.reverse();

    node.addEventListener("mouseenter", onEnter);
    node.addEventListener("mouseleave", onLeave);

    return () => {
      node.removeEventListener("mouseenter", onEnter);
      node.removeEventListener("mouseleave", onLeave);
      hoverTween.kill();
    };
  }, []);

  const Icon = iconMap[resource.type] ?? FileText;

  return (
    <a
      ref={cardRef}
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.18)] transition-all duration-300"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 rounded-3xl bg-slate-800/90 px-4 py-3 text-slate-100">
          <Icon className="h-5 w-5 text-cyan-300" />
          <span className="text-sm font-semibold">{resource.type.toUpperCase()}</span>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">
          {resource.level}
        </span>
      </div>

      <div className="mt-6 flex-1">
        <h3 className="text-xl font-semibold text-slate-100">{resource.title}</h3>
        <p className="mt-4 text-sm leading-6 text-slate-300">{resource.description}</p>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
        <span>{resource.date}</span>
        <span className="inline-flex items-center gap-2 text-cyan-300">
          {resource.type === "pdf" ? <Download className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
          Voir
        </span>
      </div>
    </a>
  );
}
