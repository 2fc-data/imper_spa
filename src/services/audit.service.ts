import api from './api'

export interface AuditLog {
  id: string
  action: string
  entity: string
  entityId: string
  oldValues: Record<string, any>
  newValues: Record<string, any>
  changedFields: string[]
  description: string
  ipAddress: string
  userId: string
  user?: { id: string; name: string; email: string }
  createdAt: string
}

export interface AuditFilters {
  page?: number
  limit?: number
  entity?: string
  entityId?: string
  action?: string
  userId?: string
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

export const auditService = {
  findAll: (filters?: AuditFilters) =>
    api.get<PaginatedResponse<AuditLog>>('/admin/audit', { params: filters }),

  getTimeline: (filters?: AuditFilters) =>
    api.get<PaginatedResponse<AuditLog>>('/admin/audit/timeline', { params: filters }),
}
