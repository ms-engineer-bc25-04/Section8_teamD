"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

// DBから取得するデータ型
type Project = {
  id: string;
  name: string;
  description: string;
  goal_amount: number;
  current_amount: number;
  deadline: string; // ISO形式
  status?: string;  // サーバー側で状態判定済みなら含まれる
};

function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    email: string;
    displayName: string | null;
    balance: number;
  } | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase認証状態＋残高APIをfetch
    const unsubscribe = auth.onAuthStateChanged(async (fbUser) => {
      if (fbUser) {
        // 残高APIを呼ぶ
        
        console.log("✅ ログイン中の Firebase UID:", fbUser.uid);

        const token = await fbUser.getIdToken();
        
        console.log("🔥 getIdToken:", token); // ←★追加

        const balanceRes = await fetch("http://localhost:3001/api/balance", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        
        console.log("🌀 balanceRes:", balanceRes.status); // ←★追加

        const balanceData = await balanceRes.json();
        
        console.log("💰 balanceData:", balanceData); // ←★追加

        setUser({
          email: fbUser.email ?? "",
          displayName: fbUser.displayName,
          balance: balanceData.balance ?? 0,
        });
      } else {
        router.push("/");
      }
    });

    // プロジェクト一覧APIをfetch
    fetch("http://localhost:3001/api/projects")
      .then((res) => {
        if (!res.ok) throw new Error("APIエラー");
        return res.json();
      })
      .then((data) => setProjects(data))
      .catch((err) => {
        alert("プロジェクト一覧の取得に失敗しました");
        setProjects([]);
      })
      .finally(() => setLoading(false));

    return () => unsubscribe();
  }, [router]);

  // ステータスを判定する関数（サーバー側でstatusを付与していればそれを使う）
  const getStatus = (project: Project): string => {
    if (project.status) return project.status;
    const today = new Date();
    const deadline = new Date(project.deadline);
    if (project.current_amount >= project.goal_amount) return "成立";
    if (today > deadline) return "終了";
    return "募集中";
  };

  if (loading) return <div>読み込み中...</div>;

  return (
    <div className="min-h-screen bg-blue-50 p-4 relative">
      {/* 残高表示エリア */}
      <div className="absolute top-4 right-4 bg-white border px-4 py-2 rounded shadow text-sm">
        {user ? (
          <p>
            残高：
            <span className="font-bold text-blue-700">
              {user.balance.toLocaleString()}円
            </span>
          </p>
        ) : (
          <p>読み込み中...</p>
        )}
      </div>

      <h1 className="text-2xl font-bold text-center mb-6">
        ようこそ、{user?.displayName || user?.email}さん！
      </h1>
      <div className="grid gap-4 max-w-3xl mx-auto">
        {projects.length === 0 && (
          <div className="text-center text-gray-500">プロジェクトがありません</div>
        )}
        {projects.map((project) => {
          const status = getStatus(project);
          return (
            <div key={project.id} className="bg-white p-4 rounded shadow">
              <h2>{project.name}</h2>
              <p>{project.description}</p>
              <p>目標金額：{project.goal_amount.toLocaleString()}円</p>
              <p>現在の達成額：{project.current_amount.toLocaleString()}円</p>
              <p>投票締切日：{project.deadline}</p>
              <p className="text-sm mb-2 font-bold">
                状況：<span className="text-blue-600">{status}</span>
              </p>
              <button
                className={`px-4 py-2 rounded text-white ${
                  status !== "募集中"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
                disabled={status !== "募集中"}
                onClick={() => router.push(`/invest/${project.id}`)}
              >
                投票する
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HomePage;
