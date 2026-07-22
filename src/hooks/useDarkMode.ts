import { useEffect } from 'react'
import { useUIStore } from '@/stores/ui.store'

export function useDarkMode() {
  const darkMode = useUIStore((s) => s.darkMode)

  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('imper-dark-mode', String(darkMode))
  }, [darkMode])
}

export function initDarkMode() {
  const stored = localStorage.getItem('imper-dark-mode')
  if (stored === 'true') {
    document.documentElement.classList.add('dark')
    useUIStore.setState({ darkMode: true })
  }
}
