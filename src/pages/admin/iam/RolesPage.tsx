import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Edit2, Trash2, Shield } from 'lucide-react'
import { roleApi, permissionApi, type Role, type Permission } from '@/services/admin-api'
import { FormError } from '@/components/ui/FormError'

const roleSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  description: z.string().optional(),
})

type RoleFormData = z.infer<typeof roleSchema>

export function RolesPage() {
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  const { register, handleSubmit, reset, formState: { errors } } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema) as any,
  })

  const { data: roles, isLoading } = useQuery<Role[]>({
    queryKey: ['admin-roles'],
    queryFn: roleApi.list,
  })

  const { data: permissions } = useQuery<Permission[]>({
    queryKey: ['admin-permissions'],
    queryFn: permissionApi.list,
  })

  const createRole = useMutation({
    mutationFn: roleApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] })
      closeForm()
    },
  })

  const updateRole = useMutation({
    mutationFn: ({ id, ...data }: RoleFormData & { id: string; permissions: string[] }) =>
      roleApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] })
      closeForm()
    },
  })

  const deleteRole = useMutation({
    mutationFn: roleApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-roles'] }),
  })

  const closeForm = () => {
    reset()
    setSelectedPermissions([])
    setIsFormOpen(false)
    setIsEditing(null)
  }

  const onSubmit = (data: RoleFormData) => {
    if (isEditing) {
      updateRole.mutate({ id: isEditing, ...data, permissions: selectedPermissions })
    } else {
      createRole.mutate({ ...data, permissions: selectedPermissions })
    }
  }

  const handleEdit = (role: Role) => {
    setIsEditing(role.id)
    reset({
      name: role.name,
      description: role.description || '',
    })
    setSelectedPermissions(role.permissions?.map((p) => p.name) || [])
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja desativar este cargo?')) {
      deleteRole.mutate(id)
    }
  }

  const togglePermission = (permName: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permName) ? prev.filter((p) => p !== permName) : [...prev, permName]
    )
  }

  const groupedPermissions = (permissions || []).reduce<Record<string, Permission[]>>((acc, p) => {
    const [resource] = p.name.split(':')
    if (!acc[resource]) acc[resource] = []
    acc[resource].push(p)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cargos</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Gerencie cargos e suas permissões.
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={() => { reset(); setIsFormOpen(true) }}
            className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            Novo Cargo
          </button>
        )}
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
          <h2 className="text-lg font-semibold">
            {isEditing ? 'Editar Cargo' : 'Cadastrar Novo Cargo'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Nome *</label>
              <input
                {...register('name')}
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--card-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
              <FormError message={errors.name?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Descrição</label>
              <input
                {...register('description')}
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--card-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Permissões</label>
            <div className="max-h-60 overflow-y-auto rounded-lg border border-[var(--border)] p-4 space-y-3">
              {Object.entries(groupedPermissions).map(([resource, perms]) => (
                <div key={resource}>
                  <p className="text-xs font-semibold uppercase text-[var(--muted-foreground)] mb-1">{resource}</p>
                  <div className="flex flex-wrap gap-2">
                    {perms.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => togglePermission(p.name)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          selectedPermissions.includes(p.name)
                            ? 'bg-[var(--primary)] text-white'
                            : 'bg-[var(--secondary)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {permissions?.length === 0 && (
                <p className="text-sm text-[var(--muted-foreground)]">Nenhuma permissão disponível.</p>
              )}
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
              disabled={createRole.isPending || updateRole.isPending}
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
        ) : roles?.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <Shield className="mx-auto h-8 w-8 text-[var(--muted-foreground)]" />
            <p className="text-sm font-medium">Nenhum cargo cadastrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-[var(--secondary)] text-[var(--muted-foreground)] uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 font-semibold">Nome</th>
                  <th className="px-6 py-3 font-semibold">Descrição</th>
                  <th className="px-6 py-3 font-semibold">Permissões</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {roles?.map((role) => (
                  <tr key={role.id} className="hover:bg-[var(--secondary)]/20 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[var(--card-foreground)]">{role.name}</td>
                    <td className="px-6 py-4 text-[var(--muted-foreground)]">{role.description || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {role.permissions?.slice(0, 3).map((p) => (
                          <span key={p.id} className="inline-flex items-center rounded bg-[var(--secondary)] px-2 py-0.5 text-xs font-medium">
                            {p.name}
                          </span>
                        ))}
                        {(role.permissions?.length || 0) > 3 && (
                          <span className="inline-flex items-center rounded bg-[var(--secondary)] px-2 py-0.5 text-xs font-medium">
                            +{(role.permissions?.length || 0) - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {role.isActive ? (
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
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(role)}
                          className="rounded p-1 text-[var(--muted-foreground)] hover:bg-[var(--border)] hover:text-foreground transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(role.id)}
                          className="rounded p-1 text-red-600 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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
