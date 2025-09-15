import OpenAI from "openai";
import { NextResponse } from "next/server";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// File validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request) {
  try {
    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('contract');

    // Validate file exists
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // For now, only handle text files
    if (file.type !== 'text/plain') {
      return NextResponse.json(
        { error: 'Only .txt files are supported currently. PDF and DOC support coming soon!' },
        { status: 400 }
      );
    }

    // Extract text from file
    const text = await file.text();

    // Validate text length
    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        { error: 'Contract text is too short or empty. Please upload a valid contract.' },
        { status: 400 }
      );
    }

    if (text.length > 50000) {
      return NextResponse.json(
        { error: 'Contract is too long. Please upload a contract under 50,000 characters.' },
        { status: 400 }
      );
    }

    // Construction-focused AI analysis
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a construction industry expert who analyzes contracts to protect contractors' business interests. Focus on INDUSTRY STANDARDS and CONTRACTOR PROTECTION, not just legal language.

Return a JSON object with these exact keys:

- contractor_protection_score: Number 1-100 (how well this contract protects the contractor's business)
- overall_risk: "Low", "Medium", or "High" 
- contract_type: Type of construction contract detected
- risk_breakdown: Object with payment_risk, liability_risk, scope_risk, timeline_risk (each "Low", "Medium", or "High")
- critical_findings: Array of 3-5 objects with {category, risk_level, finding, impact, action}
- field_team_alerts: Array of 3-5 specific alerts for field teams/foremen
- industry_benchmarks: Object comparing this contract to construction industry standards
- recommendations: Array of 3-5 specific actions to improve contractor protection

FOCUS ON CONSTRUCTION-SPECIFIC ISSUES:
- Payment terms (pay-when-paid vs pay-if-paid, retention, progress payments)
- Change order procedures and markup allowances
- Indemnification overreach common in construction
- Lien waiver timing and conditions
- Material escalation provisions
- Liquidated damages and penalty clauses
- Insurance requirements vs industry norms
- Subcontractor flow-down provisions
- Safety compliance requirements
- Completion timeline reasonableness

Compare everything to CONSTRUCTION INDUSTRY STANDARDS:
- Standard payment terms (Net 30 is industry norm)
- Typical retention percentages (5-10%)
- Standard change order markups (10-20%)
- Common insurance requirements
- Industry-standard liquidated damages rates

Always prioritize the CONTRACTOR'S BUSINESS PROTECTION over pure legal analysis.`
        },
        { 
          role: "user", 
          content: `Analyze this construction contract focusing on industry standards and contractor protection:\n\n${text}` 
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(completion.choices[0].message.content);
    
    // Add timestamp and metadata
    result.analysis_timestamp = new Date().toISOString();
    result.file_name = file.name;
    result.file_size = file.size;
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error("Error in analyze route:", error);
    
    // Handle specific OpenAI errors
    if (error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'Invalid API key configuration' },
        { status: 500 }
      );
    }
    
    if (error.message.includes('rate limit')) {
      return NextResponse.json(
        { error: 'Service temporarily busy. Please try again in a moment.' },
        { status: 429 }
      );
    }
    
    if (error.message.includes('JSON')) {
      return NextResponse.json(
        { error: 'Analysis formatting error. Please try again.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Analysis failed. Please try again or contact support.' },
      { status: 500 }
    );
  }
}

// GET method for health check
export async function GET() {
  return NextResponse.json({ 
    status: 'healthy',
    service: 'Construction Contract Analyzer API',
    timestamp: new Date().toISOString()
  });
}
