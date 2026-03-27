// app/api/score/route.js
// This is where your friend's ML model connects.
// Replace the body of POST with a call to their model endpoint.

export async function POST(request) {
  const data = await request.json()

  // ─── OPTION A: Call your friend's ML model directly ───────────────────────
  // Uncomment and replace URL when friend deploys their model:
  //
  // const mlResponse = await fetch('https://your-friends-model.vercel.app/predict', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // })
  // const result = await mlResponse.json()
  // return Response.json(result)

  // ─── OPTION B: Fallback scoring logic (active for now) ────────────────────
  const {
    farmSize = 0,
    yearsfarming = 0,
    lastYieldKg = 0,
    existingLoans = 'no',
    irrigated = 'no',
    soilType = '',
  } = data

  let score = 400
  score += Math.min(Number(farmSize) * 8, 120)
  score += Math.min(Number(yearsfarming) * 12, 100)
  score += Math.min(Number(lastYieldKg) * 0.05, 80)
  if (existingLoans === 'no') score += 60
  if (irrigated === 'yes') score += 40
  if (soilType === 'loamy') score += 30
  score = Math.min(Math.round(score), 850)

  const limit = score > 700 ? 10000 : score > 600 ? 6000 : score > 500 ? 3000 : 1000
  const risk = score > 700 ? 'Low' : score > 600 ? 'Medium' : 'High'
  const approved = score >= 500

  return Response.json({ score, limit, risk, approved })
}
