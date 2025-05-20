"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarMenu } from "@/config/sidebarMenu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

interface User {
  username: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    fetch("/api/logout", { method: "POST" }).then((res) => {
      if (res.ok) {
        setUser(null);
        toast.success("已登出");
        router.push("/login");
      }
    });
  };

  useEffect(() => {
    fetch("/api/user").then(async (res) => {
      const result = await res.json();
      setUser(result.user);
    });
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Toaster position="top-center" richColors />
      {/* Header */}
      <header className="h-14 bg-gray-900 text-white flex items-center justify-between px-6 shadow">
        <h1 className="text-xl font-bold">后台管理系统</h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <Image
                src="https://avatars.githubusercontent.com/u/9919?s=64" // GitHub logo 头像
                alt="Avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-sm">{user?.username}</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={handleLogout}>退出登录</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-60 bg-white border-r shadow-sm">
          <ScrollArea className="h-full">
            <nav className="flex flex-col p-4 space-y-1">
              {sidebarMenu.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={clsx(
                    "px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition",
                    pathname === item.path
                      ? "bg-gray-200 text-black"
                      : "text-gray-600"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </ScrollArea>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
