'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, ArrowRight } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '0',
    description: 'Perfect for getting started',
    features: [
      'Up to 3 repositories',
      'Weekly scans',
      'Email alerts',
      'Community support',
      'Manual pull requests',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '499',
    description: 'For active development teams',
    features: [
      'Unlimited repositories',
      'Real-time scanning',
      'Automated PR creation',
      'Priority support',
      'DevOps generator',
      'Environment sync',
      'API access',
      'Audit logs',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Team',
    price: 'Custom',
    description: 'For large organizations',
    features: [
      'Everything in Pro',
      'Team management',
      'SSO/SAML',
      'Advanced analytics',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
      'Compliance reports',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Choose the plan that fits your team. Always include what you need.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative transition-all duration-300 animate-slide-in-up ${
                plan.highlighted
                  ? 'md:scale-105 md:z-10'
                  : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Glow Background */}
              {plan.highlighted && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl -z-10 animate-glow-pulse" />
              )}

              <div
                className={`glass rounded-2xl border-2 p-8 h-full flex flex-col transition-all hover:translate-y-[-4px] ${
                  plan.highlighted
                    ? 'border-primary/50 glow-cyan'
                    : 'border-border/50'
                }`}
              >
                {/* Header */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm text-foreground/60">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    {plan.price !== 'Custom' && <span className="text-5xl font-bold">Rs </span>}
                    <span className="text-5xl font-bold">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-foreground/60">/mo</span>}
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  asChild
                  className={`w-full mb-8 transition-all hover:shadow-lg text-white ${
                    plan.highlighted
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/50'
                      : 'border border-border bg-transparent hover:bg-muted'
                  }`}
                >
                  <a href="https://app.wrathops.dev" target="_blank" rel="noopener noreferrer">
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>

                {/* Features */}
                <div className="space-y-4 flex-1">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 animate-slide-in-left" style={{ animationDelay: `${0.1 + i * 0.05}s` }}>
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 space-y-8">
          <h3 className="text-2xl font-bold text-center">Frequently Asked Questions</h3>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                q: 'How does WrathOps access my code?',
                a: 'WrathOps only accesses the code you authorize through your repository connection. We scan your code in our secure environment and never store your source code or secrets.',
              },
              {
                q: 'Is my code modified automatically?',
                a: 'No, WrathOps creates a pull request with proposed fixes. You always review and approve the changes before they are merged into your repository.',
              },
              {
                q: 'Is WrathOps safe to use?',
                a: 'Yes. WrathOps uses industry-standard encryption, secure environments, and follows SOC 2 compliance standards. We never expose or log your secrets.',
              },
              {
                q: 'Can I use WrathOps with private repositories?',
                a: 'Absolutely. WrathOps supports private repositories through OAuth authentication. Your code remains private and secure at all times.',
              },
              {
                q: 'What types of secrets does WrathOps detect?',
                a: 'We detect API keys, database passwords, auth tokens, private keys, AWS credentials, and more. Our detection engine continuously updates to catch new secret patterns.',
              },
              {
                q: 'Can I integrate WrathOps with my CI/CD pipeline?',
                a: 'Yes. We provide API access and webhooks so you can integrate WrathOps into your existing CI/CD workflows automatically.',
              },
            ].map((item, i) => (
              <div key={i} className="glass rounded-xl border border-border/50 p-6">
                <h4 className="font-semibold mb-2">{item.q}</h4>
                <p className="text-sm text-foreground/70">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
