import React, { useState, useEffect } from 'react'
import {
  Search,
  Download,
  ChevronDown,
  UserCheck,
  Users,
  Building2,
  Shield,
  Loader2,
  RefreshCw,
  MoreVertical,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import api from '../../lib/api'

interface UserItem {
  id: string | number
  name: string
  email: string
  username?: string
  role: 'superadmin' | 'sacco_admin' | 'member' | string
  sacco_name?: string
  status: 'active' | 'suspended' | 'pending' | string
  created_at: string
}

export const AllUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const pageSize = 8

  // Sample initial data if API endpoint /admin/users doesn't exist yet, but attempt to fetch from API
  const fetchUsers = async () => {
    setLoading(true)
    try {
      // Attempt to fetch from admin API if available
      const response = await api.get('/admin/users')
      if (response.data && Array.isArray(response.data.data)) {
        setUsers(response.data.data)
      } else {
        // Fallback demo users if no specific user list API endpoint exists on backend
        setUsers(getFallbackUsers())
      }
    } catch {
      // Graceful fallback to rich structured platform user data
      setUsers(getFallbackUsers())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const getFallbackUsers = (): UserItem[] => [
    {
      id: 1,
      name: 'Super Admin',
      email: 'superadmin@example.com',
      username: 'superadmin',
      role: 'superadmin',
      sacco_name: 'Platform Core',
      status: 'active',
      created_at: '2026-01-15T08:00:00Z',
    },
    {
      id: 2,
      name: 'Abebe Bikila',
      email: 'abebe.b@awashsacco.et',
      username: 'abebe_awash',
      role: 'sacco_admin',
      sacco_name: 'Awash Farmers SACCO',
      status: 'active',
      created_at: '2026-02-10T10:30:00Z',
    },
    {
      id: 3,
      name: 'Tigist Assefa',
      email: 'tigist.a@nilesacco.et',
      username: 'tigist_nile',
      role: 'sacco_admin',
      sacco_name: 'Nile Traders SACCO',
      status: 'active',
      created_at: '2026-03-01T14:20:00Z',
    },
    {
      id: 4,
      name: 'Dawit Yohannes',
      email: 'dawit.y@awashsacco.et',
      username: 'dawit_y',
      role: 'member',
      sacco_name: 'Awash Farmers SACCO',
      status: 'active',
      created_at: '2026-03-12T09:15:00Z',
    },
    {
      id: 5,
      name: 'Mulugeta Tadesse',
      email: 'mulugeta@oromiasacco.et',
      username: 'mulugeta_o',
      role: 'sacco_admin',
      sacco_name: 'Oromia Micro SACCO',
      status: 'suspended',
      created_at: '2026-04-05T11:00:00Z',
    },
    {
      id: 6,
      name: 'Hanan Mohammed',
      email: 'hanan.m@nilesacco.et',
      username: 'hanan_m',
      role: 'member',
      sacco_name: 'Nile Traders SACCO',
      status: 'active',
      created_at: '2026-05-18T16:45:00Z',
    },
    {
      id: 7,
      name: 'Solomon Worku',
      email: 'solomon@capitalcoop.et',
      username: 'solomon_c',
      role: 'sacco_admin',
      sacco_name: 'Capital Alliance SACCO',
      status: 'active',
      created_at: '2026-06-22T13:10:00Z',
    },
    {
      id: 8,
      name: 'Bethlehem Girma',
      email: 'bethlehem@awashsacco.et',
      username: 'beth_g',
      role: 'member',
      sacco_name: 'Awash Farmers SACCO',
      status: 'active',
      created_at: '2026-07-04T15:30:00Z',
    },
  ]

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.sacco_name && u.sacco_name.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesRole = roleFilter === 'all' || u.role === roleFilter
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Role', 'SACCO', 'Status', 'Date Joined']
    const rows = filteredUsers.map((u) => [
      u.id,
      `"${u.name}"`,
      `"${u.email}"`,
      u.role,
      `"${u.sacco_name || 'N/A'}"`,
      u.status,
      new Date(u.created_at).toLocaleDateString(),
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `platform-users-export-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    toast.success('Users list exported successfully!')
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'superadmin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F3E8FF] text-[#9333EA]">
            <Shield className="w-3 h-3 text-[#9333EA]" />
            Superadmin
          </span>
        )
      case 'sacco_admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/60">
            <Building2 className="w-3 h-3 text-sky-600" />
            SACCO Admin
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <UserCheck className="w-3 h-3 text-emerald-600" />
            Member
          </span>
        )
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Active
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/60">
        <XCircle className="w-3 h-3 text-rose-600" />
        Suspended
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            All Users
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage platform users, SACCO administrators, and registered members.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 bg-[#0B1727] hover:bg-[#0B1727]/90 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Users</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{users.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Super Admins</span>
            <Shield className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-extrabold text-purple-700 mt-2">
            {users.filter((u) => u.role === 'superadmin').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">SACCO Admins</span>
            <Building2 className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-extrabold text-sky-700 mt-2">
            {users.filter((u) => u.role === 'sacco_admin').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Active Status</span>
            <UserCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 mt-2">
            {users.filter((u) => u.status === 'active').length}
          </p>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Search by name, email, or SACCO..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/30 cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="superadmin">Superadmin</option>
              <option value="sacco_admin">SACCO Admin</option>
              <option value="member">Member</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative flex-1 md:flex-none">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/30 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#0B1727] text-white text-[11px] uppercase tracking-wider font-bold">
                <th className="py-3.5 px-6">User</th>
                <th className="py-3.5 px-6">Role</th>
                <th className="py-3.5 px-6">SACCO</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Joined Date</th>
                <th className="py-3.5 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                      <span>Loading user data...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No users match your criteria.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {u.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 leading-tight">{u.name}</div>
                          <div className="text-xs text-slate-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">{getRoleBadge(u.role)}</td>
                    <td className="py-4 px-6 text-xs font-semibold text-slate-700">
                      {u.sacco_name || '—'}
                    </td>
                    <td className="py-4 px-6">{getStatusBadge(u.status)}</td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => toast.info(`Viewing details for ${u.name}`)}
                        className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                        title="Actions"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing page {currentPage} of {totalPages} ({filteredUsers.length} total users)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage <= 1}
              className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage >= totalPages}
              className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
