'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, Clock, TrendingUp, GitPullRequest, Shield, Lock, Zap } from 'lucide-react'

const mockRepositories = [
  { id: 1, name: 'backend-api', secrets: 3, status: 'fixed', lastScan: '2 hours ago', color: 'from-green-500/20' },
  { id: 2, name: 'web-app', secrets: 1, status: 'fixed', lastScan: '5 hours ago', color: 'from-green-500/20' },
  { id: 3, name: 'mobile-sdk', secrets: 5, status: 'fixed', lastScan: '1 day ago', color: 'from-green-500/20' },
  { id: 4, name: 'data-service', secrets: 2, status: 'fixed', lastScan: '3 days ago', color: 'from-green-500/20' },
]

const mockIssues = [
  { id: 1, file: 'src/config.js', type: 'API Key', severity: 'high', status: 'fixed', pr: '#42' },
  { id: 2, file: '.env', type: 'Database Password', severity: 'critical', status: 'fixed', pr: '#41' },
  { id: 3, file: 'config/aws.js', type: 'AWS Credentials', severity: 'high', status: 'fixed', pr: '#40' },
  { id: 4, file: 'src/auth.js', type: 'JWT Secret', severity: 'high', status: 'fixed', pr: '#39' },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <section className="relative py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Dashboard Preview
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Experience the power and simplicity of the WrathOps dashboard
          </p>
        </div>

        {/* Dashboard Container */}
        <div className="glass rounded-2xl border border-border/50 overflow-hidden">
          {/* Header */}
          <div className="border-b border-border/50 p-6 bg-muted/30">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">Security Dashboard</h3>
                <p className="text-sm text-foreground/60">Monitor and manage all your repositories</p>
              </div>
              <div className="flex gap-2">
                {['Overview', 'Issues', 'Analytics', 'Settings'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.toLowerCase()
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground/60 hover:text-foreground'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: Shield, label: 'Total Issues Fixed', value: '47', color: 'text-green-400' },
                    { icon: Clock, label: 'Avg. Fix Time', value: '12m', color: 'text-primary' },
                    { icon: GitPullRequest, label: 'PRs Created', value: '34', color: 'text-secondary' },
                    { icon: TrendingUp, label: 'This Month', value: '+12', color: 'text-amber-400' },
                  ].map((stat, i) => {
                    const Icon = stat.icon
                    return (
                      <div key={i} className="glass rounded-lg border border-border/50 p-4 hover:border-primary/30 transition-all hover:translate-y-[-2px] animate-slide-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                        <Icon className={`w-5 h-5 mb-3 ${stat.color}`} />
                        <p className="text-xs text-foreground/60 mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                    )
                  })}
                </div>

                {/* Repositories */}
                <div>
                  <h4 className="text-lg font-bold mb-4">Connected Repositories</h4>
                  <div className="space-y-3">
                    {mockRepositories.map((repo) => (
                      <div
                        key={repo.id}
                        className="glass rounded-lg border border-border/50 p-4 hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h5 className="font-semibold mb-1">{repo.name}</h5>
                            <p className="text-xs text-foreground/50">Last scan: {repo.lastScan}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm font-mono">
                                <span className="text-amber-400">{repo.secrets}</span>
                                <span className="text-foreground/50"> secrets</span>
                              </p>
                              <p className="text-xs text-green-400">✓ Fixed</p>
                            </div>
                            <div className="w-px h-8 bg-border" />
                            <div className="text-right text-xs">
                              <Badge variant="secondary">Auto Scan</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'issues' && (
              <div>
                <h4 className="text-lg font-bold mb-4">Recent Issues</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-3 px-4 text-foreground/60 font-medium">File</th>
                        <th className="text-left py-3 px-4 text-foreground/60 font-medium">Type</th>
                        <th className="text-left py-3 px-4 text-foreground/60 font-medium">Severity</th>
                        <th className="text-left py-3 px-4 text-foreground/60 font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-foreground/60 font-medium">Pull Request</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockIssues.map((issue) => (
                        <tr
                          key={issue.id}
                          className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-3 px-4 font-mono text-xs">{issue.file}</td>
                          <td className="py-3 px-4">{issue.type}</td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={issue.severity === 'critical' ? 'destructive' : 'default'}
                              className={issue.severity === 'critical' ? 'bg-red-500/20 text-red-400' : ''}
                            >
                              {issue.severity}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 text-green-400">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Fixed</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <a
                              href="#"
                              className="text-primary hover:underline font-mono"
                            >
                              {issue.pr}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Issues Over Time */}
                  <div className="glass rounded-lg border border-border/50 p-6">
                    <h4 className="font-bold mb-4">Issues Detected (Last 30 Days)</h4>
                    <div className="h-40 flex items-end justify-between gap-2">
                      {[12, 15, 8, 14, 11, 18, 9, 16, 13, 7, 19, 14].map((val, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-primary to-secondary rounded-t opacity-70 hover:opacity-100 transition-opacity"
                          style={{ height: `${(val / 20) * 100}%` }}
                          title={`Day ${i + 1}: ${val} issues`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Fix Rate */}
                  <div className="glass rounded-lg border border-border/50 p-6">
                    <h4 className="font-bold mb-4">Fix Success Rate</h4>
                    <div className="flex items-center justify-center h-40">
                      <div className="relative w-32 h-32">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-border"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray={`${251.2 * 0.98} 251.2`}
                            className="text-primary transition-all"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold">98%</span>
                          <span className="text-xs text-foreground/60">Fixed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Vulnerabilities */}
                <div className="glass rounded-lg border border-border/50 p-6">
                  <h4 className="font-bold mb-4">Top Vulnerability Types</h4>
                  <div className="space-y-3">
                    {[
                      { type: 'API Keys', count: 18, percentage: 38 },
                      { type: 'Database Passwords', count: 12, percentage: 26 },
                      { type: 'AWS Credentials', count: 11, percentage: 23 },
                      { type: 'Auth Tokens', count: 6, percentage: 13 },
                    ].map((item, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{item.type}</span>
                          <span className="text-foreground/60">{item.count}</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-secondary"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h4 className="font-bold mb-4">Scan Settings</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Auto-scan on push', enabled: true },
                      { label: 'Create PR automatically', enabled: true },
                      { label: 'Email notifications', enabled: true },
                      { label: 'Slack integration', enabled: false },
                    ].map((setting, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                        <span className="text-sm">{setting.label}</span>
                        <div
                          className={`w-10 h-6 rounded-full transition-colors ${
                            setting.enabled ? 'bg-primary' : 'bg-muted'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border/50 pt-6">
                  <h4 className="font-bold mb-4">Danger Zone</h4>
                  <button className="px-4 py-2 rounded-lg border border-destructive text-destructive hover:bg-destructive/10 transition-colors text-sm font-medium">
                    Disconnect Repository
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: 'Real-time Scanning',
              description: 'Scans happen instantly when code is pushed to your repository.',
            },
            {
              icon: Lock,
              title: 'Automatic Fixes',
              description: 'Secrets are replaced with environment variables automatically.',
            },
            {
              icon: GitPullRequest,
              title: 'PR-Based Workflow',
              description: 'All changes are submitted as pull requests for your review.',
            },
          ].map((feature, i) => {
            const Icon = feature.icon
            return (
              <div key={i} className="glass rounded-lg border border-border/50 p-6 text-center">
                <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h4 className="font-bold mb-2">{feature.title}</h4>
                <p className="text-sm text-foreground/60">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
