import { z } from 'zod';

export const contactFormSchema = z.object({
  fullName: z.string().trim().min(2, 'Le nom doit contenir au moins 2 caractères').max(70, 'Le nom ne peut pas dépasser 70 caractères'),
  email: z.email('Format d’email invalide').trim().min(5, 'L’email doit contenir au moins 5 caractères').max(254, 'L’email ne peut pas dépasser 254 caractères'),
  subject: z.string().trim().min(3, 'L’objet doit contenir au moins 3 caractères').max(150, 'L’objet ne peut pas dépasser 150 caractères').refine(value => !/[\r\n]/.test(value), 'L’objet doit tenir sur une seule ligne'),
  message: z.string().trim().min(10, 'Le message doit contenir au moins 10 caractères').max(500, 'Le message ne peut pas dépasser 500 caractères'),
});

export const contactRequestSchema = contactFormSchema.extend({
  captchaToken: z.string().trim().min(1, 'Le contrôle anti-spam est requis'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type ContactRequest = z.infer<typeof contactRequestSchema>;
