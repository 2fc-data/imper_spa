import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationsService, type NotificationFilters } from '@/services/notifications.service'

export function useNotifications(filters?: NotificationFilters) {
  return useQuery({
    queryKey: ['notifications', filters],
    queryFn: () => notificationsService.findAll(filters),
  })
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationsService.getUnreadCount(),
  })
}

export function useMarkAsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: notificationsService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: notificationsService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
