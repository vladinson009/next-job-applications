import z, { string } from 'zod';

// ! Helpers
const usernameHelper = z
  .string('Invalid username')
  .toLowerCase()
  .min(4, 'Username must be at least 4 characters')
  .max(30, 'Username must be at most 30 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, _ and -')
  .trim();

const emailHelper = z
  .email('Invalid email')
  .min(4, 'Email is required')
  .toLowerCase()
  .trim();

const birthdayHelper = z.date('Birthday must be a valid Date');

const passwordHelper = z
  .string('Password is required')
  .min(8, 'Password must be more than 8 characters')
  .max(32, 'Password must be less than 32 characters')
  .trim();

const credentialHelper = z
  .string()
  .min(1, 'Username or Email is required')
  .toLowerCase()
  .trim()
  .refine(
    (val) =>
      emailHelper.safeParse(val).success || usernameHelper.safeParse(val).success,
    { error: 'Enter a valid email or username' },
  );

// ! Validation schemas

export const passwordMatchSchema = z
  .object({
    password: passwordHelper,
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

export const signInSchema = z.object({
  credential: credentialHelper,
  password: passwordHelper,
});

export const signUpSchema = z
  .object({
    username: usernameHelper,
    email: emailHelper,
  })
  .and(passwordMatchSchema);

export const changePasswordSchema = z
  .object({
    oldPassword: string('Old password is required')
      .min(1, 'Old password is required')
      .trim(),
  })
  .and(passwordMatchSchema);

export const changeBirthdaySchema = z.object({
  birthday: birthdayHelper,
});

export const changeUsernameSchema = z.object({
  username: usernameHelper,
});
