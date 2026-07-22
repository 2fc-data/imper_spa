import api from './api'

export interface Opportunity {
  id: string
  title: string
  value: number
  status: string
  leadId: string
  assignedUserId: string
  expectedCloseDate: string
  notes: string
  leads?: any[]
  createdAt: string
  updatedAt: string
}

export interface OpportunityFilters {
  page?: number
  limit?: number
  status?: string
  search?: string
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

export const opportunitiesService = {
  findAll: (filters?: OpportunityFilters) =>
    api.get<PaginatedResponse<Opportunity>>('/crm/opportunities', { params: filters }),

  findOne: (id: string) =>
    api.get<Opportunity>(`/crm/opportunities/${id}`),

  create: (data: Partial<Opportunity>) =>
    api.post<Opportunity>('/crm/opportunities', data),

  update: (id: string, data: Partial<Opportunity>) =>
    api.patch<Opportunity>(`/crm/opportunities/${id}`, data),

  delete: (id: string) =>
    api.delete(`/crm/opportunities/${id}`),
}
