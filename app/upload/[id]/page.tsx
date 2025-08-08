import UploadContent from './UploadContent';

interface UploadPageProps {
  params: Promise<{
    id: string;
  }>;
}

// All FTP-related logic has been removed. Files will be fetched client-side via /api/get-files/[id].

async function getExistingNotes(submissionId: string): Promise<string> {
  try {
    
    // Hit JotForm API directly
    const response = await fetch(
      `https://api.jotform.com/submission/${submissionId}?apiKey=${process.env.JOTFORM_API_KEY}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.ok) {
      return '';
    }

    const jotformResult = await response.json();
    const submissionData = jotformResult.content;
    
    // Extract notes from field 20
    let notes = '';
    if (submissionData && submissionData.answers && submissionData.answers['20']) {
      const field20 = submissionData.answers['20'];
      if (field20.answer) {
        // Field 20 (textarea) stores answer as a string, not an object
        notes = typeof field20.answer === 'string' ? field20.answer : field20.answer.text || '';
      } else if (field20.prettyFormat) {
        notes = field20.prettyFormat;
      }
    }

    return notes || '';
    
  } catch (error) {
    return '';
  }
}

export default async function UploadPage({ params }: UploadPageProps) {
  const { id } = await params;
  
  let existingNotes: string = '';
  
  try {
    // Fetch notes only on the server; files are loaded on the client
    const notesResult = await getExistingNotes(id);
    existingNotes = notesResult;
  } catch (error) {
    // Continue with empty array/string if fetching fails
    existingNotes = '';
  }
  
  return <UploadContent submissionId={id} initialNotes={existingNotes} />;
}