import { useQuery } from '@tanstack/react-query'
import { auditService, type AuditFilters } from '@/services/audit.service'

export function useAuditLogs(filters?: AuditFilters) {
  return useQuery({
    queryKey: ['audit', filters],
    queryFn: () => auditService.findAll(filters),
  })
}

export function useTimeline(filters?: AuditFilters) {
  return useQuery({
    queryKey: ['timeline', filters],
    queryFn: () => auditService.getTimeline(filters),
  })
}
