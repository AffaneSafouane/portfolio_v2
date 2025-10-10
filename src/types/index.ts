/**
 * TypeScript type definitions
 */

export interface Contact {
  id: number;
  fullName: string;
  email: string;
  subject?: string | null;
  message: string;
  createdAt: Date;
}