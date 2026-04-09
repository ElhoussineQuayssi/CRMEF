interface WhatsAppMessage {
  to: string;
  template: string;
  parameters: Record<string, string>;
}

export async function sendWhatsAppMessage({ to, template, parameters }: WhatsAppMessage) {
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneId || !accessToken) {
    console.error("WhatsApp credentials not configured");
    return false;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${phoneId}/messages`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: to.replace("+", ""),
          type: "template",
          template: {
            name: template,
            language: { code: "fr_FR" },
            components: [
              {
                type: "body",
                parameters: Object.entries(parameters).map(([key, value]) => ({
                  type: "text",
                  parameter_name: key,
                  text: value,
                })),
              },
            ],
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("WhatsApp API error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error);
    return false;
  }
}

export async function sendBookingNotification(booking: {
  studentName: string;
  studentPhone: string;
  subjectTopic: string;
  date: string;
  timeSlot: string;
}) {
  const adminPhone = process.env.WHATSAPP_ADMIN_PHONE;
  
  if (!adminPhone) {
    console.error("Admin phone not configured");
    return false;
  }

  return sendWhatsAppMessage({
    to: adminPhone,
    template: "new_booking_notification",
    parameters: {
      student_name: booking.studentName,
      student_phone: booking.studentPhone,
      subject: booking.subjectTopic,
      date: booking.date,
      time_slot: booking.timeSlot,
    },
  });
}