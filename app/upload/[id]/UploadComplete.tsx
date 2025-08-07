export default function UploadComplete() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload Complete!</h1>
        <p className="text-gray-600 mb-6">
          Thank you! Your files have been uploaded successfully. We'll review them and get back to you soon.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="w-full bg-sky-600 text-white py-3 px-6 rounded-lg hover:bg-sky-700 transition-colors font-semibold"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}