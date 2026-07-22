import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '@/services/api'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const proposalSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  opportunityId: z.string().min(1, 'Oportunidade é obrigatória'),
  description: z.string().optional(),
  validUntil: z.string().min(1, 'Data de validade é obrigatória'),
  terms: z.string().optional(),
  items: z.array(
    z.object({
      description: z.string().min(1, 'Descrição é obrigatória'),
      quantity: z.coerce.number().min(1, 'Quantidade deve ser > 0'),
      unitPrice: z.coerce.number().min(0, 'Preço deve ser >= 0'),
      unit: z.string().default('UN'),
    })
  ).min(1, 'Pelo menos 1 item é obrigatório'),
})

type ProposalFormData = z.infer<typeof proposalSchema>

export function CreateProposalPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [submitError, setSubmitError] = useState('')

  const urlOpportunityId = searchParams.get('opportunityId') || ''

  const { data: opportunitiesData } = useQuery({
    queryKey: ['opportunities-select'],
    queryFn: () => api.get('/crm/opportunities', { params: { limit: 200 } }).then((r) => r.data.data),
  })

  const createProposal = useMutation({
    mutationFn: (data: any) => api.post('/crm/proposals', data),
    onSuccess: () => {
      navigate('/crm/propostas')
    },
  })

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProposalFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(proposalSchema) as any,
    defaultValues: {
      opportunityId: urlOpportunityId,
      items: [{ description: '', quantity: 1, unitPrice: 0, unit: 'UN' }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  const items = watch('items')
  const subtotal = items?.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) || 0

  const onSubmit = async (data: ProposalFormData) => {
    setSubmitError('')
    try {
      await createProposal.mutateAsync(data)
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Erro ao criar proposta')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/crm/propostas" className="rounded-lg p-2 hover:bg-[var(--secondary)]">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Nova Proposta</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
        {submitError && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{submitError}</div>
        )}

        {/* Basic Info */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
          <h2 className="mb-4 text-lg font-semibold">Informações</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Título *</label>
              <input
                {...register('title')}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                placeholder="Proposta de impermeabilização"
              />
              {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Oportunidade *</label>
                <select
                  {...register('opportunityId')}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                >
                  <option value="">Selecione uma oportunidade</option>
                  {opportunitiesData?.map((opp: any) => (
                    <option key={opp.id} value={opp.id}>
                      {opp.title} {opp.value > 0 ? `- ${formatCurrency(opp.value)}` : ''}
                    </option>
                  ))}
                </select>
                {errors.opportunityId && <p className="mt-1 text-xs text-red-500">{errors.opportunityId.message}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Válida até *</label>
                <input
                  {...register('validUntil')}
                  type="date"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                />
                {errors.validUntil && <p className="mt-1 text-xs text-red-500">{errors.validUntil.message}</p>}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Descrição</label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                placeholder="Descrição da proposta..."
              />
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Itens</h2>
            <button
              type="button"
              onClick={() => append({ description: '', quantity: 1, unitPrice: 0, unit: 'UN' })}
              className="flex items-center gap-1 text-sm text-[var(--primary)] hover:underline"
            >
              <Plus size={16} /> Adicionar item
            </button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-3">
                <div className="flex-1">
                  <input
                    {...register(`items.${index}.description`)}
                    placeholder="Descrição do item"
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                  />
                </div>
                <input
                  {...register(`items.${index}.quantity`)}
                  type="number"
                  min="1"
                  placeholder="Qtd"
                  className="w-20 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-center focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                />
                <input
                  {...register(`items.${index}.unitPrice`)}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Preço"
                  className="w-32 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-right focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                />
                <input
                  {...register(`items.${index}.unit`)}
                  placeholder="Unid (ex: UN, m²)"
                  className="w-24 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-center focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                />
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {errors.items && (
            <p className="mt-2 text-xs text-red-500">{errors.items.message || errors.items.root?.message}</p>
          )}

          <div className="mt-4 flex justify-end border-t border-[var(--border)] pt-4">
            <div className="text-right">
              <p className="text-sm text-[var(--muted-foreground)]">Subtotal</p>
              <p className="text-lg font-bold">
                {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
          <h2 className="mb-4 text-lg font-semibold">Termos e Condições</h2>
          <textarea
            {...register('terms')}
            rows={4}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            placeholder="Termos e condições da proposta..."
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            to="/crm/propostas"
            className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium hover:bg-[var(--secondary)]"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={createProposal.isPending}
            className="rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary)]/90 disabled:opacity-50"
          >
            {createProposal.isPending ? 'Criando...' : 'Criar Proposta'}
          </button>
        </div>
      </form>
    </div>
  )
}
