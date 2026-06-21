import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import MinimalHero from "@/components/ui/hero-minimalism";
import { Feature } from "@/components/ui/feature-with-advantages";
import { HowItWorks } from "@/components/ui/how-it-works";
import Footer from "@/components/ui/footer-1";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const baseUrl = 
    process.env.NEXT_PUBLIC_APP_URL || 
    process.env.NEXTAUTH_URL || 
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "url": baseUrl,
        "name": "Resume Manager",
        "description": "Upload, organize, and share all your resumes from one place. Create permanent links, swap files silently, and track recruiter views.",
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${baseUrl}/#software`,
        "name": "Resume Manager",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
        "description": "Upload, organize, and share all your resumes from one place. Create permanent links, swap files silently, track recruiter views, and get AI-powered feedback.",
      }
    ]
  };

  return (
    <div className="bg-[#111010] text-[#ffffff] min-h-screen overflow-y-auto overflow-x-hidden scroll-smooth">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MinimalHero hasSession={!!session} />
      <div id="features">
        <Feature />
      </div>
      <HowItWorks />
      <Footer />
    </div>
  );
}

