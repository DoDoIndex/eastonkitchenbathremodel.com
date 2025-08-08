import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const submissionId = searchParams.get('submissionId');

    if (!submissionId) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    // Fetch the submission data from JotForm
    const jotformResponse = await fetch(
      `https://api.jotform.com/submission/${submissionId}?apiKey=${process.env.JOTFORM_API_KEY}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!jotformResponse.ok) {
      const errorData = await jotformResponse.json();
      return NextResponse.json(
        { error: 'Failed to fetch JotForm submission' },
        { status: 500 }
      );
    }

    const jotformResult = await jotformResponse.json();
    const submissionData = jotformResult.content;
    
    // Extract notes from field 20
    let notes = '';
    if (submissionData && submissionData.answers && submissionData.answers['20']) {
      const field20 = submissionData.answers['20'];
      if (field20.answer && field20.answer.text) {
        notes = field20.answer.text;
      } else if (field20.prettyFormat) {
        notes = field20.prettyFormat;
      }
    }

    return NextResponse.json(
      { 
        notes,
        submissionId
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: 'Server error while getting notes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { submissionId, notes } = await request.json();

    if (!submissionId) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    // Update JotForm submission with notes in field 20
    
    const jotformResponse = await fetch(
      `https://api.jotform.com/submission/${submissionId}?apiKey=${process.env.JOTFORM_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "20": { "text": notes }  // Field 20 for notes
        })
      }
    );

    if (!jotformResponse.ok) {
      const errorData = await jotformResponse.json();
      return NextResponse.json(
        { error: 'Failed to update JotForm submission' },
        { status: 500 }
      );
    }

    const jotformResult = await jotformResponse.json();

    return NextResponse.json(
      { 
        message: 'Notes saved successfully',
        submissionId,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: 'Server error while saving notes' },
      { status: 500 }
    );
  }
}