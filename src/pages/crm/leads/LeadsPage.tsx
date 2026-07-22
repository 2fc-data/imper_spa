import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { useLeads } from '@/hooks/useLeads'
import { formatDate, formatCurrency } from '@/lib/utils'

const statusColors: Record<string, string> = {
  novo: 'bg-blue-100 text-blue-700',
  qualificado: 'bg-yellow-100 text-yellow-700',
  visita_tecnica: 'bg-purple-100 text-purple-700',
  orcamento: 'bg-orange-100 text-orange-700',
  negociacao: 'bg-indigo-100 text-indigo-700',
  ganho: 'bg-green-100 text-green-700',
  perdido: 'bg-red-100 text-red-700',
}

const statusLabels: Record<string, string> = {
  novo: 'Novo',
  qualificado: 'Qualificado',
  visita_tecnica: 'Visita Técnica',
  orcamento: 'Orçamento',
  negociacao: 'Negociação',
  ganho: 'Ganho',
  perdido: 'Perdido',
}

export function LeadsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useLeads({
    page,
    limit: 20,
    search: search || undefined,
    status: statusFilter || undefined,
  })

  const leads = data?.data?.data || []
  const meta = data?.data?.meta

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leads</h1>
        <Link
          to="/crm/leads/novo"
          className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary)]/90"
        >
          <Plus size={16} />
          Novo Lead
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Buscar leads..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] py-2.5 pl-10 pr-4 text-sm focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
          className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
        >
          <option value="">Todos os status</option>
          <option value="novo">Novo</option>
          <option value="qualificado">Qualificado</option>
          <option value="visita_tecnica">Visita Técnica</option>
          <option value="orcamento">Orçamento</option>
          <option value="negociacao">Negociação</option>
          <option value="ganho">Ganho</option>
          <option value="perdido">Perdido</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--secondary)]">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                Nome
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                Empresa
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                Origem
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                Valor Est.
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                Criado em
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-[var(--muted-foreground)]">
                  Carregando...
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-[var(--muted-foreground)]">
                  Nenhum lead encontrado
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-[var(--secondary)]/50">
                  <td className="px-4 py-3">
                    <Link
                      to={`/crm/leads/${lead.id}`}
                      className="font-medium text-[var(--primary)] hover:underline"
                    >
                      {lead.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">
                    {lead.companyName || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[lead.status] || ''}`}
                    >
                      {statusLabels[lead.status] || lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm capitalize">{lead.source}</td>
                  <td className="px-4 py-3 text-sm">
                    {lead.estimatedValue
                      ? formatCurrency(lead.estimatedValue)
                      : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">
                    {formatDate(lead.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/crm/leads/${lead.id}`}
                      className="text-sm text-[var(--primary)] hover:underline"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[var(--muted-foreground)]">
            Mostrando {leads.length} de {meta.total} leads
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="flex items-center px-3 text-sm">
              {meta.page} / {meta.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages}
              className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Próximo
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
