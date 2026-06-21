import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),

      login: async (credentials) => {
        set({ isLoading: true })
        try {
          const { data } = await api.post('/auth/login', credentials)
          set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false })
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, message: error.response?.data?.message || 'Login failed' }
        }
      },

      register: async (userData) => {
        set({ isLoading: true })
        try {
          const { data } = await api.post('/auth/register', userData)
          set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false })
          return { success: true, message: data.message }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, message: error.response?.data?.message || 'Registration failed' }
        }
      },

      googleLogin: async (credential) => {
        set({ isLoading: true })
        try {
          const { data } = await api.post('/auth/google', { credential })
          set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false })
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, message: error.response?.data?.message || 'Google login failed' }
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },

      updateUser: (updatedUser) => {
        set({ user: { ...get().user, ...updatedUser } })
      },

      fetchMe: async () => {
        try {
          const { data } = await api.get('/auth/me')
          set({ user: data.user })
        } catch {
          set({ user: null, token: null, isAuthenticated: false })
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated })
    }
  )
)

export default useAuthStore
