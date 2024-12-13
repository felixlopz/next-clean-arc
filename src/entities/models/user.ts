import { userRoleSchema } from '@/drizzle/schema';
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(3).max(31),
  email: z.string().email(),
  password: z.string().min(6).max(255),
  role: userRoleSchema,
  createdAt: z.date()
});

export type User = z.infer<typeof userSchema>;

export const createUserSchema = userSchema
  .pick({ id: true, name: true, email: true })
  .merge(z.object({ password: z.string().min(6).max(255) }));


export type CreateUser = z.infer<typeof createUserSchema>;