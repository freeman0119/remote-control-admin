"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

type LoginData = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data: LoginData) => {
    setLoading(true);
    setError("");
    const { username, password } = data;
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success("登录成功");
        router.push("/");
      } else {
        toast.error(result.error || "登录失败");
      }
    } catch (error: any) {
      toast.error(error.message || "登录失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-tr from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      <Toaster richColors position="top-center" />
      <div
        className="hidden md:flex flex-1 items-center justify-center bg-black bg-opacity-60"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-lg text-center px-6">
          <h1
            className="text-6xl font-extrabold text-cyan-400 tracking-wide drop-shadow-lg"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            WELCOME BACK
          </h1>
        </div>
      </div>

      {/* 右侧登录表单 */}
      <div className="flex flex-col flex-1 justify-center px-12 py-16 sm:px-24 bg-[#111827] shadow-lg rounded-l-3xl">
        <Card className="max-w-md w-full bg-[#1f2937] shadow-xl rounded-3xl">
          <CardContent className="p-10 space-y-8">
            <h2
              className="text-4xl font-bold text-cyan-400 tracking-wide"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              登录账户
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
              <div>
                <Label
                  htmlFor="username"
                  className="uppercase text-cyan-300 text-sm tracking-widest font-semibold"
                  style={{ letterSpacing: "0.2em" }}
                >
                  用户名
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="请输入用户名"
                  className="mt-2 bg-[#111827] border border-gray-700 rounded-lg
                    shadow-sm focus:outline-none focus:ring-1 focus:ring-cyan-400
                    focus:border-cyan-400 placeholder:text-gray-500 text-white"
                  {...register("username", { required: "用户名不能为空" })}
                />
                {errors.username && (
                  <p className="text-sm text-red-500 mt-1 font-mono">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="uppercase text-cyan-300 text-sm tracking-widest font-semibold"
                  style={{ letterSpacing: "0.2em" }}
                >
                  密码
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入密码"
                  className="mt-2 bg-[#111827] border border-gray-700 rounded-lg
                    shadow-sm focus:outline-none focus:ring-1 focus:ring-cyan-400
                    focus:border-cyan-400 placeholder:text-gray-500 text-white"
                  {...register("password", { required: "密码不能为空" })}
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1 font-mono">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center font-mono">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-600
                  hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-700/50"
                disabled={loading}
              >
                {loading ? "登录中..." : "登录"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
