"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { mockProjects } from "../../mocks/projects";

function InvestPage() {
  const { projectId } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; balance: number } | null>(
    null
  );
  const [amount, setAmount] = useState(0);

  const project = mockProjects.find((p) => p.id === projectId);

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      setUser(JSON.parse(data));
    } else {
      router.push("/");
    }
  }, []);

  if (!project) return <div>プロジェクトが見つかりません</div>;

  const handleInvest = () => {
    if (!user || amount === 0 || amount > user.balance) {
      alert("金額が正しくありません");
      return;
    }

    user.balance -= amount;
    localStorage.setItem("user", JSON.stringify(user));
    setUser({ ...user });

    alert(`${project.name}に${amount.toLocaleString()}円を投票しました！`);
    router.push("/home");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto flex gap-6">
        <div className="flex-1 bg-white rounded shadow p-6">
          <h2 className="text-lg font-bold mb-2">{project.name}</h2>
          <p className="text-gray-600 mb-4">{project.description}</p>
          <p className="mb-1">
            目標金額：
            <span className="font-bold">
              {project.goal_amount.toLocaleString()}円
            </span>
          </p>
          <p className="mb-1">
            現在の達成額
            <span className="text-green-600 font-bold">
              {project.current_amount.toLocaleString()}円
            </span>
          </p>
          <p>
            残り必要額:
            <span className="text-blue-600 font-bold">
              {(project.goal_amount - project.current_amount).toLocaleString()}
              円
            </span>
          </p>
        </div>

        <div className="flex-1 bg-white rounded shadow p-6">
          <h3 className="text-lg font-bold mb-4">投票金額を選択</h3>
          <p className="mb-2">
            あなたの残高: <span>{user?.balance.toLocaleString()}円</span>
          </p>
          <p className="mb-2">投資金額を選択してください:</p>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {[20000, 40000, 60000, 80000, 100000].map((value) => (
              <button
                key={value}
                className={`border rounded py-2 ${
                  amount === value ? "bg-green-200 font-bold" : ""
                }`}
                onClick={() => setAmount(value)}
                disabled={user ? value > user.balance : true}
              >
                {value.toLocaleString()}円
              </button>
            ))}
          </div>

          <button
            className="w-full bg-gray-500 text-white py-2 rounded disabled:opacity-50"
            onClick={handleInvest}
            disabled={amount === 0 || (user ? amount > user.balance : true)}
          >
            {amount.toLocaleString()}円を投票する
          </button>
        </div>
      </div>
    </div>
  );
}
export default InvestPage;
