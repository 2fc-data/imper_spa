import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { patrimonioService, type AssetFilters } from '@/services/patrimonio.service'

export function useAssets(filters?: AssetFilters) {
  return useQuery({
    queryKey: ['assets', filters],
    queryFn: () => patrimonioService.findAll(filters),
  })
}

export function useAsset(id: string) {
  return useQuery({
    queryKey: ['assets', id],
    queryFn: () => patrimonioService.findOne(id),
    enabled: !!id,
  })
}

export function useCreateAsset() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: patrimonioService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
    },
  })
}

export function useUpdateAsset() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      patrimonioService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
    },
  })
}

export function useDeleteAsset() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: patrimonioService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
    },
  })
}

export function useAssetAssignments(assetId: string) {
  return useQuery({
    queryKey: ['assets', assetId, 'assignments'],
    queryFn: () => patrimonioService.findAssignments(assetId),
    enabled: !!assetId,
  })
}
