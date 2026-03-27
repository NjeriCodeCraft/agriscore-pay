'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const partners = ['INTERSWITCH', 'AGRITECH', 'BLOCKCHAIN', 'GHANA-AGRI'];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main style={{ fontFamily: "'Syne', sans-serif", background: '#0a0f0a', color: '#e8f0e8', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --green: #4caf72;
          --green-bright: #6ddb94;
          --green-dim: #1e3a28;
          --earth: #c4a46b;
          --dark: #0a0f0a;
          --card: #111811;
          --border: #1e2e1e;
        }

        body { background: var(--dark); }

        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 20px 40px;
          display: flex; align-items: center; justify-content: space-between;
          transition: all 0.3s ease;
          border-bottom: 1px solid transparent;
        }
        .nav.scrolled {
          background: rgba(10,15,10,0.92);
          backdrop-filter: blur(12px);
          border-bottom-color: var(--border);
        }
        .nav-logo {
          font-size: 1.2rem; font-weight: 800; letter-spacing: -0.02em;
          color: var(--green-bright);
        }
        .nav-logo span { color: var(--earth); }
        .nav-links { display: flex; gap: 32px; align-items: center; }
        .nav-links a {
          color: #8aaa8a; text-decoration: none; font-size: 0.85rem;
          font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase;
          transition: color 0.2s;
        }
        .nav-links a:hover { color: var(--green-bright); }
        .btn-nav {
          background: var(--green); color: #0a0f0a;
          padding: 10px 22px; border-radius: 6px;
          font-size: 0.82rem; font-weight: 700;
          letter-spacing: 0.05em; text-transform: uppercase;
          text-decoration: none; transition: background 0.2s;
        }
        .btn-nav:hover { background: var(--green-bright); color: #0a0f0a !important; }

        /* Hero */
        .hero {
          min-height: 100vh;
          display: flex; flex-direction: column; justify-content: center;
          padding: 120px 40px 80px;
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute; top: -200px; right: -200px;
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(76,175,114,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero::after {
          content: '';
          position: absolute; bottom: -100px; left: -100px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(196,164,107,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-tag {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--green-dim); border: 1px solid rgba(76,175,114,0.3);
          color: var(--green-bright); padding: 6px 14px; border-radius: 100px;
          font-size: 0.75rem; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; margin-bottom: 36px;
          width: fit-content;
          animation: fadeUp 0.6s ease both;
        }
        .hero-tag::before {
          content: '';
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--green-bright);
          animation: pulse 2s ease infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        .hero-h1 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(3.5rem, 9vw, 7.5rem);
          font-weight: 400; line-height: 1.0;
          letter-spacing: -0.02em;
          max-width: 900px;
          animation: fadeUp 0.6s 0.1s ease both;
        }
        .hero-h1 em {
          font-style: italic; color: var(--green-bright);
        }
        .hero-h1 .earth { color: var(--earth); }
        .hero-sub {
          font-family: 'Syne', sans-serif;
          font-size: 1.05rem; color: #7a9a7a; max-width: 560px;
          line-height: 1.65; margin-top: 28px;
          animation: fadeUp 0.6s 0.2s ease both;
        }
        .hero-cta {
          display: flex; gap: 16px; margin-top: 44px; flex-wrap: wrap;
          animation: fadeUp 0.6s 0.3s ease both;
        }
        .btn-primary {
          background: var(--green); color: #0a0f0a;
          padding: 16px 36px; border-radius: 8px;
          font-weight: 700; font-size: 0.9rem;
          letter-spacing: 0.04em; text-transform: uppercase;
          text-decoration: none; transition: all 0.2s;
          display: flex; align-items: center; gap: 10px;
        }
        .btn-primary:hover {
          background: var(--green-bright); transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(76,175,114,0.3);
        }
        .btn-secondary {
          background: transparent; color: #e8f0e8;
          padding: 16px 36px; border-radius: 8px;
          font-weight: 600; font-size: 0.9rem;
          letter-spacing: 0.04em;
          text-decoration: none; transition: all 0.2s;
          border: 1px solid var(--border);
          display: flex; align-items: center; gap: 10px;
        }
        .btn-secondary:hover {
          border-color: var(--green); color: var(--green-bright);
          transform: translateY(-2px);
        }

        /* Partners */
        .partners {
          padding: 32px 40px;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          overflow: hidden;
          animation: fadeUp 0.6s 0.4s ease both;
        }
        .partners-inner {
          display: flex; gap: 64px; align-items: center;
        }
        .partners-label {
          font-size: 0.7rem; letter-spacing: 0.12em;
          text-transform: uppercase; color: #4a644a;
          white-space: nowrap; font-weight: 600;
        }
        .partners-list {
          display: flex; gap: 48px; align-items: center; flex-wrap: wrap;
        }
        .partner-name {
          font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: #3a533a; transition: color 0.2s;
        }
        .partner-name:hover { color: var(--green); }

        /* Stats */
        .stats {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: var(--border);
          margin: 80px 40px;
          border: 1px solid var(--border); border-radius: 12px;
          overflow: hidden;
        }
        .stat {
          background: var(--card);
          padding: 40px 36px;
        }
        .stat-num {
          font-family: 'Instrument Serif', serif;
          font-size: 3.5rem; color: var(--green-bright);
          line-height: 1;
        }
        .stat-label {
          font-size: 0.8rem; color: #5a7a5a;
          text-transform: uppercase; letter-spacing: 0.1em;
          margin-top: 8px;
        }

        /* How it works */
        .section {
          padding: 80px 40px;
        }
        .section-tag {
          font-size: 0.72rem; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--green);
          font-weight: 600; margin-bottom: 16px;
        }
        .section-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          line-height: 1.1; max-width: 600px;
          margin-bottom: 60px;
        }
        .steps {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 2px; background: var(--border);
          border: 1px solid var(--border); border-radius: 12px; overflow: hidden;
        }
        .step {
          background: var(--card); padding: 40px 32px;
          transition: background 0.2s;
        }
        .step:hover { background: #161e16; }
        .step-num {
          font-family: 'Instrument Serif', serif;
          font-size: 3rem; color: var(--border);
          line-height: 1; margin-bottom: 20px;
        }
        .step-icon { font-size: 2rem; margin-bottom: 16px; }
        .step-title {
          font-size: 1rem; font-weight: 700;
          margin-bottom: 10px; color: #d0e8d0;
        }
        .step-desc { font-size: 0.85rem; color: #5a7a5a; line-height: 1.6; }

        /* Features */
        .features {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px; padding: 0 40px 80px;
        }
        .feature-card {
          background: var(--card); border: 1px solid var(--border);
          border-radius: 12px; padding: 32px;
          transition: all 0.2s;
        }
        .feature-card:hover {
          border-color: rgba(76,175,114,0.3);
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }
        .feature-icon {
          width: 48px; height: 48px; border-radius: 10px;
          background: var(--green-dim); border: 1px solid rgba(76,175,114,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem; margin-bottom: 20px;
        }
        .feature-title {
          font-size: 1rem; font-weight: 700; margin-bottom: 10px;
          color: #d0e8d0;
        }
        .feature-desc { font-size: 0.84rem; color: #5a7a5a; line-height: 1.65; }

        /* CTA Banner */
        .cta-banner {
          margin: 0 40px 80px;
          background: linear-gradient(135deg, #0f2a1a 0%, #0f1f10 50%, #1a2a0a 100%);
          border: 1px solid rgba(76,175,114,0.2);
          border-radius: 16px; padding: 72px 60px;
          text-align: center; position: relative; overflow: hidden;
        }
        .cta-banner::before {
          content: '';
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(76,175,114,0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(2rem, 4vw, 3.5rem);
          margin-bottom: 16px;
        }
        .cta-sub { color: #5a7a5a; font-size: 1rem; margin-bottom: 36px; }

        /* Footer */
        .footer {
          border-top: 1px solid var(--border);
          padding: 40px; display: flex;
          justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 16px;
        }
        .footer-logo { font-size: 1rem; font-weight: 800; color: var(--green-bright); }
        .footer-copy { font-size: 0.78rem; color: #3a533a; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .nav { padding: 16px 20px; }
          .hero { padding: 100px 20px 60px; }
          .stats { grid-template-columns: 1fr; margin: 60px 20px; }
          .section { padding: 60px 20px; }
          .features { padding: 0 20px 60px; }
          .cta-banner { margin: 0 20px 60px; padding: 48px 28px; }
          .footer { padding: 32px 20px; }
          .partners { padding: 24px 20px; }
          .nav-links { display: none; }
        }
      `}</style>

      {/* NAV */}
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-logo">Agri<span>Score</span></div>
        <div className="nav-links">
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <Link href="/auth" className="btn-nav">Apply Now</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-tag">Now Live — Powered by Interswitch</div>
        <h1 className="hero-h1">
          Buy Now,<br />
          Pay at <em>Harvest.</em>
        </h1>
        <p className="hero-sub">
          Get seeds, fertilizer, and equipment today.
          Repay only after you sell your crops.
          Powered by ML credit scoring and Interswitch.
        </p>
        <div className="hero-cta">
          <Link href="/auth
          " className="btn-primary">
            Get Started →
          </Link>
          <a href="#how" className="btn-secondary">
            ▶ Watch Demo
          </a>
        </div>
      </section>

      {/* PARTNERS */}
      <div className="partners">
        <div className="partners-inner">
          <span className="partners-label">Trusted by</span>
          <div className="partners-list">
            {partners.map(p => (
              <span key={p} className="partner-name">{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats">
        {[
          { num: '12K+', label: 'Farmers Financed' },
          { num: '94%', label: 'Repayment Rate' },
          { num: 'KSh 2B+', label: 'Disbursed to Date' },
        ].map(s => (
          <div className="stat" key={s.label}>
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* HOW IT WORKS */}
      <section className="section" id="how">
        <div className="section-tag">How it works</div>
        <h2 className="section-title">From application to harvest in 4 simple steps</h2>
        <div className="steps">
          {[
            { n: '01', icon: '📋', title: 'Apply in Minutes', desc: 'Fill in your farm details — size, crop, location. Our ML model scores your credit instantly.' },
            { n: '02', icon: '🤖', title: 'Instant ML Score', desc: 'Our model analyzes your farming profile and history to assign you a credit score and limit.' },
            { n: '03', icon: '🛒', title: 'Shop the Marketplace', desc: 'Browse seeds, fertilizer, and equipment. Buy on credit — payments go directly to vendors via Interswitch.' },
            { n: '04', icon: '🌾', title: 'Repay at Harvest', desc: 'Once you sell your crops, repay through Interswitch. Your score improves with every cycle.' },
          ].map(step => (
            <div className="step" key={step.n}>
              <div className="step-num">{step.n}</div>
              <div className="step-icon">{step.icon}</div>
              <div className="step-title">{step.title}</div>
              <div className="step-desc">{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features">
        <div style={{ padding: '0 40px 32px' }}>
          <div className="section-tag">Why AgriScore</div>
          <h2 className="section-title">Everything a farmer needs to grow</h2>
        </div>
        <div className="features">
          {[
            { icon: '🧠', title: 'ML Credit Scoring', desc: 'No bank account needed. Our model uses farm size, crop type, and history to score your creditworthiness.' },
            { icon: '💳', title: 'Interswitch Payments', desc: 'Secure, instant payments to vendors through Africa\'s leading payment infrastructure.' },
            { icon: '🛡️', title: 'Identity Verified', desc: 'Passport verification via Interswitch API keeps the platform safe and reduces fraud.' },
            { icon: '📊', title: 'Live Dashboard', desc: 'Track your credit score, active loans, and repayment schedule all in one place.' },
            { icon: '🌍', title: 'Built for Africa', desc: 'Designed for smallholder farmers across Kenya, Ghana, and beyond. Local crops, local support.' },
            { icon: '📱', title: 'Mobile First', desc: 'Works on any device. Apply, shop, and repay from your phone — no laptop required.' },
          ].map(f => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <div className="cta-banner">
        <h2 className="cta-title">Ready to grow your farm?</h2>
        <p className="cta-sub">Join 12,000+ farmers already using AgriScore-Pay</p>
        <Link href="/auth" className="btn-primary" style={{ display: 'inline-flex', margin: '0 auto' }}>
          Apply for Credit →
        </Link>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">AgriScore-Pay</div>
        <div className="footer-copy">© 2026 AgriScore-Pay. Powered by Interswitch.</div>
      </footer>
    </main>
  );
}