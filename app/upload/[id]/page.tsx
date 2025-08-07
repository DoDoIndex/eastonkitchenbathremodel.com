import UploadContent from './UploadContent';
import { Client } from 'basic-ftp';

interface UploadPageProps {
  params: {
    id: string;
  };
}

interface ExistingFile {
  name: string;
  size: number;
  modifiedAt: Date;
  type: 'file' | 'directory';
}

async function getExistingFiles(submissionId: string): Promise<ExistingFile[]> {
  const existingFiles: ExistingFile[] = [];

  console.log(`[FTP] Attempting to connect for submission: ${submissionId}`);
  
  // Check if environment variables are set
  if (!process.env.FTP_HOST || !process.env.FTP_USERNAME || !process.env.FTP_PASSWORD) {
    console.error('[FTP] Missing environment variables: FTP_HOST, FTP_USERNAME, or FTP_PASSWORD');
    console.log('[FTP] Skipping FTP connection - returning empty array');
    return existingFiles;
  }

  const client = new Client();

  try {
    // Connect to FTP server
    console.log(`[FTP] Connecting to ${process.env.FTP_HOST}...`);
    await client.access({
      host: process.env.FTP_HOST!,
      user: process.env.FTP_USERNAME!,
      password: process.env.FTP_PASSWORD!,
      secure: false // Set to true if using FTPS
    });
    console.log('[FTP] Connected successfully');

    // Get current working directory
    const currentDir = await client.pwd();
    console.log(`[FTP] Current directory: ${currentDir}`);

    // Check if folder exists, create if it doesn't
    try {
      console.log(`[FTP] Trying to navigate to folder: ${submissionId}`);
      await client.cd(submissionId);
      console.log(`[FTP] Successfully navigated to ${submissionId}`);
    } catch (error) {
      console.log(`[FTP] Folder ${submissionId} doesn't exist, creating it...`);
      // Folder doesn't exist, create it
      await client.ensureDir(submissionId);
      await client.cd(submissionId);
      console.log(`[FTP] Created and navigated to ${submissionId}`);
    }

    // Get current directory after navigation
    const finalDir = await client.pwd();
    console.log(`[FTP] Final directory: ${finalDir}`);

    // List files in the directory
    const files = await client.list();
    console.log(`[FTP] Found ${files.length} files in directory`);
    
    for (const file of files) {
      console.log(`[FTP] File: ${file.name} (${file.size} bytes, ${file.isDirectory ? 'directory' : 'file'})`);
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
    console.log('[FTP] Connection closed');
  }

  console.log(`[FTP] Returning ${existingFiles.length} files`);
  return existingFiles;
}

export default async function UploadPage({ params }: UploadPageProps) {
  const { id } = await params;
  
  // Add timeout to FTP call to prevent hanging
  let existingFiles: ExistingFile[] = [];
  
  try {
    // Set a timeout for the FTP operation
    existingFiles = await Promise.race([
      getExistingFiles(id),
      new Promise<ExistingFile[]>((_, reject) => 
        setTimeout(() => reject(new Error('FTP timeout')), 10000)
      )
    ]);
  } catch (error) {
    console.error('[PAGE] Failed to get existing files:', error);
    // Continue with empty array if FTP fails
    existingFiles = [];
  }
  
  return <UploadContent submissionId={id} existingFiles={existingFiles} />;
}