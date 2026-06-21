import {
  Link2,
  GitBranch,
  Sparkles,
  ShieldCheck,
  BarChart3,
  LayoutDashboard,
} from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent?: boolean;
}

function FeatureCard({ icon, title, description, accent }: FeatureCardProps) {
  return (
    <div
      className={[
        "group relative flex flex-col gap-4 p-6 rounded-2xl border transition-all duration-300",
        "bg-[#111010] border-[#292813]/70",
        "hover:border-[#f9f871]/30 hover:bg-[#141413]",
        "hover:shadow-[0_0_32px_-8px_rgba(249,248,113,0.12)]",
      ].join(" ")}
    >
      {/* Icon */}
      <div
        className={[
          "flex h-11 w-11 items-center justify-center rounded-xl border transition-colors duration-300",
          accent
            ? "bg-[#f9f871]/10 border-[#f9f871]/20 text-[#f9f871] group-hover:bg-[#f9f871]/15"
            : "bg-zinc-900 border-zinc-800 text-[#f9f871] group-hover:border-[#f9f871]/25",
        ].join(" ")}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="flex flex-col gap-1.5">
        <h3 className="font-semibold text-zinc-100 text-[15px] leading-snug">{title}</h3>
        <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
      </div>

      {/* Hover accent line */}
      <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#f9f871]/0 to-transparent group-hover:via-[#f9f871]/25 transition-all duration-500" />
    </div>
  );
}

import React from "react";

function Feature() {
  const features = [
    {
      icon: <Link2 className="w-5 h-5" />,
      title: "Single Lifetime Link",
      description:
        "Share one link with every recruiter. Swap or update the attached resume silently — the link never changes.",
      accent: true,
    },
    {
      icon: <GitBranch className="w-5 h-5" />,
      title: "Version Management",
      description:
        "Upload multiple resume versions, track revisions, and switch the active document behind your shared links instantly.",
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "AI-Powered Feedback",
      description:
        "Analyse syntax, layout impact, structure, and keyword density with real-time AI before you share with recruiters.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "Access Toggles",
      description:
        "Go public, private, or password-protected in one click. Full control over who can view your documents, at any time.",
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Recruiter Analytics",
      description:
        "Track every time a recruiter opens your link. Get timestamped view logs and download metrics in real-time.",
    },
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      title: "Central Dashboard",
      description:
        "One clean workspace to manage links, upload documents, review AI feedback, and monitor all analytics.",
    },
  ];

  return (
    <div
      id="features"
      className="w-full bg-[#18181b] text-white py-28 lg:py-36 border-t border-[#292813]/80"
    >
      <div className="w-full px-6 md:px-16 lg:px-24 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-5 mb-16">
          {/* Pill label */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#f9f871]/20 bg-[#f9f871]/5 text-[#f9f871] text-xs font-semibold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f9f871] inline-block" />
            Features
          </div>

          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-100 max-w-3xl leading-[1.1]">
            Share your resume with{" "}
            <span className="text-[#f9f871]">confidence</span>.
          </h2>
          <p className="text-zinc-500 text-lg max-w-xl leading-relaxed">
            Everything you need to manage your professional presence —
            dynamically, securely, and from a single place.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>
      </div>
    </div>
  );
}

export { Feature };
