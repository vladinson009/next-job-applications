import z from 'zod';

// ! Helpers
const passwordSchema = z
  .string('Password is required')
  .min(8, 'Password must be more than 8 characters')
  .max(32, 'Password must be less than 32 characters')
  .trim();

const passwordMatchSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: z
      .string('Repeat password is required')
      .min(1, 'Repeat password is required')
      .trim(),
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

const emailSchema = z
  .email('Invalid email')
  .min(4, 'Email is required')
  .toLowerCase()
  .trim();

const usernameSchema = z
  .string('Invalid username')
  .toLowerCase()
  .min(4, 'Username must be at least 4 characters')
  .trim();

const credentialSchema = z
  .string()
  .min(1, 'Username or Email is required')
  .toLowerCase()
  .trim()
  .refine(
    (val) =>
      emailSchema.safeParse(val).success || usernameSchema.safeParse(val).success,
    { error: 'Enter a valid email or username' },
  );

// ! Validation schemas
export const signInSchema = z.object({
  credential: credentialSchema,
  password: passwordSchema,
});

export const signUpSchema = z
  .object({
    username: usernameSchema,
    email: emailSchema,
  })
  .and(passwordMatchSchema);
