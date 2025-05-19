import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "用户名或密码不能为空" }, { status: 400 });
    }

    // 查询用户
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .limit(1);

    if (error) throw error;
    if (!users || users.length === 0) {
      return NextResponse.json({ error: "用户不存在" }, { status: 401 });
    }

    const user = users[0];

    // 验证密码
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "密码错误" }, { status: 401 });
    }

    // 登录成功
    return NextResponse.json({ message: "登录成功", user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error("登录接口错误:", err);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
