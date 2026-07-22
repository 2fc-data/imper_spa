import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Edit2, ShieldAlert } from 'lucide-react'
import api from '@/services/api'

interface Service {
  id: string
  name: string
  description: string
  icon: string
  displayOrder: number
  active: boolean
}

export function ServicesManagementPage() {
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('Home')
  const [displayOrder, setDisplayOrder] = useState(0)
  const [active, setActive] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Query to fetch all services (including inactive ones)
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ['admin-services'],
    queryFn: async () => {
      const { data } = await api.get('/services')
      return data
    },
  })

  // Mutation to create a service
  const createService = useMutation({
    mutationFn: async (newService: Omit<Service, 'id'>) => {
      const { data } = await api.post('/services', newService)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] })
      queryClient.invalidateQueries({ queryKey: ['public-services'] })
      resetForm()
    },
  })

  // Mutation to update a service
  const updateService = useMutation({
    mutationFn: async ({ id, ...updatedData }: Partial<Service> & { id: string }) => {
      const { data } = await api.patch(`/services/${id}`, updatedData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] })
      queryClient.invalidateQueries({ queryKey: ['public-services'] })
      setIsEditing(null)
      resetForm()
    },
  })

  // Mutation to delete a service
  const deleteService = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/services/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] })
      queryClient.invalidateQueries({ queryKey: ['public-services'] })
    },
  })

  const resetForm = () => {
    setName('')
    setDescription('')
    setIcon('Home')
    setDisplayOrder(0)
    setActive(true)
    setIsFormOpen(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const payload = {
      name,
      description,
      icon,
      displayOrder: Number(displayOrder),
      active,
    }

    if (isEditing) {
      updateService.mutate({ id: isEditing, ...payload })
    } else {
      createService.mutate(payload)
    }
  }

  const handleEditClick = (service: Service) => {
    setIsEditing(service.id)
    setName(service.name)
    setDescription(service.description)
    setIcon(service.icon)
    setDisplayOrder(service.displayOrder)
    setActive(service.active)
    setIsFormOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    if (confirm('Tem certeza de que deseja excluir este serviço?')) {
      deleteService.mutate(id)
    }
  }

  const iconsAvailable = [
    'Home', 'Waves', 'Building', 'Layers', 'Bath', 'Wrench', 'Grid3x3', 'HardHat',
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Serviços</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Gerencie os serviços expostos na Landing Page pública.
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={() => {
              setIsEditing(null)
              resetForm()
              setIsFormOpen(true)
            }}
            className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            Novo Serviço
          </button>
        )}
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
          <h2 className="text-lg font-semibold">
            {isEditing ? 'Editar Serviço' : 'Cadastrar Novo Serviço'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Nome do Serviço *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Impermeabilização de Lajes"
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--card-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Ícone</label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--card-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  {iconsAvailable.map(i => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Ordem de Exibição</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--card-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva os detalhes e garantia deste serviço..."
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--card-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="active"
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
            />
            <label htmlFor="active" className="text-sm font-medium select-none">
              Serviço Ativo (Visível na Landing Page)
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--secondary)] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createService.isPending || updateService.isPending}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Salvar Serviço
            </button>
          </div>
        </form>
      )}

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-[var(--muted-foreground)]">Carregando serviços...</div>
        ) : services?.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <ShieldAlert className="mx-auto h-8 w-8 text-[var(--muted-foreground)]" />
            <p className="text-sm font-medium">Nenhum serviço cadastrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-[var(--secondary)] text-[var(--muted-foreground)] uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 font-semibold">Ordem</th>
                  <th className="px-6 py-3 font-semibold">Nome</th>
                  <th className="px-6 py-3 font-semibold">Descrição</th>
                  <th className="px-6 py-3 font-semibold">Ícone</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {services?.map((service) => (
                  <tr key={service.id} className="hover:bg-[var(--secondary)]/20 transition-colors">
                    <td className="px-6 py-4 font-medium">{service.displayOrder}</td>
                    <td className="px-6 py-4 font-semibold text-[var(--card-foreground)]">{service.name}</td>
                    <td className="px-6 py-4 text-[var(--muted-foreground)] max-w-xs truncate">{service.description || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded bg-[var(--secondary)] px-2 py-1 text-xs font-semibold">
                        {service.icon}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {service.active ? (
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
                          onClick={() => handleEditClick(service)}
                          className="rounded p-1 text-[var(--muted-foreground)] hover:bg-[var(--border)] hover:text-foreground transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(service.id)}
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
