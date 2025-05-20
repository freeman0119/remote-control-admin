"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const data = [
  { id: 1, name: "电脑A", status: "online", ip: "192.168.1.2" },
  { id: 2, name: "电脑B", status: "offline", ip: "192.168.1.3" },
  { id: 3, name: "电脑C", status: "maintain", ip: "192.168.1.4" },
];

function getStatusBadge(status: string) {
  const map = {
    online: { label: "在线", variant: "success" },
    offline: { label: "离线", variant: "destructive" },
    maintain: { label: "维护中", variant: "secondary" },
  };
  const item = map[status as keyof typeof map] || {
    label: status,
    variant: "default",
  };
  return <Badge variant={item.variant as any}>{item.label}</Badge>;
}

export default function ComputersPage() {
  const handleShutdown = (id: number) => {
    alert(`发出关机指令给电脑 ID=${id}`);
  };

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">电脑状态列表</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>电脑名</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>IP</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{getStatusBadge(item.status)}</TableCell>
              <TableCell>{item.ip}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleShutdown(item.id)}
                >
                  关机
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
