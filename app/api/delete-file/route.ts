import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'basic-ftp';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');
    const submissionId = searchParams.get('submissionId');

    if (!fileName || !submissionId) {
      return NextResponse.json(
        { error: 'File name and submission ID are required' },
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
      // Connect to FTP server
      await client.access({
        host: process.env.FTP_HOST!,
        user: process.env.FTP_USERNAME!,
        password: process.env.FTP_PASSWORD!,
        secure: false
      });

      // Navigate to the submission folder
      try {
        await client.cd(submissionId);
      } catch (error) {
        return NextResponse.json(
          { error: 'Submission folder not found' },
          { status: 404 }
        );
      }

      // Delete the file
      await client.remove(fileName);
      

      return NextResponse.json(
        { 
          message: 'File deleted successfully',
          fileName: fileName
        },
        { status: 200 }
      );

    } catch (ftpError) {
      return NextResponse.json(
        { error: 'Failed to delete file from server' },
        { status: 500 }
      );
    } finally {
      client.close();
    }

  } catch (error) {
    return NextResponse.json(
      { error: 'Server error during deletion' },
      { status: 500 }
    );
  }
}