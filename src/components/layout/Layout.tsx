import { useEffect } from 'react'
import { Outlet, Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import { useUIStore } from '@/stores/ui.store'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { cn } from '@/lib/utils'

export function Layout() {
  const { isAuthenticated, isLoading } = useAuthStore()
  const { sidebarOpen } = useUIStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar />
      <Header />
      <main
        className={cn(
          "transition-all duration-300 pt-16",
          sidebarOpen ? "ml-20 sm:ml-64" : "ml-20"
        )}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
