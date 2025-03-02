"use client";

// External Dependencies

// Internal Dependencies
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";

const LandingPage = () => {
  return (
    <div className="min-h-screen w-full bg-white">
      <Header />
      <main>
        <Hero />
        <Features />
      </main>
    </div>
  );
};

export default LandingPage;
