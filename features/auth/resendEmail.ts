type Props = {
  email: string;
  username: string;
  verifyUrl: string;
};

export async function resendEmailHelper({ email, username, verifyUrl }: Props) {
  const res = await fetch('/api/send', {
    method: 'POST',
    headers: { 'Contetn-Type': 'application/json' },
    body: JSON.stringify({ email, username, verifyUrl }),
  });

  return await res.json();
}
