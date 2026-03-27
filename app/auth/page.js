'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState('register'); // 'register' | 'login'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    location: '',
    crop: '',
  });

  const crops = ['Maize', 'Wheat', 'Rice', 'Tomatoes', 'Potatoes', 'Beans', 'Coffee', 'Tea', 'Sugarcane', 'Other'];

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!form.name || !form.phone || !form.password || !form.location || !form.crop) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    // Simulate delay
    await new Promise(r => setTimeout(r, 800));

    // Check if phone already registered
    const existing = JSON.parse(localStorage.getItem('agriscore_users') || '[]');
    if (existing.find(u => u.phone === form.phone)) {
      setError('This phone number is already registered. Please log in.');
      setLoading(false);
      return;
    }

    // Create user object
    const user = {
      id: `farmer_${Date.now()}`,
      name: form.name,
      phone: form.phone,
      email: form.email,
      location: form.location,
      crop: form.crop,
      password: form.password, // In production, NEVER store plain text
      joinedAt: new Date().toISOString(),
      creditScore: null, // Set after first ML scoring
      creditLimit: null,
      activeLoans: [],
    };

    // Save to "database" (localStorage)
    localStorage.setItem('agriscore_users', JSON.stringify([...existing, user]));
    localStorage.setItem('agriscore_user', JSON.stringify(user));

    router.push('/dashboard');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!form.phone || !form.password) {
      setError('Please enter your phone number and password.');
      setLoading(false);
      return;
    }

    await new Promise(r => setTimeout(r, 600));

    const users = JSON.parse(localStorage.getItem('agriscore_users') || '[]');
    const user = users.find(u => u.phone === form.phone && u.password === form.password);

    if (!user) {
      setError('Incorrect phone number or password. Try again.');
      setLoading(false);
      return;
    }

    localStorage.setItem('agriscore_user', JSON.stringify(user));
    router.push('/dashboard');
  };

  return (
    <main style={{ fontFamily: "'Syne', sans-serif", background: '#0a0f0a', minHeight: '100vh', color: '#e8f0e8' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --green: #4caf72; --green-bright: #6ddb94; --green-dim: #1e3a28;
          --earth: #c4a46b; --dark: #0a0f0a; --card: #111811; --border: #1e2e1e;
        }
        .auth-wrap {
          min-height: 100vh; display: grid;
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 768px) {
          .auth-wrap { grid-template-columns: 1fr; }
          .auth-left { display: none; }
        }
        .auth-left {
          background: linear-gradient(160deg, #0f2a1a 0%, #0a0f0a 100%);
          padding: 60px; display: flex; flex-direction: column; justify-content: space-between;
          border-right: 1px solid var(--border); position: relative; overflow: hidden;
        }
        .auth-left::before {
          content: ''; position: absolute; top: -200px; left: -200px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(76,175,114,0.1) 0%, transparent 70%);
        }
        .left-logo { font-size: 1.3rem; font-weight: 800; color: var(--green-bright); }
        .left-logo span { color: var(--earth); }
        .left-headline {
          font-family: 'Instrument Serif', serif;
          font-size: 2.8rem; line-height: 1.1; color: #e8f0e8;
        }
        .left-headline em { font-style: italic; color: var(--green-bright); }
        .left-sub { color: #4a644a; font-size: 0.9rem; line-height: 1.65; margin-top: 16px; }
        .left-stats { display: flex; flex-direction: column; gap: 20px; }
        .left-stat { display: flex; flex-direction: column; gap: 4px; }
        .left-stat-num { font-family: 'Instrument Serif', serif; font-size: 2rem; color: var(--green-bright); }
        .left-stat-label { font-size: 0.75rem; color: #3a533a; text-transform: uppercase; letter-spacing: 0.1em; }

        .auth-right {
          padding: 60px 48px; display: flex; flex-direction: column;
          justify-content: center; overflow-y: auto;
        }
        .auth-title {
          font-family: 'Instrument Serif', serif;
          font-size: 2rem; margin-bottom: 8px;
        }
        .auth-sub { color: #5a7a5a; font-size: 0.88rem; margin-bottom: 36px; }
        .tab-switch {
          display: flex; gap: 0; margin-bottom: 32px;
          border: 1px solid var(--border); border-radius: 8px; overflow: hidden;
          width: fit-content;
        }
        .tab-btn {
          padding: 10px 28px; font-size: 0.82rem; font-weight: 600;
          letter-spacing: 0.05em; text-transform: uppercase;
          cursor: pointer; border: none; transition: all 0.2s;
          font-family: 'Syne', sans-serif;
        }
        .tab-btn.active { background: var(--green); color: #0a0f0a; }
        .tab-btn.inactive { background: transparent; color: #5a7a5a; }
        .tab-btn.inactive:hover { color: var(--green-bright); }

        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 500px) { .field-row { grid-template-columns: 1fr; } }

        .field { display: flex; flex-direction: column; gap: 7px; margin-bottom: 16px; }
        .field label { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; color: #5a7a5a; }
        .field input, .field select {
          background: var(--card); border: 1px solid var(--border);
          color: #e8f0e8; padding: 12px 14px; border-radius: 8px;
          font-size: 0.9rem; font-family: 'Syne', sans-serif;
          outline: none; transition: border-color 0.2s;
          appearance: none;
        }
        .field input:focus, .field select:focus { border-color: var(--green); }
        .field input::placeholder { color: #2a3a2a; }
        .field select option { background: #111811; }

        .error-msg {
          background: rgba(220, 60, 60, 0.1); border: 1px solid rgba(220,60,60,0.3);
          color: #f08080; padding: 12px 16px; border-radius: 8px;
          font-size: 0.83rem; margin-bottom: 20px;
        }
        .submit-btn {
          width: 100%; padding: 15px; border-radius: 8px;
          background: var(--green); color: #0a0f0a;
          font-size: 0.9rem; font-weight: 700; letter-spacing: 0.05em;
          text-transform: uppercase; border: none; cursor: pointer;
          font-family: 'Syne', sans-serif; transition: all 0.2s;
          margin-top: 8px;
        }
        .submit-btn:hover:not(:disabled) { background: var(--green-bright); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .auth-footer { margin-top: 24px; font-size: 0.82rem; color: #3a533a; text-align: center; }
        .auth-footer a { color: var(--green); text-decoration: none; }
        .back-link {
          display: inline-flex; align-items: center; gap: 6px;
          color: #3a533a; text-decoration: none; font-size: 0.8rem;
          margin-bottom: 40px; transition: color 0.2s;
        }
        .back-link:hover { color: var(--green); }

        .divider {
          border: none; border-top: 1px solid var(--border); margin: 24px 0;
        }
        .note { font-size: 0.75rem; color: #2a3a2a; text-align: center; margin-top: 12px; }
      `}</style>

      <div className="auth-wrap">
        {/* LEFT PANEL */}
        <div className="auth-left">
          <div className="left-logo">Agri<span>Score</span></div>
          <div>
            <div className="left-headline">
              Grow more.<br />
              Worry <em>less.</em>
            </div>
            <p className="left-sub">
              Join thousands of farmers getting instant credit to buy seeds,
              fertilizer, and equipment. Pay back only after your harvest.
            </p>
          </div>
          <div className="left-stats">
            {[
              { num: '12K+', label: 'Farmers Financed' },
              { num: '94%', label: 'Repayment Rate' },
              { num: 'KSh 2B+', label: 'Disbursed' },
            ].map(s => (
              <div className="left-stat" key={s.label}>
                <div className="left-stat-num">{s.num}</div>
                <div className="left-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="auth-right">
          <Link href="/" className="back-link">← Back to home</Link>

          {/* Tab Switch */}
          <div className="tab-switch">
            <button
              className={`tab-btn ${mode === 'register' ? 'active' : 'inactive'}`}
              onClick={() => { setMode('register'); setError(''); }}
            >
              Register
            </button>
            <button
              className={`tab-btn ${mode === 'login' ? 'active' : 'inactive'}`}
              onClick={() => { setMode('login'); setError(''); }}
            >
              Log In
            </button>
          </div>

          {mode === 'register' ? (
            <>
              <h1 className="auth-title">Create your account</h1>
              <p className="auth-sub">Takes 2 minutes. No bank account needed.</p>

              {error && <div className="error-msg">⚠ {error}</div>}

              <form onSubmit={handleRegister}>
                <div className="field-row">
                  <div className="field">
                    <label>Full Name *</label>
                    <input name="name" placeholder="Jane Wanjiru" value={form.name} onChange={handleChange} />
                  </div>
                  <div className="field">
                    <label>Phone Number *</label>
                    <input name="phone" placeholder="0712 345 678" value={form.phone} onChange={handleChange} />
                  </div>
                </div>
                <div className="field">
                  <label>Email (optional)</label>
                  <input name="email" type="email" placeholder="jane@example.com" value={form.email} onChange={handleChange} />
                </div>
                <div className="field-row">
                  <div className="field">
                    <label>Location / County *</label>
                    <input name="location" placeholder="Nakuru" value={form.location} onChange={handleChange} />
                  </div>
                  <div className="field">
                    <label>Main Crop *</label>
                    <select name="crop" value={form.crop} onChange={handleChange}>
                      <option value="">Select crop</option>
                      {crops.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label>Password *</label>
                  <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
                </div>
                <button className="submit-btn" type="submit" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account & Get My Credit Score →'}
                </button>
                <p className="note">🔒 Your data is stored securely. We never sell your information.</p>
              </form>
            </>
          ) : (
            <>
              <h1 className="auth-title">Welcome back</h1>
              <p className="auth-sub">Log in to check your credit score and active loans.</p>

              {error && <div className="error-msg">⚠ {error}</div>}

              <form onSubmit={handleLogin}>
                <div className="field">
                  <label>Phone Number</label>
                  <input name="phone" placeholder="0712 345 678" value={form.phone} onChange={handleChange} />
                </div>
                <div className="field">
                  <label>Password</label>
                  <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
                </div>
                <button className="submit-btn" type="submit" disabled={loading}>
                  {loading ? 'Logging in...' : 'Log In →'}
                </button>
              </form>

              <hr className="divider" />
              <p className="auth-footer">
                Don't have an account?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); setMode('register'); setError(''); }}>
                  Register here
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}