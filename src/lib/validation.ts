/**
 * Zod validation schemas
 */

import { z } from 'zod';

export const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 70 caractères'),
  
  email: z
    .email('Format d\'email invalide')
    .min(10, 'L\'email doit contenir au moins 5 caractères')
    .max(250, 'L\'email ne peut pas dépasser 254 caractères'),
  
  subject: z
    .string()
    .min(3, 'L\'objet doit contenir au moins 3 caractères' )
    .max(150, 'L\'objet ne peut pas dépasser 150 caractères'),
  
  message: z
    .string()
    .min(5, 'Le message doit contenir au moins 10 caractères')
    .max(500, 'Le message ne peut pas dépasser 1000 caractères'),

  captchaToken: z
    .string()
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
