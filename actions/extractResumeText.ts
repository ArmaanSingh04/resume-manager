"use server";

import { PDFParse } from "pdf-parse";

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

export async function extractResumeText(formData: FormData) {
  const file = formData.get("file") as File | null;
  const jobDescription = formData.get("jobDescription") as string || "";

  if (!file) {
    throw new Error("No file uploaded");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  let extractedText = "";

  if (file.name.endsWith(".pdf")) {
    try {
      const parser = new PDFParse({ data: buffer });
      const textResult = await parser.getText();
      extractedText = textResult.text;
    } catch (err: any) {
      console.error("Error parsing PDF file:", err);
      throw new Error(`Failed to parse PDF: ${err.message}`);
    }
  } else {
    // Fallback to text parsing for txt/md/etc.
    extractedText = buffer.toString("utf-8");
  }

  // Verify API Key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured in the environment variables (.env file).");
  }

  let analysis = {};

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
      console.error("OpenAI API call failed:", errText);
      throw new Error(`OpenAI API request failed: ${response.statusText} (${errText})`);
    }

    const resJson = await response.json();
    const rawContent = resJson.choices[0].message.content;
    analysis = JSON.parse(rawContent);
  } catch (err: any) {
    console.error("Error calling OpenAI API:", err);
    throw new Error(`Failed to analyze resume via OpenAI: ${err.message}`);
  }

  // Print the extracted text and the job description in the server console
  console.log("=========================================");
  console.log("EXTRACTED RESUME TEXT (from server action):");
  console.log(extractedText);
  console.log("=========================================");
  console.log("JOB DESCRIPTION (from server action):");
  console.log(jobDescription);
  console.log("=========================================");
  console.log("OPENAI ANALYSIS RESPONSE:");
  console.log(JSON.stringify(analysis, null, 2));
  console.log("=========================================");

  return {
    extractedText,
    jobDescription,
    analysis,
  };
}
