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

    // Insert to Sales CRM
    try {
      // Submit lead to Easton backend
      const leadData = {
        lead_id: submissionId?.toString() || `quote_${Date.now()}`,
        name: name,
        email: email,
        phone: phone,
        click_source: source,
        website_source: process.env.NEXT_PUBLIC_WEBSITE,
        ad_source: ad_source || "Unknown",
        status: "New",
        channel: 'Marketing',
        sales_rep: process.env.EASTON_BACKEND_DEFAULT_SALES_REP || "Default",
        text_notification: "true"
      };

      const eastonResponse = await fetch(
        `${process.env.EASTON_BACKEND_HOST}/api/v1/admin/leads`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.EASTON_BACKEND_ADMIN_API_KEY}`
          },
          body: JSON.stringify(leadData)
        }
      );

      if (eastonResponse.ok) {
        console.log('Lead submitted to Easton backend successfully:', leadData);
      } else {
        console.error('Failed to submit lead to Easton backend:', await eastonResponse.text());
      }
    } catch (eastonError) {
      console.error('Error submitting lead to Easton backend:', eastonError);
      // Don't fail the entire request if Easton submission fails
    }

    // Send email using Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send notification to staff
    await resend.emails.send({
      from: 'PPC Ads <hello@cadentile.com>',
      to: process.env.NEXT_PUBLIC_ENVIRONMENT === "PROD" ? ['dolores@eastondesigns.com', 'travis@eastondesigns.com', 'an@breakproject.com', 'an@cadentile.com'] : ['an@breakproject.com', 'an@cadentile.com'],
      subject: `[PPC] ${name} - ${submissionId}`,
      html: `
        <h2>Contact Information</h2>
        <p style="font-size: 16px;">Name: <strong style="background-color: #FFFFC5;">${name}</strong></p>
        <p style="font-size: 16px;">Email: <strong style="background-color: #FFFFC5;">${email}</strong></p>
        <p style="font-size: 16px;">Phone: <strong style="background-color: #FFFFC5;">${phone}</strong></p>
        <p style="font-size: 16px;">Source: <strong style="background-color: #FFFFC5;">${source}</strong></p>
        <p style="font-size: 16px;">Ad Source: <strong style="background-color: #FFFFC5;">${ad_source || 'None'}</strong></p>
        <p><em>Submitted at ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}</em></p>
        
        <div style="margin-top: 20px;">
          <a href="https://leads.eastondesigns.com/leads/${submissionId}" 
             style="display: inline-block; background-color: #0EA5E9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
            View Lead
          </a>
        </div>
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