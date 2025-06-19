"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { mockProjects } from "../mocks/projects";

type Project = {
  id: string;
  name: string; //プロジェクトの名前
  description: string; //プロジェクトの簡単な説明
  goal_amount: number; //目標金額
  current_amount: number; //現在の到達金額
  deadline: string; //投票期限
  //status: string; これは関数で判定できそう
};

function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; balance: number } | null>(
    null
  );
  const [projects, setProjects] = useState(mockProjects);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push("/");
    }
  }, []);

  //ステータスを判定する関数
  const getStatus = (project: Project): string => {
    const today = new Date();
    const deadline = new Date(project.deadline);
    if (project.current_amount >= project.goal_amount) return "成立";
    if (today > deadline) return "終了";
    return "募集中";
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4 relative">
      {/* ←この位置に入れるとOK */}
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
        ようこそ、{user?.name}さん！
      </h1>
      <div className="grid gap-4 max-w-3xl mx-auto">
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
