import api from '../lib/api'
import type { Sacco, PaginatedResponse } from '../types'

export interface GetSaccosParams {
  status?: 'pending' | 'approved' | 'rejected' | string
  page?: number
}

export const adminSaccoService = {
  getSaccos: async (params?: GetSaccosParams): Promise<PaginatedResponse<Sacco>> => {
    const response = await api.get<PaginatedResponse<Sacco>>('/admin/saccos', { params })
    return response.data
  },

  getSaccoById: async (id: string | number): Promise<{ data: Sacco }> => {
    const response = await api.get<{ data: Sacco }>(`/admin/saccos/${id}`)
    return response.data
  },

  approveSacco: async (id: string | number): Promise<{ success?: boolean; message?: string; data: Sacco }> => {
    const response = await api.patch<{ success?: boolean; message?: string; data: Sacco }>(`/admin/saccos/${id}/approve`)
    return response.data
  },

  rejectSacco: async (id: string | number): Promise<{ success?: boolean; message?: string; data: Sacco }> => {
    const response = await api.patch<{ success?: boolean; message?: string; data: Sacco }>(`/admin/saccos/${id}/reject`)
    return response.data
  },
}
