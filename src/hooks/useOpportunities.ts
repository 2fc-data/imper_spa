import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { opportunitiesService, type OpportunityFilters } from '@/services/opportunities.service'

export function useOpportunities(filters?: OpportunityFilters) {
  return useQuery({
    queryKey: ['opportunities', filters],
    queryFn: () => opportunitiesService.findAll(filters),
  })
}

export function useOpportunity(id: string) {
  return useQuery({
    queryKey: ['opportunities', id],
    queryFn: () => opportunitiesService.findOne(id),
    enabled: !!id,
  })
}

export function useCreateOpportunity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: opportunitiesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] })
    },
  })
}

export function useUpdateOpportunity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      opportunitiesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] })
    },
  })
}
