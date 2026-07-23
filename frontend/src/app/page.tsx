"use client";
import React, { useRef, useState, useEffect } from "react";
import { useModel } from "@/hooks/useModel";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAnalysis } from "@/context/AnalysisContext";
import Link from "next/link";
import LensFrame from "@/components/LensFrame";
import ConfidenceRing from "@/components/ConfidenceRing";
import AdvisoryBand from "@/components/AdvisoryBand";

export default function Home() {
  const { predict } = useModel();
  const { user, loading: authLoading } = useAuth();
  const { imageSrc, setImageSrc, result, setResult, resetAnalysis } =
    useAnalysis();

  const [isDragging, setIsDragging] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [error, setError] = useState<"file" | "quality" | "network" | null>(
    null,
  );
  const [config, setConfig] = useState<{
    threshold: number;
    image_size: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    fetch("/configs/config_v1.json")
      .then((r) => r.json())
      .then(setConfig)
      .catch(console.error);
  }, []);

  const handleFile = (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("file");
      return;
    }
    // simple size check for 'quality' error
    if (file.size < 1024 * 10) {
      // 10kb too small
      setError("quality");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageSrc(e.target.result as string);
        setResult(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePredict = async () => {
    if (!imageRef.current || !config) return;
    setError(null);
    setIsPredicting(true);
    // give UI time to update
    await new Promise((r) => setTimeout(r, 100));
    try {
      const prob = await predict(imageRef.current);
      setResult(prob);

      if (user && prob !== null) {
        try {
          const c = document.createElement("canvas");
          const ctx = c.getContext("2d");
          const img = imageRef.current;
          let w = img.naturalWidth,
            h = img.naturalHeight;
          const m = 200;
          if (w > h) {
            h = Math.round((h * m) / w);
            w = m;
          } else {
            w = Math.round((w * m) / h);
            h = m;
          }
          c.width = w;
          c.height = h;
          ctx?.drawImage(img, 0, 0, w, h);
          await addDoc(collection(db, "users", user.uid, "analyses"), {
            imageDataUrl: c.toDataURL("image/jpeg", 0.7),
            probability: prob,
            threshold: config.threshold,
            isHighRisk: prob >= config.threshold,
            modelVersion: "v1",
            timestamp: serverTimestamp(),
          });
        } catch (e) {
          console.error("Failed to save", e);
        }
      }
    } catch (e) {
      console.error(e);
      setError("network");
    } finally {
      setIsPredicting(false);
    }
  };

  const reset = () => {
    resetAnalysis();
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const pct = result !== null ? result * 100 : null;
  const isHigh =
    result !== null && config !== null && result >= config.threshold;

  // For v1, we map high risk to flagged, low risk to benign-leaning.
  // We don't have a middle "uncertain" threshold defined in config yet.
  const predictionClass = isHigh ? "flagged" : "benign-leaning";

  return (
    <div className="w-full max-w-[960px] mx-auto">
      <div className="mb-10 text-center lg:text-left">
        <h1 className="mb-4">Check a spot</h1>
        <p className="text-body text-ink-muted max-w-2xl mx-auto lg:mx-0">
          Upload a clear photo for an instant, AI-powered screening.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Left Column: The Photo / Dropzone */}
        <div className="flex flex-col items-center lg:items-start w-full">
          {!imageSrc ? (
            <div className="w-full max-w-[400px]">
              <div
                role="button"
                tabIndex={0}
                aria-label="Upload image. Click or drag and drop."
                className={`
                  w-full aspect-square rounded-md flex flex-col items-center justify-center
                  cursor-pointer focus-ring transition-all duration-120 relative overflow-hidden group
                  ${
                    isDragging
                      ? "border-2 border-teal bg-teal/5"
                      : "border-2 border-dashed border-hairline bg-surface hover:bg-paper"
                  }
                `}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    fileInputRef.current?.click();
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files.length)
                    handleFile(e.dataTransfer.files[0]);
                }}
              >
                {/* Scale up lens frame on drag-over */}
                <div
                  className={`transition-transform duration-120 ${isDragging ? "scale-105" : "scale-100"}`}
                >
                  <LensFrame size={200} />
                </div>

                <div className="mt-6 flex flex-col items-center text-center px-6">
                  <span className="font-semibold text-ink text-body">
                    Drag a photo here, or
                  </span>
                  <span className="mt-2 inline-flex items-center justify-center h-10 px-4 rounded-md bg-paper border border-hairline text-ink font-semibold text-sm hover:bg-hairline/50 transition-colors">
                    Choose Photo
                  </span>
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) =>
                  e.target.files && handleFile(e.target.files[0])
                }
                accept="image/*"
                aria-hidden="true"
                hidden
              />

              {/* Help or Error text */}
              <div className="mt-4 text-center text-body-sm" aria-live="polite">
                {error === "file" && (
                  <p className="text-brick font-medium">
                    This doesn&apos;t look like a photo. Try a JPG or PNG.
                  </p>
                )}
                {error === "quality" && (
                  <p className="text-brick font-medium">
                    This photo is too blurry or too small to analyze. Retake it
                    in better light, closer to the spot.
                  </p>
                )}
                {!error && (
                  <p className="text-ink-muted">
                    JPG or PNG, up to 10 MB. Use good lighting and fill the
                    frame with the spot.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full max-w-[400px] flex flex-col items-center">
              {/* Selected Photo in LensFrame */}
              <div className="relative w-[320px] h-[320px] flex items-center justify-center mx-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt="Hidden reference for model"
                  width={320}
                  height={320}
                  className="hidden"
                />

                {/* When analyzing, we overlay the indeterminate ring on top of the LensFrame border. */}
                {isPredicting && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center scale-110 pointer-events-none">
                    <ConfidenceRing state="indeterminate" size="lg" />
                  </div>
                )}

                <LensFrame
                  src={imageSrc}
                  size={320}
                  className={isPredicting ? "opacity-80" : ""}
                />
              </div>

              {/* Actions below photo */}
              <div className="mt-8 flex flex-col items-center gap-4 w-full">
                {result === null ? (
                  <>
                    <button
                      onClick={handlePredict}
                      disabled={isPredicting}
                      className={`
                        w-full max-w-[240px] h-[52px] rounded-md font-semibold text-body focus-ring transition-colors
                        ${
                          isPredicting
                            ? "bg-hairline text-ink-muted cursor-not-allowed"
                            : "bg-teal text-surface hover:bg-teal-dark"
                        }
                      `}
                    >
                      {isPredicting ? "Analyzing…" : "Analyze Photo"}
                    </button>
                    {!isPredicting && (
                      <button
                        onClick={reset}
                        className="text-body-sm font-semibold text-ink-muted hover:text-ink focus-ring px-4 py-2 rounded-md transition-colors"
                      >
                        Replace Photo
                      </button>
                    )}

                    {error === "network" && (
                      <p
                        className="mt-2 text-brick text-body-sm font-medium text-center"
                        aria-live="polite"
                      >
                        We couldn&apos;t complete the analysis. Your photo
                        hasn&apos;t been lost — try again.
                      </p>
                    )}
                  </>
                ) : null}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Result */}
        <div className="flex flex-col items-center lg:items-start w-full">
          {result !== null && pct !== null && (
            <div className="w-full max-w-[440px] flex flex-col items-center lg:items-start animate-fadeUp">
              {/* Label Chip and Confidence Ring Group */}
              <div className="flex flex-col items-center w-full sm:w-auto sm:min-w-[200px]">
                {/* Label Chip */}
                <div className="mb-6">
                  <span
                    className={`
                    inline-flex items-center justify-center px-4 py-1.5 rounded-sm text-sm font-semibold uppercase tracking-wide
                    ${isHigh ? "bg-brick/10 text-brick" : "bg-moss/10 text-moss"}
                  `}
                  >
                    {isHigh ? "Flagged" : "Lower Concern"}
                  </span>
                </div>

                {/* Confidence Ring */}
                <div className="mb-8">
                  <ConfidenceRing
                    state="settled"
                    value={pct}
                    size="lg"
                    predictionClass={predictionClass}
                  />
                </div>
              </div>

              {/* Advisory Band */}
              <div className="w-full mb-6">
                <AdvisoryBand isFlagged={isHigh} />
              </div>

              {/* Explanation Text */}
              <div className="w-full mb-8">
                <p className="text-body text-ink">
                  {isHigh
                    ? "The model detected visual patterns frequently associated with melanoma. This does not mean you have skin cancer, but it is a strong signal to have a professional examine it."
                    : "The model did not find strong visual patterns typically associated with melanoma in this image. Continue monitoring the spot for any changes in size, shape, or color."}
                </p>
              </div>

              {/* Actions */}
              <div className="w-full flex flex-col sm:flex-row gap-3">
                <Link
                  href="/doctors"
                  className="flex-1 inline-flex items-center justify-center min-h-[52px] h-auto py-2 px-4 rounded-md bg-teal text-surface font-semibold text-body hover:bg-teal-dark transition-colors focus-ring text-center"
                >
                  Find a Dermatologist Near Me
                </Link>
                <button
                  onClick={reset}
                  className="sm:w-auto inline-flex items-center justify-center h-[52px] px-6 rounded-md bg-surface border border-hairline text-ink font-semibold text-body hover:bg-paper transition-colors focus-ring"
                >
                  New Scan
                </button>
              </div>
            </div>
          )}

          {result === null && !isPredicting && (
            <div className="hidden lg:flex w-full h-full items-center justify-center">
              {/* Empty right column placeholder */}
            </div>
          )}
        </div>
      </div>

      {/* Permanent Advisory Band at the bottom of the page? No, spec says: 
          Advisory band (always visible, ochre-tint): "This tool supports — it does not replace — a dermatologist's diagnosis." 
          Wait, in the layout diagram it shows it at the bottom. But then in Result State it says "Directly under the ring: the Advisory Band — non-negotiable". 
          I will just put it globally at the bottom if there is no result, to match the diagram. 
      */}
      {result === null && (
        <div className="mt-20">
          <AdvisoryBand />
        </div>
      )}
    </div>
  );
}
