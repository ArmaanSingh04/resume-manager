import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import MinimalHero from "@/components/ui/hero-minimalism";
import { Feature } from "@/components/ui/feature-with-advantages";
import { HowItWorks } from "@/components/ui/how-it-works";
import Footer from "@/components/ui/footer-1";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="bg-[#111010] text-[#ffffff] min-h-screen overflow-y-auto overflow-x-hidden scroll-smooth">
      <MinimalHero hasSession={!!session} />
      <div id="features">
        <Feature />
      </div>
      <HowItWorks />
      <Footer />
    </div>
  );
}

