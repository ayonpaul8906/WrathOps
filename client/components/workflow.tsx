'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { CheckCircle2, AlertCircle, GitPullRequest, Shield, Eye, Code } from 'lucide-react'

const steps = [
  {
    id: 1,
    title: 'Code Push',
    description: 'Developer pushes code to repository',
    icon: Code,
    color: 'text-primary',
    content: (
      <div className="font-mono text-xs space-y-1 text-foreground/70">
        <div>$ git add .</div>
        <div>$ git commit -m "Add API integration"</div>
        <div className="text-primary">$ git push origin main</div>
      </div>
    )
  },
  {
    id: 2,
    title: 'Secret Detection',
    description: 'Automated scan finds hardcoded secrets',
    icon: AlertCircle,
    color: 'text-amber-400',
    content: (
      <div className="font-mono text-xs space-y-1.5 text-foreground/70">
        <div>const API_KEY = <span className="text-red-400">"sk-1234567890"</span></div>
        <div>const DB_PASSWORD = <span className="text-red-400">"mysql123!"</span></div>
        <div className="text-amber-400 mt-2">⚠ Hardcoded secrets detected</div>
      </div>
    )
  },
  {
    id: 3,
    title: 'Auto Fix',
    description: 'WrathOps replaces with env variables',
    icon: Shield,
    color: 'text-secondary',
    content: (
      <div className="font-mono text-xs space-y-1 text-foreground/70">
        <div>const API_KEY = <span className="text-secondary">process.env.API_KEY</span></div>
        <div>const DB_PASSWORD = <span className="text-secondary">process.env.DB_PASSWORD</span></div>
        <div className="text-secondary mt-2">✓ Created .env.example</div>
      </div>
    )
  },
  {
    id: 4,
    title: 'Pull Request',
    description: 'Creates PR with secure changes',
    icon: GitPullRequest,
    color: 'text-primary',
    content: (
      <div className="space-y-2 text-xs">
        <div className="p-2 rounded bg-primary/10 border border-primary/30">
          <div className="font-semibold text-primary">Fix: Removed hardcoded secrets</div>
          <div className="text-foreground/60 mt-1">2 files changed, 5 additions, 3 deletions</div>
        </div>
        <div className="text-foreground/60">
          <div>• index.js</div>
          <div>• .env.example</div>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: 'Review & Merge',
    description: 'Developer reviews and approves',
    icon: Eye,
    color: 'text-foreground/50',
    content: (
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2 text-secondary">
          <CheckCircle2 className="w-4 h-4" />
          <span>Approved</span>
        </div>
        <div className="text-foreground/60">Ready to merge safely</div>
      </div>
    )
  },
  {
    id: 6,
    title: 'Secure Code',
    description: 'Code deployed with zero secrets',
    icon: CheckCircle2,
    color: 'text-secondary',
    content: (
      <div className="space-y-2 text-xs">
        <div className="p-2 rounded bg-secondary/10 border border-secondary/30">
          <div className="font-semibold text-secondary">✓ No hardcoded secrets</div>
          <div className="text-foreground/60 mt-1">Environment variables configured</div>
        </div>
      </div>
    )
  }
]

export default function Workflow() {
  const [selectedStep, setSelectedStep] = useState(0)
  const currentStep = steps[selectedStep]
  const Icon = currentStep.icon

  return (
    <section id="workflow" className="relative py-20 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            The WrathOps Workflow
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            See exactly what happens when you push code to your repository
          </p>
        </div>

        {/* Main Visualization */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Left: Step List */}
          <div className="md:col-span-1 space-y-3">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setSelectedStep(index)}
                className={`w-full text-left p-4 rounded-lg transition-all duration-200 animate-slide-in-left ${
                  index === selectedStep
                    ? 'glass border-primary/50 glow-cyan'
                    : 'glass border-border/50 hover:border-border'
                } group`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Icon className={`w-5 h-5 ${step.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm mb-0.5">{step.title}</h3>
                    <p className="text-xs text-foreground/50 group-hover:text-foreground/70 transition-colors">
                      {step.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Right: Detailed View */}
          <div className="md:col-span-2 animate-slide-in-right">
            <div className="glass glow-cyan rounded-2xl border border-primary/30 p-8 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border/50">
                <div className={`p-3 rounded-lg bg-primary/10 border border-primary/30`}>
                  <Icon className={`w-6 h-6 ${currentStep.color}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{currentStep.title}</h3>
                  <p className="text-sm text-foreground/50">{currentStep.description}</p>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 mb-6">
                <div className="code-block">
                  {currentStep.content}
                </div>
              </div>

              {/* Step Counter */}
              <div className="text-sm text-foreground/50">
                Step {selectedStep + 1} of {steps.length}
              </div>
            </div>
          </div>
        </div>

        {/* Flow Diagram */}
        <div className="glass rounded-2xl border border-border/50 p-8">
          <h3 className="text-lg font-bold mb-6">Complete Flow</h3>
          <div className="overflow-x-auto">
            <div className="flex items-center gap-4 min-w-max pb-4">
              {steps.map((step, index) => {
                const StepIcon = step.icon
                return (
                  <div key={step.id} className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className={`p-3 rounded-lg border-2 ${
                        index <= selectedStep
                          ? 'bg-primary/20 border-primary/50'
                          : 'bg-muted border-border'
                      } transition-all`}>
                        <StepIcon className={`w-5 h-5 ${index <= selectedStep ? 'text-primary' : 'text-foreground/30'}`} />
                      </div>
                      <span className="text-xs font-mono text-foreground/50 text-center w-12">{step.id}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-12 h-0.5 ${
                        index < selectedStep
                          ? 'bg-gradient-to-r from-primary to-secondary'
                          : 'bg-border'
                      } transition-all`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
