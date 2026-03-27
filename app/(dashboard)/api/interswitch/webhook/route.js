// app/api/interswitch/webhook/route.js
// Interswitch posts payment confirmations here

import crypto from 'crypto'

export async function POST(request) {
  const body = await request.text()
  const signature = request.headers.get('x-interswitch-signature')

  // Verify webhook signature
  const expectedSig = crypto
    .createHmac('sha256', process.env.INTERSWITCH_CLIENT_SECRET || '')
    .update(body)
    .digest('hex')

  if (signature !== expectedSig) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(body)
  const { transactionReference, responseCode, amount } = event

  if (responseCode === '00') {
    // Payment successful — update your DB here
    // e.g., await db.loans.markRepaid(transactionReference, amount / 100)
    // e.g., await db.farmers.updateCreditScore(farmerId, +15)
    console.log('Payment confirmed:', transactionReference, amount / 100)
  }

  return Response.json({ received: true })
}
