import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Users,
  Search,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  ShieldAlert,
} from 'lucide-react'
import { toast } from 'sonner'
import { superAdminUserService, type GetUsersParams } from '../../services/superAdminUserService'

export const AllUsersPage: React.FC = () => {
  const queryClient = useQueryClient()
  const [params, setParams] = useState<GetUsersParams>({
    page: 1,
    sort: 'newest',
  })

  const { data, isLoading } = useQuery({
    queryKey: ['superadmin-users', params],
    queryFn: () => superAdminUserService.getUsers(params),
  })

  const suspendMutation = useMutation({
    mutationFn: (id: number) => superAdminUserService.suspendUser(id),
    onSuccess: () => {
      toast.success('User suspended successfully')
      queryClient.invalidateQueries({ queryKey: ['superadmin-users'] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to suspend user')
    },
  })

  const activateMutation = useMutation({
    mutationFn: (id: number) => superAdminUserService.activateUser(id),
    onSuccess: () => {
      toast.success('User activated successfully')
      queryClient.invalidateQueries({ queryKey: ['superadmin-users'] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to activate user')
    },
  })

  const handleExport = () => {
    const exportParams = { ...params }
    delete exportParams.page
    delete exportParams.sort
    superAdminUserService.exportUsers(exportParams)
      .then(() => toast.success('Export started'))
      .catch(() => toast.error('Export failed'))
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams({ ...params, search: e.target.value, page: 1 })
  }

  const handleFilterChange = (key: keyof GetUsersParams, value: string) => {
    setParams({ ...params, [key]: value || undefined, page: 1 })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            All Users
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage all platform members, SACCO admins, and superadmins.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search users by name, email, or username..."
            value={params.search || ''}
            onChange={handleSearch}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              className="bg-transparent text-sm font-medium text-slate-700 outline-none"
              value={params.role || ''}
              onChange={(e) => handleFilterChange('role', e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="superadmin">Superadmin</option>
              <option value="admin">SACCO Admin</option>
              <option value="member">Member</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              className="bg-transparent text-sm font-medium text-slate-700 outline-none"
              value={params.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">SACCO</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                      <span>Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : data?.data?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-slate-900">No users found</h3>
                    <p className="text-slate-500">Try adjusting your filters or search query.</p>
                  </td>
                </tr>
              ) : (
                data?.data.map((user: any) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">
                            {user.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${user.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : 
                          user.role === 'admin' ? 'bg-blue-100 text-blue-700' : 
                          'bg-slate-100 text-slate-700'}
                      `}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {user.sacco ? user.sacco.name : <span className="text-slate-400 italic">None</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                        ${user.is_active !== false 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' 
                          : 'bg-rose-50 text-rose-700 border border-rose-200/50'}
                      `}>
                        {user.is_active !== false ? (
                          <><CheckCircle2 className="w-3.5 h-3.5" /> Active</>
                        ) : (
                          <><XCircle className="w-3.5 h-3.5" /> Suspended</>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.role !== 'superadmin' && (
                        <div className="flex justify-end gap-2">
                          {user.is_active !== false ? (
                            <button
                              onClick={() => {
                                if(window.confirm('Are you sure you want to suspend this user?')) {
                                  suspendMutation.mutate(user.id)
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Suspend User"
                            >
                              <ShieldAlert className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if(window.confirm('Are you sure you want to activate this user?')) {
                                  activateMutation.mutate(user.id)
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Activate User"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {data?.meta && data.meta.last_page > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-500">
              Showing <span className="font-medium text-slate-900">{data.meta.from}</span> to <span className="font-medium text-slate-900">{data.meta.to}</span> of <span className="font-medium text-slate-900">{data.meta.total}</span> results
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={params.page === 1}
                onClick={() => setParams({ ...params, page: (params.page || 1) - 1 })}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={params.page === data.meta.last_page}
                onClick={() => setParams({ ...params, page: (params.page || 1) + 1 })}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
