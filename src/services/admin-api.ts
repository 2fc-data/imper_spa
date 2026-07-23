import api from './api'

// ─── Organization ────────────────────────────────────────────────────────────
export interface Organization {
  id: string
  name: string
  cnpj?: string
  address?: Record<string, unknown>
  phone?: string
  email?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export const organizationApi = {
  list: () => api.get<Organization[]>('/organization').then((r) => r.data),
  get: (id: string) => api.get<Organization>(`/organization/${id}`).then((r) => r.data),
  create: (data: Partial<Organization>) => api.post<Organization>('/organization', data).then((r) => r.data),
  update: (id: string, data: Partial<Organization>) => api.put<Organization>(`/organization/${id}`, data).then((r) => r.data),
}

// ─── Department ──────────────────────────────────────────────────────────────
export interface Department {
  id: string
  name: string
  description?: string
  organizationId: string
  organization?: Organization
  managerId?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export const departmentApi = {
  list: (organizationId?: string) =>
    api.get<Department[]>('/organization/departments', { params: { organizationId } }).then((r) => r.data),
  get: (id: string) => api.get<Department>(`/organization/departments/${id}`).then((r) => r.data),
  create: (data: Partial<Department>) => api.post<Department>('/organization/departments', data).then((r) => r.data),
  update: (id: string, data: Partial<Department>) => api.put<Department>(`/organization/departments/${id}`, data).then((r) => r.data),
}

// ─── Team ────────────────────────────────────────────────────────────────────
export interface Team {
  id: string
  name: string
  description?: string
  departmentId: string
  department?: Department
  leaderId?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export const teamApi = {
  list: (departmentId?: string) =>
    api.get<Team[]>('/organization/teams', { params: { departmentId } }).then((r) => r.data),
  get: (id: string) => api.get<Team>(`/organization/teams/${id}`).then((r) => r.data),
  create: (data: Partial<Team>) => api.post<Team>('/organization/teams', data).then((r) => r.data),
  update: (id: string, data: Partial<Team>) => api.put<Team>(`/organization/teams/${id}`, data).then((r) => r.data),
}

// ─── Cost Center ─────────────────────────────────────────────────────────────
export interface CostCenter {
  id: string
  code: string
  name: string
  departmentId?: string
  department?: Department
  teamId?: string
  team?: Team
  budget?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export const costCenterApi = {
  list: (departmentId?: string) =>
    api.get<CostCenter[]>('/organization/cost-centers', { params: { departmentId } }).then((r) => r.data),
  get: (id: string) => api.get<CostCenter>(`/organization/cost-centers/${id}`).then((r) => r.data),
  create: (data: Partial<CostCenter>) => api.post<CostCenter>('/organization/cost-centers', data).then((r) => r.data),
  update: (id: string, data: Partial<CostCenter>) => api.put<CostCenter>(`/organization/cost-centers/${id}`, data).then((r) => r.data),
}

// ─── Role ────────────────────────────────────────────────────────────────────
export interface Permission {
  id: string
  name: string
  description?: string
}

export interface Role {
  id: string
  name: string
  description?: string
  isActive: boolean
  permissions?: Permission[]
  createdAt: string
  updatedAt: string
}

export const roleApi = {
  list: () => api.get<Role[]>('/iam/roles').then((r) => r.data),
  get: (id: string) => api.get<Role>(`/iam/roles/${id}`).then((r) => r.data),
  create: (data: { name: string; description?: string; permissions?: string[] }) =>
    api.post<Role>('/iam/roles', data).then((r) => r.data),
  update: (id: string, data: { name?: string; description?: string; permissions?: string[] }) =>
    api.put<Role>(`/iam/roles/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/iam/roles/${id}`),
}

// ─── Permission ──────────────────────────────────────────────────────────────
export const permissionApi = {
  list: () => api.get<Permission[]>('/iam/permissions').then((r) => r.data),
}

// ─── User Role Assignment ────────────────────────────────────────────────────
export interface UserRole {
  id: string
  userId: string
  roleId: string
  role?: Role
  organizationId?: string
  departmentId?: string
  teamId?: string
  expiresAt?: string
  isActive: boolean
}

export const userRoleApi = {
  listByUser: (userId: string) =>
    api.get<UserRole[]>(`/iam/users/${userId}/roles`).then((r) => r.data),
  assign: (userId: string, data: { roleId: string; organizationId?: string; departmentId?: string; teamId?: string; expiresAt?: string }) =>
    api.post<UserRole>(`/iam/users/${userId}/roles`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/iam/users/roles/${id}`),
}

// ─── Delegation ──────────────────────────────────────────────────────────────
export interface Delegation {
  id: string
  delegatorId: string
  delegateId: string
  roleId: string
  role?: Role
  startDate: string
  endDate: string
  reason?: string
  isActive: boolean
  createdAt: string
}

export const delegationApi = {
  listByUser: (userId: string) =>
    api.get<Delegation[]>(`/iam/delegations/${userId}`).then((r) => r.data),
  create: (data: { delegatorId: string; delegateId: string; roleId: string; startDate: string; endDate: string; reason?: string }) =>
    api.post<Delegation>('/iam/delegations', data).then((r) => r.data),
  remove: (id: string) => api.delete(`/iam/delegations/${id}`),
}

// ─── Configuration ───────────────────────────────────────────────────────────
export interface ConfigCategory {
  id: string
  name: string
  description?: string
}

export interface ConfigKey {
  id: string
  key: string
  description?: string
  categoryId?: string
  category?: ConfigCategory
  defaultValue?: string
  type?: string
  isEncrypted: boolean
  isActive: boolean
}

export interface ConfigValue {
  key: string
  value: string
}

export const configApi = {
  get: (key: string, scope?: { organizationId?: string; departmentId?: string; userId?: string }) =>
    api.get<ConfigValue>(`/configuration/${key}`, { params: scope }).then((r) => r.data),
  set: (key: string, value: string, scope?: { organizationId?: string; departmentId?: string; userId?: string }) =>
    api.post(`/configuration/${key}`, { value, ...scope }),
  listCategories: () =>
    api.get<ConfigCategory[]>('/configuration/categories/list').then((r) => r.data),
  listKeys: (categoryId?: string) =>
    api.get<ConfigKey[]>('/configuration/keys/list', { params: { categoryId } }).then((r) => r.data),
}
