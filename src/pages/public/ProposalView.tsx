import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Droplets, FileText, Calendar, DollarSign, Clock, Loader2, AlertCircle } from 'lucide-react'
import api from '@/services/api'
import { formatCurrency, formatDate } from '@/lib/utils'

interface ProposalItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface Proposal {
  id: string
  title: string
  description?: string
  status: string
  validUntil?: string
  createdAt: string
  items: ProposalItem[]
  total: number
}

const statusLabels: Record<string, { label: string; color: string }> = {
  rascunho: { label: 'Rascunho', color: 'bg-muted text-muted-foreground' },
  enviada: { label: 'Enviada', color: 'bg-primary/10 text-primary' },
  aprovada: { label: 'Aprovada', color: 'bg-emerald-500/10 text-emerald-600' },
  rejeitada: { label: 'Recusada', color: 'bg-destructive/10 text-destructive' },
  expirada: { label: 'Expirada', color: 'bg-muted text-muted-foreground' },
}

export function ProposalView() {
  const { token } = useParams<{ token: string }>()

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-proposal', token],
    queryFn: () => api.get<Proposal>(`/integrations/proposals/${token}`),
    enabled: !!token,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    )
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-destructive mb-4" />
          <h1 className="text-xl font-semibold text-foreground mb-2">Proposta não encontrada</h1>
          <p className="text-muted-foreground text-sm">
            O link pode estar incorreto ou a proposta foi removida.
          </p>
        </div>
      </div>
    )
  }

  const proposal = data.data
  const status = statusLabels[proposal.status] ?? statusLabels.DRAFT

  return (
    <div className="min-h-screen bg-gradient-primary p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-3">
            <Droplets className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gradient-primary">ImperPoços</h1>
        </motion.div>

        {/* Proposal Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl shadow-lg border border-border overflow-hidden"
        >
          {/* Status bar */}
          <div className="px-6 py-4 border-b border-border bg-secondary/30">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-card-foreground">{proposal.title}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                {status.label}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="px-6 py-4 grid grid-cols-2 gap-4 border-b border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar size={16} />
              <span>Criada em {formatDate(proposal.createdAt)}</span>
            </div>
            {proposal.validUntil && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock size={16} />
                <span>Válida até {formatDate(proposal.validUntil)}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {proposal.description && (
            <div className="px-6 py-4 border-b border-border">
              <p className="text-sm text-card-foreground">{proposal.description}</p>
            </div>
          )}

          {/* Items */}
          {proposal.items && proposal.items.length > 0 && (
            <div className="px-6 py-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <FileText size={16} />
                Itens da proposta
              </h3>
              <div className="space-y-2">
                {proposal.items.map((item: ProposalItem) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/30"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-card-foreground">{item.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity}x {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-card-foreground">
                      {formatCurrency(item.total)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total */}
          <div className="px-6 py-4 border-t border-border bg-secondary/20">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <DollarSign size={16} />
                Valor total
              </span>
              <span className="text-xl font-bold text-primary">
                {formatCurrency(proposal.total)}
              </span>
            </div>
          </div>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Imper - Engenharia em Impermeabilização © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
