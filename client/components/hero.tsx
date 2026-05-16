'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Github } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-40 right-1/3 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 animate-fade-in">
            <span className="text-xs font-semibold text-primary">SECURITY FOR DEVELOPERS</span>
          </div>

          {/* Headline */}
          <div className="space-y-4 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="text-balance">
                Automatically Fix Security Issues
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Before They Go Live
              </span>
            </h1>

            <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto text-balance">
              WrathOps scans your code, detects hardcoded secrets, and creates pull requests with secure fixes instantly. No more manual security reviews.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 transition-all hover:shadow-lg hover:shadow-primary/50"
              asChild
            >
              <a href="https://app.wrathops.dev" target="_blank" rel="noopener noreferrer">
                Connect Repository
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border hover:bg-muted px-8"
              asChild
            >
              <a href="#workflow">View Demo</a>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-foreground/60 animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-background bg-gradient-to-br from-primary to-secondary animate-pulse-ring"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
              <span>Used by 100+ developers</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <a
              href="https://github.com/ayonpaul8906/PhantomKey"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Github className="w-4 h-4" />
              Star on GitHub
            </a>
          </div>
        </div>

        {/* Featured Demo Visual */}
        <div className="mt-20 relative animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-2xl blur-2xl" />
          <div className="relative glass rounded-2xl p-8 md:p-12 border border-primary/20 overflow-hidden glow-cyan hover:glow-cyan-lg transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-mono text-primary">$ wrathops scan</span>
              </div>
              <div className="space-y-2 text-sm font-mono text-foreground/70">
                <div className="flex items-center gap-2 animate-slide-in-left" style={{ animationDelay: '0s' }}>
                  <span className="text-primary">→</span>
                  <span>Scanning repository for secrets...</span>
                </div>
                <div className="flex items-center gap-2 animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
                  <span className="text-primary">→</span>
                  <span>Found 2 hardcoded API keys</span>
                </div>
                <div className="flex items-center gap-2 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
                  <span className="text-primary">→</span>
                  <span>Found 1 database password</span>
                </div>
                <div className="pt-2 flex items-center gap-2 animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
                  <span className="text-secondary">✓</span>
                  <span>Pull request created: <span className="text-secondary">#42</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
