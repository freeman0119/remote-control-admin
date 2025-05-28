'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Card, Modal, message, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PoweroffOutlined } from '@ant-design/icons';
import { supabase } from '@/lib/supabase';

export type ComputerStatus = 'online' | 'shutting_down' | 'offline';

interface Computer {
  id: string;
  machine_id: string;
  name: string;
  status: ComputerStatus;
  created_at: string;
  updated_at: string;
}

export default function ComputersPage() {
  const [modal, contextHolder] = Modal.useModal()
  const [computers, setComputers] = useState<Computer[]>([]);
  const [loading, setLoading] = useState(false);

  const columns: ColumnsType<Computer> = [
    {
      title: '电脑名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (name: string) => (
        <Tooltip title={name}>
          <span>{name}</span>
        </Tooltip>
      ),
    },
    {
      title: '设备ID',
      dataIndex: 'machine_id',
      key: 'machine_id',
      width: 240,
      ellipsis: {
        showTitle: false,
      },
      render: (id: string) => (
        <Tooltip title={id}>
          <span>{id}</span>
        </Tooltip>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: ComputerStatus) => {
        const statusMap = {
          online: { text: '正在运行', color: 'text-green-500' },
          shutting_down: { text: '关机中', color: 'text-orange-500' },
          offline: { text: '已关机', color: 'text-gray-500' },
        };
        return (
          <span className={statusMap[status].color}>
            {statusMap[status].text}
          </span>
        );
      },
    },
    {
      title: '最后更新',
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: 180,
      ellipsis: {
        showTitle: false,
      },
      render: (date: string) => (
        <Tooltip title={new Date(date).toLocaleString()}>
          <span>{new Date(date).toLocaleString()}</span>
        </Tooltip>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Tooltip title={record.status !== 'online' ? '电脑离线无法关机' : '关闭此电脑'}>
          <Button
            type="text"
            danger
            icon={<PoweroffOutlined />}
            disabled={record.status !== 'online'}
            onClick={() => handleShutdown(record)}
          >
            关机
          </Button>
        </Tooltip>
      ),
    },
  ];

  const fetchComputers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('computers')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setComputers(data || []);
    } catch (error) {
      console.error('Error fetching computers:', error);
      message.error('获取电脑列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 执行关机流程
  const executeShutdown = async (computer: Computer) => {
    const instance = modal.info({
      title: '关机进度',
      content: '正在发送关机指令...',
      icon: <PoweroffOutlined />,
      okButtonProps: { style: { display: 'none' } },
      maskClosable: false,
    });
    // 延时后发送指令
    await new Promise(resolve => setTimeout(resolve, 1500));

    const { error } = await supabase
      .from('computers')
      .update({ 
        status: 'shutting_down',
        updated_at: new Date().toISOString(),
      })
      .eq('id', computer.id);

    if (error) throw error;

    // 更新为关机中状态
    instance.update({
      title: '关机进度',
      content: `正在关机...`,
      icon: <PoweroffOutlined spin />,
    });

    // 监听状态变化
    const subscription = supabase
      .channel(`computer-status-${computer.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'computers',
        filter: `id=eq.${computer.id}`,
      }, async (payload) => {
        const updatedComputer = payload.new as Computer;
        if (updatedComputer.status === 'offline') {
          try {
            instance.update({
              title: '关机完成',
              content: `${computer.name} 已成功关机`,
              icon: <PoweroffOutlined style={{ color: '#52c41a' }} />,
            });
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            instance.destroy();
          } finally {
            subscription.unsubscribe();
          }
        }
      })
      .subscribe();
  };

  const handleShutdown = (computer: Computer) => {
    modal.confirm({
      title: '确认关机',
      content: `确定要关闭 ${computer.name} 吗？`,
      okText: '确认关机',
      cancelText: '取消',
      onOk: async (close) => {
        close();
        executeShutdown(computer);
      },
    });
  };

  useEffect(() => {
    // 初始加载
    fetchComputers();

    // 设置实时状态更新
    const channel = supabase
      .channel('computer_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'computers',
        },
        () => {
          fetchComputers();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="p-6">
      <Card styles={{ body: { padding: 0, overflow: 'auto' } }}>
        <Table
          columns={columns}
          dataSource={computers}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: 800 }}
        />
      </Card>
      {contextHolder}
    </div>
  );
}
