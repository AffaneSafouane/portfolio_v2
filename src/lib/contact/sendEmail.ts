import { Resend } from 'resend';
import type { ContactFormData } from '../validation';

export class ContactDeliveryError extends Error {
  constructor(message: string, public readonly statusCode: number | null) {
    super(message);
    this.name = 'ContactDeliveryError';
  }
}

export async function sendContactEmail(data: ContactFormData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('Resend is not configured');

  const resend = new Resend(apiKey);
  const recipient = process.env.CONTACT_EMAIL?.trim() || 'contact@safouane-affane.fr';
  const sender = process.env.EMAIL_FROM?.trim() || 'Portfolio <contact@safouane-affane.fr>';
  try {
    const { error } = await resend.emails.send({
      from: sender,
      to: recipient,
      replyTo: data.email,
      subject: `Nouveau message : ${data.subject}`,
      text: `Nom : ${data.fullName}\nEmail : ${data.email}\nObjet : ${data.subject}\n\n${data.message}`,
    });
    if (error) throw new ContactDeliveryError(error.message, error.statusCode ?? null);
  } catch (cause) {
    if (cause instanceof ContactDeliveryError) throw cause;
    throw new ContactDeliveryError('Resend request failed', null);
  }
}
