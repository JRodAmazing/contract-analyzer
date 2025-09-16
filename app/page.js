'use client';
import React, { useState, useRef } from 'react';
import { AlertTriangle, FileText, Download, Shield, Users, CheckCircle, XCircle, AlertCircle, Zap, Target } from 'lucide-react';

export default function ContractGuardPro() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
    setError(null);
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

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select a contract file");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('contract', file);
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Analysis failed: ${response.status}`);
      }

      const result = await response.json();
      setAnalysis(result);
    } catch (err) {
      setError(`Failed to analyze contract: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#1e3a8a", color: "white", padding: "1rem 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Shield style={{ width: "32px", height: "32px" }} />
              <div>
                <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>ContractGuard Pro</h1>
                <p style={{ fontSize: "0.875rem", color: "#93c5fd", margin: 0 }}>Construction Contract Protection</p>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.875rem", color: "#93c5fd" }}>Industry Standards First</div>
              <div style={{ fontSize: "0.75rem" }}>Contractor Business Protection</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Value Proposition */}
        <div style={{ 
          background: "linear-gradient(to right, #f0fdf4, #eff6ff)", 
          border: "1px solid #bbf7d0", 
          borderRadius: "8px", 
          padding: "1.5rem", 
          marginBottom: "2rem",
          display: "flex",
          gap: "1rem"
        }}>
          <Target style={{ width: "32px", height: "32px", color: "#16a34a", marginTop: "0.25rem", flexShrink: 0 }} />
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#111827", marginBottom: "0.5rem" }}>
              Built Different: Industry Standards, Not Legal Jargon
            </h2>
            <p style={{ color: "#374151", margin: 0 }}>
              While other AI tools focus on learning contract language, we focus on construction industry benchmarks 
              and protecting your contractor business. Get enterprise-level contract intelligence in 60 seconds.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "1rem", 
          marginBottom: "2rem" 
        }}>
          {[
            { icon: Zap, title: "30-60s", subtitle: "Analysis Time", color: "#2563eb" },
            { icon: Shield, title: "Industry", subtitle: "Standards Focus", color: "#16a34a" },
            { icon: Users, title: "Field Team", subtitle: "Ready Outputs", color: "#9333ea" },
            { icon: Download, title: "Instant", subtitle: "Export Ready", color: "#ea580c" }
          ].map(({ icon: Icon, title, subtitle, color }, index) => (
            <div key={index} style={{ 
              backgroundColor: "white", 
              padding: "1rem", 
              borderRadius: "8px", 
              border: "1px solid #e5e7eb", 
              textAlign: "center" 
            }}>
              <Icon style={{ width: "32px", height: "32px", color, margin: "0 auto 0.5rem" }} />
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827" }}>{title}</div>
              <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>{subtitle}</div>
            </div>
          ))}
        </div>

        {/* Main Upload Section */}
        <div style={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #e5e7eb", padding: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600", textAlign: "center", marginBottom: "1.5rem" }}>
            Upload Your Construction Contract
          </h2>
          
          <div
            style={{
              border: `2px dashed ${dragActive ? "#3b82f6" : "#d1d5db"}`,
              backgroundColor: dragActive ? "#eff6ff" : "transparent",
              borderRadius: "8px",
              padding: "3rem",
              textAlign: "center",
              transition: "all 0.2s",
              cursor: "pointer"
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <FileText style={{ width: "64px", height: "64px", color: "#9ca3af", margin: "0 auto 1rem" }} />
            <div style={{ marginBottom: "0.5rem" }}>
              <p style={{ fontSize: "1.25rem", fontWeight: "500", color: "#374151", margin: 0 }}>
                Drop your contract here or click to browse
              </p>
            </div>
            <p style={{ color: "#6b7280", margin: 0 }}>
              Supports: TXT files • Max 10MB
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt"
              onChange={(e) => handleFileChange(e.target.files[0])}
              style={{ display: "none" }}
            />
            
            <button
              style={{
                marginTop: "1.5rem",
                padding: "0.75rem 1.5rem",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "500",
                cursor: "pointer"
              }}
            >
              Choose File
            </button>
          </div>

          {file && (
            <div style={{ 
              marginTop: "1.5rem", 
              padding: "1rem", 
              backgroundColor: "#f0fdf4", 
              border: "1px solid #bbf7d0", 
              borderRadius: "8px" 
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <FileText style={{ width: "20px", height: "20px", color: "#16a34a" }} />
                  <span style={{ fontWeight: "500", color: "#166534" }}>{file.name}</span>
                  <span style={{ fontSize: "0.875rem", color: "#16a34a" }}>
                    ({(file.size / 1024).toFixed(2)} KB)
                  </span>
                </div>
                <button
                  onClick={() => setFile(null)}
                  style={{ color: "#dc2626", background: "none", border: "none", cursor: "pointer" }}
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {error && (
            <div style={{ 
              marginTop: "1rem", 
              padding: "1rem", 
              backgroundColor: "#fef2f2", 
              border: "1px solid #fecaca", 
              borderRadius: "8px",
              color: "#b91c1c"
            }}>
              {error}
            </div>
          )}

          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <button
              onClick={handleAnalyze}
              disabled={!file || loading}
              style={{
                padding: "1rem 2rem",
                backgroundColor: !file || loading ? "#9ca3af" : "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1.125rem",
