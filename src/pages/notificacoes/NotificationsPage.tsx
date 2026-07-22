import { useState } from 'react'
import {
  Bell,
  BellOff,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  GitPullRequest,
  CalendarClock,
  AlertTriangle,
  Send,
  FileCheck,
  Clock,
  Users,
  Target,
  Settings,
} from 'lucide-react'
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '@/hooks/useNotifications'
import { cn, formatDateTime } from '@/lib/utils'

const typeConfig: Record<string, { icon: typeof Bell; color: string; label: string }> = {
  lead_atribuido: { icon: UserPlus, color: 'text-blue-500', label: 'Lead Atribuído' },
  lead_movido: { icon: GitPullRequest, color: 'text-violet-500', label: 'Lead Movido' },
  atividade_agendada: { icon: CalendarClock, color: 'text-green-500', label: 'Atividade Agendada' },
  atividade_atrasada: { icon: AlertTriangle, color: 'text-red-500', label: 'Atividade Atrasada' },
  proposta_enviada: { icon: Send, color: 'text-blue-500', label: 'Proposta Enviada' },
  proposta_assinada: { icon: FileCheck, color: 'text-green-500', label: 'Proposta Assinada' },
  proposta_expirada: { icon: Clock, color: 'text-amber-500', label: 'Proposta Expirada' },
  lead_sem_interacao: { icon: Users, color: 'text-orange-500', label: 'Lead Sem Interação' },
  meta_atingida: { icon: Target, color: 'text-emerald-500', label: 'Meta Atingida' },
  sistema: { icon: Settings, color: 'text-gray-500', label: 'Sistema' },
}

export function NotificationsPage() {
  const [page, setPage] = useState(1)
  const [unreadOnly, setUnreadOnly] = useState(false)
  const limit = 20

  const { data, isLoading } = useNotifications({ unread: unreadOnly || undefined, page, limit })
  const markAsRead = useMarkAsRead()
  const markAllAsRead = useMarkAllAsRead()

  const notifications = data?.data?.data ?? []
  const meta = data?.data?.meta ?? { total: 0, page: 1, limit: 20, totalPages: 1 }

  function handleMarkAllRead() {
    markAllAsRead.mutate()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notificações</h1>
        <button
          onClick={handleMarkAllRead}
          disabled={markAllAsRead.isPending}
          className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] transition-colors hover:opacity-90 disabled:opacity-50"
        >
          <CheckCheck size={16} />
          Marcar todas como lidas
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => { setUnreadOnly(false); setPage(1) }}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            !unreadOnly
              ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
              : 'bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--accent)]'
          )}
        >
          Todas
        </button>
        <button
          onClick={() => { setUnreadOnly(true); setPage(1) }}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            unreadOnly
              ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
              : 'bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--accent)]'
          )}
        >
          Não lidas
        </button>
      </div>

      {/* List */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--background)]">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-[var(--muted-foreground)]">
            {unreadOnly ? <BellOff size={40} className="mb-3 opacity-40" /> : <Bell size={40} className="mb-3 opacity-40" />}
            <p className="text-sm">
              {unreadOnly ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {notifications.map((n) => {
              const cfg = typeConfig[n.type] ?? { icon: Bell, color: 'text-gray-500', label: n.type }
              const Icon = cfg.icon
              return (
                <div
                  key={n.id}
                  className={cn(
                    'flex items-start gap-4 px-6 py-4 transition-colors',
                    !n.read && 'bg-[var(--accent)]/30'
                  )}
                >
                  <div className={cn('mt-0.5 shrink-0', cfg.color)}>
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{n.title}</p>
                      {!n.read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--primary)]" />
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">{n.message}</p>
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                      {formatDateTime(n.createdAt)}
                    </p>
                  </div>
                  {!n.read && (
                    <button
                      onClick={() => markAsRead.mutate(n.id)}
                      className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-[var(--primary)] transition-colors hover:bg-[var(--accent)]"
                    >
                      Marcar lida
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[var(--border)] px-6 py-3">
            <p className="text-xs text-[var(--muted-foreground)]">
              Página {meta.page} de {meta.totalPages} — {meta.total} notificações
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={meta.page <= 1}
                className="rounded-md p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--accent)] disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={meta.page >= meta.totalPages}
                className="rounded-md p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--accent)] disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
