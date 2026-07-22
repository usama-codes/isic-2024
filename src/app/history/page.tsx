"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, deleteDoc, doc, limit, onSnapshot } from "firebase/firestore";
import { Trash2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface AnalysisRecord {
  id: string;
  imageDataUrl: string;
  probability: number;
  threshold: number;
  isHighRisk: boolean;
  timestamp: { toDate?: () => Date } | number | string;
}

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/");
      return;
    }

    const q = query(
      collection(db, "users", user.uid, "analyses"),
      orderBy("timestamp", "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as AnalysisRecord[];
        setRecords(data);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching history", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, authLoading, router]);

  const handleDelete = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "analyses", id));
      setRecords(records.filter(r => r.id !== id));
    } catch (err) {
      console.error("Error deleting record", err);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="animate-fadeUp">
        <h1 className="font-instrument text-4xl mb-8">Analysis History</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-video bg-bg-raised"></div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-1/2">
                    <div className="h-3 bg-border-subtle rounded-full w-24 mb-3"></div>
                    <div className="h-8 bg-border-subtle rounded-full w-20"></div>
                  </div>
                  <div className="w-10 h-10 bg-border-subtle rounded-lg"></div>
                </div>
                <div className="w-full bg-border-subtle h-1.5 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeUp">
      <h1 className="font-instrument text-4xl mb-8">Analysis History</h1>
      
      {records.length === 0 ? (
        <div className="text-text-secondary bg-bg-card border border-border-subtle p-8 rounded-2xl text-center">
          No analyses saved yet. Upload an image on the main page to see it here!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((record) => (
            <div key={record.id} className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden group">
              <div className="aspect-video relative overflow-hidden bg-bg-raised">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={record.imageDataUrl} alt="Analysis thumbnail" className="w-full h-full object-cover" />
                <button 
                  onClick={() => handleDelete(record.id)}
                  className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-xs text-text-tertiary mb-1">
                      {typeof record.timestamp === 'object' && record.timestamp && 'toDate' in record.timestamp && typeof record.timestamp.toDate === 'function' ? record.timestamp.toDate().toLocaleDateString() : (record.timestamp ? new Date(record.timestamp as string | number).toLocaleDateString() : 'Just now')}
                    </div>
                    <div className={`text-2xl font-instrument ${record.isHighRisk ? 'text-danger' : 'text-safe'}`}>
                      {(record.probability * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg ${record.isHighRisk ? 'bg-danger-bg text-danger' : 'bg-safe-bg text-safe'}`}>
                    {record.isHighRisk ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                  </div>
                </div>
                <div className="w-full bg-border-subtle h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full" 
                    style={{ 
                      width: `${(record.probability * 100).toFixed(1)}%`,
                      background: record.isHighRisk ? 'linear-gradient(90deg, #fbbf24 0%, #f87171 100%)' : 'linear-gradient(90deg, #4ade80 0%, #22d3ee 100%)'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
