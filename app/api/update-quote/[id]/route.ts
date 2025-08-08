import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

interface UpdateQuoteData {
  project: string;
  budget: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body: UpdateQuoteData = await request.json();
    const { project, budget } = body;
    const submissionId = (await params).id;

    // First, fetch the current submission data to get the name
    const fetchResponse = await fetch(
      `https://api.jotform.com/submission/${submissionId}?apiKey=${process.env.JOTFORM_API_KEY}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!fetchResponse.ok) {
      const errorData = await fetchResponse.json();
      throw new Error('Failed to fetch JotForm submission');
    }

    const fetchResult = await fetchResponse.json();
    
    const submissionData = fetchResult.content;
    
    // Log the answers structure specifically
    if (submissionData && submissionData.answers) {
    }
    
    // Extract name from the submission data (field ID 5 is the name field)
    // JotForm API returns answers in the format: submissionData.answers["5"]["answer"]["text"]
    let name = 'Unknown';
    if (submissionData && submissionData.answers && submissionData.answers['5']) {
      const field5 = submissionData.answers['5'];
      if (field5.answer && field5.answer.text) {
        name = field5.answer.text;
      } else if (field5.prettyFormat) {
        name = field5.prettyFormat;
      }
    }
    

    // Update the JotForm submission using their API
    // According to JotForm API docs: POST /submission/{id}
    const updateData = {
      "16": { "text": project },       // Project interest field
      "17": { "text": budget }         // Budget field
    };

    const jotformResponse = await fetch(
      `https://api.jotform.com/submission/${submissionId}?apiKey=${process.env.JOTFORM_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      }
    );

    if (!jotformResponse.ok) {
      const errorData = await jotformResponse.json();
      throw new Error('Failed to update JotForm submission');
    }

    const jotformResult = await jotformResponse.json();

    // Send update email using Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Anaheim Hills Contractor <hello@cadentile.com>',
      to: process.env.NEXT_PUBLIC_ENVIRONMENT === "PROD" ? ['hello@eastondesigns.com', 'an@breakproject.com', 'an@cadentile.com'] : ['an@breakproject.com', 'an@cadentile.com'],
      subject: `PPC Bath Kitchen - ${name} - ${submissionId}`,
      html: `
        <h2>Interest and Budget</h2>
        <p style="font-size: 16px;">Project Interest: <strong style="background-color: #FFFFC5;">${project}</strong></p>
        <p style="font-size: 16px;">Budget: <strong style="background-color: #FFFFC5;">${budget}</strong></p>
        <p><em>Updated at ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}</em></p>
      `
    });

    return NextResponse.json({ 
      message: 'Quote updated successfully',
      submissionId: submissionId 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update quote' },
      { status: 500 }
    );
  }
}