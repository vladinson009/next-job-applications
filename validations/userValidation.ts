import z from 'zod';

// ! Helpers
const passwordSchema = z
  .string('Password is required')
  .min(1, 'Password is required')
  .min(8, 'Password must be more than 8 characters')
  .max(32, 'Password must be less than 32 characters');

const passwordMatchSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        code: 'custom',
        path: ['passwordConfirm'],
        message: 'Passwords do not match',
      });
    }
  });

const emailSchema = z.email('Invalid email').min(1, 'Email is required');

// ! Validation schemas
export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signUpSchema = z
  .object({
    name: z.string('Invalid name').min(1, 'Name is required'),
    email: emailSchema,
    image: z.string().optional(),
    age: z.number().optional(),
  })
  .and(passwordMatchSchema);
