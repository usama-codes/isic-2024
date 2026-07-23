"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { Target, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LensFrame from "@/components/LensFrame";
import ConfidenceRing from "@/components/ConfidenceRing";
import AdvisoryBand from "@/components/AdvisoryBand";
import ConfirmDialog from "@/components/ConfirmDialog";

interface AnalysisRecord {
  id: string;
  imageDataUrl: string;
  probability: number;
  threshold: number;
  isHighRisk: boolean;
  timestamp: { toDate?: () => Date } | number | string;
}

export default function HistoryPage() {
  const { user, isLoaded } = useUser();
  const authLoading = !isLoaded;
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"All" | "Flagged" | "Benign-leaning">(
    "All",
  );

  const [selectedRecord, setSelectedRecord] = useState<AnalysisRecord | null>(
    null,
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (!user) return;

    const q = query(
      collection(db, "users", user.id, "analyses"),
      orderBy("timestamp", "desc"),
      limit(50),
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setRecords(
          snap.docs.map((d) => ({ id: d.id, ...d.data() })) as AnalysisRecord[],
        );
        setLoading(false);
      },
      () => setLoading(false),
    );
    return () => unsub();
  }, [user, authLoading, router]);

  const handleDelete = async () => {
    if (!user || !selectedRecord) return;
    setIsConfirmOpen(false);
    setSelectedRecord(null);
    await deleteDoc(doc(db, "users", user.id, "analyses", selectedRecord.id));
    setRecords((r) => r.filter((x) => x.id !== selectedRecord.id));
  };

  const getRelativeTime = (ts: AnalysisRecord["timestamp"]) => {
    let date: Date;
    if (
      typeof ts === "object" &&
      ts &&
      "toDate" in ts &&
      typeof ts.toDate === "function"
    ) {
      date = ts.toDate();
    } else if (ts) {
      date = new Date(ts as string | number);
    } else {
      return "Just now";
    }

    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    const diff = date.getTime() - new Date().getTime();
    const days = Math.round(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === -1) return "Yesterday";
    if (days > -30) return rtf.format(days, "day");
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const getFullDate = (ts: AnalysisRecord["timestamp"]) => {
    let date: Date;
    if (
      typeof ts === "object" &&
      ts &&
      "toDate" in ts &&
      typeof ts.toDate === "function"
    ) {
      date = ts.toDate();
    } else if (ts) {
      date = new Date(ts as string | number);
    } else {
      return "";
    }
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(date);
  };

  const filteredRecords = records.filter((r) => {
    if (filter === "Flagged") return r.isHighRisk;
    if (filter === "Benign-leaning") return !r.isHighRisk;
    return true;
  });

  if (authLoading || loading) {
    return (
      <div className="animate-fadeUp max-w-[720px] mx-auto">
        <div className="mb-8">
          <h1 className="text-[32px] font-semibold mb-2">History</h1>
          <div className="h-[36px] w-[240px] bg-paper rounded-md animate-pulse"></div>
        </div>
      </div>
    );
  }

  // --- DETAIL VIEW ---
  if (selectedRecord) {
    const isHigh = selectedRecord.isHighRisk;
    const pct = selectedRecord.probability * 100;
    const predictionClass = isHigh ? "flagged" : "benign-leaning";

    return (
      <div className="max-w-[960px] mx-auto animate-fadeUp">
        <button
          onClick={() => setSelectedRecord(null)}
          className="flex items-center gap-1 text-body-sm font-medium text-ink-muted hover:text-ink focus-ring mb-8 px-2 py-1 -ml-2 rounded-md"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to list
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="flex justify-center md:justify-end">
            <LensFrame src={selectedRecord.imageDataUrl} size={320} />
          </div>

          <div className="flex flex-col items-center md:items-start w-full max-w-[440px]">
            <span className="text-body-sm text-ink-muted mb-4 font-mono font-medium tracking-wide">
              {getFullDate(selectedRecord.timestamp)}
            </span>

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

            <div className="mb-8">
              <ConfidenceRing
                state="settled"
                value={pct}
                size="lg"
                predictionClass={predictionClass}
              />
            </div>

            <div className="w-full mb-6">
              <AdvisoryBand isFlagged={isHigh} />
            </div>

            <button
              onClick={() => setIsConfirmOpen(true)}
              className="text-body-sm font-medium text-ink-muted hover:text-brick focus-ring px-4 py-2 mt-4 rounded-md transition-colors"
            >
              Delete this scan
            </button>
          </div>
        </div>

        <ConfirmDialog
          isOpen={isConfirmOpen}
          title="Delete this scan?"
          message="This can't be undone."
          confirmLabel="Delete"
          onCancel={() => setIsConfirmOpen(false)}
          onConfirm={handleDelete}
        />
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="animate-fadeUp max-w-[720px] mx-auto">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="mb-2">History</h1>
        </div>

        {/* Lightweight filter (segmented control) */}
        {records.length > 0 && (
          <div className="inline-flex bg-paper border border-hairline rounded-md p-1">
            {(["All", "Flagged", "Benign-leaning"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`
                  px-4 py-1.5 text-sm font-medium rounded-sm focus-ring transition-colors
                  ${
                    filter === f
                      ? "bg-surface shadow-card text-ink"
                      : "text-ink-muted hover:text-ink"
                  }
                `}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {records.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-surface border border-hairline rounded-md">
          <Target
            className="w-12 h-12 text-ink-muted mb-4 opacity-50 stroke-[1.5]"
            aria-hidden="true"
          />
          <p className="text-body font-semibold text-ink mb-2">No scans yet</p>
          <p className="text-body-sm text-ink-muted mb-6">
            Complete your first check to see it here.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-teal text-surface font-semibold text-sm hover:bg-teal-dark transition-colors focus-ring"
          >
            Check a Spot
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredRecords.length === 0 && (
            <p className="text-center text-body-sm text-ink-muted py-10">
              No scans found matching this filter.
            </p>
          )}

          {filteredRecords.map((rec) => {
            const isHigh = rec.isHighRisk;
            const pct = (rec.probability * 100).toFixed(1);

            return (
              <button
                key={rec.id}
                onClick={() => setSelectedRecord(rec)}
                className="group flex items-center justify-between p-4 bg-surface border border-hairline rounded-md hover:border-teal/50 hover:shadow-card transition-all text-left focus-ring"
              >
                <div className="flex items-center gap-4">
                  {/* Lens Thumbnail */}
                  <div className="relative">
                    <LensFrame src={rec.imageDataUrl} size={48} />
                    {/* Small ring overlay on thumbnail per spec */}
                    <div className="absolute -bottom-1 -right-1 bg-surface rounded-full p-0.5">
                      <ConfidenceRing
                        value={rec.probability * 100}
                        size="sm"
                        state="settled"
                        predictionClass={isHigh ? "flagged" : "benign-leaning"}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col justify-center">
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-wide ${isHigh ? "text-brick" : "text-moss"}`}
                    >
                      {isHigh ? "Flagged" : "Lower Concern"}
                    </span>
                    <span className="text-data text-ink mt-0.5">{pct}%</span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className="text-body-sm text-ink-muted"
                    title={getFullDate(rec.timestamp)}
                  >
                    {getRelativeTime(rec.timestamp)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
