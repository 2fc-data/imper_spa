import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Phone, Mail, Building2, Calendar } from 'lucide-react'
import { useLead } from '@/hooks/useLeads'
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

export function LeadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: lead, isLoading } = useLead(id || '')

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="text-center">
        <p className="text-[var(--muted-foreground)]">Lead não encontrado</p>
        <Link to="/crm/leads" className="mt-4 text-sm text-[var(--primary)] hover:underline">
          Voltar para lista
        </Link>
      </div>
    )
  }

  const data = lead.data

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/crm/leads"
          className="rounded-lg p-2 hover:bg-[var(--secondary)]"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{data.name}</h1>
          {data.companyName && (
            <p className="text-[var(--muted-foreground)]">{data.companyName}</p>
          )}
        </div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusColors[data.status] || ''}`}
        >
          {statusLabels[data.status] || data.status}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
            <h2 className="mb-4 text-lg font-semibold">Informações</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[var(--muted-foreground)]" />
                <div>
                  <p className="text-xs text-[var(--muted-foreground)]">Email</p>
                  <p className="text-sm">{data.email || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-[var(--muted-foreground)]" />
                <div>
                  <p className="text-xs text-[var(--muted-foreground)]">Telefone</p>
                  <p className="text-sm">{data.phone || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building2 size={16} className="text-[var(--muted-foreground)]" />
                <div>
                  <p className="text-xs text-[var(--muted-foreground)]">Origem</p>
                  <p className="text-sm capitalize">{data.source}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-[var(--muted-foreground)]" />
                <div>
                  <p className="text-xs text-[var(--muted-foreground)]">Criado em</p>
                  <p className="text-sm">{formatDate(data.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {data.notes && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
              <h2 className="mb-4 text-lg font-semibold">Notas</h2>
              <p className="whitespace-pre-wrap text-sm text-[var(--muted-foreground)]">
                {data.notes}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
            <h2 className="mb-4 text-lg font-semibold">Valor Estimado</h2>
            <p className="text-3xl font-bold text-[var(--primary)]">
              {data.estimatedValue
                ? formatCurrency(data.estimatedValue)
                : 'Não definido'}
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
            <h2 className="mb-4 text-lg font-semibold">Atividade</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Tentativas</span>
                <span className="font-medium">{data.contactAttempts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Último contato</span>
                <span className="font-medium">
                  {data.lastContactAt ? formatDate(data.lastContactAt) : 'Nunca'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
