"use client";

import { Header } from '@/app/_shared/Header';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SignUpButton, useUser } from '@clerk/nextjs';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out UIUX Mock',
    features: [
      'Up to 2 projects',
      'Basic screen generation',
      'Community support',
      'Export as PNG',
    ],
    limitations: [
      'No code export',
      'No AI editing',
      'No new screen generation',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: '/month',
    description: 'For designers and developers who need more',
    features: [
      'Unlimited projects',
      'Unlimited screen generation',
      'AI-powered editing',
      'Export HTML/CSS code',
      'Download screenshots',
      'Priority support',
      'Early access to new features',
    ],
    limitations: [],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Pro Yearly',
    price: '$7.99',
    period: '/month',
    description: 'Save 20% with annual billing',
    features: [
      'Everything in Pro',
      'Billed annually ($95.88/year)',
      '2 months free',
      'Priority feature requests',
    ],
    limitations: [],
    cta: 'Start Free Trial',
    popular: false,
  },
];

export default function PricingPage() {
  const { isSignedIn } = useUser();

  return (
    <main className="min-h-screen bg-slate-950">
      <Header />
      
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-fuchsia-500/10 blur-[120px]" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-400">
              Start for free. Upgrade when you need more power.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-8 ${
                  plan.popular
                    ? 'border-violet-500 bg-violet-500/5'
                    : 'border-white/10 bg-slate-900/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-1 text-xs font-medium text-white">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="mb-2 text-xl font-semibold text-white">{plan.name}</h3>
                  <div className="mb-2 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-slate-400">{plan.period}</span>
                  </div>
                  <p className="text-sm text-slate-400">{plan.description}</p>
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
                      <span className="text-sm text-slate-300">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation) => (
                    <li key={limitation} className="flex items-start gap-3 opacity-50">
                      <span className="mt-0.5 h-5 w-5 flex-shrink-0 text-center text-slate-500">✕</span>
                      <span className="text-sm text-slate-400">{limitation}</span>
                    </li>
                  ))}
                </ul>

                {isSignedIn ? (
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600'
                        : 'bg-slate-800 text-white hover:bg-slate-700'
                    }`}
                  >
                    {plan.name === 'Free' ? 'Current Plan' : plan.cta}
                  </Button>
                ) : (
                  <SignUpButton mode="modal">
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600'
                          : 'bg-slate-800 text-white hover:bg-slate-700'
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </SignUpButton>
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm text-slate-500">
              All plans include a 2-day free trial. No credit card required.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
