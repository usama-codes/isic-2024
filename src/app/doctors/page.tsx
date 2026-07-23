"use client";
import React, { useState } from "react";
import { MapPin, Stethoscope } from "lucide-react";

export default function DoctorsPage() {
  const [hasSearched, setHasSearched] = useState(false);
  
  const handleUseLocation = () => {
    setHasSearched(true);
  };

  return (
    <div className="animate-fadeUp max-w-[960px] mx-auto pb-20">
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="mb-4">Find Care</h1>
        <p className="text-body text-ink-muted">
          Find board-certified dermatologists in your area.
        </p>
      </div>

      {/* Action Area */}
      <div className="mb-8">
        <button 
          type="button"
          onClick={handleUseLocation}
          className="flex items-center justify-center gap-2 h-[52px] px-8 rounded-md bg-teal text-surface font-semibold focus-ring hover:bg-teal-dark transition-colors cursor-pointer w-full sm:w-auto"
        >
          <MapPin className="w-5 h-5" />
          Use My Location
        </button>
        
        <p className="text-[13px] text-ink-muted mt-3">
          These listings are informational and not a referral or endorsement.
        </p>
      </div>

      {/* Results Area */}
      {hasSearched ? (
        <div className="w-full h-[600px] rounded-md overflow-hidden border border-hairline bg-surface animate-fadeUp">
          <iframe
            title="Dermatologists near me"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent("dermatologists near me")}&z=12&output=embed`}
            className="w-full h-full"
          />
        </div>
      ) : (
        /* Initial Empty State */
        <div className="bg-surface border border-hairline p-10 rounded-md text-center">
          <Stethoscope className="w-10 h-10 text-ink-muted mx-auto mb-4 stroke-[1.5]" />
          <h2 className="text-body font-semibold text-ink mb-2">Ready to find a specialist?</h2>
          <p className="text-body-sm text-ink-muted max-w-md mx-auto">
            Click "Use My Location" above to see dermatologists near you.
          </p>
        </div>
      )}
      
    </div>
  );
}
