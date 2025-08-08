'use client';

import { useState, useRef, useEffect } from 'react';

interface ExistingFile {
  name: string;
  size: number;
  modifiedAt: Date;
  type: 'file' | 'directory';
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

interface UploadContentProps {
  submissionId: string;
  existingFiles: ExistingFile[];
  initialNotes: string;
}

export default function UploadContent({ submissionId, existingFiles, initialNotes }: UploadContentProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [notes, setNotes] = useState(initialNotes);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deletedFiles, setDeletedFiles] = useState<Set<string>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'existing' | 'queue', item: any } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle escape key to close delete confirmation
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && deleteConfirm) {
        setDeleteConfirm(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [deleteConfirm]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      
      // Add all files as pending first
      const newUploadingFiles = selectedFiles.map(file => ({
        file,
        progress: 0,
        status: 'pending' as const
      }));
      
      setUploadingFiles(prev => [...prev, ...newUploadingFiles]);
      
      // Start processing the queue
      processUploadQueue();
      
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const processUploadQueue = () => {
    if (isUploading) return; // Already processing
    
    setIsUploading(true);
    
    // Process files one by one
    const processNext = () => {
      setUploadingFiles(prev => {
        const pendingFile = prev.find(uf => uf.status === 'pending');
        
        if (!pendingFile) {
          setIsUploading(false);
          return prev; // No more pending files
        }
        
        // Mark as uploading and start upload
        const updated = prev.map(uf => 
          uf === pendingFile 
            ? { ...uf, status: 'uploading' as const }
            : uf
        );
        
        // Upload the file
        uploadFile(pendingFile.file, pendingFile)
          .then(() => {
            // Continue to next file after success
            setTimeout(processNext, 100);
          })
          .catch((error) => {
            console.error('Upload error in queue:', error);
            // Continue to next file even after error
            setTimeout(processNext, 100);
          });
        
        return updated;
      });
    };
    
    processNext();
  };

  const showDeleteConfirm = (type: 'existing' | 'queue', item: any) => {
    setDeleteConfirm({ type, item });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm || isDeleting) return;
    
    setIsDeleting(true);
    
    try {
      if (deleteConfirm.type === 'existing') {
        // Call API to delete file from FTP server
        const response = await fetch(`/api/delete-file?fileName=${encodeURIComponent(deleteConfirm.item)}&submissionId=${encodeURIComponent(submissionId)}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Delete failed' }));
          throw new Error(errorData.error || 'Failed to delete file');
        }

        console.log('File deleted from FTP server successfully');
        
        // Remove from frontend display - no reload needed
        setDeletedFiles(prev => new Set([...prev, deleteConfirm.item]));
      } else if (deleteConfirm.type === 'queue') {
        // Just remove from queue (no FTP call needed for pending uploads)
        setUploadingFiles(prev => prev.filter(uf => uf !== deleteConfirm.item));
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const saveNotes = async () => {
    if (isSavingNotes) return;
    
    setIsSavingNotes(true);
    
    try {
      const response = await fetch('/api/save-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissionId,
          notes
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save notes');
      }

      console.log('Notes saved successfully');
      // Could add a success message here if needed
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Failed to save notes. Please try again.');
    } finally {
      setIsSavingNotes(false);
    }
  };

  const uploadFile = async (file: File, uploadingFile: UploadingFile) => {
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('submissionId', submissionId);

      const response = await fetch('/api/upload-file', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errorData.error || `Upload failed (${response.status})`);
      }

      // Parse the success response
      const result = await response.json();

      // Handle success - just refresh to show new files
      if (result.success) {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        // If no success flag, just mark as completed in queue
        setUploadingFiles(prev => 
          prev.map(uf => 
            uf === uploadingFile 
              ? { ...uf, progress: 100, status: 'completed' as const }
              : uf
          )
        );
      }

    } catch (error) {
      console.error('Upload error:', error);
      
      let errorMessage = 'Upload failed';
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Upload timed out (30s)';
        } else {
          errorMessage = error.message;
        }
      }
      
      // Update status to error
      setUploadingFiles(prev => 
        prev.map(uf => 
          uf === uploadingFile 
            ? { ...uf, status: 'error' as const, error: errorMessage }
            : uf
        )
      );
    } finally {
      // Always clear the timeout
      clearTimeout(timeoutId);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImageFile = (fileName: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
  };

  const handleDownloadAll = async () => {
    if (existingFiles.length === 0) return;
    
    setIsDownloading(true);
    
    try {
      // Use the PHP script on your storage server to create and download zip
      const downloadUrl = `https://ppc-img.breakproject.com/download-files.php?folder=${submissionId}`;
      
      // Create a temporary link to trigger download
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = downloadUrl;
      a.download = `${submissionId}-files.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('Error downloading zip file:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Files & Notes</h1>
            <div className="text-gray-600 space-y-2">
              <p>
                Upload photos of your <span className="text-black font-semibold">current bathroom or kitchen</span>, include <span className="text-black font-semibold">floorplans</span> if available, and add any <span className="text-black font-semibold">Pinterest inspiration</span> you love.
              </p>
              <p className="text-sm text-gray-500 mt-4">
                You can come back and update these anytime using this link.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Existing Files from FTP */}
            {existingFiles.filter(file => !deletedFiles.has(file.name)).length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Uploaded Files ({existingFiles.filter(file => !deletedFiles.has(file.name)).length})</h3>
                  <button
                    onClick={handleDownloadAll}
                    disabled={isDownloading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDownloading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Creating Zip...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Download All</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="space-y-2">
                  {existingFiles.filter(file => !deletedFiles.has(file.name)).map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-3">
                        {isImageFile(file.name) ? (
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-blue-200">
                            <img
                              src={`http://ppc-img.breakproject.com/${submissionId}/${file.name}`}
                              alt={file.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to file icon if image fails to load
                                e.currentTarget.style.display = 'none';
                                const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                if (nextElement) {
                                  nextElement.style.display = 'flex';
                                }
                              }}
                            />
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center" style={{ display: 'none' }}>
                              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(file.size)} • {file.modifiedAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <a
                          href={`http://ppc-img.breakproject.com/${submissionId}/${file.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm font-medium hover:text-blue-800 hover:underline transition-colors"
                        >
                          View
                        </a>
                        <button
                          onClick={() => showDeleteConfirm('existing', file.name)}
                          className="text-red-500 hover:text-red-700 p-1 transition-colors"
                          title="Delete file"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* File Upload Button */}
            <div className="text-center">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-sky-600 text-white px-8 py-3 rounded-lg hover:bg-sky-700 transition-colors font-semibold text-lg flex items-center space-x-2 mx-auto"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Choose Files to Upload</span>
              </button>
              <p className="text-sm text-gray-500 mt-3">
                Supported formats: JPG, PNG, PDF (Max 10MB per file)
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Files will upload immediately after selection
              </p>
            </div>

            {/* Upload Queue */}
            {uploadingFiles.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">
                  Upload Queue ({uploadingFiles.length}) 
                  {uploadingFiles.some(uf => uf.status === 'pending') && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      • {uploadingFiles.filter(uf => uf.status === 'pending').length} pending
                    </span>
                  )}
                </h3>
                <div className="space-y-2">
                  {uploadingFiles.map((uploadingFile, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            uploadingFile.status === 'completed' ? 'bg-green-100' :
                            uploadingFile.status === 'error' ? 'bg-red-100' :
                            uploadingFile.status === 'uploading' ? 'bg-sky-100' : 'bg-gray-100'
                          }`}>
                            {uploadingFile.status === 'completed' ? (
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : uploadingFile.status === 'error' ? (
                              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            ) : uploadingFile.status === 'uploading' ? (
                              <svg className="w-5 h-5 text-sky-600 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 truncate max-w-xs">{uploadingFile.file.name}</p>
                            <p className="text-sm text-gray-500">{formatFileSize(uploadingFile.file.size)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            {uploadingFile.status === 'completed' && (
                              <span className="text-sm font-medium text-green-600">Uploaded</span>
                            )}
                            {uploadingFile.status === 'error' && (
                              <span className="text-sm font-medium text-red-600">Error</span>
                            )}
                            {uploadingFile.status === 'uploading' && (
                              <span className="text-sm font-medium text-sky-600">Uploading...</span>
                            )}
                            {uploadingFile.status === 'pending' && (
                              <span className="text-sm font-medium text-gray-500">Pending</span>
                            )}
                          </div>
                          {uploadingFile.status !== 'uploading' && (
                            <button
                              onClick={() => showDeleteConfirm('queue', uploadingFile)}
                              className="text-red-500 hover:text-red-700 p-1 transition-colors"
                              title="Remove from queue"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                      {uploadingFile.status === 'error' && uploadingFile.error && (
                        <p className="text-sm text-red-600 mt-1">{uploadingFile.error}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Confirm Delete</h3>
                      <p className="text-sm text-gray-500">This action cannot be undone</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-gray-700">
                      Are you sure you want to delete{' '}
                      <span className="font-medium">
                        {deleteConfirm.type === 'existing' 
                          ? deleteConfirm.item 
                          : deleteConfirm.item.file.name}
                      </span>
                      ?
                    </p>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={cancelDelete}
                      disabled={isDeleting}
                      className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDelete}
                      disabled={isDeleting}
                      className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {isDeleting ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <span>Delete</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Separator Line */}
            <hr className="border-gray-200 my-8" />

            {/* Notes Section */}
            <div className="space-y-3">
              <label htmlFor="notes" className="block font-semibold text-gray-900">
                Design Notes & Preferences
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tell us about your design preferences, style inspirations, must-haves, or anything else you'd like us to consider..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-vertical min-h-[120px]"
                rows={5}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Share your vision, style preferences, color choices, or any specific requirements.
                </p>
                <button
                  onClick={saveNotes}
                  disabled={isSavingNotes}
                  className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSavingNotes ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Notes</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}