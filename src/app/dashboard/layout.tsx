'use client'

import { Layout, Menu, Dropdown, Avatar, Space } from 'antd';
import type { MenuProps } from 'antd';
import { 
  DesktopOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined
} from '@ant-design/icons';
import { useUser } from '@/lib/auth-provider';
import { useRouter } from 'next/navigation';

const { Sider, Content } = Layout;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useUser();
  const router = useRouter();

  const items: MenuProps['items'] = [
    {
      key: '/dashboard/computers',
      icon: <DesktopOutlined />,
      label: '电脑列表',
      onClick: () => {
        router.push('/dashboard/computers');
      }
    }
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: async () => {
        try {
          await logout();
        } catch (error) {
          // 错误已经在 auth provider 中处理
          console.error('Logout failed:', error);
        }
      },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={240}
        style={{
          background: '#0A1929',
          padding: '16px 0',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          overflowY: 'auto',
          zIndex: 1000,
        }}
      >
        <div style={{ 
          padding: '0 16px 16px',
          marginBottom: '16px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          <h1 style={{ 
            color: '#fff',
            fontSize: '18px',
            fontWeight: 500,
            margin: 0,
            padding: '8px 0',
            textAlign: 'center'
          }}>
            远程控制
          </h1>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['/dashboard/computers']}
          style={{
            background: 'transparent',
            border: 'none',
          }}
          items={items}
          theme="dark"
        />
      </Sider>
      <Layout style={{ marginLeft: 240 }}>
        <Layout.Header style={{ 
          padding: '0 24px', 
          background: '#fff', 
          display: 'flex', 
          justifyContent: 'flex-end',
          alignItems: 'center',
          height: 64,
          position: 'sticky',
          top: 0,
          zIndex: 999,
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
        }}>
          <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
            <Space style={{ cursor: 'pointer' }}>
              <Avatar 
                size="small"
                icon={<UserOutlined />} 
                style={{ backgroundColor: '#1890ff' }}
              />
              <span style={{ color: '#666' }}>{user?.email?.split('@')[0]}</span>
              <DownOutlined style={{ fontSize: '12px', color: '#999' }} />
            </Space>
          </Dropdown>
        </Layout.Header>
        <Content style={{ 
          margin: '24px',
          minHeight: 280,
          background: '#fff',
          borderRadius: '8px',
          padding: 24,
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}