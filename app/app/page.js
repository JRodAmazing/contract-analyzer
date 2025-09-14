"use client";
import { useState } from "react";
import AnalysisResults from "./AnalysisResults";

export default function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
    setError(null);
    setResult(null);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to analyze");
      return;
    }

    const formData = new FormData();
    formData.append("contract", file);

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Server error: ${res.status}`);
      }

      setResult(data);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to analyze contract. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          📑 Contract Analyzer
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Upload your contract and get instant AI-powered analysis of risks, 
          terms, and recommendations.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <form onSubmit={handleUpload} className="space-y-6">
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="contract-file"
              accept=".txt,.doc,.docx,.pdf"
              onChange={(e) => handleFileChange(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="space-y-4">
              <div className="text-6xl">📄</div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Drop your contract here or click to browse
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Supports .txt files up to 10MB (PDF support coming soon)
                </p>
              </div>
            </div>
          </div>

          {file && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-900">{file.name}</p>
                  <p className="text-sm text-blue-700">
                    {formatFileSize(file.size)} • {file.type}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="text-red-400 mr-3">⚠️</div>
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!file || loading}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
              !file || loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Analyzing Contract...
              </div>
            ) : (
              "Analyze Contract"
            )}
          </button>
        </form>
      </div>

      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="text-center">
            <div className="animate-pulse text-blue-600 mb-2">🤖</div>
            <p className="text-blue-800 font-medium">
              AI is carefully reviewing your contract...
            </p>
            <p className="text-blue-600 text-sm mt-1">
              This typically takes 10-30 seconds
            </p>
          </div>
        </div>
      )}

      {result && <AnalysisResults result={result} />}
    </div>
  );
}
