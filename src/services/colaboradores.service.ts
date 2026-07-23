import api from './api'

export interface Colaborador {
  id: string
  nome: string
  tipo: 'funcionario' | 'terceiro'
  status: string
  contrato?: string
  email?: string
  telefone?: string
  endereco?: string
  dataNascimento?: string
  dataAdmissao?: string
  departamentoId?: string
  equipeId?: string
  cargo?: string
  salario?: number
  banco?: string
  agencia?: string
  conta?: string
  pix?: string
  observacoes?: string
  fotoUrl?: string
  cpf?: string
  rg?: string
  orgaoEmissor?: string
  cnh?: string
  categoriaCnh?: string
  validadeCnh?: string
  cnhUrl?: string
  razaoSocial?: string
  cnpj?: string
  inscricaoEstadual?: string
  contratoUrl?: string
  asoUrl?: string
 _nr20Url?: string
  epiUrl?: string
  fotoCnhUrl?: string
  fotoRgUrl?: string
  fotoCpfUrl?: string
  fotoComprovanteResidenciaUrl?: string
  certidoaNascimentoCasaCivilUrl?: string
  certidaoCasamentoCasaCivilUrl?: string
  certidaoNascimentoRegistroCivil?: string
  certidaoCasamentoRegistroCivil?: string
  comprovanteResidenciaUrl?: string
  createdAt: string
  updatedAt: string
}

export interface ColaboradorFilters {
  page?: number
  limit?: number
  search?: string
  tipo?: string
  status?: string
  departamentoId?: string
  equipeId?: string
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

export interface EmergenciaContact {
  id: string
  nome: string
  parentesco: string
  telefone: string
  contatoAlternativo?: string
}

export interface EpiRecord {
  id: string
  tipo: string
  nome: string
  dataEntrega: string
  dataValidade?: string
  responsavelId?: string
  status: string
  observacoes?: string
}

export const colaboradoresService = {
  findAll: (filters?: ColaboradorFilters) =>
    api.get<PaginatedResponse<Colaborador>>('/crm/colaboradores', { params: filters }),

  findOne: (id: string) =>
    api.get<Colaborador>(`/crm/colaboradores/${id}`),

  create: (data: Partial<Colaborador>) =>
    api.post<Colaborador>('/crm/colaboradores', data),

  update: (id: string, data: Partial<Colaborador>) =>
    api.patch<Colaborador>(`/crm/colaboradores/${id}`, data),

  delete: (id: string) =>
    api.delete(`/crm/colaboradores/${id}`),

  findEmergencia: (colaboradorId: string) =>
    api.get<EmergenciaContact[]>(`/crm/colaboradores/${colaboradorId}/emergencia`),

  addEmergencia: (colaboradorId: string, data: Partial<EmergenciaContact>) =>
    api.post<EmergenciaContact>(`/crm/colaboradores/${colaboradorId}/emergencia`, data),

  removeEmergencia: (colaboradorId: string, emergenciaId: string) =>
    api.delete(`/crm/colaboradores/${colaboradorId}/emergencia/${emergenciaId}`),

  findEpi: (colaboradorId: string) =>
    api.get<EpiRecord[]>(`/crm/colaboradores/${colaboradorId}/epis`),

  addEpi: (colaboradorId: string, data: Partial<EpiRecord>) =>
    api.post<EpiRecord>(`/crm/colaboradores/${colaboradorId}/epis`, data),

  removeEpi: (colaboradorId: string, epiId: string) =>
    api.delete(`/crm/colaboradores/${colaboradorId}/epis/${epiId}`),
}
