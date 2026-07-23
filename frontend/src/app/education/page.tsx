"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronDown, ArrowRight, Circle, HelpCircle, 
  Paintbrush, Maximize, TrendingUp, Search, User
} from 'lucide-react';

const SECTIONS = [
  { id: 'warning-signs', title: 'Warning Signs (ABCDE)' },
  { id: 'self-exam', title: 'Self-Examination Guide' },
  { id: 'risk-factors', title: 'Risk Factors' },
  { id: 'prevention', title: 'Prevention' },
  { id: 'when-to-see-a-doctor', title: 'When to See a Doctor' },
];

const ABCDE = [
  { letter: "A", title: "Asymmetry", desc: "One half of the mole does not match the other half.", icon: Circle },
  { letter: "B", title: "Border", desc: "Edges are ragged, blurred, or irregular.", icon: HelpCircle },
  { letter: "C", title: "Color", desc: "Not uniform. Includes multiple shades.", icon: Paintbrush },
  { letter: "D", title: "Diameter", desc: "Larger than 6mm (about a pencil eraser).", icon: Maximize },
  { letter: "E", title: "Evolving", desc: "Changing in size, shape, or color over time.", icon: TrendingUp },
];

const SELF_EXAM = [
  "Examine your body front and back in the mirror, then right and left sides with arms raised.",
  "Bend elbows and look carefully at forearms, underarms, and palms.",
  "Look at the backs of your legs and feet, spaces between toes, and soles.",
  "Examine the back of your neck and scalp with a hand mirror. Part hair for a closer look.",
  "Finally, check your back and buttocks with a hand mirror."
];

