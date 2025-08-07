import { RefObject } from 'react';

interface FileUploadProps {
  fileInputRef: RefObject<HTMLInputElement>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FileUpload({ fileInputRef, onFileSelect }: FileUploadProps) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-sky-400 transition-colors">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf"
        onChange={onFileSelect}
        className="hidden"
      />
      <div className="space-y-4">
        <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition-colors font-semibold"
          >
            Choose Files
          </button>
          <p className="text-sm text-gray-500 mt-2">
            or drag and drop images here
          </p>
        </div>
        <p className="text-xs text-gray-400">
          Supported formats: JPG, PNG, PDF (Max 10MB per file)
        </p>
      </div>
    </div>
  );
}