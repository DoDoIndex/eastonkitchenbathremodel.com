import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  project: string;
  recaptchaToken: string;
}

async function verifyRecaptcha(token: string) {
  const secret = process.env.RECAPTCHA_SECRET;
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `secret=${secret}&response=${token}`,
  });

  const data = await response.json();
  return data.success;
}

export async function POST(request: NextRequest) {
  try {
    const body: QuoteFormData = await request.json();
    const { name, email, phone, project, recaptchaToken } = body;

    // Verify reCAPTCHA
    const isValidRecaptcha = await verifyRecaptcha(recaptchaToken);
    if (!isValidRecaptcha) {
      return NextResponse.json(
        { error: 'Invalid reCAPTCHA' },
        { status: 400 }
      );
    }

    // Prepare submission data with correct question IDs
    const submissionData = [{
      "5": { "text": name },           // Name field
      "15": { "text": phone },         // Phone field
      "11": { "text": email },         // Email field
      "16": { "text": project }        // Project interest field
    }];

    // Send to JotForm
    const jotformResponse = await fetch(
      `https://api.jotform.com/form/${process.env.JOTFORM_QUOTE_FORM}/submissions?apiKey=${process.env.JOTFORM_API_KEY}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      }
    );

    if (!jotformResponse.ok) {
      const errorData = await jotformResponse.json();
      console.error('JotForm error:', errorData);
      throw new Error('Failed to submit to JotForm');
    }

    console.log('Quote request submitted to JotForm successfully:', {
      name,
      email,
      phone,
      project,
      timestamp: new Date().toISOString()
    });

    // Send email using Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send notification to staff
    await resend.emails.send({
      from: 'Anaheim Hills Contractor <hello@cadentile.com>',
      to: process.env.NEXT_PUBLIC_ENVIRONMENT === "PROD" ? ['hello@eastondesigns.com', 'an@breakproject.com', 'an@cadentile.com'] : ['an@breakproject.com', 'an@cadentile.com'],
      subject: `PPC Bath Kitchen Remodel AH - ${name}`,
      html: `
        <h2>PPC Bath Kitchen Remodel - Anaheim Hills</h2>
        <p style="font-size: 16px;">Name: <strong style="background-color: #FFFFC5;">${name}</strong></p>
        <p style="font-size: 16px;">Email: <strong style="background-color: #FFFFC5;">${email}</strong></p>
        <p style="font-size: 16px;">Phone: <strong style="background-color: #FFFFC5;">${phone}</strong></p>
        <p style="font-size: 16px;">Project Interest: <strong style="background-color: #FFFFC5;">${project}</strong></p>
        <p><em>Submitted at ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}</em></p>
      `
    });

    return NextResponse.json(
      { message: 'Quote request submitted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Quote form error:', error);
    return NextResponse.json(
      { error: 'Failed to submit quote request' },
      { status: 500 }
    );
  }
}