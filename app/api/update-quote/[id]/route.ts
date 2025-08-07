import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

interface UpdateQuoteData {
  project: string;
  budget: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: UpdateQuoteData = await request.json();
    const { project, budget } = body;
    const submissionId = (await params).id;

    console.log('Updating JotForm submission:', submissionId);

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
      console.error('JotForm fetch error:', errorData);
      throw new Error('Failed to fetch JotForm submission');
    }

    const fetchResult = await fetchResponse.json();
    console.log('JotForm fetch result:', JSON.stringify(fetchResult, null, 2));
    
    const submissionData = fetchResult.content;
    console.log('Submission data:', JSON.stringify(submissionData, null, 2));
    
    // Log the answers structure specifically
    if (submissionData && submissionData.answers) {
      console.log('Answers object:', JSON.stringify(submissionData.answers, null, 2));
      console.log('Field 5 (name field):', JSON.stringify(submissionData.answers['5'], null, 2));
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
    
    console.log('Extracted name for email subject:', name);

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
      console.error('JotForm update error:', errorData);
      throw new Error('Failed to update JotForm submission');
    }

    const jotformResult = await jotformResponse.json();
    console.log('JotForm submission updated successfully:', jotformResult);

    // Send update email using Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Anaheim Hills Contractor <hello@cadentile.com>',
      to: process.env.NEXT_PUBLIC_ENVIRONMENT === "PROD" ? ['hello@eastondesigns.com', 'an@breakproject.com', 'an@cadentile.com'] : ['an@breakproject.com', 'an@cadentile.com'],
      subject: `PPC Bath Kitchen - ${name} - ${submissionId}`,
      html: `
        <h2>Quote Update - Anaheim Hills Contractor</h2>
        <p style="font-size: 16px;">Submission ID: <strong style="background-color: #FFFFC5;">${submissionId}</strong></p>
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
    console.error('Error updating quote:', error);
    return NextResponse.json(
      { error: 'Failed to update quote' },
      { status: 500 }
    );
  }
}