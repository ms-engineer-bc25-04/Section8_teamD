"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockUsers } from "./mocks/user";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); //エラー表示用

  const handleLogin = async () => {
    try {
      //Firebaseでログイン
      await signInWithEmailAndPassword(auth, email, password);

      //成功したらホーム画面へ
      router.push("/home");
    } catch (err: any) {
      //エラーを分かりやすく表示
      if (err.code === "auth/user-not-found") {
        setError("ユーザーが見つかりません");
      } else if (err.code === "auth/wrong-password") {
        setError("パスワードが間違っています");
      } else {
        setError("ログインに失敗しました:" + err.message);
      }
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
