export function isRedirectError(error: unknown): boolean {
  const isError = typeof error === 'object' && error !== null;
  return (
    (isError && 'message' in error && error?.message === 'NEXT_REDIRECT') ||
    (isError &&
      'digest' in error &&
      typeof error.digest === 'string' &&
      error?.digest?.includes('NEXT_REDIRECT'))
  );
}
