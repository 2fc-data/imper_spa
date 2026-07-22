import api from './api'

export interface ProposalItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Proposal {
  id: string
  number: string
  title: string
  scope: string
  terms: string
  totalValue: number
  discountPercent: number
  finalValue: number
  status: string
  validUntil: string
  signedBy: string
  signedAt: string
  signedDocument: string
  opportunityId: string
  createdById: string
  items: ProposalItem[]
  createdAt: string
  updatedAt: string
}

export interface ProposalFilters {
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

export const proposalsService = {
  findAll: (filters?: ProposalFilters) =>
    api.get<PaginatedResponse<Proposal>>('/crm/proposals', { params: filters }),

  findOne: (id: string) =>
    api.get<Proposal>(`/crm/proposals/${id}`),

  create: (data: Partial<Proposal>) =>
    api.post<Proposal>('/crm/proposals', data),

  update: (id: string, data: Partial<Proposal>) =>
    api.patch<Proposal>(`/crm/proposals/${id}`, data),

  send: (id: string) =>
    api.patch(`/crm/proposals/${id}/send`),

  sign: (id: string, data: { signedBy: string; signedDocument: string }) =>
    api.patch(`/crm/proposals/${id}/sign`, data),

  reject: (id: string) =>
    api.patch(`/crm/proposals/${id}/reject`),

  downloadPdf: (id: string) =>
    api.get(`/crm/proposals/${id}/pdf`, { responseType: 'blob' }),
}
