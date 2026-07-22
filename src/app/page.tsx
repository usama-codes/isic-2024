"use client";
import React, { useRef, useState, useEffect } from "react";
import { UploadCloud, CheckCircle2, AlertTriangle, RefreshCw, Download } from "lucide-react";
import { useModel } from "@/hooks/useModel";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAnalysis } from "@/context/AnalysisContext";
import Link from "next/link";

export default function Home() {
  const { predict } = useModel();
  const { user } = useAuth();
  const { imageSrc, setImageSrc, result, setResult, resetAnalysis } = useAnalysis();
  
  const [isDragging, setIsDragging] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  
  const [config, setConfig] = useState<{threshold: number, image_size: number} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    fetch('/configs/config_v1.json')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error("Failed to load config", err));
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPG, PNG, or WEBP).");
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
    setIsPredicting(true);
    
    // Simulate UI tick
    await new Promise(r => setTimeout(r, 100));
    
    const probability = await predict(imageRef.current);
    setResult(probability);
    setIsPredicting(false);

    // Save to Firestore if user is logged in
    if (user && probability !== null) {
      try {
        // Create a small thumbnail to save space
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxDim = 200;
        const img = imageRef.current;
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
        canvas.width = w;
        canvas.height = h;
        ctx?.drawImage(img, 0, 0, w, h);
        const thumb = canvas.toDataURL('image/jpeg', 0.7);

        await addDoc(collection(db, "users", user.uid, "analyses"), {
          imageDataUrl: thumb,
          probability: probability,
          threshold: config.threshold,
          isHighRisk: probability >= config.threshold,
          modelVersion: "v1",
          timestamp: serverTimestamp()
        });
      } catch (err) {
        console.error("Failed to save history", err);
      }
    }
  };

  const reset = () => {
    resetAnalysis();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownload = () => {
    if (!imageRef.current || result === null || !config) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 800;
    canvas.height = 1000;
    
    // Background
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Image
    const imgHeight = 600;
    ctx.drawImage(imageRef.current, 100, 100, 600, imgHeight);
    
    // Frame border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(100, 100, 600, imgHeight);
    
    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('DermLens Analysis Report', 100, 70);
    
    ctx.font = '24px sans-serif';
    const probPercent = (result * 100).toFixed(1) + '%';
    ctx.fillText('Melanoma Probability: ' + probPercent, 100, 760);
    
    const isHigh = result >= config.threshold;
    ctx.fillStyle = isHigh ? '#f87171' : '#4ade80';
    ctx.fillText(isHigh ? '⚠ High-risk lesion detected' : '✓ Low-risk', 100, 810);
    
    ctx.fillStyle = '#8b8b9e';
    ctx.font = '18px sans-serif';
    ctx.fillText('This is not a medical diagnosis. Consult a dermatologist.', 100, 880);
    ctx.fillText('Model: ISIC 2024 EfficientNet B0', 100, 910);
    
    const link = document.createElement('a');
    link.download = 'DermLens_Report.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="animate-fadeUp">
      {!imageSrc ? (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center min-h-[50vh]">
          <div>
            <p className="text-accent text-xs font-medium uppercase tracking-widest mb-4">AI-Powered Dermatology Research Tool</p>
            <h1 className="font-instrument text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight tracking-tight">
              Analyse skin lesions with <em className="italic text-accent">precision</em>
            </h1>
            <p className="text-text-secondary text-lg mb-8 max-w-md leading-relaxed">
              Upload a dermoscopic image and receive an instant probability estimate. Our model evaluates visual patterns associated with melanoma using deep learning.
            </p>
            
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-text-secondary bg-bg-card border border-border-subtle rounded-full">
                EfficientNet B0
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-text-secondary bg-bg-card border border-border-subtle rounded-full">
                ISIC 2024
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-text-secondary bg-bg-card border border-border-subtle rounded-full">
                Real-time
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <div 
              className={`relative w-full max-w-md bg-bg-card border-2 border-dashed rounded-3xl p-1 transition-all duration-300 cursor-pointer group ${isDragging ? 'border-accent shadow-[0_0_0_2px_rgba(139,92,246,0.25),0_16px_60px_rgba(139,92,246,0.15)] -translate-y-1' : 'border-border-medium hover:border-border-accent hover:shadow-[0_0_0_1px_rgba(139,92,246,0.25),0_8px_40px_rgba(139,92,246,0.08)] hover:-translate-y-0.5'}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
              }}
            >
              <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 rounded-[calc(1.5rem-2px)] border border-transparent group-hover:border-accent/30 transition-colors">
                <div className="w-16 h-16 rounded-full bg-accent-soft text-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-text-primary">Drop your image here</p>
                  <p className="text-sm text-text-secondary mt-1">or <span className="text-accent underline underline-offset-4">browse files</span></p>
                </div>
                <p className="text-xs text-text-tertiary">Supports JPG, PNG, WEBP</p>
              </div>
              <input type="file" ref={fileInputRef} onChange={(e) => e.target.files && handleFile(e.target.files[0])} accept="image/*" hidden />
            </div>
          </div>
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
          <div className="flex flex-col gap-6">
            <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-bg-raised aspect-square flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                ref={imageRef} 
                src={imageSrc} 
                alt="Uploaded lesion" 
                className="w-full h-full object-cover" 
                onLoad={() => {
                  if (result === null && !isPredicting) handlePredict();
                }}
              />
              {isPredicting && (
                <div className="scan-overlay !flex">
                  <div className="scan-line"></div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            {isPredicting && (
              <div className="flex flex-col items-center justify-center py-24 gap-6">
                <div className="w-16 h-16 animate-spin">
                  <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_0_12px_rgba(139,92,246,0.4)]">
                    <circle cx="32" cy="32" r="28" strokeWidth="4" fill="none" stroke="rgba(255,255,255,0.08)"/>
                    <circle cx="32" cy="32" r="28" strokeWidth="4" fill="none" stroke="url(#loaderGrad)" strokeDasharray="140 40" strokeLinecap="round" className="origin-center" />
                    <defs>
                      <linearGradient id="loaderGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#c4b5fd"/>
                        <stop offset="100%" stopColor="#818cf8"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <p className="text-text-secondary text-sm tracking-wide">Analyzing visual patterns…</p>
              </div>
            )}

            {result !== null && config && (
              <div className="bg-bg-card border border-border-subtle rounded-2xl p-8 flex flex-col gap-8 backdrop-blur-xl animate-fadeUp">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-medium text-text-secondary uppercase tracking-widest">Melanoma probability</span>
                    <div className={`font-instrument text-5xl mt-2 transition-colors ${result >= config.threshold ? 'text-danger' : 'text-safe'}`}>
                      {(result * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleDownload} className="w-10 h-10 rounded-full border border-border-subtle bg-bg-card flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-card-hover transition-all cursor-pointer" title="Download Report">
                      <Download className="w-5 h-5" />
                    </button>
                    <button onClick={reset} className="w-10 h-10 rounded-full border border-border-subtle bg-bg-card flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-card-hover transition-all cursor-pointer" title="New Analysis">
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="relative w-full h-1.5 bg-white/10 rounded-full overflow-visible">
                    <div 
                      className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out" 
                      style={{ 
                        width: `${(result * 100).toFixed(1)}%`,
                        background: result >= config.threshold ? 'linear-gradient(90deg, #fbbf24 0%, #f87171 100%)' : 'linear-gradient(90deg, #4ade80 0%, #22d3ee 100%)',
                        boxShadow: result >= config.threshold ? '0 0 16px rgba(248, 113, 113, 0.3)' : '0 0 16px rgba(74, 222, 128, 0.2)'
                      }}
                    ></div>
                    <div className="absolute -top-1 w-0.5 h-3.5 bg-text-secondary rounded-[1px] z-10" style={{ left: `${(config.threshold * 100).toFixed(1)}%` }}></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-text-tertiary mt-2 font-medium">
                    <span>0%</span>
                    <span className="text-text-secondary">Threshold: <strong className="text-text-primary">{(config.threshold * 100).toFixed(1)}%</strong></span>
                    <span>100%</span>
                  </div>
                </div>

                <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-semibold leading-relaxed border ${result >= config.threshold ? 'bg-danger-bg border-danger-border text-danger' : 'bg-safe-bg border-safe-border text-safe'}`}>
                  {result >= config.threshold ? <AlertTriangle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
                  {result >= config.threshold ? 'High-risk lesion detected — consult a dermatologist.' : 'Low-risk — no significant indicators found.'}
                </div>

                {result >= config.threshold && (
                  <Link href="/doctors" className="w-full py-3 px-4 bg-accent/10 hover:bg-accent/20 border border-accent/30 rounded-xl text-accent text-sm font-semibold text-center transition-colors">
                    Find Dermatologists Near Me
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
