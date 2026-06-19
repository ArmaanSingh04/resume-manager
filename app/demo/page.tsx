import { Navbar1 } from "@/components/ui/navbar-1";
import { Feature } from "@/components/ui/feature-with-advantages";
import { HowItWorks } from "@/components/ui/how-it-works";
import Footer from "@/components/ui/footer-1";

export default function Demo() {
  return (
    <div className="min-h-screen bg-[#111010] text-[#ffffff] flex flex-col justify-start overflow-y-auto scroll-smooth">
      <Navbar1 />
      <div className="py-12 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-100 mb-2">Standalone Demos</h1>
          <p className="text-sm text-zinc-450">This page demonstrates the navbar, features, how-it-works, and footer sections in isolation.</p>
        </div>
      </div>
      <div className="border-t border-zinc-800">
        <Feature />
      </div>
      <HowItWorks />
      <Footer />
    </div>
  );
}
