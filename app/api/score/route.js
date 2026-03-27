// app/api/interswitch/initiate/route.js
// Interswitch Quickteller / Webpay integration
// Docs: https://developer.interswitchgroup.com/docs/

export async function POST(request) {
  const { amount, loanId, farmerId, email, description } = await request.json()

  // ─── Interswitch credentials (set in .env.local) ──────────────────────────
  const MERCHANT_CODE = process.env.INTERSWITCH_MERCHANT_CODE
  const PAY_ITEM_ID = process.env.INTERSWITCH_PAY_ITEM_ID
  const CLIENT_ID = process.env.INTERSWITCH_CLIENT_ID
  const CLIENT_SECRET = process.env.INTERSWITCH_CLIENT_SECRET

  // Amount must be in kobo (multiply naira by 100)
  const amountKobo = Number(amount) * 100

  // Generate unique transaction reference
  const transactionRef = `AGRI-${loanId}-${Date.now()}`

  // ─── For sandbox testing, return mock response ────────────────────────────
  if (process.env.NODE_ENV !== 'production') {
    return Response.json({
      transactionRef,
      redirectUrl: `https://sandbox.interswitchng.com/pay?merchantCode=${MERCHANT_CODE}&payItemID=${PAY_ITEM_ID}&amount=${amountKobo}&transactionreference=${transactionRef}&cust_email=${email}`,
      amountKobo,
    })
  }

  // ─── Production: Call Interswitch to get payment URL ──────────────────────
  // Reference: https://developer.interswitchgroup.com/docs/webpay
  const payload = {
    merchantCode: MERCHANT_CODE,
    payableCode: PAY_ITEM_ID,
    amount: amountKobo,
    transactionReference: transactionRef,
    customerEmail: email,
    description: description || `AgriScore Loan Repayment: ${loanId}`,
    returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/repayment?ref=${transactionRef}`,
  }

  // Return the redirect URL for client to open
  return Response.json({
    transactionRef,
    redirectUrl: `https://webpay.interswitchng.com/pay?${new URLSearchParams(payload)}`,
    amountKobo,
  })
}
