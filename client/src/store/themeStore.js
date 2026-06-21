import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useThemeStore = create(
  persist(
    (set, get) => ({
      isDark: false,

      toggleTheme: () => {
        const newValue = !get().isDark
        set({ isDark: newValue })
        if (newValue) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },

      initTheme: () => {
        const isDark = get().isDark
        if (isDark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    }),
    { name: 'theme-storage' }
  )
)

export default useThemeStore
