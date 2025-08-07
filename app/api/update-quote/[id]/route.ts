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
    const submissionId = params.id;

    console.log('Updating JotForm submission:', submissionId);

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
      subject: `Quote Updated - Submission ${submissionId}`,
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