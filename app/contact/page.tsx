'use client'

import PageWrapper from '@/components/layout/PageWrapper'
import { Mail } from 'lucide-react'

export default function ContactPage() {
  return (
    <PageWrapper>
      <div className="bg-white min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="mb-16">
            <h1 className="text-5xl font-bold text-text-primary mb-6">
              Contact
            </h1>
            <div className="w-16 h-1 bg-brand-black" />
          </div>

          <div className="space-y-12">
            <div>
              <p className="text-xl text-text-secondary leading-relaxed">
                Have a question, a problem, or something to say?
                We read every message.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-6 bg-surface-muted rounded-2xl">
                <div className="w-12 h-12 bg-brand-black rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-text-primary mb-1">
                    Email
                  </p>
                  <a
                    href="mailto:lusamalungisha1@gmail.com"
                    className="text-text-secondary hover:text-text-primary transition-colors"
                  >
                    lusamalungisha1@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-surface-border">
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Response times
              </h2>
              <div className="space-y-3 text-text-secondary">
                <p>General enquiries — within 48 hours</p>
                <p>Creator applications — within 48 hours</p>
                <p>Billing and refunds — within 24 hours</p>
                <p>Technical issues — within 24 hours</p>
              </div>
            </div>

            <div className="pt-8 border-t border-surface-border">
              <p className="text-text-faint text-sm">
                TryMyApp.uk is an independent platform built and operated
                by Lusa Malungisha. We are a small team — your message
                goes directly to the person who built this.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
