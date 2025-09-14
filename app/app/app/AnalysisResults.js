"use client";

export default function AnalysisResults({ result }) {
  if (!result) return null;

  const getRiskColor = (risk) => {
    const colors = {
      Low: "text-green-700 bg-green-100",
      Medium: "text-yellow-700 bg-yellow-100", 
      High: "text-red-700 bg-red-100",
    };
    return colors[risk] || "text-gray-700 bg-gray-100";
  };

  const getRiskBarColor = (risk) => {
    const colors = {
      Low: "bg-green-500",
      Medium: "bg-yellow-500",
      High: "bg-red-500",
    };
    return colors[risk] || "bg-gray-500";
  };

  const getRiskWidth = (risk) => {
    const widths = {
      Low: "30%",
      Medium: "60%",
      High: "90%",
    };
    return widths[risk] || "50%";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Contract Analysis Complete</h2>
            <p className="text-blue-100 mt-1">
              {result.contract_type || 'Contract'} Analysis
            </p>
          </div>
          <div className="text-right">
            <div className={`inline-block px-4 py-2 rounded-full font-bold ${getRiskColor(result.overall_risk)}`}>
              {result.overall_risk} Risk
            </div>
            {result.risk_score && (
              <p className="text-blue-100 text-sm mt-1">
                Score: {result.risk_score}/100
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Overall Risk Assessment</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Risk Level</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getRiskColor(result.overall_risk)}`}>
                  {result.overall_risk}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ${getRiskBarColor(result.overall_risk)}`}
                  style={{ width: getRiskWidth(result.overall_risk) }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">💵 Payment Terms</h3>
            <p className="text-blue-800 text-sm">{result.payment_terms}</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="font-semibold text-orange-900 mb-2">⚖️ Liability</h3>
            <p className="text-orange-800 text-sm">{result.liability}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-900 mb-2">🛑 Termination</h3>
            <p className="text-red-800 text-sm">{result.termination}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">🛡️ Insurance</h3>
            <p className="text-green-800 text-sm">{result.insurance}</p>
          </div>
        </div>

        {result.key_risks && result.key_risks.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-red-900 mb-4">🚨 Key Risks Identified</h3>
            <ul className="space-y-2">
              {result.key_risks.map((risk, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span className="text-red-800 text-s
