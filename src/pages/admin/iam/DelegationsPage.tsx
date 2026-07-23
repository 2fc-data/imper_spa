import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Edit2, Trash2, ArrowRightLeft } from 'lucide-react'
import { delegationApi, type Delegation } from '@/services/admin-api'
import { FormError } from '@/components/ui/FormError'

const delegationSchema = z.object({
  fromUserId: z.string().min(1, 'Obrigatório'),
  toUserId: z.string().min(1, 'Obrigatório'),
  reason: z.string().max(255, 'Máximo 255 caracteres').optional(),
  expiresAt: z.string().optional(),
})

type DelegationFormData = z.infer<typeof delegationSchema>

export function DelegationsPage() {
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DelegationFormData>({
    resolver: zodResolver(delegationSchema) as any,
  })

  const { data: delegations, isLoading } = useQuery<Delegation[]>({
    queryKey: ['admin-delegations'],
    queryFn: delegationApi.list,
  })

  const createDelegation = useMutation({
    mutationFn: delegationApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-delegations'] })
      closeForm()
    },
  })

  const updateDelegation = useMutation({
    mutationFn: ({ id, ...data }: { id: string; reason?: string; expiresAt?: string }) =>
      delegationApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-delegations'] })
      closeForm()
    },
  })

  const revokeDelegation = useMutation({
    mutationFn: delegationApi.revoke,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-delegations'] }),
  })

  const closeForm = () => {
    reset()
    setIsFormOpen(false)
    setIsEditing(null)
  }

  const onSubmit = (data: DelegationFormData) => {
    if (isEditing) {
      updateDelegation.mutate({
        id: isEditing,
        reason: data.reason || undefined,
        expiresAt: data.expiresAt || undefined,
      })
    } else {
      createDelegation.mutate({
        fromUserId: data.fromUserId,
        toUserId: data.toUserId,
        reason: data.reason || undefined,
        expiresAt: data.expiresAt || undefined,
      })
    }
  }

  const handleEdit = (del: Delegation) => {
    setIsEditing(del.id)
    reset({
      fromUserId: del.fromUserId,
      toUserId: del.toUserId,
      reason: del.reason || '',
      expiresAt: del.expiresAt?.split('T')[0] || '',
    })
    setIsFormOpen(true)
  }

  const handleRevoke = (id: string) => {
    if (confirm('Tem certeza que deseja revogar esta delegação?')) {
      revokeDelegation.mutate(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Delegações</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Gerencie delegações temporárias de permissões entre usuários.
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={() => { reset(); setIsFormOpen(true) }}
            className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            Nova Delegação
          </button>
        )}
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
          <h2 className="text-lg font-semibold">
            {isEditing ? 'Editar Delegação' : 'Criar Nova Delegação'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Usuário Origem *</label>
              <input
                {...register('fromUserId')}
                placeholder="ID do usuário que delega"
                disabled={!!isEditing}
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--card-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-50"
              />
              <FormError message={errors.fromUserId?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Usuário Destino *</label>
              <input
                {...register('toUserId')}
                placeholder="ID do usuário que recebe"
                disabled={!!isEditing}
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--card-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-50"
              />
              <FormError message={errors.toUserId?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Motivo</label>
              <input
                {...register('reason')}
                placeholder="Férias, licença, etc."
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--card-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
              <FormError message={errors.reason?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Data de Expiração</label>
              <input
                {...register('expiresAt')}
                type="date"
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--card-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
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
              disabled={createDelegation.isPending || updateDelegation.isPending}
              className="px-4 py-2 text-sm font-medium bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isEditing ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </form>
      )}

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-[var(--muted-foreground)]">Carregando...</div>
        ) : delegations?.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <ArrowRightLeft className="mx-auto h-8 w-8 text-[var(--muted-foreground)]" />
            <p className="text-sm font-medium">Nenhuma delegação encontrada.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-[var(--secondary)] text-[var(--muted-foreground)] uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 font-semibold">Origem</th>
                  <th className="px-6 py-3 font-semibold">Destino</th>
                  <th className="px-6 py-3 font-semibold">Motivo</th>
                  <th className="px-6 py-3 font-semibold">Expira em</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {delegations?.map((del) => (
                  <tr key={del.id} className="hover:bg-[var(--secondary)]/20 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-[var(--card-foreground)]">{del.fromUserId}</td>
                    <td className="px-6 py-4 font-mono text-xs text-[var(--card-foreground)]">{del.toUserId}</td>
                    <td className="px-6 py-4 text-[var(--muted-foreground)]">{del.reason || '-'}</td>
                    <td className="px-6 py-4 text-[var(--muted-foreground)]">
                      {del.expiresAt ? new Date(del.expiresAt).toLocaleDateString('pt-BR') : 'Sem prazo'}
                    </td>
                    <td className="px-6 py-4">
                      {del.isActive ? (
                        <span className="inline-flex items-center gap-1 rounded bg-green-500/10 px-2 py-1 text-xs font-semibold text-green-600">
                          Ativa
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-gray-500/10 px-2 py-1 text-xs font-semibold text-gray-600">
                          Revogada
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {del.isActive && (
                          <>
                            <button
                              onClick={() => handleEdit(del)}
                              className="rounded p-1 text-[var(--muted-foreground)] hover:bg-[var(--border)] hover:text-foreground transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleRevoke(del.id)}
                              className="rounded p-1 text-red-600 hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
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
