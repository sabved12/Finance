"use client";

import { Hero } from "@/components/hero"; // Assuming Hero is in a separate file now

import { statsData, featuresData, howItWorksData, testimonialsData } from "../data/landing";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import EverythingTimeline from "@/components/timeline";
import HowItWorksSection  from "@/components/howItWorks";
import Testimonials from "@/components/testimonials";
import CTA from "@/components/cta";

// Main Landing Page Component
export default function Home() {
  return (
    <div>

      <Hero />
      <EverythingTimeline featuresData={featuresData} />

   
      <section className="py-20 bg-[#161429] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-sky-300 mb-2">
                  {stat.value}
                </p>
                <p className="text-violet-200/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

            <HowItWorksSection  />
      
            <Testimonials/>
            <CTA/>

      {/* <section className="py-20 bg-gradient-to-r from-violet-100 via-sky-100 to-fuchsia-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Every Choice Shapes Your Story
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are building a better financial future
            with FinTrack. Get started for free.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-lg shadow-lg">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section> */}
    </div>
  );
}