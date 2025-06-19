"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

type Project = {
  id: string;
  name: string;
  description: string;
  goal_amount: number;
  current_amount: number;
  deadline: string;
  status?: string;
};

function InvestPage() {
  const { projectId } = useParams();
  const router = useRouter();

  const [user, setUser] = useState<{ email: string; displayName: string | null; balance: number } | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Firebase認証＋ユーザー情報取得
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (fbUser) => {
      if (!fbUser) {
        router.push("/");
        return;
      }
      // 残高もAPIから取る場合はここでfetch
      setUser({
        email: fbUser.email ?? "",
        displayName: fbUser.displayName,
        balance: 40000, // 仮：あとでAPIから取得する形に
      });
    });

    return () => unsubscribe();
  }, [router]);

  // プロジェクト情報をAPIから取得
  useEffect(() => {
    fetch("http://localhost:3001/api/projects")
      .then((res) => res.json())
      .then((projects) => {
        const target = projects.find((p: Project) => p.id === projectId);
        setProject(target ?? null);
      })
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) return <div>読み込み中...</div>;
  if (!user) return <div>認証エラー</div>;
  if (!project) return <div>プロジェクトが見つかりません</div>;

  const handleInvest = async () => {
    if (!user || amount === 0 || amount > user.balance) {
      alert("金額が正しくありません");
      return;
    }

    // 投票APIを叩く（要サーバーAPI実装）
    try {
      // Firebaseのトークン取得
      const token = await auth.currentUser?.getIdToken();
      // 投票APIコール（認証付き）
      const res = await fetch("http://localhost:3001/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId: project.id,
          amount: amount,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "送金失敗");

      alert(`${project.name}に${amount.toLocaleString()}円を投票しました！`);
      router.push("/home");
    } catch (e: any) {
      alert("投票処理でエラー:" + e.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto flex gap-6">
        <div className="flex-1 bg-white rounded shadow p-6">
          <h2 className="text-lg font-bold mb-2">{project.name}</h2>
          <p className="text-gray-600 mb-4">{project.description}</p>
          <p className="mb-1">
            目標金額：
            <span className="font-bold">{project.goal_amount.toLocaleString()}円</span>
          </p>
          <p className="mb-1">
            現在の達成額
            <span className="text-green-600 font-bold">{project.current_amount.toLocaleString()}円</span>
          </p>
          <p>
            残り必要額:
            <span className="text-blue-600 font-bold">
              {(project.goal_amount - project.current_amount).toLocaleString()}円
            </span>
          </p>
        </div>

        <div className="flex-1 bg-white rounded shadow p-6">
          <h3 className="text-lg font-bold mb-4">投票金額を選択</h3>
          <p className="mb-2">
            あなたの残高: <span>{user.balance.toLocaleString()}円</span>
          </p>
          <p className="mb-2">投票金額を選択してください:</p>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {[20000, 40000, 60000, 80000, 100000].map((value) => (
              <button
                key={value}
                className={`border rounded py-2 ${amount === value ? "bg-green-200 font-bold" : ""}`}
                onClick={() => setAmount(value)}
                disabled={value > user.balance}
              >
                {value.toLocaleString()}円
              </button>
            ))}
          </div>

          <button
            className="w-full bg-gray-500 text-white py-2 rounded disabled:opacity-50"
            onClick={handleInvest}
            disabled={amount === 0 || amount > user.balance}
          >
            {amount.toLocaleString()}円を投票する
          </button>
        </div>
      </div>
    </div>
  );
}

export default InvestPage;
