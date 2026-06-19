"use client";

import { cn } from "@/lib/utils";
import { Upload, Link as LinkIcon, Share2 } from "lucide-react";
import type React from "react";

// The main props for the HowItWorks component
interface HowItWorksProps extends React.HTMLAttributes<HTMLElement> {}

// The props for a single step card
interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
}

/**
 * A single step card within the "How It Works" section.
 * It displays an icon, title, description, and a list of benefits.
 */
const StepCard: React.FC<StepCardProps> = ({
  icon,
  title,
  description,
  benefits,
}) => (
  <div
    className={cn(
      "relative rounded-2xl border border-zinc-800 bg-[#18181b] p-6 text-zinc-100 transition-all duration-300 ease-in-out",
      "hover:scale-105 hover:shadow-lg hover:border-[#f9f871]/50 hover:bg-[#18181b]/90"
    )}
  >
    {/* Icon */}
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-850 text-[#f9f871] border border-zinc-700">
      {icon}
    </div>
    {/* Title and Description */}
    <h3 className="mb-2 text-xl font-semibold text-zinc-100">{title}</h3>
    <p className="mb-6 text-zinc-400 text-sm leading-relaxed">{description}</p>
    {/* Benefits List */}
    <ul className="space-y-3">
      {benefits.map((benefit, index) => (
        <li key={index} className="flex items-center gap-3">
          <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#f9f871]/15">
            <div className="h-2 w-2 rounded-full bg-[#f9f871]"></div>
          </div>
          <span className="text-zinc-400 text-sm">{benefit}</span>
        </li>
      ))}
    </ul>
  </div>
);

/**
 * A responsive "How It Works" section that displays a 3-step process.
 * Styled with theme yellow accents and deep dark background.
 */
export const HowItWorks: React.FC<HowItWorksProps> = ({
  className,
  ...props
}) => {
  const stepsData = [
    {
      icon: <Upload className="h-6 w-6" />,
      title: "Upload your resume",
      description:
        "Upload your resume in PDF format to your private secure workspace.",
      benefits: [
        "Supports multiple resume versions",
      ],
    },
    {
      icon: <LinkIcon className="h-6 w-6" />,
      title: "Create link",
      description:
        "Generate a custom, dynamic share link. Secure it with privacy toggles as needed.",
      benefits: [
        "One link that lasts a lifetime",
        "Toggle public/private access",
      ],
    },
    {
      icon: <Share2 className="h-6 w-6" />,
      title: "Share and track",
      description:
        "Share the link with recruiters, track real-time view logs, and swap resumes behind the link anytime.",
      benefits: [
        "Log exact recruiter click metrics",
        "Swap active resumes instantly",
        "Control access and disable links",
      ],
    },
  ];

  return (
    <section
      id="how-it-works"
      className={cn("w-full bg-[#111010] text-[#ffffff] py-16 sm:py-24 border-t border-[#292813]", className)}
      {...props}
    >
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
            How it <span className="text-[#f9f871]">works</span>
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Easily manage, analyze, and share your professional profiles in <span className="text-[#f9f871]">three simple steps</span>.
          </p>
        </div>

        {/* Step Indicators with Connecting Line */}
        <div className="relative mx-auto mb-8 w-full max-w-xl">
          <div
            aria-hidden="true"
            className="absolute left-[16.6667%] top-1/2 h-0.5 w-[66.6667%] -translate-y-1/2 bg-[#292813]"
          ></div>
          {/* Use grid to align numbers with the card grid below */}
          <div className="relative grid grid-cols-3">
            {stepsData.map((_, index) => (
              <div
                key={index}
                className="flex h-8 w-8 items-center justify-center justify-self-center rounded-full bg-[#18181b] border border-[#292813] font-semibold text-zinc-100 ring-4 ring-[#111010]"
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Steps Grid */}
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
          {stepsData.map((step, index) => (
            <StepCard
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              benefits={step.benefits}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
