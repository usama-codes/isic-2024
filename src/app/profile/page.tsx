"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { User as UserIcon, Download, LogOut, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [isExporting, setIsExporting] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleExport = async () => {
    if (!user) return;
    setIsExporting(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      const imgFolder = zip.folder("images");

      const snap = await getDocs(collection(db, "users", user.uid, "analyses"));
      
      const rows = [
        ["ID", "Date", "Probability", "Risk", "Threshold", "Image_Filename"]
      ];

      snap.forEach(doc => {
        const data = doc.data();
        let dateStr = "";
        
        if (data.timestamp) {
          if (typeof data.timestamp === "object" && "toDate" in data.timestamp && typeof data.timestamp.toDate === "function") {
            dateStr = data.timestamp.toDate().toISOString();
          } else {
            dateStr = new Date(data.timestamp).toISOString();
          }
        }
        
        const imageFilename = `scan_${doc.id}.jpg`;
        
        // Add image to zip if available
        if (data.imageDataUrl && data.imageDataUrl.includes(",")) {
          const base64Data = data.imageDataUrl.split(",")[1];
          if (base64Data && imgFolder) {
            imgFolder.file(imageFilename, base64Data, { base64: true });
          }
        }

        rows.push([
          doc.id,
          dateStr,
          data.probability?.toString() || "",
          data.isHighRisk ? "High" : "Low",
          data.threshold?.toString() || "",
          imageFilename
        ]);
      });

      const csvContent = rows.map(r => r.join(",")).join("\n");
      zip.file("history.csv", csvContent);

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "second_look_export.zip");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export data:", err);
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-fadeUp max-w-[720px] mx-auto">
        <div className="mb-8">
          <h1 className="text-[32px] font-semibold mb-2">Profile</h1>
          <div className="h-[36px] w-[240px] bg-paper rounded-md animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-surface border border-hairline rounded-md max-w-[720px] mx-auto animate-fadeUp">
        <UserIcon className="w-12 h-12 text-ink-muted mb-4 opacity-50 stroke-[1.5]" aria-hidden="true" />
        <p className="text-body font-semibold text-ink mb-2">Not signed in</p>
        <p className="text-body-sm text-ink-muted mb-6">Sign in to view your profile and manage data.</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-teal text-surface font-semibold text-sm hover:bg-teal-dark transition-colors focus-ring"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fadeUp max-w-[720px] mx-auto pb-20">
      
      <div className="mb-10">
        <h1 className="mb-4">Profile & Settings</h1>
        <p className="text-body text-ink-muted">
          Manage your account and data.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Account Info */}
        <section className="bg-surface rounded-md border border-hairline p-6">
          <h2 className="text-body font-semibold text-ink mb-6">Account Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-[13px] font-semibold text-ink-muted uppercase tracking-wide mb-1">Email</p>
              <p className="text-body text-ink font-medium">{user.email || "No email available"}</p>
            </div>
            {user.metadata.creationTime && (
              <div>
                <p className="text-[13px] font-semibold text-ink-muted uppercase tracking-wide mb-1">Member Since</p>
                <p className="text-body text-ink font-medium">
                  {new Date(user.metadata.creationTime).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Data & Privacy */}
        <section className="bg-surface rounded-md border border-hairline p-6">
          <h2 className="text-body font-semibold text-ink mb-6">Data & Privacy</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-body font-medium text-ink">Export Analysis History</p>
              <p className="text-body-sm text-ink-muted mt-1 max-w-sm">
                Download a ZIP file containing the results, dates, and original images of all your past scans.
              </p>
            </div>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-md border border-hairline bg-paper text-ink font-semibold text-sm hover:bg-surface focus-ring transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isExporting ? "Exporting..." : "Export to ZIP"}
            </button>
          </div>
        </section>

        {/* Danger Zone / Sign Out */}
        <section className="bg-surface rounded-md border border-hairline p-6 mt-8">
          <h2 className="text-body font-semibold text-ink mb-6">Session</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-body font-medium text-ink">Sign Out</p>
              <p className="text-body-sm text-ink-muted mt-1 max-w-sm">
                Securely log out of your account on this device.
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-brick/10 text-brick font-semibold text-sm hover:bg-brick/20 focus-ring transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
