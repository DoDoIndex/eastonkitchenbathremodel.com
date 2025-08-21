import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  project: string;
  budget: string;
  source: string;
  ad_source: string;
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
    const { name, email, phone, project, budget, source, ad_source, recaptchaToken } = body;

    // Verify reCAPTCHA (skip if token is 'skip')
    if (recaptchaToken !== 'skip') {
      const isValidRecaptcha = await verifyRecaptcha(recaptchaToken);
      if (!isValidRecaptcha) {
        return NextResponse.json(
          { error: 'Invalid reCAPTCHA' },
          { status: 400 }
        );
      }
    }

    // Prepare submission data with correct question IDs
    const submissionData = [{
      "5": { "text": name },           // Name field
      "15": { "text": phone },         // Phone field
      "11": { "text": email },         // Email field
      "16": { "text": project },       // Project interest field
      "17": { "text": budget },        // Budget field
      "18": { "text": source },        // Source field
      "22": { "text": ad_source }      // Ad source field
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
      throw new Error('Failed to submit to JotForm');
    }

    const jotformResult = await jotformResponse.json();
    
    // Extract the submission ID from JotForm response
    let submissionId = null;
    if (jotformResult.responseCode === 200 && jotformResult.content && Array.isArray(jotformResult.content)) {
      submissionId = jotformResult.content[0]?.submissionID;
    }

    console.log('Quote request submitted to JotForm successfully:', {
      name,
      email,
      phone,
      project,
      budget,
      source,
      ad_source,
      submissionId,
      timestamp: new Date().toISOString()
    });

    // Send email using Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send notification to staff
    await resend.emails.send({
      from: 'PPC Ads <hello@cadentile.com>',
      to: process.env.NEXT_PUBLIC_ENVIRONMENT === "PROD" ? ['dolores@eastondesigns.com', 'travis@eastondesigns.com', 'travis@cadentile.com', 'an@breakproject.com', 'an@cadentile.com'] : ['an@breakproject.com', 'an@cadentile.com'],
      subject: `[PPC] ${name} - ${submissionId}`,
      html: `
        <h2>Contact Information</h2>
        <p style="font-size: 16px;">Name: <strong style="background-color: #FFFFC5;">${name}</strong></p>
        <p style="font-size: 16px;">Email: <strong style="background-color: #FFFFC5;">${email}</strong></p>
        <p style="font-size: 16px;">Phone: <strong style="background-color: #FFFFC5;">${phone}</strong></p>
        <p style="font-size: 16px;">Source: <strong style="background-color: #FFFFC5;">${source}</strong></p>
        <p style="font-size: 16px;">Ad Source: <strong style="background-color: #FFFFC5;">${ad_source || 'None'}</strong></p>
        <p><em>Submitted at ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}</em></p>
      `
    });

    return NextResponse.json(
      { 
        message: 'Quote request submitted successfully',
        submissionId: submissionId
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to submit quote request' },
      { status: 500 }
    );
  }
}