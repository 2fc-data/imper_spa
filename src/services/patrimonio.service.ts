import api from './api'

export interface Asset {
  id: string
  codigo: string
  nome: string
  tipo: string
  descricao?: string
  dataAquisicao?: string
  valorInvestido?: number
  valorAtual?: number
  estado?: string
  status?: string
  responsibleId?: string
  costCenterId?: string
  observacoes?: string
  placa?: string
  chassi?: string
  marca?: string
  modelo?: string
  ano?: number
  renavam?: string
  cor?: string
  combustivel?: string
  km?: number
  seguro?: string
  licenciamento?: string
  dataVencSeguro?: string
  nroSerie?: string
  garantia?: string
  manualUrl?: string
  endereco?: string
  matricula?: string
  area?: number
  finalidade?: string
  situacao?: string
  material?: string
  localizacao?: string
  assignments?: AssetAssignment[]
  createdAt: string
  updatedAt: string
}

export interface AssetAssignment {
  id: string
  assetId: string
  colaboradorId: string
  startDate: string
  endDate?: string
  motivo?: string
  colaborador?: { id: string; nome: string }
}

export interface AssetFilters {
  page?: number
  limit?: number
  search?: string
  tipo?: string
  estado?: string
  status?: string
  costCenterId?: string
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

export const patrimonioService = {
  findAll: (filters?: AssetFilters) =>
    api.get<PaginatedResponse<Asset>>('/crm/patrimonio', { params: filters }),

  findOne: (id: string) =>
    api.get<Asset>(`/crm/patrimonio/${id}`),

  create: (data: Partial<Asset>) =>
    api.post<Asset>('/crm/patrimonio', data),

  update: (id: string, data: Partial<Asset>) =>
    api.patch<Asset>(`/crm/patrimonio/${id}`, data),

  delete: (id: string) =>
    api.delete(`/crm/patrimonio/${id}`),

  findAssignments: (assetId: string) =>
    api.get<AssetAssignment[]>(`/crm/patrimonio/${assetId}/alocacoes`),

  addAssignment: (assetId: string, data: Partial<AssetAssignment>) =>
    api.post<AssetAssignment>(`/crm/patrimonio/${assetId}/alocacoes`, data),

  removeAssignment: (assetId: string, assignmentId: string) =>
    api.delete(`/crm/patrimonio/${assetId}/alocacoes/${assignmentId}`),
}
