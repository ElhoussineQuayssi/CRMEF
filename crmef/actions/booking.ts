"use server";

import { revalidatePath } from "next/cache";
import { bookingSchema } from "@/lib/validators";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { sendBookingNotification } from "@/lib/whatsapp";

export async function createBooking(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const result = bookingSchema.safeParse({
    studentName: formData.get("studentName")?.toString() ?? "",
    studentPhone: formData.get("studentPhone")?.toString() ?? "",
    subjectTopic: formData.get("subjectTopic")?.toString() ?? "",
    selectedDate: formData.get("selectedDate")?.toString() ?? "",
    timeSlot: formData.get("timeSlot")?.toString() ?? "",
  });

  if (!result.success) {
    console.error("Validation failed:", result.error);
    return { error: "Données invalides" };
  }

  const payload = result.data;

  console.log("Booking payload:", payload);

  try {
    const supabase = createSupabaseServerClient();
    
    const dateValue = new Date(payload.selectedDate);
    console.log("Inserting with date:", dateValue.toISOString().split('T')[0]);
    
    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          student_name: payload.studentName,
          student_phone: payload.studentPhone,
          subject_topic: payload.subjectTopic,
          date: dateValue.toISOString().split('T')[0],
          time_slot: payload.timeSlot,
          status: "pending",
        },
      ])
      .select();

    console.log("Insert result:", { data, error });

    if (!error && data && data.length > 0) {
      const booking = data[0];
      await sendBookingNotification({
        studentName: payload.studentName,
        studentPhone: payload.studentPhone,
        subjectTopic: payload.subjectTopic,
        date: dateValue.toISOString().split('T')[0],
        timeSlot: payload.timeSlot,
      });
    }

    revalidatePath("/booking");
    return { success: true };
  } catch (error) {
    console.error("Booking submission failed:", error);
    return { error: "Erreur lors de la soumission" };
  }
}

// =============================================
// ADMIN BOOKING ACTIONS
// =============================================

export async function confirmBooking(id: number): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase
      .from("bookings")
      .update({ status: "confirmed" })
      .eq("id", id);

    if (error) {
      console.error("Confirm booking error:", error);
      return { error: error.message };
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Confirm booking failed:", error);
    return { error: "Erreur lors de la confirmation" };
  }
}

export async function cancelBooking(id: number): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", id);

    if (error) {
      console.error("Cancel booking error:", error);
      return { error: error.message };
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Cancel booking failed:", error);
    return { error: "Erreur lors de l'annulation" };
  }
}

export async function deleteBooking(id: number): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete booking error:", error);
      return { error: error.message };
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Delete booking failed:", error);
    return { error: "Erreur lors de la suppression" };
  }
}