export default function EducationPage() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    [SECTIONS[0].id]: true,
    [SECTIONS[1].id]: true,
    [SECTIONS[2].id]: true,
    [SECTIONS[3].id]: true,
    [SECTIONS[4].id]: true,
  });

  // Simple scroll spy logic
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = SECTIONS.map(s => document.getElementById(s.id));
      let currentId = SECTIONS[0].id;
      for (const el of sectionElements) {
        if (el && window.scrollY >= (el.offsetTop - 100)) {
          currentId = el.id;
        }
      }
      setActiveSection(currentId);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAccordion = (id: string) => {
    // If mobile (window < 1024), act as single-open accordion. If desktop, independent toggle.
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      setOpenAccordions(prev => {
        const next = Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {});
        return { ...next, [id]: !prev[id] };
      });
    } else {
      setOpenAccordions(prev => ({ ...prev, [id]: !prev[id] }));
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      // open if closed
      setOpenAccordions(prev => ({ ...prev, [id]: true }));
      // scroll
      window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 w-full max-w-[1120px] mx-auto animate-fadeUp">
      
      {/* TOC Rail (Desktop) / Chips (Mobile) */}
      <div className="lg:w-64 shrink-0">
        <div className="sticky top-24 lg:top-8 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0 border-b lg:border-b-0 border-hairline bg-paper z-20">
          <span className="hidden lg:block text-body-sm font-semibold text-ink-muted uppercase tracking-wide mb-4 px-3">
            Contents
          </span>
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`
                whitespace-nowrap px-4 py-2 lg:py-2.5 rounded-full lg:rounded-md text-[14px] lg:text-[15px] font-medium transition-colors text-left focus-ring
                ${activeSection === s.id 
                  ? 'bg-teal/10 text-teal-dark' 
                  : 'text-ink-muted hover:bg-surface border lg:border-none border-hairline'}
              `}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-[720px] pb-32">
        <div className="mb-12">
          <h1 className="mb-4">Skin health</h1>
          <p className="text-body text-ink-muted">
            Understanding the warning signs and how to protect yourself.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          
          {/* Section 1: Warning Signs */}
          <section id="warning-signs" className="bg-surface rounded-md border border-hairline overflow-hidden">
            <button 
              onClick={() => toggleAccordion('warning-signs')}
              className="w-full flex items-center justify-between px-6 py-5 focus-ring hover:bg-paper transition-colors"
              aria-expanded={openAccordions['warning-signs']}
            >
              <h2 className="text-ink">Warning Signs</h2>
              <ChevronDown className={`w-5 h-5 text-ink-muted transition-transform ${openAccordions['warning-signs'] ? 'rotate-180' : ''}`} />
            </button>
            <div className={`px-6 pb-6 pt-2 transition-all ${openAccordions['warning-signs'] ? 'block' : 'hidden'}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {ABCDE.map(({ letter, title, desc, icon: Icon }) => (
                  <div key={letter} className="bg-paper p-4 rounded-md border border-hairline flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-display font-semibold text-2xl text-teal">{letter}</span>
                      <Icon className="w-5 h-5 text-ink-muted stroke-[1.5]" />
                    </div>
                    <div>
                      <h3 className="text-body-sm font-semibold text-ink">{title}</h3>
                      <p className="text-[13px] text-ink-muted mt-1 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 2: Self-Exam */}
          <section id="self-exam" className="bg-surface rounded-md border border-hairline overflow-hidden">
            <button 
              onClick={() => toggleAccordion('self-exam')}
              className="w-full flex items-center justify-between px-6 py-5 focus-ring hover:bg-paper transition-colors"
              aria-expanded={openAccordions['self-exam']}
            >
              <h2 className="text-ink">Self-Examination Guide</h2>
              <ChevronDown className={`w-5 h-5 text-ink-muted transition-transform ${openAccordions['self-exam'] ? 'rotate-180' : ''}`} />
            </button>
            <div className={`px-6 pb-6 pt-2 transition-all ${openAccordions['self-exam'] ? 'block' : 'hidden'}`}>
              <div className="flex flex-col gap-4">
                {SELF_EXAM.map((step, idx) => (
                  <div key={idx} className="flex gap-4 p-4 border border-hairline rounded-md">
                    <div className="w-8 h-8 rounded-full bg-paper border border-hairline shrink-0 flex items-center justify-center font-mono font-semibold text-teal-dark">
                      {idx + 1}
                    </div>
                    <p className="text-body-sm text-ink pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 3: Risk Factors */}
          <section id="risk-factors" className="bg-surface rounded-md border border-hairline overflow-hidden">
            <button 
              onClick={() => toggleAccordion('risk-factors')}
              className="w-full flex items-center justify-between px-6 py-5 focus-ring hover:bg-paper transition-colors"
              aria-expanded={openAccordions['risk-factors']}
            >
              <h2 className="text-ink">Risk Factors</h2>
              <ChevronDown className={`w-5 h-5 text-ink-muted transition-transform ${openAccordions['risk-factors'] ? 'rotate-180' : ''}`} />
            </button>
            <div className={`px-6 pb-6 pt-2 transition-all ${openAccordions['risk-factors'] ? 'block' : 'hidden'}`}>
              <ul className="list-disc pl-5 space-y-2 text-body-sm text-ink-muted">
                <li>A lighter natural skin color.</li>
                <li>Skin that burns, freckles, reddens easily, or becomes painful in the sun.</li>
                <li>Blue or green eyes.</li>
                <li>Blond or red hair.</li>
                <li>Certain types and a large number of moles.</li>
                <li>A family history of skin cancer.</li>
                <li>A personal history of skin cancer.</li>
                <li>Older age.</li>
              </ul>
            </div>
          </section>

          {/* Section 4: Prevention */}
          <section id="prevention" className="bg-surface rounded-md border border-hairline overflow-hidden">
            <button 
              onClick={() => toggleAccordion('prevention')}
              className="w-full flex items-center justify-between px-6 py-5 focus-ring hover:bg-paper transition-colors"
              aria-expanded={openAccordions['prevention']}
            >
              <h2 className="text-ink">Prevention</h2>
              <ChevronDown className={`w-5 h-5 text-ink-muted transition-transform ${openAccordions['prevention'] ? 'rotate-180' : ''}`} />
            </button>
            <div className={`px-6 pb-6 pt-2 transition-all ${openAccordions['prevention'] ? 'block' : 'hidden'}`}>
              <ul className="list-disc pl-5 space-y-2 text-body-sm text-ink-muted">
                <li>Seek shade, especially during midday hours.</li>
                <li>Wear clothing that covers your arms and legs.</li>
                <li>Wear a hat with a wide brim to shade your face, head, ears, and neck.</li>
                <li>Wear sunglasses that wrap around and block both UVA and UVB rays.</li>
                <li>Use sunscreen with a sun protection factor (SPF) of 15 or higher, and both UVA and UVB (broad spectrum) protection.</li>
                <li>Avoid indoor tanning.</li>
              </ul>
            </div>
          </section>

          {/* Section 5: When to See a Doctor */}
          <section id="when-to-see-a-doctor" className="bg-surface rounded-md border border-hairline overflow-hidden">
            <button 
              onClick={() => toggleAccordion('when-to-see-a-doctor')}
              className="w-full flex items-center justify-between px-6 py-5 focus-ring hover:bg-paper transition-colors"
              aria-expanded={openAccordions['when-to-see-a-doctor']}
            >
              <h2 className="text-ink">When to See a Doctor</h2>
              <ChevronDown className={`w-5 h-5 text-ink-muted transition-transform ${openAccordions['when-to-see-a-doctor'] ? 'rotate-180' : ''}`} />
            </button>
            <div className={`px-6 pb-6 pt-2 transition-all ${openAccordions['when-to-see-a-doctor'] ? 'block' : 'hidden'}`}>
              <p className="text-body-sm text-ink-muted mb-6">
                If you notice a new spot that is different from others on your body, or a spot that changes, itches, or bleeds, you should make an appointment with a board-certified dermatologist.
              </p>
              <Link
                href="/doctors"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-teal text-surface font-semibold text-body-sm hover:bg-teal-dark transition-colors focus-ring"
              >
                <Search className="w-4 h-4" />
                Find Care Near You
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
