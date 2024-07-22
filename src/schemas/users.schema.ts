import { z, ZodSchema } from 'zod';

export const registerUserSchema: ZodSchema = z.object({
  name: z.string({
    required_error: 'Name is required',
  }),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email({
      message: 'Invalid Email',
    }),
  password: z.string({
    required_error: 'Password is required',
  }),
});
