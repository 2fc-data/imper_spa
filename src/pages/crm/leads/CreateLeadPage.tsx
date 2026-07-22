import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateLead } from '@/hooks/useLeads'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const leadSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  source: z.enum(['whatsapp', 'instagram', 'indicacao', 'site', 'outro']),
  estimatedValue: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
})

type LeadFormData = z.infer<typeof leadSchema>

const sourceLabels: Record<string, string> = {
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  indicacao: 'Indicação',
  site: 'Site',
  outro: 'Outro',
}

export function CreateLeadPage() {
  const navigate = useNavigate()
  const createLead = useCreateLead()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(leadSchema) as any,
    defaultValues: { source: 'site' },
  })

  const onSubmit = async (data: LeadFormData) => {
    try {
      await createLead.mutateAsync(data)
      navigate('/crm/leads')
    } catch (err) {
      // error handled by mutation
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/crm/leads" className="rounded-lg p-2 hover:bg-[var(--secondary)]">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Novo Lead</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
          <h2 className="mb-4 text-lg font-semibold">Informações do Lead</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Nome *</label>
              <input
                {...register('name')}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                placeholder="Nome do lead"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                  placeholder="email@exemplo.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Telefone</label>
                <input
                  {...register('phone')}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Empresa</label>
                <input
                  {...register('companyName')}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                  placeholder="Nome da empresa"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Origem *</label>
                <select
                  {...register('source')}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                >
                  {Object.entries(sourceLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Valor estimado após vistoria (R$)</label>
              <input
                {...register('estimatedValue')}
                type="number"
                step="0.01"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Notas</label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                placeholder="Observações sobre o lead..."
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            to="/crm/leads"
            className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium hover:bg-[var(--secondary)]"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={createLead.isPending}
            className="rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary)]/90 disabled:opacity-50"
          >
            {createLead.isPending ? 'Criando...' : 'Criar Lead'}
          </button>
        </div>
      </form>
    </div>
  )
}
