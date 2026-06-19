import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function Feature() {
  return (
    <div className="w-full bg-[#18181b] text-[#ffffff] py-28 lg:py-40 border-t border-[#292813]">
      <div className="w-full px-6 md:px-16 lg:px-24">
        <div className="flex gap-4 flex-col items-center text-center w-full">
          <div>
            <Badge variant="default">Features</Badge>
          </div>
          <div className="flex gap-2 flex-col items-center text-center">
            <h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-4xl font-bold text-zinc-100">
              Share your resume with <span className="text-[#f9f871]">confidence</span>.
            </h2>
            <p className="text-lg max-w-4xl leading-relaxed tracking-tight text-zinc-400">
              Manage your professional presence <span className="text-[#f9f871]">dynamically</span> and <span className="text-[#f9f871]">securely</span> from a centralized dashboard.
            </p>
          </div>
          <div className="flex gap-6 pt-8 flex-col w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* Feature 1 - Single Link (Emphasized) */}
              <div className="flex flex-row gap-4 items-start p-6 bg-[#111010] border border-[#292813]/60 rounded-2xl">
                <Check className="w-5 h-5 mt-1 text-[#f9f871] shrink-0" />
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-zinc-100">Single Lifetime Link</p>
                  <p className="text-zinc-450 text-sm leading-relaxed">
                    Share a single link with recruiters. You can swap or update the attached resume behind the scenes anytime without changing the link.
                  </p>
                </div>
              </div>

              {/* Feature 2 - Version Control */}
              <div className="flex flex-row gap-4 items-start p-6 bg-[#111010] border border-[#292813]/60 rounded-2xl">
                <Check className="w-5 h-5 mt-1 text-[#f9f871] shrink-0" />
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-zinc-100">Version Management</p>
                  <p className="text-zinc-450 text-sm leading-relaxed">
                    Upload multiple versions of your resume, track changes, and select which version is active for your shared links instantly.
                  </p>
                </div>
              </div>

              {/* Feature 3 - AI Analysis */}
              <div className="flex flex-row gap-4 items-start p-6 bg-[#111010] border border-[#292813]/60 rounded-2xl">
                <Check className="w-5 h-5 mt-1 text-[#f9f871] shrink-0" />
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-zinc-100">AI-Powered Feedback</p>
                  <p className="text-zinc-450 text-sm leading-relaxed">
                    Get real-time feedback on your resumes. Analyze syntax, layout impact, structure, and keyword density prior to sharing.
                  </p>
                </div>
              </div>

              {/* Feature 4 - Privacy Toggles */}
              <div className="flex flex-row gap-4 items-start p-6 bg-[#111010] border border-[#292813]/60 rounded-2xl">
                <Check className="w-5 h-5 mt-1 text-[#f9f871] shrink-0" />
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-zinc-100">Access Toggles</p>
                  <p className="text-zinc-450 text-sm leading-relaxed">
                    Maintain security over your data. Make your shared links password protected, public, or private instantly as you search for roles.
                  </p>
                </div>
              </div>

              {/* Feature 5 - Track Views */}
              <div className="flex flex-row gap-4 items-start p-6 bg-[#111010] border border-[#292813]/60 rounded-2xl">
                <Check className="w-5 h-5 mt-1 text-[#f9f871] shrink-0" />
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-zinc-100">Recruiter Analytics</p>
                  <p className="text-zinc-450 text-sm leading-relaxed">
                    Receive view logging metrics when recruiters open your link. Track visits and downloads of your documents in real-time.
                  </p>
                </div>
              </div>

              {/* Feature 6 - Unified Dashboard */}
              <div className="flex flex-row gap-4 items-start p-6 bg-[#111010] border border-[#292813]/60 rounded-2xl">
                <Check className="w-5 h-5 mt-1 text-[#f9f871] shrink-0" />
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-zinc-100">Central Dashboard</p>
                  <p className="text-zinc-450 text-sm leading-relaxed">
                    A clean, fast workspace to edit your links, view analytic metrics, upload feedback, and manage all your documents.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Feature };
