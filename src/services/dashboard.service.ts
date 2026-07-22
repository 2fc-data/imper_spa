import api from './api'

export interface DashboardSummary {
  totalLeads: number
  leadsGrowth: string
  totalOpportunities: number
  opportunitiesValue: number
  totalProposals: number
  conversionRate: number
}

export interface PipelineStage {
  status: string
  count: number
  value: number
}

export interface OriginsData {
  source: string
  count: number
  percentage: number
}

export interface PerformerData {
  userId: string
  name: string
  wonValue: number
  leadsCount: number
}

export interface ActivityData {
  id: string
  type: string
  title: string
  scheduledAt: string
  leadName: string
}

export interface DashboardPipelineResponse {
  stages: PipelineStage[]
}

export interface DashboardOriginsResponse {
  origins: OriginsData[]
}

export interface DashboardPerformersResponse {
  performers: PerformerData[]
}

export interface DashboardActivitiesResponse {
  overdue: number
  today: number
  thisWeek: number
  recent: ActivityData[]
}

export const dashboardService = {
  getSummary: () =>
    api.get<DashboardSummary>('/dashboard/summary'),

  getPipeline: () =>
    api.get<DashboardPipelineResponse>('/dashboard/pipeline'),

  getOrigins: () =>
    api.get<DashboardOriginsResponse>('/dashboard/origins'),

  getPerformers: () =>
    api.get<DashboardPerformersResponse>('/dashboard/performers'),

  getActivities: () =>
    api.get<DashboardActivitiesResponse>('/dashboard/activities'),
}
