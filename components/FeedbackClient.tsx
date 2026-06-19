"use client";

import { useState } from "react";
import { submitFeedback } from "@/actions/submitFeedback";

interface FeedbackClientProps {
  initialHasFeedback: boolean;
}

export default function FeedbackClient({ initialHasFeedback }: FeedbackClientProps) {
  const [hasFeedback, setHasFeedback] = useState(initialHasFeedback);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [mostUsedFeature, setMostUsedFeature] = useState<string>("");
  const [mostUsedOther, setMostUsedOther] = useState<string>("");
  const [feedbackType, setFeedbackType] = useState<string>("");
  const [comments, setComments] = useState<string>("");
  const [featureRequest, setFeatureRequest] = useState<string>("");
  const [recommend, setRecommend] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Form validations
    if (rating === 0) {
      setValidationError("Please select an experience rating.");
      return;
    }
    if (!mostUsedFeature) {
      setValidationError("Please select your most used feature.");
      return;
    }
    if (mostUsedFeature === "Other" && !mostUsedOther.trim()) {
      setValidationError("Please specify your most used feature.");
      return;
    }
    if (!feedbackType) {
      setValidationError("Please select a feedback type.");
      return;
    }
    if (!comments.trim()) {
      setValidationError("Please enter your feedback comments.");
      return;
    }
    if (!recommend) {
      setValidationError("Please select if you would recommend us.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitFeedback({
        rating,
        mostUsedFeature,
        mostUsedOther: mostUsedFeature === "Other" ? mostUsedOther : undefined,
        feedbackType,
        comments,
        featureRequest: featureRequest.trim() ? featureRequest : undefined,
        recommend,
      });

      // Clear form
      setRating(0);
      setMostUsedFeature("");
      setMostUsedOther("");
      setFeedbackType("");
      setComments("");
      setFeatureRequest("");
      setRecommend("");

      setHasFeedback(true);
    } catch (err: any) {
      setValidationError(err?.message || "Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasFeedback) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8 max-w-md w-full text-center flex flex-col items-center justify-center gap-6 backdrop-blur-md">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/25 shrink-0">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-zinc-100">Thanks for the feedback.</h3>
            <p className="text-zinc-500 text-sm mt-2">
              Your response helps us improve Resume Manager for everyone.
            </p>
          </div>
          <button
            onClick={() => setHasFeedback(false)}
            className="w-full bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 cursor-pointer shadow-lg shadow-orange-950/20"
          >
            Give another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto w-full justify-start py-4">
      {/* Page Header */}
      <div className="mb-6 text-center sm:text-left flex flex-col gap-1.5">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-100 flex items-center justify-center sm:justify-start gap-2.5">
          <svg className="w-7 h-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
          Share Feedback
        </h1>
        <p className="text-zinc-400 text-xs">
          Help us improve Resume Manager. Tell us what you think.
        </p>
      </div>

      <div className="flex-1 flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full bg-zinc-900/10 border border-zinc-850/80 rounded-2xl p-8 sm:p-12 flex flex-col gap-10 backdrop-blur-md"
        >
          {validationError && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-5 py-3.5 rounded-xl text-xs sm:text-sm font-semibold animate-in fade-in duration-200">
              ⚠️ {validationError}
            </div>
          )}

          {/* Rating */}
          <div className="flex flex-col gap-4">
            <span className="text-base sm:text-lg font-bold text-zinc-100 flex items-center gap-2">
              ⭐ Experience Rating
            </span>
            <span className="text-zinc-400 text-xs sm:text-sm -mt-2">
              How would you rate your experience with Resume Manager?
            </span>
            <div className="flex items-center gap-3 mt-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-3xl sm:text-4xl transition-transform duration-100 hover:scale-125 focus:outline-none cursor-pointer"
                  title={`Rate ⭐ ${star}`}
                >
                  <span
                    className={
                      star <= (hoverRating || rating)
                        ? "text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]"
                        : "text-zinc-700 grayscale opacity-30"
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-zinc-800/40" />

          {/* Most Used Feature */}
          <div className="flex flex-col gap-4">
            <span className="text-base sm:text-lg font-bold text-zinc-100 flex items-center gap-2">
              🎯 Most Used Feature
            </span>
            <span className="text-zinc-400 text-xs sm:text-sm -mt-2">Which feature did you use the most?</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-1.5">
              {[
                "Resume Upload & Storage",
                "AI Resume Analysis",
                "Job Description Matching",
                "Resume Sharing Links",
                "Resume Analytics",
                "Resume Viewer",
                "Other",
              ].map((feature) => (
                <label
                  key={feature}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border text-sm cursor-pointer transition-all duration-200 ${
                    mostUsedFeature === feature
                      ? "border-orange-500/80 bg-orange-600/10 text-zinc-100 shadow-md shadow-orange-950/10"
                      : "border-zinc-800 bg-zinc-950/20 text-zinc-400 hover:border-zinc-700/80 hover:text-zinc-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="mostUsedFeature"
                    value={feature}
                    checked={mostUsedFeature === feature}
                    onChange={(e) => setMostUsedFeature(e.target.value)}
                    className="accent-orange-500 cursor-pointer h-4 w-4 shrink-0"
                  />
                  <span className="font-medium">{feature}</span>
                </label>
              ))}
            </div>
          </div>

          {/* If Other is selected, show specify input */}
          {mostUsedFeature === "Other" && (
            <div className="flex flex-col gap-3 animate-in slide-in-from-top-2 duration-200">
              <label htmlFor="most-used-other" className="text-xs sm:text-sm font-semibold text-zinc-400">
                Please specify:
              </label>
              <input
                id="most-used-other"
                type="text"
                value={mostUsedOther}
                onChange={(e) => setMostUsedOther(e.target.value)}
                placeholder="Type the feature name..."
                className="w-full bg-zinc-950/40 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-base focus:border-orange-500/60 outline-none transition-colors placeholder-zinc-700"
              />
            </div>
          )}

          <div className="h-px bg-zinc-800/40" />

          {/* Feedback Type */}
          <div className="flex flex-col gap-4">
            <span className="text-base sm:text-lg font-bold text-zinc-100 flex items-center gap-2">
              💬 Feedback Type
            </span>
            <span className="text-zinc-400 text-xs sm:text-sm -mt-2">What type of feedback are you providing?</span>
            <div className="flex flex-wrap gap-2.5 mt-1.5">
              {["Bug Report", "Feature Request", "General Feedback", "UI/UX Feedback", "Other"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFeedbackType(type)}
                  className={`px-5 py-3 rounded-full border text-sm cursor-pointer transition-all duration-200 ${
                    feedbackType === type
                      ? "border-orange-500/60 bg-orange-600/10 text-orange-400 font-semibold"
                      : "border-zinc-800 bg-zinc-950/20 text-zinc-400 hover:border-zinc-700/80 hover:text-zinc-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-zinc-800/40" />

          {/* Comments */}
          <div className="flex flex-col gap-4">
            <label htmlFor="comments" className="text-base sm:text-lg font-bold text-zinc-100 flex items-center gap-2">
              📝 Feedback
            </label>
            <span className="text-zinc-400 text-xs sm:text-sm -mt-2">Tell us more about your experience.</span>
            <textarea
              id="comments"
              rows={5}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="What did you like?&#10;What frustrated you?&#10;What should we improve?"
              className="w-full bg-zinc-950/40 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-base focus:border-orange-500/60 outline-none transition-colors resize-none placeholder-zinc-700 leading-relaxed"
            />
          </div>

          <div className="h-px bg-zinc-800/40" />

          {/* Feature Request (Optional) */}
          <div className="flex flex-col gap-4">
            <label htmlFor="feature-request" className="text-base sm:text-lg font-bold text-zinc-100 flex items-center gap-2">
              🚀 Feature Request (Optional)
            </label>
            <span className="text-zinc-400 text-xs sm:text-sm -mt-2">What feature would you like us to build next?</span>
            <input
              id="feature-request"
              type="text"
              value={featureRequest}
              onChange={(e) => setFeatureRequest(e.target.value)}
              placeholder="E.g., Cover Letter Generator..."
              className="w-full bg-zinc-950/40 border border-zinc-800 rounded-xl px-4 py-3.5 text-zinc-100 text-base focus:border-orange-500/60 outline-none transition-colors placeholder-zinc-700"
            />
          </div>

          <div className="h-px bg-zinc-800/40" />

          {/* Recommendation */}
          <div className="flex flex-col gap-4">
            <span className="text-base sm:text-lg font-bold text-zinc-100 flex items-center gap-2">
              🤝 Recommendation
            </span>
            <span className="text-zinc-400 text-xs sm:text-sm -mt-2">Would you recommend Resume Manager to others?</span>
            <div className="flex gap-4 mt-1.5">
              {["Yes", "Maybe", "No"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setRecommend(opt)}
                  className={`flex-1 py-3.5 rounded-xl border text-sm font-semibold cursor-pointer transition-all duration-200 ${
                    recommend === opt
                      ? "border-orange-500/60 bg-orange-600/10 text-orange-400 font-bold"
                      : "border-zinc-800 bg-zinc-950/20 text-zinc-400 hover:border-zinc-700/80 hover:text-zinc-200"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-600 hover:bg-orange-500 active:bg-orange-700 disabled:bg-zinc-800 disabled:text-zinc-550 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-300 cursor-pointer shadow-lg shadow-orange-950/20 flex items-center justify-center gap-2 mt-4 text-base sm:text-lg"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Submitting Feedback...</span>
              </>
            ) : (
              <span>Submit Feedback</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
