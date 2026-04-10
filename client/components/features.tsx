'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lock, GitBranch, FileJson, ArrowRight, Database, Shield, Code2 } from 'lucide-react'

const features = [
  {
    icon: Lock,
    title: 'Secret Detection',
    description: 'Automatically detects hardcoded API keys, passwords, tokens, and credentials',
    examples: ['API Keys', 'Database passwords', 'Auth tokens', 'Private keys'],
    color: 'from-red-500/20 to-red-500/5',
    borderColor: 'border-red-500/20',
  },
  {
    icon: Code2,
    title: 'Auto Fix Engine',
    description: 'Replaces secrets with environment variables in seconds',
    examples: [
      'const KEY = process.env.API_KEY',
      'const PASS = process.env.DB_PASSWORD',
      'const TOKEN = process.env.AUTH_TOKEN',
    ],
    color: 'from-secondary/20 to-secondary/5',
    borderColor: 'border-secondary/20',
  },
  {
    icon: GitBranch,
    title: 'PR-Based Workflow',
    description: 'Creates pull requests automatically for review before deploying',
    examples: ['Automated commits', 'Fix validation', 'Developer review', 'Safe merge'],
    color: 'from-primary/20 to-primary/5',
    borderColor: 'border-primary/20',
  },
  {
    icon: FileJson,
    title: 'DevOps Generator',
    description: 'Generates Docker, docker-compose, and setup scripts on demand',
    examples: ['Dockerfile', 'docker-compose.yml', '.env.example', 'Setup scripts'],
    color: 'from-amber-500/20 to-amber-500/5',
    borderColor: 'border-amber-500/20',
  },
]

export default function Features() {
  return (
    <section id="features" className="relative py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Powerful Features
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Everything you need to secure your codebase automatically
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className={`glass rounded-2xl border ${feature.borderColor} p-8 glass-hover group animate-slide-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon & Title */}
                <div className="flex items-start gap-4 mb-6">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${feature.color} border ${feature.borderColor} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{feature.title}</h3>
                    <p className="text-sm text-foreground/60">{feature.description}</p>
                  </div>
                </div>

                {/* Examples */}
                <div className="space-y-2">
                  {feature.examples.map((example, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-foreground/70 animate-slide-in-left" style={{ animationDelay: `${0.1 + i * 0.05}s` }}>
                      <div className="w-1.5 h-1.5 rounded-full bg-primary group-hover:scale-150 transition-transform" />
                      <span className="font-mono text-xs">{example}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Real Dashboard UI */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold">Dashboard Interface</h3>
          
          <div className="glass rounded-2xl border border-border/50 p-8 overflow-hidden">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/50">
              <div>
                <h4 className="text-lg font-bold">Recent Scans</h4>
                <p className="text-sm text-foreground/50">Last 30 days activity</p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">All</Badge>
                <Badge variant="secondary">Resolved</Badge>
              </div>
            </div>

            {/* Scan Results Table */}
            <div className="space-y-3">
              {[
                { project: 'backend-api', issues: 3, status: 'fixed', time: '2 hours ago' },
                { project: 'web-app', issues: 1, status: 'fixed', time: '5 hours ago' },
                { project: 'mobile-sdk', issues: 5, status: 'fixed', time: '1 day ago' },
              ].map((scan, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/50 hover:border-primary/30 transition-colors">
                  <div className="flex-1">
                    <h5 className="font-semibold">{scan.project}</h5>
                    <p className="text-xs text-foreground/50">{scan.issues} secrets found</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs font-mono text-secondary">✓ {scan.status}</p>
                      <p className="text-xs text-foreground/50">{scan.time}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-foreground/30" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DevOps Generator */}
          <div className="glass rounded-2xl border border-border/50 p-8">
            <div className="mb-6 pb-6 border-b border-border/50">
              <h4 className="text-lg font-bold mb-1">DevOps Generator</h4>
              <p className="text-sm text-foreground/50">Generate secure configurations for your project</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Input */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Repository URL</label>
                  <input
                    type="text"
                    placeholder="https://github.com/user/repo"
                    className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Select Templates</label>
                  <div className="space-y-2">
                    {['Dockerfile', 'docker-compose.yml', '.env.example', 'Setup Script'].map((template) => (
                      <label key={template} className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                        <span className="text-sm">{template}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Output Preview */}
              <div className="space-y-2">
                <span className="text-sm font-medium">Generated Files</span>
                <div className="code-block h-64">
                  <div className="space-y-1 text-xs text-foreground/70">
                    <div>📄 Dockerfile</div>
                    <div>📄 docker-compose.yml</div>
                    <div>📄 .env.example</div>
                    <div>📄 setup.sh</div>
                    <div>📄 README.md</div>
                    <div className="text-primary mt-4">✓ Ready to download</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
