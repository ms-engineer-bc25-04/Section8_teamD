"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockUsers } from "./mocks/user";

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/home");
    } else {
      alert("メールアドレスまたはパスワードが違います");
    }
  };
  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-50">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-xl font-bold text-center mb-4">
          みんまちプロジェクト
        </h1>
        <p className="text-center mb-4 text-sm text-gray-600">
          興味があるプロジェクトに投資しよう💶
        </p>

        <input
          type="email"
          placeholder="メールアドレスを入力"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border rounded w-full p-2 mb-4"
        />

        <input
          type="password"
          placeholder="パスワードを入力"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border rounded w-full p-2 mb-4"
        />

        <button
          className="w-full bg-gray-500 text-white p-2 rounded"
          onClick={handleLogin}
        >
          ログイン
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
