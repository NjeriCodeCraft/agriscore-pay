'use client'
import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [farmer, setFarmer] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem('agriscore_user')
    if (!raw) return
    const u = JSON.parse(raw)

    // Build the farmer object from localStorage, falling back to demo values
setFarmer({
  name: u.name || 'Amara Osei',
  farmId: u.id || 'AG-2024-00412',
  location: u.location || 'Bono Region, Ghana',
  creditScore: u.creditScore ?? 0,
  creditLimit: u.creditLimit ?? 0,
  usedCredit: u.usedCredit ?? 0,
  riskLevel: u.riskLevel || 'low',
  crop: u.crop || 'maize',
  loans: u.activeLoans?.length ? u.activeLoans : [],
})

  }, [])
  if (!farmer) return (
    <div style={{ padding: 40, color: '#4a644a', fontFamily: 'Syne, sans-serif' }}>Loading...</div>
  )

  const scorePct = `${(farmer.creditScore / 850) * 100 * 3.6}deg`
  const available = farmer.creditLimit - farmer.usedCredit

  return (
    <div>
      <div className="page-header">
        <h1>Welcome back, {farmer.name.split(' ')[0]} 👋</h1>
        <p>Farm ID: {farmer.farmId} · {farmer.location}</p>
      </div>

      {/* Stats Row */}
      <div className="card-grid card-grid-4" style={{ marginBottom: 28 }}>
        <div className="stat-card">
          <div className="label">Credit Score</div>
          <div className="value" style={{ color: '#2d6a4f' }}>{farmer.creditScore}</div>
          <div className="sub">↑ +18 this season</div>
        </div>
        <div className="stat-card">
          <div className="label">Credit Limit</div>
          <div className="value">₦ {farmer.creditLimit.toLocaleString()}</div>
          <div className="sub">Buy Now, Pay at Harvest</div>
        </div>
        <div className="stat-card">
          <div className="label">Credit Used</div>
          <div className="value" style={{ color: '#b7791f' }}>₦ {farmer.usedCredit.toLocaleString()}</div>
          <div className="sub">₦ {available.toLocaleString()} available</div>
        </div>
        <div className="stat-card">
          <div className="label">Active Loans</div>
          <div className="value">{farmer.loans.filter(l => l.status === 'active').length}</div>
          <div className="sub">Next harvest: Nov 2025</div>
        </div>
      </div>

      {/* Score Card + Usage */}
      <div className="card-grid card-grid-2" style={{ marginBottom: 28 }}>
        <div className="score-card" style={{ '--pct': scorePct }}>
          <div className="score-ring">
            <span className="score-num">{farmer.creditScore}</span>
          </div>
          <div>
            <div style={{ fontSize: 20, fontFamily: 'Syne', fontWeight: 700, marginBottom: 4 }}>
              {farmer.creditScore >= 700 ? 'Good Standing' : farmer.creditScore >= 500 ? 'Fair Standing' : 'Needs Improvement'}
            </div>
            <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 16 }}>
              {farmer.creditScore >= 700
                ? 'Your score qualifies you for premium crop inputs on credit.'
                : 'Keep repaying on time to improve your score.'}
            </div>
            <a href="/apply" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white', fontSize: 13 }}>
              Apply for More Credit →
            </a>
          </div>
        </div>

        <div className="card">
          <div className="section-title">Credit Utilization</div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
              <span>Used: ₦ {farmer.usedCredit.toLocaleString()}</span>
              <span style={{ color: 'var(--gray-mid)' }}>Limit: ₦ {farmer.creditLimit.toLocaleString()}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${Math.min((farmer.usedCredit / farmer.creditLimit) * 100, 100)}%` }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--gray-mid)', marginTop: 6 }}>
              {farmer.creditLimit > 0 ? Math.round((farmer.usedCredit / farmer.creditLimit) * 100) : 0}% used · {farmer.riskLevel === 'low' ? 'Healthy range' : 'Watch your usage'}
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <div className="section-title" style={{ fontSize: 15, marginBottom: 12 }}>Score Factors</div>
            {[
              { label: 'Repayment History', score: 92, max: 100 },
              { label: 'Farm Size', score: 78, max: 100 },
              { label: 'Crop Yield Record', score: 85, max: 100 },
              { label: 'Season Length', score: 70, max: 100 },
            ].map(f => (
              <div key={f.label} className="criteria-row" style={{ marginBottom: 10 }}>
                <div className="criteria-label" style={{ width: 140, fontSize: 13 }}>{f.label}</div>
                <div className="criteria-bar">
                  <div className="progress-bar"><div className="progress-fill" style={{ width: `${f.score}%` }} /></div>
                </div>
                <div className="criteria-score">{f.score}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Loans */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div className="section-title" style={{ margin: 0 }}>Active Loans</div>
          <a href="/dashboard/repayment" className="btn btn-outline btn-sm">View All</a>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Loan ID</th>
                <th>Item</th>
                <th>Amount</th>
                <th>Disbursed</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {farmer.loans.map(loan => (
                <tr key={loan.id}>
                  <td style={{ fontWeight: 600, color: 'var(--green-mid)', fontFamily: 'monospace' }}>{loan.id}</td>
                  <td>{loan.item}</td>
                  <td style={{ fontWeight: 600 }}>₦ {loan.amount.toLocaleString()}</td>
                  <td style={{ color: 'var(--gray-mid)' }}>{loan.disbursed}</td>
                  <td style={{ color: 'var(--gray-mid)' }}>{loan.due}</td>
                  <td>
                    <span className={`badge ${loan.status === 'active' ? 'badge-yellow' : 'badge-green'}`}>
                      {loan.status === 'active' ? '⏳ Active' : '✅ Repaid'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}