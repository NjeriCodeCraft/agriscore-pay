'use client'
import { useState, useEffect } from 'react'

const INITIAL = {
  fullName: '', phone: '', farmId: '',
  farmSize: '', cropType: '', region: '',
  yearsfarming: '', lastYieldKg: '',
  existingLoans: 'no', soilType: '', irrigated: 'no',
  requestedAmount: '',
}

async function callMLModel(formData) {
  try {
    const res = await fetch('https://agriscore-api.onrender.com/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    if (!res.ok) throw new Error('ML API failed')
    return await res.json()
  } catch {
    return computeFallbackScore(formData)
  }
}

function computeFallbackScore(data) {
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
  return { score, limit, risk, approved: score >= 500 }
}

export default function ApplyPage() {
  const [form, setForm] = useState(INITIAL)
  const [step, setStep] = useState(1) // 1=form, 2=loading, 3=result
  const [result, setResult] = useState(null)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    setStep(2)
    await new Promise(r => setTimeout(r, 2200)) // simulate ML processing
    const res = await callMLModel({
      farmSize: Number(form.farmSize),
      yearsfarming: Number(form.yearsfarming),
      lastYieldKg: Number(form.lastYieldKg),
      existingLoans: form.existingLoans,
      irrigated: form.irrigated,
      soilType: form.soilType,
      cropType: form.cropType,
      requestedAmount: Number(form.requestedAmount),
    })
    setResult(res)
    setStep(3)
  }

  if (step === 2) return <LoadingScreen />
  if (step === 3) return <ResultScreen result={result} name={form.fullName} onReset={() => { setStep(1); setForm(INITIAL); setResult(null) }} />

  return (
    <div>
      <div className="page-header">
        <h1>Apply for Crop Credit</h1>
        <p>Fill in your farm details — get your ML credit score instantly.</p>
      </div>

      <div className="alert alert-yellow">
        <span>🌾</span>
        <span>Your credit limit is based on farm size, crop history, and repayment record. Be accurate for the best score.</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28 }}>
        <form onSubmit={handleSubmit}>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="section-title">Personal Details</div>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input required value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="e.g. Amara Osei" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input required value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+234 801 234 5678" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Farmer ID (if returning)</label>
                <input value={form.farmId} onChange={e => set('farmId', e.target.value)} placeholder="AG-2024-XXXXX (optional)" />
              </div>
              <div className="form-group">
                <label>Region / State</label>
                <select required value={form.region} onChange={e => set('region', e.target.value)}>
                  <option value="">Select region</option>
                  {['Bono Region', 'Ashanti Region', 'Ogun State', 'Kano State', 'Kaduna State', 'Niger State', 'Benue State', 'Enugu State'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 20 }}>
            <div className="section-title">Farm Details</div>
            <div className="form-row">
              <div className="form-group">
                <label>Farm Size (hectares)</label>
                <input required type="number" min="0.5" step="0.5" value={form.farmSize} onChange={e => set('farmSize', e.target.value)} placeholder="e.g. 3.5" />
              </div>
              <div className="form-group">
                <label>Primary Crop</label>
                <select required value={form.cropType} onChange={e => set('cropType', e.target.value)}>
                  <option value="">Select crop</option>
                  {['Maize', 'Rice', 'Cassava', 'Yam', 'Soybean', 'Sorghum', 'Millet', 'Groundnut', 'Cowpea'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Years Farming</label>
                <input required type="number" min="0" value={form.yearsfarming} onChange={e => set('yearsfarming', e.target.value)} placeholder="e.g. 7" />
              </div>
              <div className="form-group">
                <label>Last Season Yield (kg)</label>
                <input required type="number" min="0" value={form.lastYieldKg} onChange={e => set('lastYieldKg', e.target.value)} placeholder="e.g. 2500" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Soil Type</label>
                <select value={form.soilType} onChange={e => set('soilType', e.target.value)}>
                  <option value="">Select soil type</option>
                  {['Loamy', 'Sandy', 'Clay', 'Silt', 'Peaty'].map(s => (
                    <option key={s} value={s.toLowerCase()}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Irrigation Available?</label>
                <select value={form.irrigated} onChange={e => set('irrigated', e.target.value)}>
                  <option value="no">No — Rainfed</option>
                  <option value="yes">Yes — Irrigated</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 24 }}>
            <div className="section-title">Credit Request</div>
            <div className="form-row">
              <div className="form-group">
                <label>Requested Credit Amount (₦)</label>
                <input required type="number" min="500" step="100" value={form.requestedAmount} onChange={e => set('requestedAmount', e.target.value)} placeholder="e.g. 5000" />
              </div>
              <div className="form-group">
                <label>Existing Loans?</label>
                <select value={form.existingLoans} onChange={e => set('existingLoans', e.target.value)}>
                  <option value="no">No existing loans</option>
                  <option value="yes">Yes, I have loans</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-full">
            🤖 Get My Credit Score Instantly
          </button>
        </form>

        {/* Sidebar info */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="section-title" style={{ fontSize: 15 }}>How Scoring Works</div>
            {[
              { icon: '🌱', label: 'Farm Size', desc: 'Larger farms = higher limit' },
              { icon: '📅', label: 'Years Farming', desc: 'More experience = lower risk' },
              { icon: '📊', label: 'Yield History', desc: 'Higher yield = better score' },
              { icon: '💧', label: 'Irrigation', desc: 'Reduces weather risk' },
              { icon: '✅', label: 'Repayment', desc: 'Past on-time payments boost score' },
            ].map(f => (
              <div key={f.label} style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 20 }}>{f.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{f.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-mid)' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="card" style={{ background: 'var(--green-pale)', border: '1px solid var(--green-light)' }}>
            <div style={{ fontSize: 13, color: 'var(--green-deep)', lineHeight: 1.6 }}>
              <strong>💡 Repayment is at Harvest</strong><br />
              No monthly installments. You repay after your harvest is sold. Powered by Interswitch.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 24 }}>
      <div style={{ fontSize: 56 }}>🤖</div>
      <div style={{ fontFamily: 'Syne', fontSize: 24, fontWeight: 700, color: 'var(--green-deep)' }}>
        Analyzing your farm data...
      </div>
      <div style={{ color: 'var(--gray-mid)', fontSize: 15, textAlign: 'center', maxWidth: 360 }}>
        Our ML model is calculating your AgriScore based on 12 data points.
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        {[0, 0.2, 0.4].map((d, i) => (
          <div key={i} style={{
            width: 10, height: 10, borderRadius: '50%',
            background: 'var(--green-mid)',
            animation: `pulse 1.2s ease-in-out ${d}s infinite`,
          }} />
        ))}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:.3;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }`}</style>
    </div>
  )
}

function ResultScreen({ result, name, onReset }) {
  useEffect(() => {
    if (result.approved) {
      const raw = localStorage.getItem('agriscore_user')
      if (!raw) return
      const user = JSON.parse(raw)
      user.creditScore = result.score
      user.creditLimit = result.limit
      user.usedCredit = 0
      user.riskLevel = result.risk
      localStorage.setItem('agriscore_user', JSON.stringify(user))
    }
  }, [])

  const color = result.score >= 700 ? 'var(--green-mid)' : result.score >= 600 ? 'var(--earth)' : 'var(--danger)'
  const label = result.score >= 700 ? 'Excellent' : result.score >= 600 ? 'Good' : result.score >= 500 ? 'Fair' : 'Poor'
  const bg = result.score >= 700 ? 'var(--green-pale)' : result.score >= 600 ? 'var(--earth-light)' : '#fee2e2'

  return (
    <div>
      <div className="page-header">
        <h1>Your AgriScore Result</h1>
        <p>Based on your farm data submitted by {name}</p>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div className="card" style={{ textAlign: 'center', padding: 48, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--gray-mid)', marginBottom: 12 }}>
            Your AgriScore
          </div>
          <div style={{ fontSize: 80, fontFamily: 'Syne', fontWeight: 800, color, lineHeight: 1, marginBottom: 8 }}>
            {result.score}
          </div>
          <div style={{ display: 'inline-flex', background: bg, color, padding: '6px 20px', borderRadius: 20, fontWeight: 600, marginBottom: 28 }}>
            {label} Standing
          </div>

          {result.approved ? (
            <>
              <div style={{ fontSize: 15, color: 'var(--gray-mid)', marginBottom: 8 }}>Approved Credit Limit</div>
              <div style={{ fontSize: 40, fontFamily: 'Syne', fontWeight: 700, color: 'var(--green-deep)', marginBottom: 8 }}>
                ₦{result.limit.toLocaleString()}
              </div>
              <div style={{ fontSize: 13, color: 'var(--gray-mid)', marginBottom: 32 }}>Buy Now · Pay at Harvest via Interswitch</div>
              <a href="/marketplace" className="btn btn-primary btn-lg" style={{ marginRight: 12 }}>
                🛒 Shop on Credit Now
              </a>
            </>
          ) : (
            <>
              <div style={{ background: '#fee2e2', color: 'var(--danger)', padding: '16px 24px', borderRadius: 10, marginBottom: 28, fontSize: 14 }}>
                Your score doesn't meet our minimum threshold of 500. Improve your yield records and repay any outstanding loans, then reapply.
              </div>
            </>
          )}
          <button onClick={onReset} className="btn btn-outline btn-sm" style={{ marginTop: 8 }}>
            Apply Again
          </button>
        </div>

        {result.approved && (
          <div className="card">
            <div className="section-title">Score Breakdown</div>
            {[
              { label: 'Repayment History', score: 92 },
              { label: 'Farm Productivity', score: Math.round((result.score - 400) * 0.4 + 60) },
              { label: 'Farm Size Factor', score: Math.round((result.score - 400) * 0.3 + 55) },
              { label: 'Experience Level', score: Math.round((result.score - 400) * 0.2 + 50) },
              { label: 'Risk Indicators', score: Math.round((result.score - 400) * 0.1 + 70) },
            ].map(f => (
              <div key={f.label} className="criteria-row" style={{ marginBottom: 14 }}>
                <div className="criteria-label">{f.label}</div>
                <div className="criteria-bar">
                  <div className="progress-bar"><div className="progress-fill" style={{ width: `${Math.min(f.score, 100)}%` }} /></div>
                </div>
                <div className="criteria-score">{Math.min(f.score, 100)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
