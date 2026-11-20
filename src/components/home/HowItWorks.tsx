"use client";

import { Settings, Palette, CheckCircle, Package } from "lucide-react";

const steps = [
  {
    icon: Settings,
    title: "Configure",
    description: "Choose your product specifications",
  },
  {
    icon: Palette,
    title: "Design",
    description: "Create or upload your artwork",
  },
  {
    icon: CheckCircle,
    title: "Approve",
    description: "Review and approve your proof",
  },
  {
    icon: Package,
    title: "Receive",
    description: "We produce and deliver",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-text-primary mb-12">
        How It Works
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={step.title} className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
              <step.icon className="w-6 h-6" />
            </div>
            <div className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">
              Step {index + 1}
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-1">
              {step.title}
            </h3>
            <p className="text-sm text-text-secondary">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
