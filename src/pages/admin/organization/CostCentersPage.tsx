import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Edit2, Landmark } from 'lucide-react'
import {
  departmentApi,
  costCenterApi,
  type Department,
  type CostCenter,
} from '@/services/admin-api'
import { MaskedInput, getRawValue } from '@/components/ui/MaskedInput'
import { FormError } from '@/components/ui/FormError'

const ccSchema = z.object({
  code: z.string().min(2, 'Mínimo 2 caracteres'),
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  departmentId: z.string().optional(),
  budget: z.coerce.number().min(0, 'Valor deve ser positivo').optional().or(z.literal('')),
})

type CCFormData = z.infer<typeof ccSchema>

export function CostCentersPage() {
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [filterDeptId, setFilterDeptId] = useState('')

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<CCFormData>({
    resolver: zodResolver(ccSchema) as any,
  })

  const { data: departments } = useQuery<Department[]>({
    queryKey: ['admin-departments'],
    queryFn: () => departmentApi.list(),
  })

  const { data: costCenters, isLoading } = useQuery<CostCenter[]>({
    queryKey: ['admin-cost-centers', filterDeptId],
    queryFn: () => costCenterApi.list(filterDeptId || undefined),
  })

  const createCC = useMutation({
    mutationFn: costCenterApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cost-centers'] })
      closeForm()
    },
  })

  const updateCC = useMutation({
    mutationFn: ({ id, ...data }: CCFormData & { id: string }) =>
      costCenterApi.update(id, {
        code: data.code,
        name: data.name,
        departmentId: data.departmentId || undefined,
        budget: data.budget ? Number(data.budget) : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cost-centers'] })
      closeForm()
    },
  })

  const closeForm = () => {
    reset()
    setIsFormOpen(false)
    setIsEditing(null)
  }

  const onSubmit = (data: CCFormData) => {
    if (isEditing) {
      updateCC.mutate({ id: isEditing, ...data })
    } else {
      createCC.mutate({
        code: data.code,
        name: data.name,
        departmentId: data.departmentId || undefined,
        budget: data.budget ? Number(data.budget) : undefined,
      })
    }
  }

  const handleEdit = (cc: CostCenter) => {
    setIsEditing(cc.id)
    reset({
      code: cc.code,
      name: cc.name,
      departmentId: cc.departmentId || '',
      budget: cc.budget ?? '',
    })
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Centros de Custo</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Gerencie os centros de custo por departamento.
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={() => { reset(); setIsFormOpen(true) }}
            className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            Novo Centro de Custo
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Filtrar por departamento:</label>
        <select
          value={filterDeptId}
          onChange={(e) => setFilterDeptId(e.target.value)}
          className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--card-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        >
          <option value="">Todos</option>
          {departments?.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
          <h2 className="text-lg font-semibold">
            {isEditing ? 'Editar Centro de Custo' : 'Cadastrar Novo Centro de Custo'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Código *</label>
              <input
                {...register('code')}
                placeholder="Ex: CC-001"
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--card-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
              <FormError message={errors.code?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Nome *</label>
              <input
                {...register('name')}
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--card-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
              <FormError message={errors.name?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Departamento</label>
              <select
                {...register('departmentId')}
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--card-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="">Nenhum</option>
                {departments?.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Orçamento</label>
              <Controller
                control={control}
                name="budget"
                render={({ field }) => (
                  <MaskedInput
                    mask="currency"
                    value={field.value?.toString() ?? ''}
                    onChange={(v) => field.onChange(getRawValue(v, 'currency') || '')}
                    onBlur={field.onBlur}
                    error={!!errors.budget}
                    placeholder="R$ 0,00"
                  />
                )}
              />
              <FormError message={errors.budget?.message} />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeForm}
              className="px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--secondary)] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createCC.isPending || updateCC.isPending}
              className="px-4 py-2 text-sm font-medium bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isEditing ? 'Salvar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      )}

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-[var(--muted-foreground)]">Carregando...</div>
        ) : costCenters?.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <Landmark className="mx-auto h-8 w-8 text-[var(--muted-foreground)]" />
            <p className="text-sm font-medium">Nenhum centro de custo cadastrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-[var(--secondary)] text-[var(--muted-foreground)] uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 font-semibold">Código</th>
                  <th className="px-6 py-3 font-semibold">Nome</th>
                  <th className="px-6 py-3 font-semibold">Departamento</th>
                  <th className="px-6 py-3 font-semibold">Orçamento</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {costCenters?.map((cc) => (
                  <tr key={cc.id} className="hover:bg-[var(--secondary)]/20 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-[var(--card-foreground)]">{cc.code}</td>
                    <td className="px-6 py-4 font-semibold text-[var(--card-foreground)]">{cc.name}</td>
                    <td className="px-6 py-4 text-[var(--muted-foreground)]">{cc.department?.name || '-'}</td>
                    <td className="px-6 py-4 text-[var(--muted-foreground)]">
                      {cc.budget != null ? `R$ ${cc.budget.toLocaleString('pt-BR')}` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {cc.isActive ? (
                        <span className="inline-flex items-center gap-1 rounded bg-green-500/10 px-2 py-1 text-xs font-semibold text-green-600">
                          Ativo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-red-500/10 px-2 py-1 text-xs font-semibold text-red-600">
                          Inativo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEdit(cc)}
                        className="rounded p-1 text-[var(--muted-foreground)] hover:bg-[var(--border)] hover:text-foreground transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
