import { useState } from 'react'
import { Plus, Edit, Trash2, ArrowLeftRight, LogIn, LogOut, Activity } from 'lucide-react'
import { useAuditLogs } from '@/hooks/useAudit'
import { formatDate } from '@/lib/utils'

const actionColors: Record<string, string> = {
  create: 'bg-green-100 text-green-700',
  update: 'bg-blue-100 text-blue-700',
  delete: 'bg-red-100 text-red-700',
  login: 'bg-purple-100 text-purple-700',
  logout: 'bg-gray-100 text-gray-700',
  status_change: 'bg-orange-100 text-orange-700',
}

const actionLabels: Record<string, string> = {
  create: 'Criado',
  update: 'Atualizado',
  delete: 'Excluido',
  login: 'Login',
  logout: 'Logout',
  status_change: 'Mudanca de Status',
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

export function AuditPage() {
  const [entityFilter, setEntityFilter] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useAuditLogs({
    page,
    limit: 20,
    entity: entityFilter || undefined,
    action: actionFilter || undefined,
  })

  const logs = data?.data?.data || []
  const meta = data?.data?.meta

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Auditoria</h1>

      <div className="flex flex-wrap items-center gap-4">
        <select
          value={entityFilter}
          onChange={(e) => { setEntityFilter(e.target.value); setPage(1) }}
          className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
        >
          <option value="">Todas as entidades</option>
          <option value="Lead">Lead</option>
          <option value="Opportunity">Oportunidade</option>
          <option value="Client">Cliente</option>
          <option value="Activity">Atividade</option>
          <option value="Proposal">Proposta</option>
          <option value="Contact">Contato</option>
          <option value="User">Usuario</option>
        </select>

        <select
          value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); setPage(1) }}
          className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
        >
          <option value="">Todas as acoes</option>
          <option value="create">Criado</option>
          <option value="update">Atualizado</option>
          <option value="delete">Excluido</option>
          <option value="login">Login</option>
          <option value="logout">Logout</option>
          <option value="status_change">Mudanca de Status</option>
        </select>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="py-12 text-center text-[var(--muted-foreground)]">Carregando...</div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center text-[var(--muted-foreground)]">Nenhum log de auditoria encontrado</div>
        ) : (
          logs.map((log) => {
            const Icon = actionIcons[log.action] || Activity
            return (
              <div key={log.id} className="flex items-start gap-4 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--secondary)]">
                  <Icon size={16} className="text-[var(--muted-foreground)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${actionColors[log.action] || ''}`}>
                      {actionLabels[log.action] || log.action}
                    </span>
                    <span className="text-sm font-medium">{entityLabels[log.entity] || log.entity}</span>
                    {log.entityId && (
                      <span className="text-xs text-[var(--muted-foreground)]">#{log.entityId.slice(0, 8)}</span>
                    )}
                  </div>
                  {log.changedFields && log.changedFields.length > 0 && (
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      Campos alterados: {log.changedFields.join(', ')}
                    </p>
                  )}
                  {log.description && <p className="mt-1 text-sm">{log.description}</p>}
                </div>
                <div className="text-right text-xs text-[var(--muted-foreground)]">
                  {log.user?.name && <p className="font-medium">{log.user.name}</p>}
                  <p>{formatDate(log.createdAt)}</p>
                </div>
              </div>
            )
          })
        )}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[var(--muted-foreground)]">
            Mostrando {logs.length} de {meta.total} registros
          </p>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm disabled:opacity-50">Anterior</button>
            <span className="flex items-center px-3 text-sm">{meta.page} / {meta.totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))} disabled={page === meta.totalPages}
              className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm disabled:opacity-50">Proximo</button>
          </div>
        </div>
      )}
    </div>
  )
}
