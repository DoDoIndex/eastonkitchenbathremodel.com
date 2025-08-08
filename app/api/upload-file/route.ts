import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'basic-ftp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const submissionId = formData.get('submissionId') as string;

    if (!file || !submissionId) {
      return NextResponse.json(
        { error: 'File and submission ID are required' },
        { status: 400 }
      );
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only images (JPG, PNG, GIF, WebP) and PDF files are allowed' },
        { status: 400 }
      );
    }

    // Check environment variables
    if (!process.env.FTP_HOST || !process.env.FTP_USERNAME || !process.env.FTP_PASSWORD) {
      console.error('[FTP] Missing environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const client = new Client();
    client.ftp.verbose = true;

    try {
      // Connect to FTP server
      console.log(`[FTP] Uploading ${file.name} for submission: ${submissionId}`);
      await client.access({
        host: process.env.FTP_HOST!,
        user: process.env.FTP_USERNAME!,
        password: process.env.FTP_PASSWORD!,
        secure: false
      });

      // Ensure the submission folder exists
      try {
        await client.cd(submissionId);
      } catch (error) {
        // Folder doesn't exist, create it
        await client.ensureDir(submissionId);
        await client.cd(submissionId);
      }

      // Convert file to buffer and create a readable stream
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Create a readable stream from the buffer
      const { Readable } = await import('stream');
      const stream = Readable.from(buffer);

      // Upload the file using the stream
      await client.uploadFrom(stream, file.name);
      
      console.log(`[FTP] Successfully uploaded ${file.name}`);

      return NextResponse.json(
        { 
          message: 'File uploaded successfully',
          fileName: file.name,
          fileSize: file.size,
          success: true
        },
        { status: 200 }
      );

    } catch (ftpError) {
      console.error('[FTP] Upload error:', ftpError);
      return NextResponse.json(
        { error: 'Failed to upload file to server' },
        { status: 500 }
      );
    } finally {
      client.close();
    }

  } catch (error) {
    console.error('[API] Upload error:', error);
    return NextResponse.json(
      { error: 'Server error during upload' },
      { status: 500 }
    );
  }
}