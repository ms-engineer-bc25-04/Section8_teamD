# まちづくりクラウドファンディングAPI

## プロジェクト概要

このアプリは「地域のまちづくりプロジェクト」を対象とした投票型クラウドファンディングAPIです。  
金融API（GMOあおぞら銀行 OpenAPI）との連携により、仮想的な送金・残高取得など**実務に近いエンタープライズAPI設計／開発経験**を積むために個人実装しました。

- **ユーザー認証**: Firebase Authentication
- **データ永続化**: MySQL + Prisma ORM
- **API設計**: Node.js（Express）
- **外部API連携**: 銀行API（GMOあおぞらネット銀行 OpenAPI）
- **初期データ投入**: seedスクリプトによる自動化

---

## 技術スタック・工夫ポイント

- **TypeScript/JavaScriptベースのバックエンド開発**
- **Prisma ORM** による型安全なDBアクセス・スキーマ管理
- **実在の銀行API仕様**を想定したAPI連携実装
- **.env管理によるセキュアなキー管理・環境分離**
- **API仕様書・テストケース例を明記しチーム開発も意識**
- **開発手順・起動方法をREADMEに明記し、第三者も触りやすい構成**

---

## 主なAPI一覧

| メソッド | パス                   | 概要                             |
|----------|-----------------------|----------------------------------|
| GET      | `/api/users`          | ユーザー一覧取得                 |
| GET      | `/api/projects`       | プロジェクト一覧＋状態付与       |
| GET      | `/api/balance`        | ユーザーの銀行口座残高取得       |
| POST     | `/api/vote`           | プロジェクトへの投票（送金処理） |

---

## データベース設計

**Prisma Schema/ER図あり（別ファイル）**

- ユーザー・プロジェクト・投票（送金履歴）テーブルで構成
- 主要カラム例：
    - ユーザー: id（Firebase UID）、口座番号、支店コード、アクセストークン
    - プロジェクト: 金額目標・現状・期限・プロジェクト用口座番号 など

---

## 環境構築・起動手順

1. `.env` ファイルを以下のように用意

    ```env
    DATABASE_URL="mysql://root:pass1234@localhost:3306/minmachi_db"
    USER1_TOKEN=（ユーザー1のアクセストークン）
    USER2_TOKEN=（ユーザー2のアクセストークン）
    USER3_TOKEN=（ユーザー3のアクセストークン）
    FIREBASE_PROJECT_ID=xxxx
    FIREBASE_CLIENT_EMAIL=xxxx
    FIREBASE_PRIVATE_KEY="xxxx"
    ```

2. パッケージ導入・DBセットアップ

    ```bash
    npm install
    npx prisma migrate dev --name init
    node prisma/seed.js
    ```

3. サーバー起動

    ```bash
    node index.js
    # または nodemon index.js
    ```

4. APIテスト

    - [GET] `/api/balance?user_id=user_001`
    - [POST] `/api/vote`  
      ```json
      {
        "userId": "user_001",
        "projectId": "project_001",
        "amount": 20000
      }
      ```

---

## 成果・アピールポイント

- **API連携・セキュリティ・環境構築自動化の実務経験を再現**
- チームコラボ・DB設計レビュー・環境共有も想定したREADME/seed/ER図を作成
- **第三者（エンジニア）がclone後すぐに動かせるよう配慮**
- コード・DB・API仕様書も含め、**「他者に伝える力・保守性」**を意識

---

## 備考

- 本リポジトリはサーバーサイドのみ（フロントエンドは別リポジトリ）
- **本物の銀行APIを模したサンドボックス環境を利用し、実務の疑似体験**
- ご質問・技術詳細説明など歓迎です

---


## ライセンス

MIT


