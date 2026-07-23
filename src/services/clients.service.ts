import api from './api'

export interface Client {
  id: string
  name: string
  companyName: string
  email: string
  phone: string
  whatsapp: string
  address: string
  city: string
  state: string
  cpfCnpj: string
  contactPerson: string
  status: string
  notes: string
  tags: string[]
  totalPurchases: number
  completedProjects: number
  sourceOpportunityId: string
  createdAt: string
  updatedAt: string
}

export interface ClientFilters {
  page?: number
  limit?: number
  search?: string
  status?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const clientsService = {
  findAll: (filters?: ClientFilters) =>
    api.get<PaginatedResponse<Client>>('/crm/clients', { params: filters }),

  findOne: (id: string) =>
    api.get<Client>(`/crm/clients/${id}`),

  create: (data: Partial<Client>) =>
    api.post<Client>('/crm/clients', data),

  update: (id: string, data: Partial<Client>) =>
    api.patch<Client>(`/crm/clients/${id}`, data),

  delete: (id: string) =>
    api.delete(`/crm/clients/${id}`),
}
