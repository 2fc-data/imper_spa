import api from './api'

export interface Lead {
  id: string
  name: string
  companyName: string
  email: string
  phone: string
  whatsapp: string
  status: string
  source: string
  estimatedValue: number
  notes: string
  tags: string[]
  assignedUserId: string
  lastContactAt: string
  contactAttempts: number
  createdAt: string
  updatedAt: string
}

export interface LeadFilters {
  page?: number
  limit?: number
  status?: string
  source?: string
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

export const leadsService = {
  findAll: (filters?: LeadFilters) =>
    api.get<PaginatedResponse<Lead>>('/crm/leads', { params: filters }),

  findOne: (id: string) =>
    api.get<Lead>(`/crm/leads/${id}`),

  create: (data: Partial<Lead>) =>
    api.post<Lead>('/crm/leads', data),

  update: (id: string, data: Partial<Lead>) =>
    api.patch<Lead>(`/crm/leads/${id}`, data),

  moveStage: (id: string, status: string) =>
    api.patch(`/crm/leads/${id}/move`, { status }),

  delete: (id: string) =>
    api.delete(`/crm/leads/${id}`),
}
