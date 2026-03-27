'use client'
import { useState } from 'react'

const FARMER = {
  name: 'Amara Osei',
  farmId: 'AG-2024-00412',
  location: 'Bono Region, Ghana',
  creditScore: 724,
  creditLimit: 8500,
  usedCredit: 3200,
  loans: [
    { id: 'LN-001', item: 'NPK Fertilizer 50kg x 4', amount: 1200, disbursed: 'Mar 5, 2025', due: 'Nov 30, 2025', status: 'active' },
    { id: 'LN-002', item: 'Maize Hybrid Seeds 10kg', amount: 800, disbursed: 'Mar 12, 2025', due: 'Nov 30, 2025', status: 'active' },
    { id: 'LN-003', item: 'Herbicide 5L x 2', amount: 1200, disbursed: 'Jan 10, 2025', due: 'Jun 30, 2025', status: 'repaid' },
  ]
}

const scorePct = `${(FARMER.creditScore / 850) * 100 * 3.6}deg`

export default function Dashboard() {
  return (
    <div>
      <div className="page-header">
        <h1>Welcome back, {FARMER.name.split(' ')[0]} 👋</h1>
        <p>Farm ID: {FARMER.farmId} · {FARMER.location}</p>
      </div>

      {/* Stats Row */}
      <div className="card-grid card-grid-4" style={{ marginBottom: 28 }}>
        <div className="stat-card">
          <div className="label">Credit Score</div>
          <div className="value" style={{ color: '#2d6a4f' }}>{FARMER.creditScore}</div>
          <div className="sub">↑ +18 this season</div>
        </div>
        <div className="stat-card">
          <div className="label">Credit Limit</div>
          <div className="value">₦{FARMER.creditLimit.toLocaleString()}</div>
          <div className="sub">Buy Now, Pay at Harvest</div>
        </div>
        <div className="stat-card">
          <div className="label">Credit Used</div>
          <div className="value" style={{ color: '#b7791f' }}>₦{FARMER.usedCredit.toLocaleString()}</div>
          <div className="sub">₦{(FARMER.creditLimit - FARMER.usedCredit).toLocaleString()} available</div>
        </div>
        <div className="stat-card">
          <div className="label">Active Loans</div>
          <div className="value">{FARMER.loans.filter(l => l.status === 'active').length}</div>
          <div className="sub">Next harvest: Nov 2025</div>
        </div>
      </div>

      {/* Score Card + Usage */}
      <div className="card-grid card-grid-2" style={{ marginBottom: 28 }}>
        <div className="score-card" style={{ '--pct': scorePct }}>
          <div className="score-ring">
            <span className="score-num">{FARMER.creditScore}</span>
          </div>
          <div>
            <div style={{ fontSize: 20, fontFamily: 'Syne', fontWeight: 700, marginBottom: 4 }}>Good Standing</div>
            <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 16 }}>Your score qualifies you for premium crop inputs on credit.</div>
            <a href="/apply" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white', fontSize: 13 }}>
              Apply for More Credit →
            </a>
          </div>
        </div>

        <div className="card">
          <div className="section-title">Credit Utilization</div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
              <span>Used: ₦{FARMER.usedCredit.toLocaleString()}</span>
              <span style={{ color: 'var(--gray-mid)' }}>Limit: ₦{FARMER.creditLimit.toLocaleString()}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(FARMER.usedCredit / FARMER.creditLimit) * 100}%` }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--gray-mid)', marginTop: 6 }}>
              {Math.round((FARMER.usedCredit / FARMER.creditLimit) * 100)}% used · Healthy range
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
          <a href="/repayment" className="btn btn-outline btn-sm">View All</a>
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
              {FARMER.loans.map(loan => (
                <tr key={loan.id}>
                  <td style={{ fontWeight: 600, color: 'var(--green-mid)', fontFamily: 'monospace' }}>{loan.id}</td>
                  <td>{loan.item}</td>
                  <td style={{ fontWeight: 600 }}>₦{loan.amount.toLocaleString()}</td>
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
