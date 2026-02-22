import {
  changeBirthdaySchema,
  changePasswordSchema,
  passwordMatchSchema,
  changeUsernameSchema,
} from '@/validations/userValidation';
import z from 'zod';

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
// export type ChangePasswordOutputSchema = z.output<typeof changePasswordSchema>;

export type SetPasswordSchema = z.infer<typeof passwordMatchSchema>;
// export type SetPasswordOutputSchema = z.output<typeof passwordMatchSchema>;

export type ChangeUserBirthdaySchema = z.infer<typeof changeBirthdaySchema>;
// export type ChangeUserBirthdayOutputSchema = z.output<typeof birthdaySchema>;

export type ChangeUsernameSchema = z.infer<typeof changeUsernameSchema>;
