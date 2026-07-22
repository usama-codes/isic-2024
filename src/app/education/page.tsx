import React from "react";
import { Info, Sun, ShieldCheck, Search } from "lucide-react";

export default function EducationPage() {
  return (
    <div className="animate-fadeUp max-w-3xl mx-auto">
      <h1 className="font-instrument text-4xl mb-6">Skin Health Education</h1>
      <p className="text-text-secondary text-lg mb-12 leading-relaxed">
        Understanding your skin is the first step toward early detection. Familiarize yourself with the warning signs and self-examination techniques.
      </p>

      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-accent/10 text-accent">
              <Search className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-semibold">The ABCDE Rule</h2>
          </div>
          <p className="text-text-secondary mb-6">Dermatologists use the ABCDE heuristic to identify suspicious moles or lesions. Look for these signs during your monthly skin checks:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-bg-card border border-border-subtle p-5 rounded-xl">
              <h3 className="text-lg font-semibold text-accent mb-2">A — Asymmetry</h3>
              <p className="text-sm text-text-tertiary">One half of the mole does not match the other half in shape.</p>
            </div>
            <div className="bg-bg-card border border-border-subtle p-5 rounded-xl">
              <h3 className="text-lg font-semibold text-accent mb-2">B — Border</h3>
              <p className="text-sm text-text-tertiary">The edges are ragged, blurred, or irregular.</p>
            </div>
            <div className="bg-bg-card border border-border-subtle p-5 rounded-xl">
              <h3 className="text-lg font-semibold text-accent mb-2">C — Color</h3>
              <p className="text-sm text-text-tertiary">The color is not uniform and may include shades of black, brown, and tan, or even white, gray, red, pink, or blue.</p>
            </div>
            <div className="bg-bg-card border border-border-subtle p-5 rounded-xl">
              <h3 className="text-lg font-semibold text-accent mb-2">D — Diameter</h3>
              <p className="text-sm text-text-tertiary">The lesion is larger than 6 millimeters across (about the size of a pencil eraser), although they can be smaller.</p>
            </div>
            <div className="bg-bg-card border border-border-subtle p-5 rounded-xl md:col-span-2">
              <h3 className="text-lg font-semibold text-accent mb-2">E — Evolving</h3>
              <p className="text-sm text-text-tertiary">The mole looks different from the rest or is changing in size, shape, or color. If a mole starts to itch, bleed, or crust over, see a doctor immediately.</p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-warn-bg text-warn">
              <Sun className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-semibold">Prevention & Protection</h2>
          </div>
          <ul className="space-y-4 text-text-secondary">
            <li className="flex gap-3">
              <ShieldCheck className="w-5 h-5 text-safe shrink-0 mt-0.5" />
              <span><strong>Seek shade</strong> between 10 AM and 4 PM when UV rays are strongest.</span>
            </li>
            <li className="flex gap-3">
              <ShieldCheck className="w-5 h-5 text-safe shrink-0 mt-0.5" />
              <span><strong>Wear protective clothing</strong>, including a wide-brimmed hat and UV-blocking sunglasses.</span>
            </li>
            <li className="flex gap-3">
              <ShieldCheck className="w-5 h-5 text-safe shrink-0 mt-0.5" />
              <span><strong>Apply broad-spectrum sunscreen</strong> (SPF 30 or higher) every day, even when it&apos;s cloudy. Reapply every two hours or after swimming/sweating.</span>
            </li>
            <li className="flex gap-3">
              <ShieldCheck className="w-5 h-5 text-safe shrink-0 mt-0.5" />
              <span><strong>Avoid tanning beds</strong>. Indoor tanning has been shown to increase the risk of melanoma by up to 75%.</span>
            </li>
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Info className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-semibold">Understanding Model Results</h2>
          </div>
          <div className="bg-bg-raised border border-border-subtle p-6 rounded-2xl text-text-secondary space-y-4">
            <p>Our deep learning model, an EfficientNet B0 architecture, was trained on the <strong>ISIC 2024 dataset</strong>. It analyzes visual features in dermoscopic images that are correlated with skin cancer.</p>
            <p>The output probability is a statistical estimate based on patterns it learned during training. It is <strong>not a medical diagnosis</strong>. AI tools can sometimes produce false positives (flagging a benign mole as risky) or false negatives (missing a dangerous lesion).</p>
            <p>If you have any doubts about a mole, regardless of what the model predicts, <strong>always consult a board-certified dermatologist</strong>.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
