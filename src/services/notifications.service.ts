import api from './api'

export interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  userId: string
  relatedId: string
  createdAt: string
}

export interface NotificationsPage {
  data: Notification[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}

export interface NotificationFilters {
  unread?: boolean
  page?: number
  limit?: number
}

export const notificationsService = {
  findAll: (filters?: NotificationFilters) => {
    const params = new URLSearchParams()
    if (filters?.unread) params.set('unread', 'true')
    if (filters?.page) params.set('page', String(filters.page))
    if (filters?.limit) params.set('limit', String(filters.limit))
    const qs = params.toString()
    return api.get<NotificationsPage>(`/notifications${qs ? `?${qs}` : ''}`)
  },

  getUnreadCount: () =>
    api.get<{ count: number }>('/notifications/count'),

  markAsRead: (id: string) =>
    api.patch(`/notifications/${id}/read`),

  markAllAsRead: () =>
    api.patch('/notifications/read-all'),
}
