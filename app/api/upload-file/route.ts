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
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const client = new Client();
    client.ftp.verbose = true;

    try {
      await client.access({
        host: process.env.FTP_HOST!,
        user: process.env.FTP_USERNAME!,
        password: process.env.FTP_PASSWORD!,
        secure: false
      });

      // Try to create directory first (ignore error if it exists)
      try {
        await client.send(`MKD ${submissionId}`);
      } catch (error) {
        // Ignore directory exists error
      }

      // Now try to enter the directory
      try {
        await client.cd(submissionId);
      } catch (error) {
        console.error('Failed to enter directory:', error);
        throw error; // Only throw if we can't enter the directory
      }

      // Convert file to buffer and create a stream
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Create a stream from buffer using Node's built-in stream constructor
      const { Readable } = require('stream');
      const stream = new Readable();
      stream.push(buffer);
      stream.push(null);  // Signal the end of the stream
      
      // Upload using the stream
      await client.uploadFrom(stream, file.name);
      

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
        console.error('FTP Error:', {
          message: ftpError instanceof Error ? ftpError.message : 'Unknown error',
          name: ftpError instanceof Error ? ftpError.name : 'Unknown',
          stack: ftpError instanceof Error ? ftpError.stack : undefined,
          error: ftpError // Log the raw error object
        });
        
        return NextResponse.json(
          { error: 'Failed to upload file to server' },
          { status: 500 }
        );
    } finally {
      client.close();
    }

  } catch (error) {
    console.error('Server Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
      error: error // Log the raw error object
    });

    return NextResponse.json(
      { error: 'Server error during upload' },
      { status: 500 }
    );
  }
}