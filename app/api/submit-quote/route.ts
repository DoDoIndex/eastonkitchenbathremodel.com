import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, project, recaptchaToken } = body;

    // Verify reCAPTCHA
    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET}&response=${recaptchaToken}`,
    });

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification
    // 3. Add to CRM system
    // For now, we'll just log the data
    console.log('Quote request received:', {
      name,
      email,
      phone,
      project,
      timestamp: new Date().toISOString(),
      recaptchaScore: recaptchaData.score // Available if using reCAPTCHA v3
    });

    // TODO: Implement your preferred method of handling the form data:
    // - Send email using Resend, SendGrid, or similar
    // - Save to database (PostgreSQL, MongoDB, etc.)
    // - Send to CRM (HubSpot, Salesforce, etc.)
    // - Send to webhook

    return NextResponse.json(
      { message: 'Quote request submitted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing quote request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}