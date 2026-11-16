import AIAnalyzerClient from "@/components/AIAnalyzerClient";

// The resume-analysis Server Action runs inside this page's serverless
// function, and the OpenAI call can take longer than the default timeout.
export const maxDuration = 60;

export default function AIAnalyzerPage() {
  return (
    <AIAnalyzerClient />
  );
}
