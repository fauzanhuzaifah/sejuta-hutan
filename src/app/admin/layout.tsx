'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  TreePine,
  ShieldCheck
} from 'lucide-react';
import { useTheme } from 'next-themes';

const navItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Kelola Peserta',
    href: '/admin/peserta',
    icon: Users,
  },
  {
    title: 'Kelola Komentar',
    href: '/admin/komentar',
    icon: MessageSquare,
  },
  {
    title: 'Statistik',
    href: '/admin/statistik',
    icon: BarChart3,
  },
  {
    title: 'Pengaturan',
    href: '/admin/pengaturan',
    icon: Settings,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const pathname = usePathname();
  const { theme } = useTheme();

  // Simple password check (in production, use proper authentication)
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setError('');
      localStorage.setItem('adminLoggedIn', 'true');
    } else {
      setError('Password salah!');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('adminLoggedIn');
    setPassword('');
  };

  // Check if already logged in
  useEffect(() => {
    const loggedIn = localStorage.getItem('adminLoggedIn');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-[#052e16]' : 'bg-[#f0fdf4]'}`}>
        <div className={`w-full max-w-md p-8 rounded-3xl ${theme === 'dark' ? 'bg-gradient-to-br from-green-900/80 to-[#022c17] border border-green-700/30' : 'bg-white border border-green-200 shadow-xl'}`}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-green-100' : 'text-green-900'}`}>
              Admin Login
            </h1>
            <p className={`text-sm ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>
              Program Menanam Sejuta Pohon
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className={`block text-xs font-semibold mb-2 tracking-wider uppercase ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                Password Admin
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className={`w-full px-4 py-3 rounded-xl text-sm transition-all ${
                  theme === 'dark'
                    ? 'bg-green-800/30 border-green-700/30 text-green-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                    : 'bg-white border-green-200 text-green-900 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                }`}
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full px-8 py-3 rounded-xl font-bold text-white text-base bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/25"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-[#052e16]' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${
          theme === 'dark' ? 'bg-gradient-to-b from-green-900/90 to-[#022c17] border-r border-green-800' : 'bg-white border-r border-green-200'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-green-700/20">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                <TreePine className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className={`font-bold text-sm ${theme === 'dark' ? 'text-green-100' : 'text-green-900'}`}>SEJUTA POHON</span>
                <span className={`block text-[10px] tracking-widest uppercase ${theme === 'dark' ? 'text-green-600' : 'text-green-500'}`}>Admin Panel</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-500/25'
                      : theme === 'dark'
                      ? 'text-green-400 hover:bg-green-800/30 hover:text-green-300'
                      : 'text-green-700 hover:bg-green-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-green-700/20">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-red-500 hover:bg-red-500/10"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className={`sticky top-0 z-30 border-b ${theme === 'dark' ? 'bg-[#052e16]/80 backdrop-blur-sm border-green-800' : 'bg-white/80 backdrop-blur-sm border-green-200'}`}>
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-800/30"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-4">
              <Link
                href="/"
                target="_blank"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  theme === 'dark'
                    ? 'text-green-400 hover:bg-green-800/30'
                    : 'text-green-700 hover:bg-green-100'
                }`}
              >
                <TreePine className="w-4 h-4" />
                Lihat Landing Page
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
