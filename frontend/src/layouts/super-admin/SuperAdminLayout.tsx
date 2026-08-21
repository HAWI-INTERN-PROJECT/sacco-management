import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  Search,
  Bell,
  Plus,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Shield,
} from 'lucide-react'
import { useAuthStore } from '../../stores/auth'

export const SuperAdminLayout: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, getProfile, logout } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)

  useEffect(() => {
    if (!user) {
      getProfile().catch(() => {
        // Silently fail if unauthenticated; interceptor or route guard will handle
      })
    }
  }, [user, getProfile])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch {
      navigate('/login')
    }
  }

  const isDashboard = location.pathname === '/super-admin' || location.pathname === '/super-admin/'

  const mainNavItems = [
    { label: 'Dashboard', path: '/super-admin', icon: LayoutDashboard },
    { label: 'SACCOs', path: '/super-admin/saccos', icon: Building2 },
    { label: 'All Users', path: '/super-admin/users', icon: Users },
    { label: 'Platform Reports', path: '/super-admin/reports', icon: BarChart3 },
  ]

  const bottomNavItems = [
    { label: 'Settings', path: '/super-admin/settings', icon: Settings },
  ]

  const isActive = (path: string) => {
    if (path === '/super-admin') {
      return location.pathname === '/super-admin' || location.pathname === '/super-admin/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col md:flex-row font-sans text-slate-900">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#182232] text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
            <Building2 className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <div className="font-extrabold text-base leading-tight tracking-wide text-white">SACCO MS</div>
            <div className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
              Platform Admin
            </div>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md hover:bg-slate-800 text-slate-300"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-[#182232] text-slate-300 flex-shrink-0 flex flex-col justify-between z-40 select-none shadow-xl`}
      >
        <div>
          {/* Header Brand */}
          <div className="hidden md:flex items-center gap-3 px-6 py-5 border-b border-slate-800/80">
            <div className="bg-slate-800/90 p-2.5 rounded-xl border border-slate-700/60 shadow-xs shrink-0">
              <Building2 className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <div className="font-extrabold text-lg text-white leading-snug tracking-wide">SACCO MS</div>
              <div className="text-[10px] text-amber-400 font-bold tracking-wider uppercase">
                Platform Admin
              </div>
            </div>
          </div>

          {/* New Application CTA */}
          <div className="px-4 py-4">
            <Link
              to="/super-admin/saccos"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-[#10B981] hover:bg-emerald-600 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Review Applications</span>
            </Link>
          </div>

          {/* Main Links */}
          <nav className="px-3 py-1 space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-[#10B981] text-white font-bold shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom Links */}
        <div className="p-3 border-t border-slate-800/80 space-y-1">
          {bottomNavItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-[#10B981] text-white font-bold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 text-slate-400" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </aside>

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F4F6F9]">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200/90 px-6 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
          {/* Header Title */}
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-lg font-extrabold text-slate-900 truncate tracking-tight">
              {isDashboard ? 'Platform Superadmin' : 'SACCO Management System'}
            </h1>
            <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-[#F3E8FF] text-[#9333EA] shrink-0 border border-purple-200/60">
              <Shield className="w-3 h-3 text-[#9333EA]" />
              Superadmin
            </span>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative hidden lg:block w-60">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search platform..."
                className="w-full pl-9 pr-4 py-1.5 bg-[#F1F5F9] border border-slate-200/80 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:bg-white transition-all"
              />
            </div>

            {/* Notifications */}
            <button
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="w-2 h-2 bg-rose-500 rounded-full absolute top-1.5 right-1.5 ring-2 ring-white"></span>
            </button>

            {/* Help */}
            <button
              onClick={() => setShowHelpModal(true)}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors hidden sm:block"
              title="Help & Support"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-3 p-1 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#182232] text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : 'SA'}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {user?.name || 'Super Admin'}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold">
                    {user?.email || 'superadmin@example.com'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-900">{user?.name || 'Super Admin'}</div>
                    <div className="text-[11px] text-slate-400">{user?.email || 'superadmin@example.com'}</div>
                  </div>
                  <Link
                    to="/super-admin/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Platform Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Viewport Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Platform Support & Help</h3>
              <button onClick={() => setShowHelpModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              As a Superadmin, you have top-level access to inspect, approve, or reject cooperative applications, review cross-platform analytics, and manage systemic parameters.
            </p>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-xs text-slate-700 space-y-1">
              <div className="font-bold text-slate-900">Support Desk Contact:</div>
              <div>Email: support@saccoms.et</div>
              <div>Phone: +251 11 600 0000</div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-[#0B1727] text-white text-xs font-bold rounded-lg hover:bg-[#0B1727]/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
