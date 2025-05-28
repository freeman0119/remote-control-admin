'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { useRouter } from 'next/navigation'
import { message } from 'antd'

interface UserContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const login = async (username: string, password: string) => {
    setIsLoading(true)
    try {
      // 1. 获取 email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('username', username)
        .single()

      if (userError || !userData) {
        throw new Error('用户名不存在，请检查后重试')
      }

      // 2. 登录认证
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password,
      })

      if (loginError) {
        throw new Error('登录失败，请检查用户名或密码')
      }

      setUser(data.user)
      message.success('登录成功，正在跳转...')
      router.push('/dashboard/computers')
    } catch (error) {
      console.error('Login failed:', error)
      message.error(error instanceof Error ? error.message : '系统错误，请稍后再试')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      router.push('/login')
      message.success('退出成功')
    } catch (error) {
      console.error('Logout failed:', error)
      message.error('退出失败')
      throw error
    }
  }

  // 初始化加载当前 session
  useEffect(() => {
    const getSessionUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }
    getSessionUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within an AuthProvider')
  }
  return context
}
