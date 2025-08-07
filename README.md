# まちづくりクラウドファンディングアプリ

**投票型クラウドファンディング（金融API連携）アプリ**  
Firebase認証＋GMOあおぞら銀行API＋MySQL＋Prisma＋Express構成

---

## 概要

- ユーザーが「まちづくりプロジェクト」に**投票（仮想通貨送金）**できるWebアプリです。
- 銀行API（GMOあおぞらネット銀行API）と連携し、**口座残高の取得・送金処理**を実現しています。
- フロントエンド（Next.js/React等）は別リポジトリ。

---

## 技術スタック

- **Node.js (Express)**
- **Prisma ORM**
- **MySQL（ローカル or Docker）**
- **Firebase Authentication**
- **GMOあおぞら銀行 OpenAPI**  
- Postman（APIテスト用）

---

## セットアップ手順

### 1. .env 設定例

```env
DATABASE_URL="mysql://root:pass1234@localhost:3306/minmachi_db"
USER1_TOKEN=OTU5ZGIxYTcxYjBhNjc0ZWE0MzgxMzEw
USER2_TOKEN=NTE2NzJiNzg0Zjc5MTM2YjgwNzY5NmFj
USER3_TOKEN=ODBiOTdmN2I5MTllNDg1Mzk3MDcyMTI3
FIREBASE_PROJECT_ID=xxxx
FIREBASE_CLIENT_EMAIL=xxxx
FIREBASE_PRIVATE_KEY="xxxx"

2. パッケージインストール
```npm install

