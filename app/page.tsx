"use client";

import Header from "../components/Header";
import Hero from "../components/hero";
import { Inter } from "next/font/google";
import "./globals.css";
import {featuresData, howItWorksData, statsData, testimonialsData} from "../data/landing";
import CountUp from 'react-countup';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function Home() {
  return (
    <div>

      {/* <Header/> */}
      <Hero/>

      <section className="py-25 bg-dark bg-blue-950">
        <div className="container mx-auto text-center px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white">
           {statsData.map((statsData,index)=>(

           <div key={index} className="text-center">
            <div className="text-4xl font-bold mb-2 font-">{statsData.value}</div>
            <div className="text-gray-300">{statsData.label}</div>

            
           </div>

           ))}
          </div>
        </div>
      </section>

   

      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-3">Everything you need to stay financially sound</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuresData.map((feature, index)=>(
                <Card key={index} className="p-6 pb-4 mb-4">
                
                <CardContent className="space-y-2 pb-4 mb-2">
                  {feature.icon}
                  <h3 className="font-extrabold">{feature.title}</h3>
                  <p>{feature.description}</p>
                </CardContent>
                
              </Card>
            ))}
          </div>
        </div>
      </section>

         <section className="py-20 bg-gradient-to-br from-blue-200 via-blue-100 to-cyan-100">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-10 text-blue-950">How it works</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
      {howItWorksData.map((step, index) => (
        <div
          key={index}
          className={`
            group w-full max-w-sm 
            text-center p-7 bg-gradient-to-tr from-white via-cyan-50 to-blue-50 
            rounded-2xl border-2 border-transparent 
            shadow-lg hover:shadow-2xl
            transition-all duration-300
            hover:border-blue-900 hover:scale-105
            hover:bg-gradient-to-br hover:from-cyan-50 hover:to-blue-100
            relative
          `}
          style={{
            boxShadow:
              "0px 2px 20px 0px rgba(27, 45, 112, 0.10), 0 0 0 2px #cfdcff inset",
          }}
        >
          <div className="
            w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center
            bg-gradient-to-br from-cyan-200 to-blue-300 shadow-inner
            border-2 border-cyan-300
            group-hover:from-cyan-300 group-hover:to-amber-200
            transition-all duration-300
          ">
            {step.icon}
          </div>
          <h3 className="text-xl font-bold mb-4 text-blue-800 group-hover:text-blue-900 transition-colors duration-300">{step.title}</h3>
          <p className="text-gray-600">{step.description}</p>
          {/* Optional: Add a gold accent line or shape */}
          <span className="absolute left-1/2 -bottom-3 -translate-x-1/2 w-16 h-1 rounded bg-gradient-to-r from-amber-400 to-yellow-300 opacity-70 group-hover:opacity-100 transition" />
        </div>
      ))}
    </div>
  </div>
</section>

{/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="pt-4">
                  <div className="flex items-center mb-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="ml-4">
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">{testimonial.quote}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already managing their finances
            smarter with Welth
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-white text-blue-900 hover:bg-blue-50 animate-bounce"
            >
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>

      

      
    </div>
//   
  );
}