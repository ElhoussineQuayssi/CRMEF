"use client";

import { motion } from "framer-motion";

const timelineData = [
  {
    year: "2020",
    title: "Baccalauréat Sciences Expérimentales",
    description: "Fondation en sciences exactes et expérimentales.",
  },
  {
    year: "Licence",
    title: "Licence Fondamentale en SMP",
    description: "Approfondissement en Sciences de la Matière Physique.",
  },
  {
    year: "Aujourd'hui",
    title: "Enseignement Mathématiques & Physique",
    description: "Transmission des connaissances aux bacheliers.",
  },
];

export function EducationalTimeline() {
  return (
    <div className="mt-10">
      <h3 className="text-xl font-semibold text-slate-50 mb-6">Parcours Éducatif</h3>
      <div className="space-y-6">
        {timelineData.map((item, index) => (
          <motion.div
            key={item.year}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className="flex items-start gap-4"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-300 text-slate-950 font-semibold text-sm">
              {item.year}
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-medium text-slate-50">{item.title}</h4>
              <p className="text-slate-300">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}