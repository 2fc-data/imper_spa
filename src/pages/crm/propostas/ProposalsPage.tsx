import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, FileText, Send, CheckCircle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
import { formatDate, formatCurrency } from '@/lib/utils'

const statusColors: Record<string, string> = {
  rascunho: 'bg-gray-100 text-gray-700',
  enviada: 'bg-blue-100 text-blue-700',
  aprovada: 'bg-green-100 text-green-700',
  rejeitada: 'bg-red-100 text-red-700',
  assinada: 'bg-purple-100 text-purple-700',
}

const statusLabels: Record<string, string> = {
  rascunho: 'Rascunho',
  enviada: 'Enviada',
  aprovada: 'Aprovada',
  rejeitada: 'Rejeitada',
  assinada: 'Assinada',
}

export function ProposalsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['proposals', { page, search }],
    queryFn: () =>
      api.get('/crm/proposals', {
        params: { page, limit: 20, search: search || undefined },
      }),
  })

  const proposals = data?.data?.data || []
  const meta = data?.data?.meta

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Propostas</h1>
        <Link
          to="/crm/propostas/novo"
          className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary)]/90"
        >
          <Plus size={16} />
          Nova Proposta
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
        <input
          type="text"
          placeholder="Buscar propostas..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] py-2.5 pl-10 pr-4 text-sm focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
        />
      </div>

      {/* Cards */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
        </div>
      ) : proposals.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-12 text-center">
          <FileText size={48} className="mx-auto text-[var(--muted-foreground)]" />
          <p className="mt-4 text-[var(--muted-foreground)]">Nenhuma proposta encontrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {proposals.map((proposal: any) => (
            <Link
              key={proposal.id}
              to={`/crm/propostas/${proposal.id}`}
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--muted-foreground)]">
                    {proposal.number}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">{proposal.title}</h3>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[proposal.status] || ''}`}
                >
                  {statusLabels[proposal.status] || proposal.status}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">Valor</span>
                  <span className="font-semibold">{formatCurrency(proposal.finalValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">Válido até</span>
                  <span>{formatDate(proposal.validUntil)}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                {proposal.status === 'rascunho' && (
                  <span className="inline-flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                    <Send size={12} /> Enviar
                  </span>
                )}
                {proposal.status === 'assinada' && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle size={12} /> Assinada
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[var(--muted-foreground)]">
            Mostrando {proposals.length} de {meta.total} propostas
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
