import React, { useState } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Wallet,
  Landmark,
  BarChart3,
  Settings,
  HelpCircle,
  Search,
  Bell,
  Plus,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useAuthStore } from '../../stores/auth'

export const SuperAdminLayout: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch {
      navigate('/login')
    }
  }

  const mainNavItems = [
    { label: 'Dashboard', path: '/super-admin', icon: LayoutDashboard },
    { label: 'SACCOs', path: '/super-admin/saccos', icon: Building2 },
    { label: 'Members', path: '/super-admin/members', icon: Users },
    { label: 'Loans', path: '/super-admin/loans', icon: CreditCard },
    { label: 'Savings', path: '/super-admin/savings', icon: Wallet },
    { label: 'Accounts', path: '/super-admin/accounts', icon: Landmark },
    { label: 'Reports', path: '/super-admin/reports', icon: BarChart3 },
  ]

  const bottomNavItems = [
    { label: 'Settings', path: '/super-admin/settings', icon: Settings },
    { label: 'Support', path: '/super-admin/support', icon: HelpCircle },
  ]

  const isActive = (path: string) => {
    if (path === '/super-admin') {
      return location.pathname === '/super-admin' || location.pathname === '/super-admin/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#0B1727] text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
            <Building2 className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <div className="font-bold text-base leading-tight tracking-wide">SACCO MS</div>
            <div className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Platform Admin</div>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md hover:bg-slate-800 text-slate-300"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop & Mobile Sidebar */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-[#0B1727] text-slate-300 flex-shrink-0 flex flex-col justify-between z-40`}
      >
        <div>
          {/* Brand Logo Header */}
          <div className="hidden md:flex items-center gap-3 px-6 py-6 border-b border-slate-800/80">
            <div className="bg-slate-800/90 p-2.5 rounded-lg border border-slate-700/60 shadow-xs">
              <Building2 className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <div className="font-extrabold text-lg text-white leading-snug tracking-wide">SACCO MS</div>
              <div className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase">
                Management System
              </div>
            </div>
          </div>

          {/* New Application CTA Button */}
          <div className="px-4 py-4">
            <Link
              to="/super-admin/saccos"
              className="w-full flex items-center justify-center gap-2 bg-[#9A7B1C] hover:bg-[#836815] text-white font-semibold text-sm py-2.5 px-4 rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Application</span>
            </Link>
          </div>

          {/* Main Navigation */}
          <nav className="px-3 py-2 space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-[#9A7B1C] text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom Navigation & User Profile */}
        <div className="p-3 border-t border-slate-800/80 space-y-1">
          {bottomNavItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-[#9A7B1C] text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 text-slate-400" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F4F6F9]">
        {/* Top Bar Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
          {/* Left Title & Badge */}
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-lg font-bold text-slate-900 truncate">
              SACCO Management System
            </h1>
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 shrink-0">
              Platform Superadmin
            </span>
          </div>

          {/* Right Header Search & Actions */}
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative hidden lg:block w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-1.5 bg-slate-100/80 border border-slate-200 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:bg-white transition-all"
              />
            </div>

            {/* Icons */}
            <button
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="w-2 h-2 bg-rose-500 rounded-full absolute top-1.5 right-1.5 ring-2 ring-white"></span>
            </button>
            <button
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors hidden sm:block"
              title="Help & Support"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            {/* Profile User Info */}
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"
                alt="Admin Avatar"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200"
              />
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {user?.name || 'Admin User'}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  System Administrator
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-rose-600 transition-colors ml-1"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
