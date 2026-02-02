import z from 'zod';

// ! Helpers
const passwordSchema = z
  .string('Password is required')
  .min(8, 'Password must be more than 8 characters')
  .max(32, 'Password must be less than 32 characters');

const passwordMatchSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: z
      .string('Repeat password is required')
      .min(1, 'Repeat password is required'),
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
    username: z
      .string('Invalid username')
      .min(4, 'Username must be at least 4 characters'),
    email: emailSchema,
  })
  .and(passwordMatchSchema);
