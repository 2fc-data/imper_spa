import { useState } from 'react'
import { Calendar, Clock, Phone, Mail, FileText, CheckCircle } from 'lucide-react'
import { useActivities, useCompleteActivity } from '@/hooks/useActivities'
import { formatDateTime } from '@/lib/utils'

const typeIcons: Record<string, any> = {
  ligacao: Phone,
  email: Mail,
  reuniao: Calendar,
  visita: Calendar,
  proposta: FileText,
}

const typeLabels: Record<string, string> = {
  ligacao: 'Ligação',
  email: 'Email',
  reuniao: 'Reunião',
  visita: 'Visita',
  proposta: 'Proposta',
}

const statusColors: Record<string, string> = {
  pendente: 'bg-yellow-100 text-yellow-700',
  concluida: 'bg-green-100 text-green-700',
  cancelada: 'bg-red-100 text-red-700',
}

export function AgendaPage() {
  const [filter, setFilter] = useState('pendente')
  const completeActivity = useCompleteActivity()

  const { data, isLoading } = useActivities({
    status: filter || undefined,
  })

  const activities = data?.data?.data || []

  const handleComplete = (id: string) => {
    completeActivity.mutate(id)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Agenda de Atividades</h1>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { key: 'pendente', label: 'Pendentes' },
          { key: 'concluida', label: 'Concluídas' },
          { key: 'cancelada', label: 'Canceladas' },
          { key: '', label: 'Todas' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === key
                ? 'bg-[var(--primary)] text-white'
                : 'bg-[var(--secondary)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)]/80'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Activities */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
        </div>
      ) : activities.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-12 text-center">
          <Calendar size={48} className="mx-auto text-[var(--muted-foreground)]" />
          <p className="mt-4 text-[var(--muted-foreground)]">Nenhuma atividade encontrada</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => {
            const Icon = typeIcons[activity.type] || Calendar
            return (
              <div
                key={activity.id}
                className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--secondary)]">
                  <Icon size={18} className="text-[var(--muted-foreground)]" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                    <span>{activity.leadId}</span>
                    <span>•</span>
                    <span>{typeLabels[activity.type] || activity.type}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {formatDateTime(activity.scheduledAt)}
                    </span>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[activity.status] || ''}`}
                >
                  {activity.status === 'concluida' ? 'Concluída' : 'Pendente'}
                </span>

                {activity.status === 'pendente' && (
                  <button
                    onClick={() => handleComplete(activity.id)}
                    disabled={completeActivity.isPending}
                    className="rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-green-600"
                    title="Marcar como concluída"
                  >
                    <CheckCircle size={18} />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
