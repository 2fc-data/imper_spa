import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Edit2, Building2 } from 'lucide-react'
import { organizationApi, type Organization } from '@/services/admin-api'
import { MaskedInput, getRawValue } from '@/components/ui/MaskedInput'
import { FormError } from '@/components/ui/FormError'
import { isValidCNPJ, isValidPhone } from '@/lib/validators'

const orgSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  cnpj: z.string().optional().refine(v => !v || isValidCNPJ(v), 'CNPJ inválido'),
  phone: z.string().optional().refine(v => !v || isValidPhone(v), 'Telefone inválido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
})

type OrgFormData = z.infer<typeof orgSchema>

export function OrganizationsPage() {
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<OrgFormData>({
    resolver: zodResolver(orgSchema) as any,
  })

  const { data: organizations, isLoading } = useQuery<Organization[]>({
    queryKey: ['admin-organizations'],
    queryFn: organizationApi.list,
  })

  const createOrg = useMutation({
    mutationFn: (data: OrgFormData) => organizationApi.create({
      name: data.name,
      cnpj: getRawValue(data.cnpj ?? '', 'cnpj'),
      phone: getRawValue(data.phone ?? '', 'phone'),
      email: data.email || undefined,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-organizations'] })
      closeForm()
    },
  })

  const updateOrg = useMutation({
    mutationFn: ({ id, ...data }: OrgFormData & { id: string }) =>
      organizationApi.update(id, {
        name: data.name,
        cnpj: getRawValue(data.cnpj ?? '', 'cnpj'),
        phone: getRawValue(data.phone ?? '', 'phone'),
        email: data.email || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-organizations'] })
      closeForm()
    },
  })

  const closeForm = () => {
    reset()
    setIsFormOpen(false)
    setIsEditing(null)
  }

  const onSubmit = (data: OrgFormData) => {
    if (isEditing) {
      updateOrg.mutate({ id: isEditing, ...data })
    } else {
      createOrg.mutate(data)
    }
  }

  const handleEdit = (org: Organization) => {
    setIsEditing(org.id)
    reset({
      name: org.name,
      cnpj: org.cnpj || '',
      phone: org.phone || '',
      email: org.email || '',
    })
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Organizações</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Gerencie as organizações da plataforma.
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={() => { reset(); setIsFormOpen(true) }}
            className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            Nova Organização
          </button>
        )}
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
          <h2 className="text-lg font-semibold">
            {isEditing ? 'Editar Organização' : 'Cadastrar Nova Organização'}
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
              <label className="block text-sm font-medium mb-1.5">CNPJ</label>
              <Controller
                control={control}
                name="cnpj"
                render={({ field }) => (
                  <MaskedInput
                    mask="cnpj"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={!!errors.cnpj}
                    placeholder="00.000.000/0000-00"
                  />
                )}
              />
              <FormError message={errors.cnpj?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Telefone</label>
              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <MaskedInput
                    mask="phone"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={!!errors.phone}
                    placeholder="(00) 00000-0000"
                  />
                )}
              />
              <FormError message={errors.phone?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--card-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="email@exemplo.com"
              />
              <FormError message={errors.email?.message} />
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
              disabled={createOrg.isPending || updateOrg.isPending}
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
        ) : organizations?.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <Building2 className="mx-auto h-8 w-8 text-[var(--muted-foreground)]" />
            <p className="text-sm font-medium">Nenhuma organização cadastrada.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-[var(--secondary)] text-[var(--muted-foreground)] uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 font-semibold">Nome</th>
                  <th className="px-6 py-3 font-semibold">CNPJ</th>
                  <th className="px-6 py-3 font-semibold">Telefone</th>
                  <th className="px-6 py-3 font-semibold">Email</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {organizations?.map((org) => (
                  <tr key={org.id} className="hover:bg-[var(--secondary)]/20 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[var(--card-foreground)]">{org.name}</td>
                    <td className="px-6 py-4 text-[var(--muted-foreground)]">{org.cnpj || '-'}</td>
                    <td className="px-6 py-4 text-[var(--muted-foreground)]">{org.phone || '-'}</td>
                    <td className="px-6 py-4 text-[var(--muted-foreground)]">{org.email || '-'}</td>
                    <td className="px-6 py-4">
                      {org.isActive ? (
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
                        onClick={() => handleEdit(org)}
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
