import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Download, Send } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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

export function ProposalDetailPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const { data: proposal, isLoading } = useQuery({
    queryKey: ['proposals', id],
    queryFn: () => api.get(`/crm/proposals/${id}`).then((r) => r.data.data),
    enabled: !!id,
  })

  const sendMutation = useMutation({
    mutationFn: () => api.patch(`/crm/proposals/${id}/send`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] })
      queryClient.invalidateQueries({ queryKey: ['proposals', id] })
    },
  })

  const handleDownloadPdf = async () => {
    const response = await api.get(`/crm/proposals/${id}/pdf`, {
      responseType: 'blob',
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `proposta-${proposal?.number || id}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="text-center">
        <p className="text-[var(--muted-foreground)]">Proposta não encontrada</p>
        <Link to="/crm/propostas" className="mt-4 text-sm text-[var(--primary)] hover:underline">
          Voltar para lista
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/crm/propostas"
          className="rounded-lg p-2 hover:bg-[var(--secondary)]"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <p className="text-sm text-[var(--muted-foreground)]">{proposal.number}</p>
          <h1 className="text-2xl font-bold">{proposal.title}</h1>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusColors[proposal.status] || ''}`}
        >
          {statusLabels[proposal.status] || proposal.status}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {proposal.description && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
              <h2 className="mb-4 text-lg font-semibold">Descrição</h2>
              <p className="whitespace-pre-wrap text-sm text-[var(--muted-foreground)]">
                {proposal.description}
              </p>
            </div>
          )}

          {/* Items */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
            <h2 className="mb-4 text-lg font-semibold">Itens</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="pb-2 text-left font-medium text-[var(--muted-foreground)]">Descrição</th>
                  <th className="pb-2 text-right font-medium text-[var(--muted-foreground)]">Qtd</th>
                  <th className="pb-2 text-right font-medium text-[var(--muted-foreground)]">Preço Unit.</th>
                  <th className="pb-2 text-right font-medium text-[var(--muted-foreground)]">Total</th>
                </tr>
              </thead>
              <tbody>
                {proposal.items?.map((item: any) => (
                  <tr key={item.id} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-3">{item.description}</td>
                    <td className="py-3 text-right">{item.quantity}</td>
                    <td className="py-3 text-right">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-3 text-right font-medium">{formatCurrency(item.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Terms */}
          {proposal.terms && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
              <h2 className="mb-4 text-lg font-semibold">Termos e Condições</h2>
              <p className="whitespace-pre-wrap text-sm text-[var(--muted-foreground)]">
                {proposal.terms}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
            <h2 className="mb-4 text-lg font-semibold">Valores</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Subtotal</span>
                <span>{formatCurrency(proposal.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Desconto</span>
                <span>-{formatCurrency(proposal.discount)}</span>
              </div>
              <div className="border-t border-[var(--border)] pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-lg font-bold text-[var(--primary)]">
                    {formatCurrency(proposal.finalValue)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
            <h2 className="mb-4 text-lg font-semibold">Detalhes</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Criada em</span>
                <span>{formatDate(proposal.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Válida até</span>
                <span>{formatDate(proposal.validUntil)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleDownloadPdf}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium hover:bg-[var(--secondary)]"
            >
              <Download size={16} />
              Baixar PDF
            </button>
            {proposal.status === 'rascunho' && (
              <button
                onClick={() => sendMutation.mutate()}
                disabled={sendMutation.isPending}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary)]/90 disabled:opacity-50"
              >
                <Send size={16} />
                {sendMutation.isPending ? 'Enviando...' : 'Enviar Proposta'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
