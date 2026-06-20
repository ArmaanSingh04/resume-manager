"use client";

import { cn } from "@/lib/utils";
import { Upload, Link as LinkIcon, Share2 } from "lucide-react";
import type React from "react";

interface HowItWorksProps extends React.HTMLAttributes<HTMLElement> {}

interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  step: number;
}

const StepCard: React.FC<StepCardProps> = ({
  icon,
  title,
  description,
  benefits,
  step,
}) => (
  <div
    className={cn(
      "group relative flex flex-col gap-5 rounded-2xl border border-zinc-800/60 bg-[#18181b] p-7",
      "transition-all duration-300 ease-out",
      "hover:border-[#f9f871]/25 hover:bg-[#1a1a18]",
      "hover:shadow-[0_0_40px_-10px_rgba(249,248,113,0.1)]"
    )}
  >
    {/* Step number — top-right corner */}
    <span className="absolute top-5 right-5 text-xs font-bold text-zinc-700 tracking-widest select-none">
      {String(step).padStart(2, "0")}
    </span>

    {/* Icon */}
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#111010] border border-zinc-800 text-[#f9f871] transition-all duration-300 group-hover:border-[#f9f871]/30 group-hover:bg-[#f9f871]/5">
      {icon}
    </div>

    {/* Title and Description */}
    <div>
      <h3 className="mb-2 text-lg font-semibold text-zinc-100 leading-snug">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
    </div>

    {/* Benefits */}
    <ul className="flex flex-col gap-2.5 mt-auto pt-2 border-t border-zinc-800/50">
      {benefits.map((benefit, index) => (
        <li key={index} className="flex items-center gap-3">
          <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#f9f871]/10">
            <div className="h-1.5 w-1.5 rounded-full bg-[#f9f871]" />
          </div>
          <span className="text-zinc-400 text-sm">{benefit}</span>
        </li>
      ))}
    </ul>
  </div>
);

export const HowItWorks: React.FC<HowItWorksProps> = ({
  className,
  ...props
}) => {
  const stepsData = [
    {
      icon: <Upload className="h-5 w-5" />,
      title: "Upload your resume",
      description:
        "Upload your resume in PDF format to your private, secure workspace. Multiple versions are supported.",
      benefits: [
        "Supports multiple resume versions",
        "Secure private storage",
      ],
    },
    {
      icon: <LinkIcon className="h-5 w-5" />,
      title: "Create a link",
      description:
        "Generate a custom, dynamic share link in seconds. Apply privacy toggles — public, private, or password-protected.",
      benefits: [
        "One permanent link",
        "Toggle access instantly",
      ],
    },
    {
      icon: <Share2 className="h-5 w-5" />,
      title: "Share and track",
      description:
        "Send the link to recruiters, monitor real-time view logs, and silently swap the attached resume at any time.",
      benefits: [
        "Real-time recruiter view logs",
        "Swap active resumes anytime",
        "Disable links on demand",
      ],
    },
  ];

  return (
    <section
      id="how-it-works"
      className={cn(
        "w-full bg-[#111010] text-white py-28 lg:py-36 border-t border-[#292813]/80",
        className
      )}
      {...props}
    >
      <div className="mx-auto px-6 md:px-16 lg:px-24 max-w-7xl">
        {/* Section header */}
        <div className="flex flex-col items-center text-center gap-5 mb-16">
          {/* Pill label */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#f9f871]/20 bg-[#f9f871]/5 text-[#f9f871] text-xs font-semibold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f9f871] inline-block" />
            How it works
          </div>

          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-100 max-w-2xl leading-[1.1]">
            Up and running in{" "}
            <span className="text-[#f9f871]">three steps</span>.
          </h2>
          <p className="text-zinc-500 text-lg max-w-md leading-relaxed">
            No setup friction. Go from zero to a live, shareable resume link in
            under a minute.
          </p>
        </div>

        {/* Connector line + step numbers */}
        <div className="relative mx-auto mb-10 w-full max-w-2xl hidden md:block">
          {/* Horizontal connector */}
          <div
            aria-hidden="true"
            className="absolute left-[16.6667%] top-1/2 h-px w-[66.6667%] -translate-y-1/2"
            style={{
              background:
                "linear-gradient(to right, transparent, #292813 20%, #292813 80%, transparent)",
            }}
          />
          <div className="relative grid grid-cols-3">
            {stepsData.map((_, index) => (
              <div
                key={index}
                className="flex h-9 w-9 items-center justify-center justify-self-center rounded-full bg-[#18181b] border border-[#292813] text-xs font-bold text-[#f9f871] ring-4 ring-[#111010] z-10"
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {stepsData.map((step, index) => (
            <StepCard
              key={index}
              step={index + 1}
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
