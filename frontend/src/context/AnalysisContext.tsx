"use client";
import React, { createContext, useContext, useState } from "react";

interface AnalysisContextType {
  imageSrc: string | null;
  setImageSrc: (src: string | null) => void;
  result: number | null;
  setResult: (res: number | null) => void;
  resetAnalysis: () => void;
}

const AnalysisContext = createContext<AnalysisContextType>({
  imageSrc: null,
  setImageSrc: () => {},
  result: null,
  setResult: () => {},
  resetAnalysis: () => {},
});

export const AnalysisProvider = ({ children }: { children: React.ReactNode }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [result, setResult] = useState<number | null>(null);

  const resetAnalysis = () => {
    setImageSrc(null);
    setResult(null);
  };

  return (
    <AnalysisContext.Provider value={{ imageSrc, setImageSrc, result, setResult, resetAnalysis }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => useContext(AnalysisContext);
