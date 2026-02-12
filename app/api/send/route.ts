import { emailText } from '@/constants/emailVerification';
import { sendEmail } from '@/lib/sendEmail';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body: { email: string; username: string; verifyUrl: string } =
      await req.json();

    const { email, username, verifyUrl } = body;

    if (!email || !username || !verifyUrl) {
      return NextResponse.json(
        {
          error: 'Missing email, name or verifyUrl',
        },
        { status: 400 },
      );
    }

    const emailData = await sendEmail({
      to: email,
      subject: 'Verify your email',
      html: emailText(verifyUrl, username),
    });

    return Response.json(emailData);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
