import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { activitiesService, type ActivityFilters } from '@/services/activities.service'

export function useActivities(filters?: ActivityFilters) {
  return useQuery({
    queryKey: ['activities', filters],
    queryFn: () => activitiesService.findAll(filters),
  })
}

export function useActivity(id: string) {
  return useQuery({
    queryKey: ['activities', id],
    queryFn: () => activitiesService.findOne(id),
    enabled: !!id,
  })
}

export function useCreateActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: activitiesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
    },
  })
}

export function useCompleteActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: activitiesService.complete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
    },
  })
}
