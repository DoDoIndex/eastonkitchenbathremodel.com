import { NextRequest, NextResponse } from 'next/server';

async function isValidJotformSubmission(submissionId: string): Promise<boolean> {
  try {
    const apiKey = process.env.JOTFORM_API_KEY;
    if (!apiKey) {
      return false;
    }

    const res = await fetch(
      `https://api.jotform.com/submission/${encodeURIComponent(submissionId)}?apiKey=${encodeURIComponent(apiKey)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // 10s timeout using AbortController
        signal: AbortSignal.timeout ? AbortSignal.timeout(10000) : undefined as any,
      }
    );

    if (!res.ok) return false;
    const data = await res.json().catch(() => null as any);
    // JotForm returns { responseCode: 200, content: {...} }
    return Boolean(data && data.responseCode === 200 && data.content);
  } catch {
    return false;
  }
}

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const submissionId = context?.params?.id;
  if (!submissionId) {
    return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 });
  }

  // Verify the submission exists in JotForm
  const exists = await isValidJotformSubmission(submissionId);
  if (!exists) {
    return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
  }

  // If it exists, fetch files from external PHP endpoint.
  // Folder defaults to submission ID but can be overridden via ?folder= query param.
  const { searchParams } = new URL(request.url);
  const folderOverride = searchParams.get('folder');
  const folder = folderOverride && folderOverride.trim() !== '' ? folderOverride : submissionId;

  try {
    const url = `https://ppc-img.breakproject.com/get-files.php?folder=${encodeURIComponent(folder)}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout ? AbortSignal.timeout(10000) : undefined as any,
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch files' }, { status: 502 });
    }

    const files = await res.json().catch(() => null);
    if (!Array.isArray(files)) {
      return NextResponse.json({ error: 'Unexpected response format from files endpoint' }, { status: 502 });
    }

    return NextResponse.json({ submissionId, folder, files }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching files' }, { status: 500 });
  }
}

