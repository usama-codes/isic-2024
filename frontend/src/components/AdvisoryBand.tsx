import React from 'react';
import { Info } from 'lucide-react';

type AdvisoryBandProps = {
  isFlagged?: boolean;
};

export default function AdvisoryBand({ isFlagged = false }: AdvisoryBandProps) {
  return (
    <div className="w-full bg-[#B8791E]/10 border-t border-ochre p-4 flex gap-3 items-start">
      <Info className="w-5 h-5 text-ochre shrink-0 mt-0.5" aria-hidden="true" />
      <p className="text-body-sm text-ink leading-relaxed">
        {isFlagged ? (
          <strong className="font-semibold block mb-1">
            This pattern is worth having a dermatologist look at soon.
          </strong>
        ) : (
          <strong className="font-semibold block mb-1">
            This result is a screening aid based on an image, not a medical diagnosis.
          </strong>
        )}
        See a dermatologist to confirm any result, especially if the spot has changed recently.
      </p>
    </div>
  );
}
