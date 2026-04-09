"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export interface Resource {
  id: number;
  title: string;
  description: string | null;
  type: "video" | "pdf";
  level: string | null;
  file_url: string | null;
  youtube_url: string | null;
  created_at: string;
}

export async function getResources(): Promise<Resource[]> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get resources error:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Get resources failed:", error);
    return [];
  }
}

export async function addVideoResource(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  try {
    const title = formData.get("title")?.toString() ?? "";
    const description = formData.get("description")?.toString() ?? "";
    const youtubeUrl = formData.get("youtubeUrl")?.toString() ?? "";
    const level = formData.get("level")?.toString() ?? "";

    if (!title || !youtubeUrl) {
      return { error: "Titre et URL sont requis" };
    }

    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("resources").insert([
      {
        title,
        description: description || null,
        type: "video",
        level: level || null,
        youtube_url: youtubeUrl,
        file_url: null,
      },
    ]);

    if (error) {
      console.error("Add video error:", error);
      return { error: error.message };
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Add video failed:", error);
    return { error: "Erreur lors de l'ajout de la vidéo" };
  }
}

export async function addPdfResource(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  try {
    const title = formData.get("title")?.toString() ?? "";
    const description = formData.get("description")?.toString() ?? "";
    const level = formData.get("level")?.toString() ?? "";
    const file = formData.get("file") as File | null;

    if (!title || !file) {
      return { error: "Titre et fichier PDF sont requis" };
    }

    if (file.type !== "application/pdf") {
      return { error: "Seuls les fichiers PDF sont autorisés" };
    }

    const supabase = createSupabaseServerClient();

    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = `pdfs/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("resources")
      .upload(filePath, uint8Array, {
        contentType: "application/pdf",
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { error: "Erreur lors de l'upload du fichier" };
    }

    const { data: publicUrlData } = supabase.storage
      .from("resources")
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;

    const { error: insertError } = await supabase.from("resources").insert([
      {
        title,
        description: description || null,
        type: "pdf",
        level: level || null,
        file_url: publicUrl,
        youtube_url: null,
      },
    ]);

    if (insertError) {
      console.error("Insert error:", insertError);
      await supabase.storage.from("resources").remove([filePath]);
      return { error: insertError.message };
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Add PDF failed:", error);
    return { error: "Erreur lors de l'ajout du PDF" };
  }
}

export async function deleteResource(id: number, fileUrl?: string | null): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = createSupabaseServerClient();

    if (fileUrl) {
      const urlParts = fileUrl.split("/");
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `pdfs/${fileName}`;

      await supabase.storage.from("resources").remove([filePath]);
    }

    const { error } = await supabase.from("resources").delete().eq("id", id);

    if (error) {
      console.error("Delete resource error:", error);
      return { error: error.message };
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Delete resource failed:", error);
    return { error: "Erreur lors de la suppression" };
  }
}