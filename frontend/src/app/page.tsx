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
    <div className="w-full max-w-[1200px] mx-auto px-4 lg:px-8 pb-16 pt-8 overflow-hidden">
      {/* Dynamic Layout depending on whether an image is selected */}
      <div
        className={`transition-all duration-700 ease-in-out flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 ${
          !imageSrc ? "min-h-[75vh]" : ""
        }`}
      >
        {/* Left Typography / Hero Side */}
        <div
          className={`flex-col justify-center text-center lg:text-left z-10 transition-all duration-700 ease-in-out ${
            !imageSrc ? "flex flex-1 lg:pr-12" : "hidden"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal/10 text-teal text-sm font-semibold mb-8 mx-auto lg:mx-0 w-fit">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal"></span>
            </span>
            Instant AI Screening
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl mb-6 text-ink leading-[1.1] tracking-tight font-light">
            A <span className="text-teal italic font-medium">second look</span><br/>before you decide.
          </h1>
          <p className="text-lg lg:text-xl text-ink-muted mb-8 max-w-lg mx-auto lg:mx-0">
            Upload a clear photo of a skin spot for a confidential, AI-powered assessment. Gain clarity in seconds.
          </p>
        </div>

        {/* Right Column: Interaction / Dropzone / Results */}
        <div
          className={`relative flex flex-col items-center w-full transition-all duration-700 ease-in-out ${
            !imageSrc ? "flex-1 max-w-md lg:max-w-lg" : "w-full"
          }`}
        >
          {/* Decorative Background for Hero State */}
          {!imageSrc && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-teal/15 via-paper to-ochre/15 rounded-full blur-[80px] -z-10 opacity-70 pointer-events-none"></div>
          )}

          {/* Wrapper for the interactive part */}
          <div
            className={`w-full transition-all duration-500 relative z-0 ${
              !imageSrc
                ? "bg-surface/80 backdrop-blur-xl p-6 lg:p-10 rounded-[32px] shadow-raised border border-surface"
                : ""
            }`}
          >
            {/* If there's an image, we change to a split layout for photo and results */}
            {imageSrc ? (
              <div className="w-full">
                <div className="mb-10 text-center lg:text-left">
                  <h1 className="mb-4 text-4xl">Analysis</h1>
                  <p className="text-body text-ink-muted max-w-2xl mx-auto lg:mx-0">
                    Review your screening results below.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                  {/* Left Column: The Photo */}
                  <div className="flex flex-col items-center lg:items-start w-full">
                    <div className="w-full max-w-[400px] flex flex-col items-center">
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
                                We couldn&apos;t complete the analysis. Your
                                photo hasn&apos;t been lost — try again.
                              </p>
                            )}
                          </>
                        ) : null}
                      </div>
                    </div>
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
                                ${
                                  isHigh
                                    ? "bg-brick/10 text-brick"
                                    : "bg-moss/10 text-moss"
                                }
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
                            Find a Dermatologist
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
                  </div>
                </div>
              </div>
            ) : (
              // Initial State Dropzone
              <div className="w-full flex flex-col items-center">
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Upload image. Click or drag and drop."
                  className={`
                    w-full aspect-square rounded-2xl flex flex-col items-center justify-center
                    cursor-pointer focus-ring transition-all duration-300 relative overflow-hidden group
                    ${
                      isDragging
                        ? "border-2 border-teal bg-teal/5"
                        : "border-2 border-dashed border-hairline bg-paper hover:bg-hairline/20 hover:border-teal/50"
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
                  <div
                    className={`transition-transform duration-300 ${
                      isDragging ? "scale-110" : "scale-100 group-hover:scale-105"
                    }`}
                  >
                    <LensFrame size={180} />
                  </div>

                  <div className="mt-8 flex flex-col items-center text-center px-6 z-10">
                    <span className="font-semibold text-ink text-lg">
                      Drag a photo here, or
                    </span>
                    <span className="mt-3 inline-flex items-center justify-center h-12 px-6 rounded-md bg-surface border border-hairline text-ink font-semibold hover:border-teal hover:text-teal transition-all shadow-sm">
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

                <div className="mt-6 text-center text-body-sm" aria-live="polite">
                  {error === "file" && (
                    <p className="text-brick font-medium">
                      This doesn&apos;t look like a photo. Try a JPG or PNG.
                    </p>
                  )}
                  {error === "quality" && (
                    <p className="text-brick font-medium">
                      This photo is too blurry or too small to analyze. Retake
                      it in better light, closer to the spot.
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
            )}
          </div>
        </div>
      </div>

      {result === null && (
        <div className="mt-20">
          <AdvisoryBand />
        </div>
      )}
    </div>
  );
}
