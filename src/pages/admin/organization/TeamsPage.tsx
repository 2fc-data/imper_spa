import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Edit2, Users } from 'lucide-react'
import {
  departmentApi,
  teamApi,
  type Department,
  type Team,
} from '@/services/admin-api'
import { FormError } from '@/components/ui/FormError'

const teamSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  description: z.string().optional(),
  departmentId: z.string().min(1, 'Selecione um departamento'),
})

type TeamFormData = z.infer<typeof teamSchema>

export function TeamsPage() {
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [filterDeptId, setFilterDeptId] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema) as any,
  })

  const { data: departments } = useQuery<Department[]>({
    queryKey: ['admin-departments'],
    queryFn: () => departmentApi.list(),
  })

  const { data: teams, isLoading } = useQuery<Team[]>({
    queryKey: ['admin-teams', filterDeptId],
    queryFn: () => teamApi.list(filterDeptId || undefined),
  })

  const createTeam = useMutation({
    mutationFn: teamApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-teams'] })
      closeForm()
    },
  })

  const updateTeam = useMutation({
    mutationFn: ({ id, ...data }: TeamFormData & { id: string }) =>
      teamApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-teams'] })
      closeForm()
    },
  })

  const closeForm = () => {
    reset()
    setIsFormOpen(false)
    setIsEditing(null)
  }

  const onSubmit = (data: TeamFormData) => {
    if (isEditing) {
      updateTeam.mutate({ id: isEditing, ...data })
    } else {
      createTeam.mutate(data)
    }
  }

  const handleEdit = (team: Team) => {
    setIsEditing(team.id)
    reset({
      name: team.name,
      description: team.description || '',
      departmentId: team.departmentId,
    })
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Equipes</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Gerencie as equipes por departamento.
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={() => { reset(); setIsFormOpen(true) }}
            className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            Nova Equipe
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
            {isEditing ? 'Editar Equipe' : 'Cadastrar Nova Equipe'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Departamento *</label>
              <select
                {...register('departmentId')}
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--card-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="">Selecione...</option>
                {departments?.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <FormError message={errors.departmentId?.message} />
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
              disabled={createTeam.isPending || updateTeam.isPending}
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
        ) : teams?.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <Users className="mx-auto h-8 w-8 text-[var(--muted-foreground)]" />
            <p className="text-sm font-medium">Nenhuma equipe cadastrada.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-[var(--secondary)] text-[var(--muted-foreground)] uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 font-semibold">Nome</th>
                  <th className="px-6 py-3 font-semibold">Departamento</th>
                  <th className="px-6 py-3 font-semibold">Descrição</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {teams?.map((team) => (
                  <tr key={team.id} className="hover:bg-[var(--secondary)]/20 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[var(--card-foreground)]">{team.name}</td>
                    <td className="px-6 py-4 text-[var(--muted-foreground)]">{team.department?.name || '-'}</td>
                    <td className="px-6 py-4 text-[var(--muted-foreground)] max-w-xs truncate">{team.description || '-'}</td>
                    <td className="px-6 py-4">
                      {team.isActive ? (
                        <span className="inline-flex items-center gap-1 rounded bg-green-500/10 px-2 py-1 text-xs font-semibold text-green-600">
                          Ativa
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-red-500/10 px-2 py-1 text-xs font-semibold text-red-600">
                          Inativa
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEdit(team)}
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
