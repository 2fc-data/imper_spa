import { Plus, Edit, Trash2, ArrowLeftRight, LogIn, LogOut, Activity } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface TimelineEvent {
  id: string
  entity: string
  entityId: string
  action: string
  description?: string
  changedFields?: string[]
  user?: { name: string }
  createdAt: string
}

interface TimelineViewProps {
  events: TimelineEvent[]
  loading?: boolean
}

const actionColors: Record<string, string> = {
  create: 'bg-green-100 text-green-700 border-green-200',
  update: 'bg-blue-100 text-blue-700 border-blue-200',
  delete: 'bg-red-100 text-red-700 border-red-200',
  login: 'bg-purple-100 text-purple-700 border-purple-200',
  logout: 'bg-gray-100 text-gray-700 border-gray-200',
  status_change: 'bg-orange-100 text-orange-700 border-orange-200',
}

const actionLabels: Record<string, string> = {
  create: 'Criado',
  update: 'Atualizado',
  delete: 'Excluido',
  login: 'Login',
  logout: 'Logout',
  status_change: 'Status',
}

const entityLabels: Record<string, string> = {
  Lead: 'Lead',
  Opportunity: 'Oportunidade',
  Client: 'Cliente',
  Activity: 'Atividade',
  Proposal: 'Proposta',
  Contact: 'Contato',
  User: 'Usuario',
  Notification: 'Notificacao',
}

const actionIcons: Record<string, any> = {
  create: Plus,
  update: Edit,
  delete: Trash2,
  login: LogIn,
  logout: LogOut,
  status_change: ArrowLeftRight,
}

export function TimelineView({ events, loading }: TimelineViewProps) {
  if (loading) {
    return <div className="py-8 text-center text-[var(--muted-foreground)]">Carregando timeline...</div>
  }

  if (events.length === 0) {
    return <div className="py-8 text-center text-[var(--muted-foreground)]">Nenhum evento registrado</div>
  }

  return (
    <div className="relative ml-4 border-l-2 border-[var(--border)] pl-6 space-y-6">
      {events.map((event) => {
        const Icon = actionIcons[event.action] || Activity
        const colorClass = actionColors[event.action] || 'bg-gray-100 text-gray-700 border-gray-200'
        return (
          <div key={event.id} className="relative">
            <div className={`absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full border ${colorClass}`}>
              <Icon size={12} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {actionLabels[event.action] || event.action}
                </span>
                <span className="text-sm text-[var(--muted-foreground)]">
                  {entityLabels[event.entity] || event.entity}
                </span>
              </div>
              {event.description && (
                <p className="text-sm text-[var(--muted-foreground)]">{event.description}</p>
              )}
              {event.changedFields && event.changedFields.length > 0 && (
                <p className="text-xs text-[var(--muted-foreground)]">
                  Alterado: {event.changedFields.join(', ')}
                </p>
              )}
              <p className="text-xs text-[var(--muted-foreground)]">
                {event.user?.name && <span className="font-medium">{event.user.name}</span>}
                {event.user?.name && ' em '}
                {formatDate(event.createdAt)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
