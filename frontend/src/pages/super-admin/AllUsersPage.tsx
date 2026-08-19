import React, { useState } from 'react'
import { Search, Download, ChevronDown, MoreVertical, UserCheck, ShieldAlert } from 'lucide-react'
import { toast } from 'sonner'

interface UserItem {
  id: string
  name: string
  userId: string
  role: 'Superadmin' | 'SACCO Admin' | 'Member'
  sacco: string
  email: string
  joinedDate: string
  status: 'Active' | 'Suspended'
  avatarColor: string
}

export const AllUsersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles')
  const [saccoFilter, setSaccoFilter] = useState('All SACCOs')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [currentPage, setCurrentPage] = useState(1)

  // Demo user data matching Figma design
  const initialUsers: UserItem[] = [
    {
      id: '1',
      name: 'Abebe Kebede',
      userId: 'USR-8891',
      role: 'SACCO Admin',
      sacco: 'Abay SACCO',
      email: 'abebe.k@abaysacco.et',
      joinedDate: 'Oct 12, 2023',
      status: 'Active',
      avatarColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    },
    {
      id: '2',
      name: 'Tigist Hailu',
      userId: 'USR-9022',
      role: 'Member',
      sacco: 'Awash Cooperative',
      email: 't.hailu@awash.com',
      joinedDate: 'Nov 05, 2023',
      status: 'Suspended',
      avatarColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      id: '3',
      name: 'Gemechu D.',
      userId: 'USR-0001',
      role: 'Superadmin',
      sacco: 'Global',
      email: 'admin@platform.et',
      joinedDate: 'Jan 01, 2022',
      status: 'Active',
      avatarColor: 'bg-slate-800 text-white border-slate-700',
    },
    {
      id: '4',
      name: 'Dawit Bekele',
      userId: 'USR-7621',
      role: 'SACCO Admin',
      sacco: 'Oromia Farmers',
      email: 'dawit.b@oromia.org',
      joinedDate: 'Mar 18, 2023',
      status: 'Active',
      avatarColor: 'bg-blue-100 text-blue-700 border-blue-200',
    },
    {
      id: '5',
      name: 'Marta Tadesse',
      userId: 'USR-5412',
      role: 'Member',
      sacco: 'Unity Savers',
      email: 'marta.t@unity.et',
      joinedDate: 'Apr 02, 2023',
      status: 'Active',
      avatarColor: 'bg-purple-100 text-purple-700 border-purple-200',
    },
    {
      id: '6',
      name: 'Kassahun Worku',
      userId: 'USR-3390',
      role: 'Member',
      sacco: 'Awash Cooperative',
      email: 'k.worku@gmail.com',
      joinedDate: 'Jun 15, 2023',
      status: 'Active',
      avatarColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    },
    {
      id: '7',
      name: 'Hiwot Alemu',
      userId: 'USR-1109',
      role: 'Member',
      sacco: 'Bale Merchants',
      email: 'h.alemu@yahoo.com',
      joinedDate: 'Aug 29, 2023',
      status: 'Suspended',
      avatarColor: 'bg-[#FEE2E2] text-rose-700 border-rose-200',
    },
  ]

  const getInitials = (name: string) => {
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const handleDownloadCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['User ID,Name,Role,SACCO,Email,Joined Date,Status']
        .concat(
          initialUsers.map(
            (u) => `"${u.userId}","${u.name}","${u.role}","${u.sacco}","${u.email}","${u.joinedDate}","${u.status}"`
          )
        )
        .join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `platform_users_export_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Users list exported successfully as CSV.')
  }

  // Filtered users
  const filteredUsers = initialUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.sacco.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = roleFilter === 'All Roles' || u.role === roleFilter
    const matchesSacco = saccoFilter === 'All SACCOs' || u.sacco === saccoFilter
    const matchesStatus = statusFilter === 'All Statuses' || u.status === statusFilter

    return matchesSearch && matchesRole && matchesSacco && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">All Users</h1>
          <p className="text-xs text-slate-500 mt-1">Manage platform users across all SACCOs</p>
        </div>

        <button
          onClick={handleDownloadCSV}
          className="bg-[#0F5132] hover:bg-[#0B3D26] text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 stroke-[2.2]" />
          <span>Download CSV</span>
        </button>
      </div>

      {/* Filter Bar Box */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name, email, or ID..."
            className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-slate-200/80 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white transition-all"
          />
        </div>

        {/* Filter 1: Roles */}
        <div className="relative">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full appearance-none pl-3.5 pr-8 py-2 bg-[#F8FAFC] border border-slate-200/80 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
          >
            <option value="All Roles">All Roles</option>
            <option value="Superadmin">Superadmin</option>
            <option value="SACCO Admin">SACCO Admin</option>
            <option value="Member">Member</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Filter 2: SACCOs */}
        <div className="relative">
          <select
            value={saccoFilter}
            onChange={(e) => setSaccoFilter(e.target.value)}
            className="w-full appearance-none pl-3.5 pr-8 py-2 bg-[#F8FAFC] border border-slate-200/80 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
          >
            <option value="All SACCOs">All SACCOs</option>
            <option value="Abay SACCO">Abay SACCO</option>
            <option value="Awash Cooperative">Awash Cooperative</option>
            <option value="Oromia Farmers">Oromia Farmers</option>
            <option value="Unity Savers">Unity Savers</option>
            <option value="Global">Global</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Filter 3: Statuses */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none pl-3.5 pr-8 py-2 bg-[#F8FAFC] border border-slate-200/80 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">USER</th>
                <th className="py-3.5 px-6">ROLE</th>
                <th className="py-3.5 px-6">SACCO</th>
                <th className="py-3.5 px-6">EMAIL</th>
                <th className="py-3.5 px-6">JOINED DATE</th>
                <th className="py-3.5 px-6">STATUS</th>
                <th className="py-3.5 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No users matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* User Avatar + Name + ID */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 ${u.avatarColor}`}
                        >
                          {getInitials(u.name)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{u.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">ID: {u.userId}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-6">
                      {u.role === 'SACCO Admin' && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#E0E7FF] text-[#3730A3]">
                          SACCO Admin
                        </span>
                      )}
                      {u.role === 'Member' && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FEF3C7] text-[#92400E]">
                          Member
                        </span>
                      )}
                      {u.role === 'Superadmin' && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#1E293B] text-white">
                          Superadmin
                        </span>
                      )}
                    </td>

                    {/* SACCO */}
                    <td className="py-4 px-6 text-slate-800 font-semibold">{u.sacco}</td>

                    {/* Email */}
                    <td className="py-4 px-6 text-slate-500 font-mono">{u.email}</td>

                    {/* Joined Date */}
                    <td className="py-4 px-6 text-slate-500">{u.joinedDate}</td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      {u.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#15803D]">
                          <UserCheck className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEE2E2] text-[#B91C1C]">
                          <ShieldAlert className="w-3 h-3" />
                          <span>Suspended</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toast.info(`Viewing profile for ${u.name}`)}
                          className="text-xs font-semibold text-[#10B981] hover:text-[#059669] transition-colors"
                        >
                          View Profile
                        </button>
                        <button className="p-1 rounded text-slate-400 hover:text-slate-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>Showing 1–10 of 3,456 users</div>
          <div className="flex items-center gap-1.5 font-semibold">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(1)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                currentPage === 1 ? 'bg-[#0F5132] text-white' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              1
            </button>
            <button
              onClick={() => setCurrentPage(2)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                currentPage === 2 ? 'bg-[#0F5132] text-white' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              2
            </button>
            <button
              onClick={() => setCurrentPage(3)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                currentPage === 3 ? 'bg-[#0F5132] text-white' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              3
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
