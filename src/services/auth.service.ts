import api from './api'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

export interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

export const authService = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>('/auth/login', data),

  getProfile: () =>
    api.get<UserProfile>('/auth/profile'),
}
