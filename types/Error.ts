import { $ZodIssue } from 'zod/v4/core';

export type ActionError =
  | {
      type: 'validation';
      issues: $ZodIssue[];
    }
  | {
      type: 'server';
      message: string;
    };
