import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const PRICING = {
  builder: {
    amount_cents: 2900,
    label: 'Builder Tier',
    description: 'Subdomain + featured placement',
    type: 'builder_tier' as const,
    platform_cut: 2900,
    creator_payout: 0,
  },
  launch: {
    amount_cents: 9700,
    label: 'Launch Tier — Founding Price',
    description: 'Featured placement + guaranteed creator review',
    type: 'launch_tier' as const,
    platform_cut: 4700,
    creator_payout: 5000,
  },
} as const

export const FOUNDING_LIMIT = parseInt(
  process.env.NEXT_PUBLIC_FOUNDING_LIMIT ?? '50'
)
export const FOUNDING_PRICE_CENTS = parseInt(
  process.env.NEXT_PUBLIC_FOUNDING_PRICE_USD ?? '97'
) * 100
