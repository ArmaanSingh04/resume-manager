import FeedbackClient from "@/components/FeedbackClient";
import { hasSubmittedFeedback } from "@/actions/hasSubmittedFeedback";

export default async function FeedbackPage() {
  const hasFeedback = await hasSubmittedFeedback();

  return (
    <FeedbackClient initialHasFeedback={hasFeedback} />
  );
}
