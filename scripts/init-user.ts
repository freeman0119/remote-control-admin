import bcrypt from "bcrypt";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);
async function initUser() {
  const username = process.env.USER_NAME;
  const password = process.env.PASSWORD;

  const passwordHash = await bcrypt.hash(password, 10);
  const { data, error } = await supabase.from("users").insert([
    {
      username,
      password: passwordHash,
    },
  ]);

  if (error) {
    console.error("❌ 插入失败:", error.message);
  } else {
    console.log("✅ 用户已添加:", data);
  }
}

initUser();
