'use client';

import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import FileUpload from './FileUpload';
import FileList from './FileList';
import UploadComplete from './UploadComplete';

interface UploadContentProps {
  submissionId: string;
}

export default function UploadContent({ submissionId }: UploadContentProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    setUploading(true);
    
    try {
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file, index) => {
          formData.append(`file-${index}`, file);
        });
        formData.append('submissionId', submissionId);

        const response = await fetch('/api/upload-files', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          setUploadComplete(true);
          toast.success('Submission completed successfully!');
        } else {
          toast.error('Failed to upload files. Please try again.');
        }
      } else {
        // No files uploaded, just mark as complete
        setUploadComplete(true);
        toast.success('Submission completed successfully!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to complete submission. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (uploadComplete) {
    return <UploadComplete />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Last Step</h1>
            <div className="text-gray-600 space-y-2">
              <p>
              Upload photos of your <span className="text-black font-semibold">current bathroom or kitchen</span>, include <span className="text-black font-semibold">floorplans</span> if available, and add any <span className="text-black font-semibold">Pinterest inspiration</span> you love, and write a note with anything you'd like us to consider in the design.
              </p>
              <p className="text-sm text-gray-500 mt-4">
                You don't have to do this now. You can save this link and upload later.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <FileUpload 
              fileInputRef={fileInputRef}
              onFileSelect={handleFileSelect}
            />

            {files.length > 0 && (
              <FileList 
                files={files}
                onRemoveFile={removeFile}
              />
            )}

            {/* Submit Button */}
            <div className="text-center">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full bg-sky-600 text-white py-3 px-6 rounded-lg hover:bg-sky-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}