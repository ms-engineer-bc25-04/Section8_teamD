# みんまちプロジェクト（Minmachi Project）

## 🏙️ プロジェクト概要

「みんまちプロジェクト」は、地域住民が自分の町の未来を自ら選ぶための**クラウドファンディング型投票アプリ**です。

10万人規模の地方市を想定し、各住民が10万円分の地域通貨を支給され、市が提案するプロジェクト（例：新しい公園、交通インフラ、文化事業など）に2万円単位で投票できます。

投票の裏側にはGMOあおぞらネット銀行のAPI連携を活用し、実際の「残高反映」や「銀行認証」が動作する設計です。

---

## 📱 主な機能

- Firebase Auth によるログイン・認証（銀行と連動）
- 自分の残高確認（あおぞら銀行API）
- プロジェクト一覧表示（目標金額・進捗・締切）
- 投票（資金送付）機能
- 投票後の自動残高更新、プロジェクト達成額更新

---

## 🖼️ 画面構成

- ログインページ（Firebase Authentication）
- ホームページ（残高・プロジェクト一覧表示）
- 投票ページ（投票金額を選んで送信）

---

## 🧑‍💻 担当領域と役割

### ■ フロントエンド（Next.js / Tailwind CSS）

- ページ構成、UIモック作成（ワイヤー：Figma）
- プロジェクト一覧画面・投票画面のモックUI作成
- APIとの接続（残高取得・投票処理）

担当：**あゆみさん**

---

### ■ バックエンド（Node.js / Express / Prisma / MySQL）

- DB設計（ER図、Prismaスキーマ）
- ユーザー・プロジェクト・投資APIの作成（GET/POST）
- sunabar銀行APIとの連携実装（残高取得）

担当：**のりこさん**

---

### ■ インテグレーション・進行管理

- Firebase Auth設計／仮ユーザー作成
- 各システム連携の検証・調整（API接続確認）
- バリデーションやUI体験の改善
- デモ資料・発表スライド作成

担当：**たかえさん**

---

## 🛠️ 使用技術スタック

### ■ フロントエンド  
- Next.js（ページ遷移・構成）
- React（UI構築）
- Tailwind CSS（デザイン）
- Firebase Authentication（ログイン）

### ■ バックエンド  
- Node.js + Express（APIサーバー）
- Prisma（ORM）
- MySQL（データベース）

### ■ 認証・決済・API連携  
- Firebase Auth（ID/PW連携）
- sunabar（あおぞらネット銀行サンドボックスAPI）

### ■ インフラ・開発  
- Docker（MySQL起動用）
- GitHub（コード管理）
- Postman（APIテスト）
- dotenv（環境変数管理）

---

## 📸 デモ画像・キャプチャ（例）

※必要に応じて、以下に画面キャプチャを挿入

---

## 📂 セットアップ方法（ローカル）

```bash
# フロントエンド
cd frontend
npm install
npm run dev

# バックエンド
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev

