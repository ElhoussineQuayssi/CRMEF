"use client";

import { useState, useTransition } from "react";
import {
  Video,
  FileText,
  Plus,
  Trash2,
  Upload,
  ExternalLink,
  PlayCircle,
  File,
  RefreshCw,
  Youtube,
  CheckCircle,
} from "lucide-react";
import { addVideoResource, addPdfResource, deleteResource, type Resource } from "@/actions/resources";
import { useToast } from "@/components/admin/Toast";

interface ResourcesTabProps {
  initialResources: Resource[];
  onRefresh: () => void;
}

const levels = ["Bac", "1ère Bac", "2ème Bac", "Terminale"];
const resourceTypeLabels = {
  video: "Vidéo",
  pdf: "PDF",
};

export function ResourcesTab({ initialResources, onRefresh }: ResourcesTabProps) {
  const [activeType, setActiveType] = useState<"video" | "pdf">("video");
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const { showToast } = useToast();

  const videoResources = resources.filter((r) => r.type === "video");
  const pdfResources = resources.filter((r) => r.type === "pdf");

  const handleAddVideo = async (formData: FormData) => {
    startTransition(async () => {
      const result = await addVideoResource(formData);
      if (result.success) {
        showToast("Vidéo ajoutée avec succès!");
        onRefresh();
        setResources((prev) => [...prev]);
      } else {
        showToast(result.error || "Erreur lors de l'ajout", "error");
      }
    });
  };

  const handleAddPdf = async (formData: FormData) => {
    startTransition(async () => {
      const result = await addPdfResource(null, formData);
      if (result.success) {
        showToast("PDF uploaded avec succès!");
        onRefresh();
        setResources((prev) => [...prev]);
      } else {
        showToast(result.error || "Erreur lors de l'upload", "error");
      }
    });
  };

  const handleDelete = (id: number, fileUrl: string | null) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette ressource?")) return;
    setLoadingId(id);
    startTransition(async () => {
      const result = await deleteResource(id, fileUrl);
      if (result.success) {
        showToast("Ressource supprimée");
        setResources((prev) => prev.filter((r) => r.id !== id));
        onRefresh();
      } else {
        showToast(result.error || "Erreur lors de la suppression", "error");
      }
      setLoadingId(null);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <button
          onClick={() => setActiveType("video")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
            activeType === "video"
              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
              : "bg-white/5 text-slate-400 border border-white/10 hover:text-slate-200"
          }`}
        >
          <Youtube className="h-4 w-4" />
          Vidéos ({videoResources.length})
        </button>
        <button
          onClick={() => setActiveType("pdf")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
            activeType === "pdf"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
              : "bg-white/5 text-slate-400 border border-white/10 hover:text-slate-200"
          }`}
        >
          <FileText className="h-4 w-4" />
          PDF ({pdfResources.length})
        </button>
      </div>

      {activeType === "video" ? (
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-100">
              <Plus className="h-5 w-5 text-rose-400" />
              Ajouter une vidéo
            </h3>
            <form
              action={handleAddVideo}
              className="mt-5 space-y-4"
            >
              <div>
                <label className="mb-2 block text-sm text-slate-400">Titre *</label>
                <input
                  name="title"
                  required
                  placeholder="Ex: Mécanique - Les lois de Newton"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-rose-500/50 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-400">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Description optionnelle..."
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-rose-500/50 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-400">URL YouTube/Vimeo *</label>
                <input
                  name="youtubeUrl"
                  required
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-rose-500/50 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-400">Niveau</label>
                <select
                  name="level"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 focus:border-rose-500/50 focus:outline-none"
                >
                  <option value="">Sélectionner un niveau</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-rose-400 hover:to-rose-500 disabled:opacity-50"
              >
                {isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <PlayCircle className="h-4 w-4" />}
                {isPending ? "Ajout en cours..." : "Ajouter la vidéo"}
              </button>
            </form>
          </div>

          <div className="space-y-4">
            {videoResources.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 py-16">
                <Video className="h-12 w-12 text-slate-600" />
                <h3 className="mt-4 text-lg font-medium text-slate-400">Aucune vidéo</h3>
                <p className="mt-2 text-sm text-slate-500">Ajoutez votre première vidéo YouTube</p>
              </div>
            ) : (
              videoResources.map((resource) => (
                <div
                  key={resource.id}
                  className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:border-white/20"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-500/20">
                    <Youtube className="h-5 w-5 text-rose-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-200 truncate">{resource.title}</h4>
                    {resource.level && (
                      <span className="mt-1 inline-block rounded-lg bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                        {resource.level}
                      </span>
                    )}
                    {resource.description && (
                      <p className="mt-2 text-sm text-slate-500 line-clamp-2">{resource.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {resource.youtube_url && (
                      <a
                        href={resource.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-rose-400"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(resource.id, null)}
                      disabled={loadingId === resource.id}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 transition hover:bg-rose-500/30 disabled:opacity-50"
                    >
                      {loadingId === resource.id ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-100">
              <Upload className="h-5 w-5 text-cyan-400" />
              Upload un PDF
            </h3>
            <form
              action={handleAddPdf}
              className="mt-5 space-y-4"
            >
              <div>
                <label className="mb-2 block text-sm text-slate-400">Titre *</label>
                <input
                  name="title"
                  required
                  placeholder="Ex: Cours de Physique - Optique"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-400">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Description optionnelle..."
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-400">Niveau</label>
                <select
                  name="level"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 focus:border-cyan-500/50 focus:outline-none"
                >
                  <option value="">Sélectionner un niveau</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-400">Fichier PDF *</label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-slate-900/50 px-5 py-8 transition hover:border-cyan-500/50 hover:bg-slate-900">
                  <Upload className="h-8 w-8 text-slate-500" />
                  <span className="mt-3 text-sm text-slate-400">Cliquez pour uploader un PDF</span>
                  <span className="mt-1 text-xs text-slate-600">Max 50MB</span>
                  <input
                    name="file"
                    type="file"
                    accept=".pdf"
                    required
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && file.size > 50 * 1024 * 1024) {
                        showToast("Fichier trop volumineux (max 50MB)", "error");
                        e.target.value = "";
                      }
                    }}
                  />
                </label>
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-cyan-400 hover:to-cyan-500 disabled:opacity-50"
              >
                {isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                {isPending ? "Upload en cours..." : "Uploader le PDF"}
              </button>
            </form>
          </div>

          <div className="space-y-4">
            {pdfResources.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 py-16">
                <FileText className="h-12 w-12 text-slate-600" />
                <h3 className="mt-4 text-lg font-medium text-slate-400">Aucun PDF</h3>
                <p className="mt-2 text-sm text-slate-500">Uploadez votre premier document PDF</p>
              </div>
            ) : (
              pdfResources.map((resource) => (
                <div
                  key={resource.id}
                  className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:border-white/20"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20">
                    <File className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-200 truncate">{resource.title}</h4>
                    {resource.level && (
                      <span className="mt-1 inline-block rounded-lg bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                        {resource.level}
                      </span>
                    )}
                    {resource.description && (
                      <p className="mt-2 text-sm text-slate-500 line-clamp-2">{resource.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {resource.file_url && (
                      <a
                        href={resource.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-cyan-400"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(resource.id, resource.file_url)}
                      disabled={loadingId === resource.id}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 transition hover:bg-rose-500/30 disabled:opacity-50"
                    >
                      {loadingId === resource.id ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}