import React, { useState } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import {
  LayoutGrid,
  Building2,
  Users,
  BarChart3,
  Settings,
  Bell,
  HelpCircle,
  Search,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from 'lucide-react'
import { useAuthStore } from '../../stores/auth'

export const SuperAdminLayout: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, getProfile, logout } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  React.useEffect(() => {
    if (!user && localStorage.getItem('token')) {
      getProfile().catch(() => {
        localStorage.removeItem('token')
        navigate('/login', { replace: true })
      })
    }
  }, [user, getProfile, navigate])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch {
      navigate('/login')
    }
  }


  const navItems = [
    { label: 'Platform Dashboard', path: '/super-admin', icon: LayoutGrid },
    { label: 'SACCO Management', path: '/super-admin/saccos', icon: Building2 },
    { label: 'All Users', path: '/super-admin/users', icon: Users },
    { label: 'Platform Reports', path: '/super-admin/reports', icon: BarChart3 },
    { label: 'Platform Settings', path: '/super-admin/settings', icon: Settings },
  ]

  const isActive = (path: string) => {
    if (path === '/super-admin') {
      return location.pathname === '/super-admin' || location.pathname === '/super-admin/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans text-slate-800">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#182232] text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center font-bold text-white text-xs">
            SA
          </div>
          <div>
            <div className="font-bold text-sm leading-tight">SuperAdmin</div>
            <div className="text-[10px] text-slate-400">System Authority</div>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md text-slate-300 hover:bg-slate-800"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar navigation */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:flex flex-col w-full md:w-64 bg-[#182232] text-slate-300 flex-shrink-0 z-40 select-none min-h-screen justify-between`}
      >
        <div>
          {/* Sidebar Top Header Logo */}
          <div className="hidden md:flex items-center gap-3.5 px-6 py-6 border-b border-slate-800/80">
            <div className="w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center font-extrabold text-white text-sm shadow-sm shrink-0">
              SA
            </div>
            <div>
              <div className="font-extrabold text-base text-white leading-snug tracking-tight">SuperAdmin</div>
              <div className="text-[11px] text-slate-400 font-medium">System Authority</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-6 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg text-xs font-semibold transition-all relative ${
                    active
                      ? 'bg-slate-800/60 text-amber-400 font-bold border-r-4 border-amber-500'
                      : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className={`w-4 h-4 ${active ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"
              alt="Admin Avatar"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-700 shrink-0"
            />
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-200 truncate">{user?.name || 'Admin User'}</div>
              <div className="text-[10px] text-slate-400 truncate">Platform Administrator</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
          {/* Green Title Header */}
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-extrabold text-[#166534] tracking-tight">Platform Admin</h1>
          </div>

          {/* Top Search & Actions */}
          <div className="flex items-center gap-4">
            {/* Search Input Box */}
            <div className="relative hidden md:block w-64 lg:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search across platform..."
                className="w-full pl-9 pr-4 py-2 bg-[#F1F5F9] border border-slate-200/80 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white transition-all"
              />
            </div>

            {/* Notification Bell */}
            <button
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="w-2 h-2 bg-rose-500 rounded-full absolute top-1.5 right-1.5 ring-2 ring-white"></span>
            </button>

            {/* Support / Help Button */}
            <button
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors hidden sm:block"
              title="Help & Documentation"
            >
              <HelpCircle className="w-5 h-5 text-slate-600" />
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100 transition-colors text-left"
              >
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"
                  alt="Platform Admin"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200"
                />
                <span className="text-xs font-bold text-slate-800 hidden sm:inline-block">Platform Admin</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{user?.name || 'Platform Admin'}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email || 'admin@platform.et'}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}


