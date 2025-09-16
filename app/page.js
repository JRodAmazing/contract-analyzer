'use client';
import React, { useState, useRef } from 'react';
import { AlertTriangle, FileText, Download, Shield, Clock, DollarSign, Users, CheckCircle, XCircle, AlertCircle, Zap, Target } from 'lucide-react';

export default function ContractGuardPro() {
  const [currentView, setCurrentView] = useState('upload');
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
    setError(null);
    setCurrentView('upload');
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
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const result = await response.json();
      setAnalysis(result);
      setCurrentView('results');
    } catch (err) {
      setError(`Failed to analyze contract: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (format) => {
    if (!analysis) return;
    
    const reportContent = `
CONSTRUCTION CONTRACT ANALYSIS REPORT
=====================================

CONTRACT TYPE: ${analysis.contract_type || 'Unknown'}
OVERALL RISK: ${analysis.overall_risk || 'Unknown'}
CONTRACTOR PROTECTION SCORE: ${analysis.contractor_protection_score || 'N/A'}/100

CRITICAL FINDINGS:
${(analysis.critical_findings || []).map(f => 
  `• ${f.category}: ${f.finding}\n  Impact: ${f.impact}\n  Action: ${f.action}\n`
).join('\n')}

FIELD TEAM ALERTS:
${(analysis.field_team_alerts || []).map(alert => `• ${alert}`).join('\n')}

RECOMMENDATIONS:
${(analysis.recommendations || []).map(rec => `• ${rec}`).join('\n')}

Generated: ${new Date().toLocaleString()}
    `.trim();
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contract-analysis-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';  
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskIcon = (risk) => {
    switch(risk) {
      case 'High': return <XCircle className="w-5 h-5" />;
      case 'Medium': return <AlertCircle className="w-5 h-5" />;
      case 'Low': return <CheckCircle className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">ContractGuard Pro</h1>
                <p className="text-blue-200 text-sm">AI-Powered Construction Contract Protection</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-200">Industry Standards First</div>
              <div className="text-xs">Contractor Business Protection</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Value Proposition Banner */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-4">
            <Target className="w-8 h-8 text-green-600 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Built Different: Industry Standards, Not Legal Jargon
              </h2>
              <p className="text-gray-700">
                While other AI tools focus on learning contract language, we focus on construction industry benchmarks 
                and protecting your contractor business. Get enterprise-level contract intelligence in 60 seconds.
              </p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        {currentView === 'upload' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">30-60s</div>
                <div className="text-sm text-gray-600">Analysis Time</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">Industry</div>
                <div className="text-sm text-gray-600">Standards Focus</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">Field Team</div>
                <div className="text-sm text-gray-600">Ready Outputs</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <Download className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">Instant</div>
                <div className="text-sm text-gray-600">Export Ready</div>
              </div>
            </div>

            {/* File Upload */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-semibold mb-6 text-center">Upload Your Construction Contract</h2>
              
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-xl font-medium text-gray-700">
                    Drop your contract here or click to browse
                  </p>
                  <p className="text-gray-500">
                    Supports: TXT files • Max 10MB
                  </p>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  className="hidden"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Choose File
                </button>
              </div>

              {file && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">{file.name}</span>
                      <span className="text-sm text-green-600">
                        ({(file.size / 1024).toFixed(2)} KB)
                      </span>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              <div className="mt-8 text-center">
                <button
                  onClick={handleAnalyze}
                  disabled={!file || loading}
                  className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
                >
                  {loading ? 'Analyzing Contract...' : 'Analyze Contract →'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {currentView === 'results' && analysis && (
          <div className="space-y-8">
            {/* Header with Actions */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentView('upload')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Analyze Another Contract
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={() => exportReport('txt')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Report</span>
                </button>
              </div>
            </div>

            {/* Contractor Protection Score */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">Contractor Protection Score</h2>
                <div className="text-6xl font-bold mb-2 text-blue-600">
                  {analysis.contractor_protection_score || 'N/A'}
                </div>
                <div className="text-gray-600">
                  Overall Risk Level: <span className="font-semibold">{analysis.overall_risk || 'Unknown'}</span>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Contract Type: {analysis.contract_type || 'Unknown'}
                </div>
              </div>
            </div>

            {/* Risk Breakdown */}
            {analysis.risk_breakdown && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(analysis.risk_breakdown).map(([category, risk]) => (
                  <div key={category} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium capitalize">{category.replace('_', ' ')}</h3>
                      {getRiskIcon(risk)}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(risk)}`}>
                      {risk} Risk
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Critical Findings */}
            {analysis.critical_findings && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span>Critical Findings</span>
                </h2>
                <div className="space-y-4">
                  {analysis.critical_findings.map((finding, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{finding.category}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(finding.risk_level)}`}>
                          {finding.risk_level}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2"><strong>Finding:</strong> {finding.finding}</p>
                      <p className="text-gray-700 mb-2"><strong>Impact:</strong> {finding.impact}</p>
                      <p className="text-green-700"><strong>Recommended Action:</strong> {finding.action}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Field Team Alerts */}
            {analysis.field_team_alerts && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2 text-yellow-800">
                  <Users className="w-5 h-5" />
                  <span>Field Team Alerts</span>
                </h2>
                <div className="space-y-2">
                  {analysis.field_team_alerts.map((alert, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-yellow-800">{alert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Industry Benchmarks */}
            {analysis.industry_benchmarks && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2 text-blue-800">
                  <Target className="w-5 h-5" />
                  <span>Industry Benchmarks</span>
                </h2>
                <div className="space-y-3">
                  {Object.entries(analysis.industry_benchmarks).map(([key, benchmark]) => (
                    <div key={key} className="bg-white rounded-lg p-3 border border-blue-200">
                      <h4 className="font-medium text-blue-900 capitalize mb-1">{key.replace('_', ' ')}</h4>
                      <p className="text-blue-800 text-sm">{benchmark}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  <span>Recommended Actions</span>
                </h2>
                <div className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-green-800">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
