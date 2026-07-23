import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { colaboradoresService, type ColaboradorFilters } from '@/services/colaboradores.service'

export function useColaboradores(filters?: ColaboradorFilters) {
  return useQuery({
    queryKey: ['colaboradores', filters],
    queryFn: () => colaboradoresService.findAll(filters),
  })
}

export function useColaborador(id: string) {
  return useQuery({
    queryKey: ['colaboradores', id],
    queryFn: () => colaboradoresService.findOne(id),
    enabled: !!id,
  })
}

export function useCreateColaborador() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: colaboradoresService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colaboradores'] })
    },
  })
}

export function useUpdateColaborador() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      colaboradoresService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colaboradores'] })
    },
  })
}

export function useDeleteColaborador() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: colaboradoresService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colaboradores'] })
    },
  })
}

export function useColaboradorEmergencia(colaboradorId: string) {
  return useQuery({
    queryKey: ['colaboradores', colaboradorId, 'emergencia'],
    queryFn: () => colaboradoresService.findEmergencia(colaboradorId),
    enabled: !!colaboradorId,
  })
}

export function useColaboradorEpi(colaboradorId: string) {
  return useQuery({
    queryKey: ['colaboradores', colaboradorId, 'epi'],
    queryFn: () => colaboradoresService.findEpi(colaboradorId),
    enabled: !!colaboradorId,
  })
}
