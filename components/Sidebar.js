'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { href: '/dashboard', icon: '⊞', label: 'Overview' },
  { href: '/apply', icon: '✦', label: 'Apply for Credit' },
  { href: '/marketplace', icon: '🛒', label: 'Marketplace' },
  { href: '/repayment', icon: '↩', label: 'Repayment' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem('agriscore_user');
    if (u) setUser(JSON.parse(u));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('agriscore_user');
    router.push('/auth');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');
        .sidebar {
          width: ${collapsed ? '72px' : '220px'};
          min-height: 100vh;
          background: #0d130d;
          border-right: 1px solid #1e2e1e;
          display: flex; flex-direction: column;
          transition: width 0.2s ease;
          position: sticky; top: 0; height: 100vh;
          font-family: 'Syne', sans-serif;
          flex-shrink: 0;
        }
        .sidebar-top {
          padding: 24px 16px 20px;
          border-bottom: 1px solid #1e2e1e;
          display: flex; align-items: center;
          justify-content: ${collapsed ? 'center' : 'space-between'};
        }
        .sidebar-logo {
          font-size: 1rem; font-weight: 800; color: #6ddb94;
          white-space: nowrap; overflow: hidden;
          display: ${collapsed ? 'none' : 'block'};
        }
        .sidebar-logo span { color: #c4a46b; }
        .collapse-btn {
          background: none; border: none; color: #3a533a;
          cursor: pointer; font-size: 1rem; padding: 4px;
          transition: color 0.2s; line-height: 1;
        }
        .collapse-btn:hover { color: #6ddb94; }
        .sidebar-nav {
          flex: 1; padding: 16px 8px; display: flex; flex-direction: column; gap: 4px;
        }
        .nav-item {
          display: flex; align-items: center;
          gap: 12px; padding: 10px 12px; border-radius: 8px;
          text-decoration: none; color: #4a644a;
          font-size: 0.82rem; font-weight: 600;
          letter-spacing: 0.03em;
          transition: all 0.15s; white-space: nowrap; overflow: hidden;
        }
        .nav-item:hover { background: #111811; color: #a0c8a0; }
        .nav-item.active { background: #1e3a28; color: #6ddb94; }
        .nav-icon { font-size: 1rem; flex-shrink: 0; }
        .nav-label { display: ${collapsed ? 'none' : 'block'}; }
        .sidebar-bottom {
          padding: 16px 8px;
          border-top: 1px solid #1e2e1e;
        }
        .user-chip {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 8px;
          margin-bottom: 8px;
          overflow: hidden;
        }
        .user-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: #1e3a28; border: 1px solid #4caf72;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem; font-weight: 700; color: #6ddb94;
          flex-shrink: 0;
        }
        .user-info { display: ${collapsed ? 'none' : 'block'}; overflow: hidden; }
        .user-name { font-size: 0.8rem; font-weight: 700; color: #c0dcc0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .user-loc { font-size: 0.7rem; color: #3a533a; }
        .logout-btn {
          width: 100%; display: flex; align-items: center; gap: 12px;
          padding: 10px 12px; border-radius: 8px;
          background: none; border: none; cursor: pointer;
          color: #3a533a; font-size: 0.82rem; font-weight: 600;
          font-family: 'Syne', sans-serif;
          transition: all 0.15s; white-space: nowrap; overflow: hidden;
          text-align: left;
        }
        .logout-btn:hover { background: rgba(220,60,60,0.08); color: #f08080; }
        .logout-label { display: ${collapsed ? 'none' : 'block'}; }
      `}</style>

      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-logo">Agri<span>Score</span></div>
          <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${pathname === item.href ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-bottom">
          {user && (
            <div className="user-chip">
              <div className="user-avatar">
                {user.name ? user.name[0].toUpperCase() : 'F'}
              </div>
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-loc">{user.location}</div>
              </div>
            </div>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">⇤</span>
            <span className="logout-label">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}