'use client'
import { useState } from 'react'

const PRODUCTS = [
  { id: 1, name: 'NPK Fertilizer 50kg', category: 'Fertilizer', emoji: '🧪', price: 280, unit: 'per bag', desc: 'Balanced 15-15-15 NPK blend for high-yield crops', vendor: 'AgroSupply Co.' },
  { id: 2, name: 'Maize Hybrid Seeds 5kg', category: 'Seeds', emoji: '🌽', price: 320, unit: 'per pack', desc: 'Early-maturing drought-tolerant hybrid variety', vendor: 'SeedMaster Ltd.' },
  { id: 3, name: 'Rice Seeds FARO-44 5kg', category: 'Seeds', emoji: '🌾', price: 290, unit: 'per pack', desc: 'High-yielding flood-tolerant rice variety', vendor: 'SeedMaster Ltd.' },
  { id: 4, name: 'Glyphosate Herbicide 1L', category: 'Herbicide', emoji: '🌿', price: 180, unit: 'per litre', desc: 'Broad-spectrum non-selective herbicide', vendor: 'CropGuard Nigeria' },
  { id: 5, name: 'Urea Fertilizer 50kg', category: 'Fertilizer', emoji: '⚗️', price: 240, unit: 'per bag', desc: '46% nitrogen content for leaf/stem growth', vendor: 'AgroSupply Co.' },
  { id: 6, name: 'Pesticide Spray 500ml', category: 'Pesticide', emoji: '💊', price: 150, unit: 'per bottle', desc: 'Controls aphids, stem borers, and armyworms', vendor: 'CropGuard Nigeria' },
  { id: 7, name: 'Drip Irrigation Kit', category: 'Equipment', emoji: '💧', price: 1200, unit: 'per kit', desc: 'Covers 0.5 hectare, includes pipes and nozzles', vendor: 'FarmTech Ghana' },
  { id: 8, name: 'Manual Knapsack Sprayer', category: 'Equipment', emoji: '🪣', price: 380, unit: 'each', desc: '16-litre capacity, adjustable nozzle', vendor: 'FarmTech Ghana' },
  { id: 9, name: 'Soybean Seeds 10kg', category: 'Seeds', emoji: '🫘', price: 260, unit: 'per pack', desc: 'High-protein variety, good nodulation', vendor: 'SeedMaster Ltd.' },
]

const CATEGORIES = ['All', 'Seeds', 'Fertilizer', 'Herbicide', 'Pesticide', 'Equipment']
const FARMER_CREDIT = 5300 // available credit

