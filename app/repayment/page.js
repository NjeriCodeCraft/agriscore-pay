'use client'
import { useState } from 'react'

const LOANS = [
  {
    id: 'LN-001', item: 'NPK Fertilizer 50kg x 4', amount: 1200,
    disbursed: '2025-03-05', due: '2025-11-30',
    payments: [],
    status: 'active',
    harvestEstimate: 'November 2025',
  },
  {
    id: 'LN-002', item: 'Maize Hybrid Seeds 10kg', amount: 800,
    disbursed: '2025-03-12', due: '2025-11-30',
    payments: [],
    status: 'active',
    harvestEstimate: 'November 2025',
  },
  {
    id: 'LN-003', item: 'Herbicide 5L x 2', amount: 1200,
    disbursed: '2025-01-10', due: '2025-06-30',
    payments: [{ date: '2025-06-28', amount: 1200, ref: 'ISW-TXN-88421' }],
    status: 'repaid',
    harvestEstimate: 'June 2025',
  },
  {
    id: 'LN-004', item: 'Drip Irrigation Kit', amount: 1200,
    disbursed: '2024-09-01', due: '2025-01-31',
    payments: [{ date: '2025-01-15', amount: 600, ref: 'ISW-TXN-71002' }, { date: '2025-01-29', amount: 600, ref: 'ISW-TXN-71098' }],
    status: 'repaid',
    harvestEstimate: 'January 2025',
  },
]

