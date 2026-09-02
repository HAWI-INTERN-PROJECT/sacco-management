import api from '../lib/api'

export const authService = {
  forgotPassword: async (email: string) => {
    const response = await api.post('/forgot-password', { email })
    return response.data
  },

  resetPassword: async (data: {
    token: string
    email: string
    password: string
    password_confirmation: string
  }) => {
    const response = await api.post('/reset-password', data)
    return response.data
  },

  changePassword: async (data: {
    current_password: string
    new_password: string
    new_password_confirmation: string
  }) => {
    const response = await api.put('/change-password', data)
    return response.data
  },
}
