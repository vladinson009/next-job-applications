import { VerifyEmailTemplate } from '@/components/verify-email-template';
import { sendEmail } from '@/lib/sendEmail';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body: { email: string; name: string; verifyUrl: string } =
      await req.json();

    const { email, name, verifyUrl } = body;

    if (!email || !name || !verifyUrl) {
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
      html: `<div>
                <h1>Welcome to Job Applications, ${name}</h1>
                <p>Here is your verifying link</p>
                <a href="${verifyUrl}">Click here</a>
                <p>This link is valid for 24 hours.</p>
            </div>`,
    });

    return Response.json(emailData);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
