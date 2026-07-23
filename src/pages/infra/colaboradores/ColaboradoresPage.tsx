import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { useColaboradores } from '@/hooks/useColaboradores'
import { formatDate } from '@/lib/utils'

const statusColors: Record<string, string> = {
  ativo: 'bg-green-100 text-green-700',
  inativo: 'bg-gray-100 text-gray-700',
  afastado: 'bg-yellow-100 text-yellow-700',
  desligado: 'bg-red-100 text-red-700',
}

const tipoLabels: Record<string, string> = {
  funcionario: 'Funcionário',
  terceiro: 'Terceiro',
}

export function ColaboradoresPage() {
  const [search, setSearch] = useState('')
  const [tipoFilter, setTipoFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useColaboradores({
    page,
    limit: 20,
    search: search || undefined,
    tipo: tipoFilter || undefined,
    status: statusFilter || undefined,
  })

  const colaboradores = data?.data?.data || []
  const meta = data?.data?.meta

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Colaboradores</h1>
        <Link
          to="/admin/colaboradores/novo"
          className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary)]/90"
        >
          <Plus size={16} />
          Novo Colaborador
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Buscar colaboradores..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] py-2.5 pl-10 pr-4 text-sm focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
          />
        </div>
        <select
          value={tipoFilter}
          onChange={(e) => { setTipoFilter(e.target.value); setPage(1) }}
          className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
        >
          <option value="">Todos os tipos</option>
          <option value="funcionario">Funcionário</option>
          <option value="terceiro">Terceiro</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
        >
          <option value="">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
          <option value="afastado">Afastado</option>
          <option value="desligado">Desligado</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--secondary)]">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">Nome</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">CPF/CNPJ</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">Telefone</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">Criado em</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-[var(--muted-foreground)]">Carregando...</td>
              </tr>
            ) : colaboradores.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-[var(--muted-foreground)]">Nenhum colaborador encontrado</td>
              </tr>
            ) : (
              colaboradores.map((c) => (
                <tr key={c.id} className="hover:bg-[var(--secondary)]/50">
                  <td className="px-4 py-3">
                    <Link to={`/admin/colaboradores/${c.id}`} className="font-medium text-[var(--primary)] hover:underline">
                      {c.nome}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">{tipoLabels[c.tipo] || c.tipo}</td>
                  <td className="px-4 py-3 text-sm">{c.cpf || c.cnpj || '-'}</td>
                  <td className="px-4 py-3 text-sm">{c.telefone || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[c.status] || ''}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">{formatDate(c.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/colaboradores/${c.id}`} className="text-sm text-[var(--primary)] hover:underline">Ver</Link>
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
            Mostrando {colaboradores.length} de {meta.total} colaboradores
          </p>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm disabled:opacity-50">Anterior</button>
            <span className="flex items-center px-3 text-sm">{meta.page} / {meta.totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))} disabled={page === meta.totalPages} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm disabled:opacity-50">Próximo</button>
          </div>
        </div>
      )}
    </div>
  )
}
