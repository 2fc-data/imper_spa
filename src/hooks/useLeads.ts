import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { leadsService, type LeadFilters } from '@/services/leads.service'

export function useLeads(filters?: LeadFilters) {
  return useQuery({
    queryKey: ['leads', filters],
    queryFn: () => leadsService.findAll(filters),
  })
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ['leads', id],
    queryFn: () => leadsService.findOne(id),
    enabled: !!id,
  })
}

export function useCreateLead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: leadsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })
}

export function useUpdateLead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      leadsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })
}

export function useMoveLeadStage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      leadsService.moveStage(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })
}

export function useDeleteLead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: leadsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })
}
