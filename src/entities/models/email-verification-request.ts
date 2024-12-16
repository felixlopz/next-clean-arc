import { z } from 'zod';

export const emailVerificationRequest = z.object({
  id: z.string(),
  userId: z.string(),
  email: z.string().email(),
  code: z.string(),
  expiresAt: z.date(),
});

export type EmailVerificationRequest = z.infer<typeof emailVerificationRequest>;
