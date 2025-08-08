import UploadContent from './UploadContent';
import { notFound } from 'next/navigation';

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
      notFound();
    }

    const jotformResult = await response.json();
    
    // Check if the response indicates a valid submission
    if (!jotformResult.content) {
      notFound();
    }
    
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
    throw error; // Re-throw the error instead of returning empty string
  }
}

export default async function UploadPage({ params }: UploadPageProps) {
  const { id } = await params;
  
  try {
    // Fetch notes only on the server; files are loaded on the client
    const notesResult = await getExistingNotes(id);
    return <UploadContent submissionId={id} initialNotes={notesResult} />;
  } catch (error) {
    // If JotForm submission is not found, show 404 page
    notFound();
  }
}