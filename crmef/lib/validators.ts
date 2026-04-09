import { z } from "zod";

export const bookingSchema = z.object({
  studentName: z.string().min(2, "Name must be at least 2 characters"),
  studentPhone: z
    .string()
    .min(8, "Phone number must be at least 8 characters")
    .max(20),
  subjectTopic: z.string().min(5, "Please describe the topic"),
  selectedDate: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
    message: "Please select a valid date",
  }),
  timeSlot: z.string().min(1, "Select a time slot"),
});

export type BookingPayload = z.infer<typeof bookingSchema>;
