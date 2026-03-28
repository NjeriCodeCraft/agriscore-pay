export async function POST(request) {
  try {
    const data = await request.json()

    let score = 400
    score += Math.min(data.farmSize * 8, 120)
    score += Math.min(data.yearsfarming * 12, 100)
    score += Math.min(data.lastYieldKg * 0.05, 80)
    if (data.existingLoans === 'no') score += 60
    if (data.irrigated === 'yes') score += 40
    if (data.soilType === 'loamy') score += 30
    score = Math.min(Math.round(score), 850)

    const limit = score > 700 ? 10000 : score > 600 ? 6000 : score > 500 ? 3000 : 1000
    const risk = score > 700 ? 'Low' : score > 600 ? 'Medium' : 'High'
    const approved = score >= 500

    return Response.json({ score, limit, risk, approved })
  } catch (error) {
    return Response.json({ error: 'Scoring failed' }, { status: 500 })
  }
}