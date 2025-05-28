'use client'

import { Card, Form, Input, Button } from 'antd'
import { ComputerDesktopIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import AnimatedBackground from '@/components/animated-background'
import type { LoginForm } from '@/types/auth'
import { useUser } from '@/lib/auth-provider'
export default function LoginPage() {
  const { login, isLoading } = useUser()

  const handleLogin = async (values: LoginForm) => {
    const { username, password } = values
    try {
      await login(username, password)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <AnimatedBackground />
      
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-blue-600/20" />
      
      <Card 
        className="w-full max-w-md mx-4 backdrop-blur-sm bg-white/90 shadow-2xl"
        variant="borderless"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <ComputerDesktopIcon className="w-12 h-12 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">远程关机控制台</h1>
          <p className="text-gray-500 mt-2">请登录以继续使用系统</p>
        </div>

        <Form
          name="login"
          onFinish={handleLogin}
          layout="vertical"
          requiredMark={false}
          className="space-y-4"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' }
            ]}
          >
            <Input 
              prefix={<ComputerDesktopIcon className="w-5 h-5 text-gray-400" />}
              placeholder="用户名" 
              size="large"
              className="rounded-lg"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' }
            ]}
          >
            <Input.Password
              prefix={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
              placeholder="密码"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg h-12 text-base font-medium"
            >
              {isLoading ? '登录中...' : '登录'}
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-6 text-center text-sm text-gray-500">
          遇到问题？请联系系统管理员
        </div>
      </Card>
    </div>
  )
}