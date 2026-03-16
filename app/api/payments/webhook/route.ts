import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase-server'

export const config = {
  api: { bodyParser: false }
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: ReturnType<typeof stripe.webhooks.constructEvent>

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  const serviceClient = createServiceClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as unknown as {
      id: string
      metadata?: { app_id?: string; tier?: string; type?: string }
    }
    const { app_id, tier } = session.metadata ?? {}

    if (!app_id || !tier) {
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
    }

    try {
      await serviceClient
        .from('transactions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('stripe_session_id', session.id)

      await serviceClient
        .from('apps')
        .update({ tier })
        .eq('id', app_id)

      console.log(`Payment completed: app ${app_id} upgraded to ${tier}`)
    } catch (error) {
      console.error('Webhook processing error:', error)
      return NextResponse.json(
        { error: 'Webhook processing failed' },
        { status: 500 }
      )
    }
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as unknown as { id: string }
    await serviceClient
      .from('transactions')
      .update({ status: 'failed' })
      .eq('stripe_session_id', session.id)
  }

  return NextResponse.json({ received: true })
}