export default function Marketplace() {
  const [cat, setCat] = useState('All')
  const [cart, setCart] = useState({})
  const [paying, setPaying] = useState(false)
  const [paid, setPaid] = useState(false)

  const filtered = cat === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === cat)
  const cartItems = Object.entries(cart).filter(([, qty]) => qty > 0).map(([id, qty]) => ({ ...PRODUCTS.find(p => p.id === Number(id)), qty }))
  const total = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0)

  function addToCart(id) { setCart(p => ({ ...p, [id]: (p[id] || 0) + 1 })) }
  function removeFromCart(id) { setCart(p => ({ ...p, [id]: Math.max((p[id] || 0) - 1, 0) })) }

  async function handlePayment() {
    setPaying(true)
    // Interswitch payment integration
    // In production, call your backend to create a payment reference
    // then redirect to Interswitch payment gateway
    try {
      // Simulated Interswitch flow:
      // 1. POST /api/interswitch/initiate → get paymentReference
      // 2. Redirect to Interswitch hosted page
      // 3. Interswitch webhooks back with confirmation
      await new Promise(r => setTimeout(r, 2000))
      setPaid(true)
    } catch {
      alert('Payment failed. Please try again.')
    } finally {
      setPaying(false)
    }
  }

  if (paid) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', gap: 16 }}>
      <div style={{ fontSize: 72 }}>✅</div>
      <h1 style={{ fontFamily: 'Syne', color: 'var(--green-deep)' }}>Order Confirmed!</h1>
      <p style={{ color: 'var(--gray-mid)', maxWidth: 360 }}>Your inputs will be delivered within 3-5 working days. Repayment is due at harvest via Interswitch.</p>
      <div className="card" style={{ marginTop: 8, width: '100%', maxWidth: 400, textAlign: 'left' }}>
        <div className="section-title">Order Summary</div>
        {cartItems.map(i => (
          <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
            <span>{i.name} x{i.qty}</span>
            <strong>₦{(i.price * i.qty).toLocaleString()}</strong>
          </div>
        ))}
        <div style={{ borderTop: '1px solid var(--gray-light)', paddingTop: 12, marginTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontFamily: 'Syne' }}>
          <span>Total Credit Used</span>
          <span style={{ color: 'var(--green-mid)' }}>₦{total.toLocaleString()}</span>
        </div>
      </div>
      <a href="/repayment" className="btn btn-primary" style={{ marginTop: 8 }}>Track Repayment →</a>
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <h1>Farm Inputs Marketplace</h1>
        <p>Buy seeds, fertilizers & equipment on credit. Pay at harvest via Interswitch.</p>
      </div>

      {/* Credit Banner */}
      <div style={{ background: 'linear-gradient(135deg, var(--green-deep), var(--green-mid))', borderRadius: 12, padding: '16px 24px', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white' }}>
        <div>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>AVAILABLE CREDIT</div>
          <div style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800 }}>₦{(FARMER_CREDIT - total).toLocaleString()}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>IN CART</div>
          <div style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, color: total > 0 ? '#fcd34d' : 'white' }}>
            {total > 0 ? `₦${total.toLocaleString()}` : '₦0'}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 28, alignItems: 'start' }}>
        {/* Products */}
        <div>
          {/* Category filter */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCat(c)} className={`btn btn-sm ${cat === c ? 'btn-primary' : 'btn-outline'}`}>
                {c}
              </button>
            ))}
          </div>

          <div className="card-grid card-grid-3">
            {filtered.map(p => (
              <div key={p.id} className="product-card">
                <div className="product-img">{p.emoji}</div>
                <div className="product-body">
                  <div style={{ marginBottom: 4 }}>
                    <span className="badge badge-gray">{p.category}</span>
                  </div>
                  <div className="product-name">{p.name}</div>
                  <div className="product-desc">{p.desc}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-mid)', marginBottom: 12 }}>Vendor: {p.vendor}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="product-price">₦{p.price.toLocaleString()} <span>/{p.unit}</span></div>
                  </div>
                  {cart[p.id] > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
                      <button onClick={() => removeFromCart(p.id)} className="btn btn-outline btn-sm" style={{ padding: '6px 12px' }}>−</button>
                      <span style={{ fontWeight: 700, fontFamily: 'Syne', fontSize: 16 }}>{cart[p.id]}</span>
                      <button onClick={() => addToCart(p.id)} className="btn btn-primary btn-sm" style={{ padding: '6px 12px' }}>+</button>
                    </div>
                  ) : (
                    <button onClick={() => addToCart(p.id)} className="btn btn-primary btn-sm btn-full" style={{ marginTop: 12 }}>
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart / Checkout */}
        <div className="card" style={{ position: 'sticky', top: 24 }}>
          <div className="section-title">🛒 Your Cart</div>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--gray-mid)', fontSize: 14 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🧺</div>
              Cart is empty.<br />Add items to buy on credit.
            </div>
          ) : (
            <>
              {cartItems.map(i => (
                <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{i.name}</div>
                    <div style={{ color: 'var(--gray-mid)', fontSize: 12 }}>x{i.qty} × ₦{i.price.toLocaleString()}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontFamily: 'Syne' }}>₦{(i.price * i.qty).toLocaleString()}</div>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--gray-light)', paddingTop: 14, marginTop: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Syne', fontWeight: 700, fontSize: 18, marginBottom: 6 }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--green-deep)' }}>₦{total.toLocaleString()}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray-mid)', marginBottom: 16 }}>
                  {total > FARMER_CREDIT
                    ? <span style={{ color: 'var(--danger)' }}>⚠ Exceeds your credit limit</span>
                    : `✅ Within your ₦${FARMER_CREDIT.toLocaleString()} credit limit`}
                </div>
                <button
                  onClick={handlePayment}
                  disabled={paying || total === 0 || total > FARMER_CREDIT}
                  className="btn btn-earth btn-full btn-lg"
                  style={{ opacity: paying ? 0.7 : 1 }}
                >
                  {paying ? '⏳ Processing...' : '💳 Pay via Interswitch'}
                </button>
                <div style={{ fontSize: 11, color: 'var(--gray-mid)', textAlign: 'center', marginTop: 8 }}>
                  Repayment due at harvest · Secured by Interswitch
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
