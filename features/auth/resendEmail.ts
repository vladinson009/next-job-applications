type Props = {
  email: string;
  name: string;
  verifyUrl: string;
};

export async function resendEmailHelper({ email, name, verifyUrl }: Props) {
  const res = await fetch('/api/send', {
    method: 'POST',
    headers: { 'Contetn-Type': 'application/json' },
    body: JSON.stringify({ email, name, verifyUrl }),
  });

  return await res.json();
}
