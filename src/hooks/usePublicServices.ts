import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'

interface PublicService {
  id: string
  name: string
  description: string
  icon: string
  displayOrder: number
}

async function fetchPublicServices(): Promise<PublicService[]> {
  const { data } = await api.get('/integrations/services')
  return data
}

export function usePublicServices() {
  return useQuery({
    queryKey: ['public-services'],
    queryFn: fetchPublicServices,
    staleTime: 1000 * 60 * 5,
  })
}
