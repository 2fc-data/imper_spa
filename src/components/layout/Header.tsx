import { useState, useRef, useEffect } from 'react'
import { Bell, User, Check, CheckCheck, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/stores/auth.store'
import { useUIStore } from '@/stores/ui.store'
import { useNotifications, useUnreadCount, useMarkAsRead, useMarkAllAsRead } from '@/hooks/useNotifications'
import { getInitials, formatDate } from '@/lib/utils'

export function Header() {
  const { user } = useAuthStore()
  const { sidebarOpen } = useUIStore()
  const { data: unreadData } = useUnreadCount()
  const { data: notificationsData } = useNotifications()
  const markAsRead = useMarkAsRead()
  const markAllAsRead = useMarkAllAsRead()

  const unreadCount = unreadData?.data?.count ?? 0
  const notifications = notificationsData?.data?.data ?? []

  const [panelOpen, setPanelOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setPanelOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkRead = (id: string) => {
    markAsRead.mutate(id)
  }

  const handleMarkAllRead = () => {
    markAllAsRead.mutate()
  }

  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--background)] px-6"
      style={{ marginLeft: sidebarOpen ? '256px' : '80px' }}
    >
      <div />

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className="relative rounded-lg p-2 hover:bg-[var(--secondary)] transition-colors"
          >
            <Bell size={20} className="text-[var(--muted-foreground)]" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--destructive)] text-[10px] font-bold text-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {panelOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xl"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
                  <h3 className="text-sm font-semibold text-[var(--card-foreground)]">
                    Notificações
                  </h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                      >
                        <CheckCheck size={14} />
                        Ler todas
                      </button>
                    )}
                    <button
                      onClick={() => setPanelOpen(false)}
                      className="rounded p-1 hover:bg-[var(--secondary)] transition-colors"
                    >
                      <X size={14} className="text-[var(--muted-foreground)]" />
                    </button>
                  </div>
                </div>

                {/* List */}
                <div className="overflow-y-auto max-h-72 custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-sm text-[var(--muted-foreground)]">
                      <Bell size={24} className="mx-auto mb-2 opacity-40" />
                      Nenhuma notificação
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`flex items-start gap-3 px-4 py-3 border-b border-[var(--border)] transition-colors hover:bg-[var(--secondary)] ${
                          !n.read ? 'bg-primary/5' : ''
                        }`}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          {!n.read ? (
                            <button
                              onClick={() => handleMarkRead(n.id)}
                              className="rounded-full p-1 hover:bg-primary/10 transition-colors"
                              title="Marcar como lida"
                            >
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            </button>
                          ) : (
                            <Check size={14} className="text-[var(--muted-foreground)] opacity-40" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--card-foreground)] truncate">
                            {n.title}
                          </p>
                          {n.message && (
                            <p className="text-xs text-[var(--muted-foreground)] mt-0.5 line-clamp-2">
                              {n.message}
                            </p>
                          )}
                          <p className="text-[10px] text-[var(--muted-foreground)] mt-1 opacity-60">
                            {formatDate(n.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-white">
            {user ? getInitials(user.name) : <User size={16} />}
          </div>
          <div className="hidden text-sm md:block">
            <p className="font-medium text-[var(--foreground)]">{user?.name}</p>
            <p className="text-xs text-[var(--muted-foreground)]">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