function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export default function Repayment() {
  const [activeTab, setActiveTab] = useState('active')
  const [payingId, setPayingId] = useState(null)
  const [paidIds, setPaidIds] = useState([])

  const active = LOANS.filter(l => l.status === 'active' && !paidIds.includes(l.id))
  const repaid = LOANS.filter(l => l.status === 'repaid' || paidIds.includes(l.id))
  const totalOwed = active.reduce((s, l) => s + l.amount, 0)

  async function handleRepay(loan) {
    setPayingId(loan.id)
    // Interswitch payment integration
    // In production: POST /api/interswitch/repayment → get reference → redirect to gateway
    await new Promise(r => setTimeout(r, 2200))
    setPaidIds(p => [...p, loan.id])
    setPayingId(null)
    alert(`✅ Repayment of ₦${loan.amount.toLocaleString()} confirmed!\nInterswitch Ref: ISW-TXN-${Math.floor(Math.random()*90000+10000)}`)
  }

  const shown = activeTab === 'active' ? active : repaid

  return (
    <div>
      <div className="page-header">
        <h1>Repayment Tracker</h1>
        <p>All your harvest repayments via Interswitch in one place.</p>
      </div>

      {/* Summary */}
      <div className="card-grid card-grid-3" style={{ marginBottom: 28 }}>
        <div className="stat-card">
          <div className="label">Total Owed</div>
          <div className="value" style={{ color: active.length ? 'var(--earth)' : 'var(--green-mid)' }}>
            ₦{totalOwed.toLocaleString()}
          </div>
          <div className="sub">{active.length} active loan{active.length !== 1 ? 's' : ''}</div>
        </div>
        <div className="stat-card">
          <div className="label">Total Repaid</div>
          <div className="value" style={{ color: 'var(--green-mid)' }}>
            ₦{repaid.reduce((s, l) => s + l.amount, 0).toLocaleString()}
          </div>
          <div className="sub">Across {repaid.length} loans</div>
        </div>
        <div className="stat-card">
          <div className="label">Next Due Date</div>
          <div className="value" style={{ fontSize: 20, paddingTop: 6 }}>
            {active.length ? 'Nov 30, 2025' : '—'}
          </div>
          <div className="sub">{active.length ? `${daysUntil('2025-11-30')} days away` : 'No pending loans'}</div>
        </div>
      </div>

      {active.length > 0 && (
        <div className="alert alert-yellow" style={{ marginBottom: 24 }}>
          <span>⚠️</span>
          <span>You have <strong>₦{totalOwed.toLocaleString()}</strong> due at harvest. Repay on time to maintain your AgriScore.</span>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[['active', '⏳ Active Loans'], ['repaid', '✅ Repaid']].map(([val, label]) => (
          <button key={val} onClick={() => setActiveTab(val)} className={`btn btn-sm ${activeTab === val ? 'btn-primary' : 'btn-outline'}`}>
            {label} ({val === 'active' ? active.length : repaid.length})
          </button>
        ))}
      </div>

      {/* Loan Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {shown.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '48px', color: 'var(--gray-mid)' }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
            {activeTab === 'active' ? 'No active loans! Great job.' : 'No repaid loans yet.'}
          </div>
        )}
        {shown.map(loan => {
          const isPaying = payingId === loan.id
          const isNowPaid = paidIds.includes(loan.id)
          const days = daysUntil(loan.due)
          return (
            <div key={loan.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: 'Syne', fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{loan.item}</div>
                  <div style={{ fontSize: 13, color: 'var(--gray-mid)' }}>
                    Loan ID: <span style={{ fontFamily: 'monospace', color: 'var(--green-mid)', fontWeight: 600 }}>{loan.id}</span>
                    &nbsp;·&nbsp;Disbursed: {loan.disbursed}
                  </div>
                </div>
                <span className={`badge ${loan.status === 'repaid' || isNowPaid ? 'badge-green' : days < 30 ? 'badge-yellow' : 'badge-gray'}`}>
                  {loan.status === 'repaid' || isNowPaid ? '✅ Repaid' : days < 0 ? '🔴 Overdue' : days < 30 ? '⚠ Due Soon' : '⏳ Active'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
                {[
                  { label: 'Loan Amount', value: `₦${loan.amount.toLocaleString()}` },
                  { label: 'Due Date', value: loan.due },
                  { label: 'Harvest Est.', value: loan.harvestEstimate },
                  { label: 'Days Remaining', value: loan.status === 'repaid' || isNowPaid ? '—' : days > 0 ? `${days} days` : `${Math.abs(days)} overdue` },
                ].map(f => (
                  <div key={f.label}>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--gray-mid)', marginBottom: 4 }}>{f.label}</div>
                    <div style={{ fontFamily: 'Syne', fontSize: 16, fontWeight: 700, color: 'var(--green-deep)' }}>{f.value}</div>
                  </div>
                ))}
              </div>

              {/* Payment history */}
              {(loan.payments.length > 0 || isNowPaid) && (
                <div style={{ background: 'var(--green-pale)', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--green-mid)', marginBottom: 8 }}>
                    Payment History
                  </div>
                  {loan.payments.map((p, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                      <span>{p.date}</span>
                      <span style={{ fontWeight: 600 }}>₦{p.amount.toLocaleString()}</span>
                      <span style={{ fontFamily: 'monospace', color: 'var(--green-mid)', fontSize: 12 }}>{p.ref}</span>
                    </div>
                  ))}
                  {isNowPaid && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                      <span>Just now</span>
                      <span style={{ fontWeight: 600 }}>₦{loan.amount.toLocaleString()}</span>
                      <span style={{ fontFamily: 'monospace', color: 'var(--green-mid)', fontSize: 12 }}>ISW-TXN-LIVE</span>
                    </div>
                  )}
                </div>
              )}

              {loan.status === 'active' && !isNowPaid && (
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <button
                    onClick={() => handleRepay(loan)}
                    disabled={isPaying}
                    className="btn btn-earth"
                    style={{ opacity: isPaying ? 0.7 : 1 }}
                  >
                    {isPaying ? '⏳ Processing via Interswitch...' : `💳 Repay ₦${loan.amount.toLocaleString()} via Interswitch`}
                  </button>
                  <span style={{ fontSize: 12, color: 'var(--gray-mid)' }}>Secure · Instant · Interswitch</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Interswitch info */}
      <div className="card" style={{ marginTop: 28, background: 'var(--green-pale)', border: '1px solid var(--green-light)' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ fontSize: 32 }}>🏦</span>
          <div>
            <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, color: 'var(--green-deep)', marginBottom: 4 }}>
              Powered by Interswitch
            </div>
            <div style={{ fontSize: 13, color: 'var(--gray-mid)' }}>
              All repayments are processed securely via Interswitch's payment gateway. You'll receive an SMS confirmation after each payment. Your AgriScore is updated automatically upon successful repayment.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
