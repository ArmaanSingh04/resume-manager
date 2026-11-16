"use server";

const SYSTEM_PROMPT = `You are an expert ATS reviewer and technical recruiter.

Analyze the provided resume. If a job description is also provided, evaluate the resume against that job description.

Return ONLY valid JSON.

{
"overallScore": 0,

"scores": {
"ats": 0,
"experience": 0,
"projects": 0,
"skills": 0,
"readability": 0
},

"summary": {
"candidateLevel": "",
"primaryDomain": "",
"assessment": ""
},

"skills": {
"detected": [],
"strongest": [],
"missing": []
},

"atsAnalysis": {
"detectedSections": [],
"missingSections": [],
"issues": []
},

"jobMatch": {
"provided": false,
"matchScore": 0,
"matchedKeywords": [],
"missingKeywords": [],
"assessment": ""
},

"strengths": [],

"weaknesses": [],

"recommendations": [
{
"priority": "high",
"title": "",
"description": ""
}
],

"recruiterPerspective": {
"wouldInterview": true,
"reason": ""
}
}

Rules:

* All scores must be integers from 0-100.
* If no job description is provided:

  * Set jobMatch.provided to false.
  * Leave jobMatch fields empty or 0.
* If a job description is provided:

  * Set jobMatch.provided to true.
  * Compare the resume against the job requirements.
  * Identify matched and missing skills/keywords.
* Be realistic and strict.
* Return ONLY valid JSON.
* Do not include markdown or explanations.`;

// Server Actions must return errors instead of throwing them: in production
// Next.js replaces a thrown error's message with a generic digest notice.
export type ResumeAnalysisResult =
  | { ok: true; extractedText: string; jobDescription: string; analysis: unknown }
  | { ok: false; error: string };

async function extractPdfText(buffer: Buffer): Promise<string> {
  // Import order matters. pdf-parse/worker polyfills DOMMatrix, ImageData and
  // Path2D from @napi-rs/canvas, and pdfjs uses DOMMatrix as soon as pdf-parse
  // loads. pdfjs would otherwise load canvas and its worker through dynamic
  // requires that Vercel's file tracer can't follow, so neither gets deployed.
  const { CanvasFactory, getData } = await import("pdf-parse/worker");
  const { PDFParse } = await import("pdf-parse");

  // Load the worker from an inline data: URL so no worker file is needed on disk.
  PDFParse.setWorker(getData());

  const parser = new PDFParse({ data: buffer, CanvasFactory });
  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
}

export async function extractResumeText(formData: FormData): Promise<ResumeAnalysisResult> {
  const file = formData.get("file") as File | null;
  const jobDescription = formData.get("jobDescription") as string || "";

  if (!file) {
    return { ok: false, error: "No file uploaded." };
  }

  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return { ok: false, error: "Only PDF files are supported. Please upload a PDF file." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  let extractedText = "";

  try {
    extractedText = await extractPdfText(buffer);
  } catch (err: any) {
    console.error("Error parsing PDF file:", err);
    return { ok: false, error: `Failed to read the PDF: ${err?.message || String(err)}` };
  }

  if (!extractedText.trim()) {
    return {
      ok: false,
      error: "No text could be found in this PDF. Scanned or image-only resumes aren't supported.",
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OPENAI_API_KEY is not set for this deployment.");
    return { ok: false, error: "AI analysis is not configured on the server (OPENAI_API_KEY is missing)." };
  }

  let analysis: unknown = {};

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: `Resume Text:\n\n${extractedText}\n\nJob Description (if any):\n\n${jobDescription || "Not provided."}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI API call failed:", response.status, errText);
      return {
        ok: false,
        error: `AI analysis request failed (${response.status} ${response.statusText}).`,
      };
    }

    const resJson = await response.json();
    const rawContent = resJson.choices[0].message.content;
    analysis = JSON.parse(rawContent);
  } catch (err: any) {
    console.error("Error calling OpenAI API:", err);
    return { ok: false, error: `Failed to analyze resume: ${err?.message || String(err)}` };
  }

  return {
    ok: true,
    extractedText,
    jobDescription,
    analysis,
  };
}
