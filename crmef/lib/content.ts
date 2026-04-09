export type ResourceType = "pdf" | "video";

export interface SkillTile {
  title: string;
  description: string;
  accent: string;
  icon: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  type: ResourceType;
  level: string;
  date: string;
  description: string;
  url: string;
  thumbnail: string;
  videoId?: string;
}

export const skillTiles: SkillTile[] = [
  {
    title: "Physique",
    description: "Mécanique, Électricité et Chimie pour maîtriser les fondamentaux.",
    accent: "#0F52BA",
    icon: "Atom",
  },
  {
    title: "Mathématiques",
    description: "Analyse, Algèbre et Probabilités pour une compréhension approfondie.",
    accent: "#2DD4BF",
    icon: "Sparkles",
  },
  {
    title: "Préparation aux examens",
    description: "Méthodes et stratégies pour réussir le Baccalauréat.",
    accent: "#7C3AED",
    icon: "BookOpen",
  },
];

export const resources: ResourceItem[] = [
  {
    id: "1",
    title: "Pack de révision Physique Bac",
    type: "pdf",
    level: "Bac",
    date: "2026-03-05",
    description: "Guide PDF structuré pour chaque chapitre majeur de physique.",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    thumbnail: "https://images.unsplash.com/photo-1527694224015-7e0ade448987?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "2",
    title: "Masterclass Optique & Lentilles",
    type: "video",
    level: "1ère Bac",
    date: "2026-02-18",
    description: "Une visite guidée visuelle de l'optique géométrique et de la conception des lentilles.",
    url: "https://www.youtube.com/watch?v=3G6Z3qLxzJQ",
    thumbnail: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80",
    videoId: "3G6Z3qLxzJQ",
  },
  {
    id: "3",
    title: "Exercices Statique & Dynamique",
    type: "pdf",
    level: "Terminale",
    date: "2026-01-29",
    description: "Problèmes d'entraînement conçus pour réussir les examens.",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "4",
    title: "Concepts Quantiques en 10 Minutes",
    type: "video",
    level: "Bac+1",
    date: "2026-03-12",
    description: "Cours introductif guidé sur les fondamentaux quantiques.",
    url: "https://www.youtube.com/watch?v=2zJ7lGI6N10",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    videoId: "2zJ7lGI6N10",
  },
];

export const highlights = [
  {
    title: "Expertise en Mathématiques & Physique",
    description: "Maîtrise des concepts clés pour réussir les examens du Baccalauréat.",
  },
  {
    title: "Accompagnement personnalisé",
    description: "Séances individuelles adaptées à vos besoins et niveau.",
  },
  {
    title: "Ressources enrichissantes",
    description: "Bibliothèque de PDFs et vidéos pour renforcer l'apprentissage.",
  },
];
