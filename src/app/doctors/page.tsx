"use client";
import React from "react";
import { MapPin } from "lucide-react";

export default function DoctorsPage() {
  return (
    <div className="animate-fadeUp max-w-5xl mx-auto h-[80vh] flex flex-col">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="font-instrument text-4xl mb-2">Find a Dermatologist</h1>
          <p className="text-text-secondary">Search for specialists near your location</p>
        </div>
        <div className="p-3 bg-accent/10 text-accent rounded-xl">
          <MapPin className="w-6 h-6" />
        </div>
      </div>

      <div className="flex-1 bg-bg-raised border border-border-subtle rounded-3xl overflow-hidden relative shadow-[0_8px_40px_rgba(0,0,0,0.2)]">
        <iframe 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          loading="lazy" 
          allowFullScreen 
          referrerPolicy="no-referrer-when-downgrade" 
          src="https://maps.google.com/maps?q=dermatologists+near+me&output=embed"
          className="absolute inset-0"
        ></iframe>
      </div>
    </div>
  );
}
