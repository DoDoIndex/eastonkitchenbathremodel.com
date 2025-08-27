import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

interface UpdateQuoteData {
  project: string;
  budget: string;
  financing: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body: UpdateQuoteData = await request.json();
    const { project, budget, financing } = body;
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
      "17": { "text": budget },        // Budget field
      "21": { "text": financing }      // Financing field
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

    // Update the lead in the Sales CRM
    try {
      // Submit lead to Easton backend
      const leadData = {
        project_interest: project,
        budget: budget,
        finance_need: financing,
        status: "Active"
      };

      const eastonResponse = await fetch(
        `${process.env.EASTON_BACKEND_HOST}/api/v1/admin/leads/${submissionId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.EASTON_BACKEND_ADMIN_API_KEY}`
          },
          body: JSON.stringify(leadData)
        }
      );

      if (eastonResponse.ok) {
        console.log('Lead updated in Easton backend successfully:', leadData);
      } else {
        console.error('Failed to update lead in Easton backend:', await eastonResponse.text());
      }
    } catch (eastonError) {
      console.error('Error submitting lead to Easton backend:', eastonError);
      // Don't fail the entire request if Easton submission fails
    }

    // Send update email using Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'PPC Ads <hello@cadentile.com>',
      to: process.env.NEXT_PUBLIC_ENVIRONMENT === "PROD" ? ['dolores@eastondesigns.com', 'travis@eastondesigns.com', 'an@breakproject.com', 'an@cadentile.com'] : ['an@breakproject.com', 'an@cadentile.com'],
      subject: `[PPC] ${name} - ${submissionId}`,
      html: `
        <h2>Interest and Budget</h2>
        <p style="font-size: 16px;">Project Interest: <strong style="background-color: #FFFFC5;">${project}</strong></p>
        <p style="font-size: 16px;">Budget: <strong style="background-color: #FFFFC5;">${budget}</strong></p>
        <p style="font-size: 16px;">Financing: <strong style="background-color: #FFFFC5;">${financing}</strong></p>
        <p><em>Updated at ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}</em></p>
        
        <div style="margin-top: 20px;">
          <a href="https://eastonkitchenbathremodel.com/upload/${submissionId}" 
             style="display: inline-block; background-color: #0EA5E9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
            View Files
          </a>
        </div>
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