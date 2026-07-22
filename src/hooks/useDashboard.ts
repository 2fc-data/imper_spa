import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboard.service'

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => dashboardService.getSummary(),
  })
}

export function useDashboardPipeline() {
  return useQuery({
    queryKey: ['dashboard', 'pipeline'],
    queryFn: () => dashboardService.getPipeline(),
  })
}

export function useDashboardOrigins() {
  return useQuery({
    queryKey: ['dashboard', 'origins'],
    queryFn: () => dashboardService.getOrigins(),
  })
}

export function useDashboardPerformers() {
  return useQuery({
    queryKey: ['dashboard', 'performers'],
    queryFn: () => dashboardService.getPerformers(),
  })
}

export function useDashboardActivities() {
  return useQuery({
    queryKey: ['dashboard', 'activities'],
    queryFn: () => dashboardService.getActivities(),
  })
}
