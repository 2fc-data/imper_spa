import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useOpportunities, useUpdateOpportunity } from '@/hooks/useOpportunities'
import { formatCurrency } from '@/lib/utils'

const stages = [
  { key: 'novo', label: 'Novo', color: 'bg-blue-500' },
  { key: 'qualificado', label: 'Qualificado', color: 'bg-yellow-500' },
  { key: 'visita_agendada', label: 'Visita Agendada', color: 'bg-purple-500' },
  { key: 'proposta_gerada', label: 'Proposta Gerada', color: 'bg-orange-500' },
  { key: 'proposta_enviada', label: 'Proposta Enviada', color: 'bg-indigo-500' },
  { key: 'aprovada', label: 'Aprovada', color: 'bg-green-500' },
  { key: 'recusada', label: 'Recusada', color: 'bg-red-500' },
]

export function FunnelPage() {
  const { data: allOpps, isLoading } = useOpportunities({ limit: 200 })
  const updateOpportunity = useUpdateOpportunity()
  const [draggedOppId, setDraggedOppId] = useState<string | null>(null)
  const [overStage, setOverStage] = useState<string | null>(null)

  const opportunities = allOpps?.data?.data || []

  const oppsByStage = stages.map((stage) => ({
    ...stage,
    opportunities: opportunities.filter((o) => o.status === stage.key),
  }))

  const handleDragStart = (e: React.DragEvent, oppId: string) => {
    e.dataTransfer.effectAllowed = 'move'
    setDraggedOppId(oppId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (stageKey: string) => {
    setOverStage(stageKey)
  }

  const handleDragLeave = () => {
    setOverStage(null)
  }

  const handleDrop = (e: React.DragEvent, targetStage: string) => {
    e.preventDefault()
    setOverStage(null)
    if (draggedOppId) {
      const opp = opportunities.find((o) => o.id === draggedOppId)
      if (opp && opp.status !== targetStage) {
        updateOpportunity.mutate({ id: draggedOppId, data: { status: targetStage } })
      }
      setDraggedOppId(null)
    }
  }

  const handleDragEnd = () => {
    setDraggedOppId(null)
    setOverStage(null)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Funil de Vendas</h1>

      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {oppsByStage.map((stage) => (
            <div
              key={stage.key}
              onDragOver={handleDragOver}
              onDragEnter={() => handleDragEnter(stage.key)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.key)}
              className={`flex w-72 flex-shrink-0 flex-col rounded-xl border-2 transition-colors ${
                overStage === stage.key
                  ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                  : 'border-[var(--border)] bg-[var(--secondary)]/50'
              }`}
            >
              {/* Header */}
              <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
                <div className={`h-3 w-3 rounded-full ${stage.color}`} />
                <span className="text-sm font-semibold">{stage.label}</span>
                <span className="ml-auto rounded-full bg-[var(--secondary)] px-2 py-0.5 text-xs font-medium">
                  {stage.opportunities.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex-1 space-y-2 p-2">
                {stage.opportunities.map((opp) => {
                  const firstLead = opp.leads && opp.leads.length > 0 ? opp.leads[0] : null;
                  return (
                    <div
                      key={opp.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, opp.id)}
                      onDragEnd={handleDragEnd}
                      className={`cursor-grab rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 shadow-sm hover:shadow-md active:cursor-grabbing transition-opacity ${
                        draggedOppId === opp.id ? 'opacity-40' : ''
                      }`}
                    >
                      {firstLead ? (
                        <Link to={`/crm/leads/${firstLead.id}`}>
                          <p className="text-sm font-medium hover:underline">{opp.title}</p>
                        </Link>
                      ) : (
                        <p className="text-sm font-medium">{opp.title}</p>
                      )}
                      
                      {firstLead?.companyName && (
                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                          {firstLead.companyName}
                        </p>
                      )}

                      {firstLead?.name && (
                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                          Cliente: {firstLead.name}
                        </p>
                      )}

                      <div className="mt-2 flex items-center justify-between">
                        {opp.value > 0 && (
                          <p className="text-xs font-semibold text-[var(--primary)]">
                            {formatCurrency(opp.value)}
                          </p>
                        )}
                        <Link
                          to={`/crm/propostas/novo?opportunityId=${opp.id}`}
                          className="rounded bg-[var(--primary)]/10 px-2 py-1 text-[10px] font-bold text-[var(--primary)] hover:bg-[var(--primary)]/20"
                        >
                          Gerar Proposta
                        </Link>
                      </div>
                    </div>
                  )
                })}

                {stage.opportunities.length === 0 && (
                  <div className="rounded-lg border-2 border-dashed border-[var(--border)] p-4 text-center text-xs text-[var(--muted-foreground)]">
                    Nenhuma oportunidade
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
