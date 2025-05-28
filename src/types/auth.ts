export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading'

export interface User {
  id: string
  username: string
  created_at: string
}

export interface LoginForm {
  username: string
  password: string
}
