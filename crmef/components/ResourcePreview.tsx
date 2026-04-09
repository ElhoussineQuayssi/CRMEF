"use client";

import { useEffect, useMemo, useState } from "react";
import { getResources, type Resource } from "@/actions/resources";
import { ResourceCard } from "@/components/ResourceCard";
import { motion } from "framer-motion";

const levels = ["All", "Bac", "1ère Bac", "Terminale", "Bac+1"] as const;
const types = ["All", "pdf", "video"] as const;

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

function mapDbToUiResource(dbResource: Resource): ResourceItem {
  const isVideo = dbResource.type === "video";
  const youtubeId = isVideo && dbResource.youtube_url
    ? dbResource.youtube_url.split("v=")[1]?.split("&")[0] || dbResource.youtube_url.split("/").pop()
    : null;
  
  return {
    id: dbResource.id.toString(),
    title: dbResource.title,
    type: dbResource.type,
    level: dbResource.level || "Bac",
    date: new Date(dbResource.created_at).toISOString().split("T")[0],
    description: dbResource.description || "",
    url: isVideo ? (dbResource.youtube_url || "") : (dbResource.file_url || ""),
    thumbnail: isVideo 
      ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
      : "https://images.unsplash.com/photo-1527694224015-7e0ade448987?auto=format&fit=crop&w=900&q=80",
    videoId: youtubeId || undefined,
  };
}

export function ResourcePreview() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<(typeof levels)[number]>("All");
  const [selectedType, setSelectedType] = useState<(typeof types)[number]>("All");

  useEffect(() => {
    getResources().then((dbResources) => {
      setResources(dbResources.map(mapDbToUiResource));
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    return resources.filter((resource) => {
      const levelMatch = selectedLevel === "All" || resource.level === selectedLevel;
      const typeMatch = selectedType === "All" || resource.type === selectedType;
      return levelMatch && typeMatch;
    });
  }, [resources, selectedLevel, selectedType]);

  return (
    <section className="px-6 py-16 sm:px-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">Bibliothèque de ressources</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">Ressources en Mathématiques et Physique sélectionnées</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
              Accédez à des guides téléchargeables, des vidéos spécifiques au niveau et du matériel d'étude sélectionné pour chaque sujet majeur en Mathématiques et Physique.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-wrap gap-2 rounded-3xl border border-white/10 bg-slate-950/70 p-3">
              {levels.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSelectedLevel(level)}
                  className={`rounded-full px-4 py-2 text-sm transition ${selectedLevel === level ? "bg-slate-100 text-slate-950" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 rounded-3xl border border-white/10 bg-slate-950/70 p-3">
              {types.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`rounded-full px-4 py-2 text-sm transition ${selectedType === type ? "bg-cyan-300 text-slate-950" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          layout
          className="mt-10 grid gap-6 xl:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {filtered.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
