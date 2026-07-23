import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Edit2, GitBranch } from 'lucide-react'
import {
  organizationApi,
  departmentApi,
  type Organization,
  type Department,
} from '@/services/admin-api'
import { FormError } from '@/components/ui/FormError'

const deptSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  description: z.string().optional(),
  organizationId: z.string().min(1, 'Selecione uma organização'),
})

type DeptFormData = z.infer<typeof deptSchema>

export function DepartmentsPage() {
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [filterOrgId, setFilterOrgId] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DeptFormData>({
    resolver: zodResolver(deptSchema) as any,
  })

  const { data: organizations } = useQuery<Organization[]>({
    queryKey: ['admin-organizations'],
    queryFn: organizationApi.list,
  })

  const { data: departments, isLoading } = useQuery<Department[]>({
    queryKey: ['admin-departments', filterOrgId],
    queryFn: () => departmentApi.list(filterOrgId || undefined),
  })

  const createDept = useMutation({
    mutationFn: departmentApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-departments'] })
      closeForm()
    },
  })

  const updateDept = useMutation({
    mutationFn: ({ id, ...data }: DeptFormData & { id: string }) =>
      departmentApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-departments'] })
      closeForm()
    },
  })

  const closeForm = () => {
    reset()
    setIsFormOpen(false)
    setIsEditing(null)
  }

  const onSubmit = (data: DeptFormData) => {
    if (isEditing) {
      updateDept.mutate({ id: isEditing, ...data })
    } else {
      createDept.mutate(data)
    }
  }

  const handleEdit = (dept: Department) => {
    setIsEditing(dept.id)
    reset({
      name: dept.name,
      description: dept.description || '',
      organizationId: dept.organizationId,
    })
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Departamentos</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Gerencie os departamentos por organização.
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={() => { reset(); setIsFormOpen(true) }}
            className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            Novo Departamento
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Filtrar por organização:</label>
        <select
          value={filterOrgId}
          onChange={(e) => setFilterOrgId(e.target.value)}
          className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--card-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        >
          <option value="">Todas</option>
          {organizations?.map((org) => (
            <option key={org.id} value={org.id}>{org.name}</option>
          ))}
        </select>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
          <h2 className="text-lg font-semibold">
            {isEditing ? 'Editar Departamento' : 'Cadastrar Novo Departamento'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Organização *</label>
              <select
                {...register('organizationId')}
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--card-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="">Selecione...</option>
                {organizations?.map((org) => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
              <FormError message={errors.organizationId?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Nome *</label>
              <input
                {...register('name')}
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--card-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
              <FormError message={errors.name?.message} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Descrição</label>
            <textarea
              {...register('description')}
              rows={2}
              className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--card-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
            />
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
              disabled={createDept.isPending || updateDept.isPending}
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
        ) : departments?.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <GitBranch className="mx-auto h-8 w-8 text-[var(--muted-foreground)]" />
            <p className="text-sm font-medium">Nenhum departamento cadastrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-[var(--secondary)] text-[var(--muted-foreground)] uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 font-semibold">Nome</th>
                  <th className="px-6 py-3 font-semibold">Organização</th>
                  <th className="px-6 py-3 font-semibold">Descrição</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {departments?.map((dept) => (
                  <tr key={dept.id} className="hover:bg-[var(--secondary)]/20 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[var(--card-foreground)]">{dept.name}</td>
                    <td className="px-6 py-4 text-[var(--muted-foreground)]">{dept.organization?.name || '-'}</td>
                    <td className="px-6 py-4 text-[var(--muted-foreground)] max-w-xs truncate">{dept.description || '-'}</td>
                    <td className="px-6 py-4">
                      {dept.isActive ? (
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
                        onClick={() => handleEdit(dept)}
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
