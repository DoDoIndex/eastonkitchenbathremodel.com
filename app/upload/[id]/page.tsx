import UploadContent from './UploadContent';
import { Client } from 'basic-ftp';

interface UploadPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface ExistingFile {
  name: string;
  size: number;
  modifiedAt: Date;
  type: 'file' | 'directory';
}

async function getExistingFiles(submissionId: string): Promise<ExistingFile[]> {
  const existingFiles: ExistingFile[] = [];

  
  // Check if environment variables are set
  if (!process.env.FTP_HOST || !process.env.FTP_USERNAME || !process.env.FTP_PASSWORD) {
    return existingFiles;
  }

  const client = new Client();

  try {
    // Connect to FTP server
    await client.access({
      host: process.env.FTP_HOST!,
      user: process.env.FTP_USERNAME!,
      password: process.env.FTP_PASSWORD!,
      secure: false // Set to true if using FTPS
    });

    // Get current working directory
    const currentDir = await client.pwd();

    // Check if folder exists, create if it doesn't
    try {
      await client.cd(submissionId);
    } catch (error) {
      // Folder doesn't exist, just return empty array
      // The folder will be created when the first file is uploaded
      return existingFiles;
    }

    // Get current directory after navigation
    const finalDir = await client.pwd();

    // List files in the directory
    const files = await client.list();
    
    for (const file of files) {
      existingFiles.push({
        name: file.name,
        size: file.size,
        modifiedAt: file.modifiedAt || new Date(),
        type: file.isDirectory ? 'directory' : 'file'
      });
    }

  } catch (error) {
    console.error('[FTP] Error details:', error);
    // If FTP fails, return empty array (don't break the page)
  } finally {
    client.close();
  }

  return existingFiles;
}

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
  
  // Add timeout to FTP call to prevent hanging
  let existingFiles: ExistingFile[] = [];
  let existingNotes: string = '';
  
  try {
    // Fetch both files and notes in parallel
    const [filesResult, notesResult] = await Promise.all([
      Promise.race([
        getExistingFiles(id),
        new Promise<ExistingFile[]>((_, reject) => 
          setTimeout(() => reject(new Error('FTP timeout')), 10000)
        )
      ]),
      getExistingNotes(id)
    ]);
    
    existingFiles = filesResult;
    existingNotes = notesResult;
  } catch (error) {
    // Continue with empty array/string if fetching fails
    existingFiles = [];
    existingNotes = '';
  }
  
  return <UploadContent submissionId={id} existingFiles={existingFiles} initialNotes={existingNotes} />;
}