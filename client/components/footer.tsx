'use client'

import Link from 'next/link'
import { Github, Mail, Globe, ArrowRight } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative border-t border-border/50 bg-gradient-to-t from-muted/30 to-transparent pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Section */}
        <div className="glass rounded-2xl border border-primary/30 p-12 mb-16 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to secure your code?</h3>
          <p className="text-foreground/60 mb-8 max-w-xl mx-auto">
            Start protecting your repositories today.
          </p>
          <a
            href="https://app.wrathops.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
          >
            Start Scan
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                WrathOps
              </span>
            </div>
            <p className="text-sm text-foreground/60">
              Automatically fix security issues in your code before they go live.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://github.com/ayonpaul8906/PhantomKey"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-border hover:border-primary hover:text-primary transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@wrathops.dev"
                className="p-2 rounded-lg border border-border hover:border-primary hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="https://wrathops.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-border hover:border-primary hover:text-primary transition-colors"
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#workflow" className="text-foreground/60 hover:text-primary transition-colors">
                  How it Works
                </a>
              </li>
              <li>
                <a href="#features" className="text-foreground/60 hover:text-primary transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-foreground/60 hover:text-primary transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="https://app.wrathops.dev" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-primary transition-colors">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://docs.wrathops.dev" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-primary transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="https://blog.wrathops.dev" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="https://github.com/ayonpaul8906/PhantomKey" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-primary transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://status.wrathops.dev" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-primary transition-colors">
                  Status
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:hello@wrathops.dev" className="text-foreground/60 hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-foreground/50">
            © {currentYear} WrathOps. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-foreground/50">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
