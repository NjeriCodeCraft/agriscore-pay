import './globals.css'

export const metadata = {
  title: 'AgriScore Pay',
  description: 'Buy Now, Pay at Harvest — Credit for Farmers',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="layout">
          <Sidebar />
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  )
}

function Sidebar() {
  const links = [
    { href: '/dashboard', icon: '🌾', label: 'Dashboard' },
    { href: '/apply', icon: '📝', label: 'Apply for Credit' },
    { href: '/marketplace', icon: '🛒', label: 'Marketplace' },
    { href: '/repayment', icon: '💳', label: 'Repayment' },
  ]
  return (
    <nav className="sidebar">
      <div className="sidebar-logo">Agri<span>Score</span> Pay</div>
      {links.map(l => (
        <a key={l.href} href={l.href}>
          <span className="icon">{l.icon}</span>
          {l.label}
        </a>
      ))}
      <div style={{ marginTop: 'auto', padding: '12px 16px', fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
        Powered by Interswitch
      </div>
    </nav>
  )
}
