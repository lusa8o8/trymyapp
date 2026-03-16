import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createServiceClient } from '@/lib/supabase-server'
import { stripe, PRICING, FOUNDING_LIMIT } from '@/lib/stripe'

function createRouteClient(request: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll() {},
      },
    }
  )
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteClient(request)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { app_id, tier } = await request.json()

    if (!app_id || !tier || !['builder', 'launch'].includes(tier)) {
      return NextResponse.json(
        { error: 'app_id and tier (builder|launch) required' },
        { status: 400 }
      )
    }

    const serviceClient = createServiceClient()

    const { data: app } = await serviceClient
      .from('apps')
      .select('id, name, developer_id, tier')
      .eq('id', app_id)
      .single()

    if (!app) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 })
    }

    if (app.developer_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (app.tier === tier) {
      return NextResponse.json(
        { error: 'App is already on this tier' },
        { status: 400 }
      )
    }

    if (tier === 'launch') {
      const { count } = await serviceClient
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'launch_tier')
        .eq('status', 'completed')

      if ((count ?? 0) >= FOUNDING_LIMIT) {
        return NextResponse.json(
          { error: `Founding price limit of ${FOUNDING_LIMIT} reached. Standard pricing applies.` },
          { status: 400 }
        )
      }
    }

    const pricing = PRICING[tier as keyof typeof PRICING]
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: pricing.amount_cents,
            product_data: {
              name: `TryMyApp.uk — ${pricing.label}`,
              description: `${app.name}: ${pricing.description}`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        app_id,
        user_id: user.id,
        tier,
        type: pricing.type,
      },
      success_url: `${appUrl}/dashboard?payment=success&tier=${tier}`,
      cancel_url: `${appUrl}/dashboard?payment=cancelled`,
    })

    await serviceClient
      .from('transactions')
      .insert({
        developer_id: user.id,
        app_id,
        stripe_session_id: session.id,
        type: pricing.type,
        amount_cents: pricing.amount_cents,
        currency: 'usd',
        status: 'pending',
        platform_cut: pricing.platform_cut,
        creator_payout: pricing.creator_payout,
      })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
