import React from 'react';
import { Target } from 'lucide-react';

type LensFrameProps = {
  src?: string;
  size?: number;
  className?: string;
};

export default function LensFrame({ src, size = 320, className = '' }: LensFrameProps) {
  return (
    <div 
      className={`relative rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-paper ${className}`}
      style={{ width: size, height: size }}
    >
      {src ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={src} 
            alt="Uploaded photo of the examined skin area" 
            width={size} 
            height={size}
            className="w-full h-full object-cover"
          />
          {/* Subtle outer ring when photo is present */}
          <div className="absolute inset-0 rounded-full border border-hairline pointer-events-none" aria-hidden="true" />
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* The lens motif icon */}
          <div className="relative flex items-center justify-center text-teal opacity-80">
            <Target className="w-12 h-12 stroke-[1.5]" aria-hidden="true" />
          </div>
        </div>
      )}
    </div>
  );
}
