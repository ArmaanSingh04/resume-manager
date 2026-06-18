"use client";

import { useEffect, useRef } from "react";
import { recordResumeVisit } from "@/actions/recordResumeVisit";

interface ResumeTrackerProps {
  fileId: number;
}

export default function ResumeTracker({ fileId }: ResumeTrackerProps) {
  const isRecorded = useRef(false);

  useEffect(() => {
    if (isRecorded.current) return;
    isRecorded.current = true;

    async function trackVisit() {
      try {
        await recordResumeVisit(fileId);
      } catch (err) {
        console.error("Error tracking resume visit:", err);
      }
    }

    trackVisit();
  }, [fileId]);

  return null;
}
