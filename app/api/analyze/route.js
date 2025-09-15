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

    // Validate file type (for now, only text files)
    if (file.type !== 'text/plain') {
      return NextResponse.json(
        { error: 'Only .txt files are supported currently. PDF support coming soon!' },
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

    // AI analysis
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert contract analyzer. Analyze the contract and return a JSON object with these exact keys:

- payment_terms: Detailed analysis of payment schedules, methods, and penalties
- liability: Analysis of liability clauses, limitations, and responsibilities  
- termination: Termination conditions, notice periods, and consequences
- insurance: Insurance requirements and coverage details
- key_risks: Array of 3-5 major risks identified
- recommendations: Array of 3-5 actionable recommendations
- overall_risk: One of "Low", "Medium", or "High"
- risk_score: Number from 1-100 (higher = more risky)
- contract_type: Detected type of contract (e.g., "Service Agreement", "NDA", etc.)

Provide specific, actionable insights. If a section is not present in the contract, state "Not specified in contract" rather than making assumptions.`
        },
        { 
          role: "user", 
          content: `Please analyze this contract:\n\n${text.substring(0, 20000)}` // Limit to avoid token limits
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(completion.choices[0].message.content);
    
    // Validate the response has required fields
    const requiredFields = ['payment_terms', 'liability', 'termination', 'insurance', 'overall_risk'];
    const missingFields = requiredFields.filter(field => !result[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`AI response missing required fields: ${missingFields.join(', ')}`);
    }

    // Add metadata
    result.analyzed_at = new Date().toISOString();
    result.file_name = file.name;
    result.file_size = file.size;
    result.text_length = text.length;

    return NextResponse.json(result);

  } catch (error) {
    console.error("Error in analyze route:", error);
    
    // Return appropriate error message
    if (error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'OpenAI service temporarily unavailable' },
        { status: 503 }
      );
    }
    
    if (error.message.includes('rate limit')) {
      return NextResponse.json(
        { error: 'Service is busy. Please try again in a moment.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to analyze contract. Please try again.' },
      { status: 500 }
    );
  }
}
