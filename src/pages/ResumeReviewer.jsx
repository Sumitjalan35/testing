import { useState } from 'react';
import apiService from '../services/api';

function ResumeReviewer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (useSample = false) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await apiService.reviewCV(useSample ? null : file);
      setResult(data);
    } catch (e) {
      setError(e.message || 'Failed to review resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 lg:p-10">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-6 lg:p-8 border border-gray-200">
        <h1 className="text-2xl lg:text-3xl font-bold text-secondary-800 mb-2">Resume Reviewer</h1>
        <p className="text-secondary-600 mb-6">Upload a PDF resume to get AI-powered feedback, or use the sample PDF.</p>

        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full md:w-auto"
          />
          <div className="flex gap-3">
            <button
              disabled={loading || !file}
              onClick={() => handleSubmit(false)}
              className={`btn-primary ${(!file || loading) ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Analyzing…' : 'Review Uploaded PDF'}
            </button>
            <button
              disabled={loading}
              onClick={() => handleSubmit(true)}
              className={`px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Analyzing…' : 'Use Sample PDF'}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 mb-4">{error}</div>
        )}

        {result && (
          <div className="mt-6">
            <div className="text-sm text-secondary-600 mb-2">
              File: <span className="font-medium text-secondary-800">{result.filename || 'sample.pdf'}</span>
              {typeof result.text_length === 'number' && (
                <span className="ml-3">Extracted: {result.text_length} chars</span>
              )}
            </div>
            <div className="prose max-w-none whitespace-pre-wrap leading-relaxed bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
              {result.review}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeReviewer;


