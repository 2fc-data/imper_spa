import api from './api'

export interface Activity {
  id: string
  type: string
  description: string
  status: string
  scheduledAt: string
  completedAt: string
  leadId: string
  userId: string
  notes: string
  createdAt: string
  updatedAt: string
}

export interface ActivityFilters {
  page?: number
  limit?: number
  type?: string
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

export const activitiesService = {
  findAll: (filters?: ActivityFilters) =>
    api.get<PaginatedResponse<Activity>>('/crm/activities', { params: filters }),

  findOne: (id: string) =>
    api.get<Activity>(`/crm/activities/${id}`),

  create: (data: Partial<Activity>) =>
    api.post<Activity>('/crm/activities', data),

  update: (id: string, data: Partial<Activity>) =>
    api.patch<Activity>(`/crm/activities/${id}`, data),

  complete: (id: string) =>
    api.patch(`/crm/activities/${id}/complete`),
}
