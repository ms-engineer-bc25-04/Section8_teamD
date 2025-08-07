

GMOあおぞら銀行API・AWS（Lambda, DynamoDB）・LINE Messaging API を活用して開発された、Fintech体験型のLINE Botアプリです。ユーザーはLINE上から銀行APIにアクセスし、残高照会や取引履歴の取得などの操作が可能です。

## 📌 概要

本アプリは以下の技術を組み合わせたチャットボットシステムです：

- LINE Messaging API：ユーザーインターフェース
- AWS Lambda：ビジネスロジックの処理
- DynamoDB：ユーザーデータやログの保存
- GMOあおぞら銀行API：口座情報や取引データの取得

ユーザーはLINEを通じて銀行口座の残高や履歴の確認、デモ送金などの操作ができます。

---

## 🏗️ アーキテクチャ構成

```plaintext
[ユーザー(LINE)]
       ⇅
[LINE Messaging API]
       ⇅
[AWS API Gateway] - (Token認証)
       ⇅
[AWS Lambda 関数群]
       ⇅
[DynamoDB / GMOあおぞら銀行API]


🚀 機能一覧
| 機能        | 概要                             |
| --------- | ------------------------------ |
| 残高確認      | LINEから自身の銀行口座の残高を照会できます        |
| 履歴取得      | 過去の取引履歴をLINE上で確認できます           |
| ユーザー登録    | DynamoDBにユーザー情報を登録し、セッション管理します |
| エラーハンドリング | 絵文字などを活用して、処理ステータスを可視化         |


🛠️ 使用技術
言語・フレームワーク:

TypeScript / Node.js（Lambda）

Python（ログ分析などの補助ツール）

データベース:

AWS DynamoDB

認証・API:

OAuth2（銀行API用）

JWT（ユーザー認証）

インフラ・ツール:

AWS Lambda / API Gateway / CloudWatch

GitHub / GitHub Actions

🔧 セットアップ手順
1. LINE Developer Consoleの設定
チャネル作成

チャネルアクセストークン／シークレット取得

Webhook URL に API Gateway エンドポイントを設定

2. 環境変数の設定
.env または Lambda 環境変数に以下を定義：

LINE_CHANNEL_SECRET=xxx
LINE_CHANNEL_ACCESS_TOKEN=xxx
GMO_CLIENT_ID=xxx
GMO_CLIENT_SECRET=xxx
REDIRECT_URI=https://...

3. DynamoDB テーブル構成（例）
Users：

userId（PK）

accessToken

refreshToken

createdAt

Logs：

id（PK）

userId

action

timestamp

4. デプロイ方法
# zip化してデプロイ
zip -r function.zip .
aws lambda update-function-code --function-name your-lambda-name --zip-file fileb://function.zip



📝 学び・工夫ポイント
エラー状態を絵文字でわかりやすく表現

CloudWatchでログを確認しながら段階的にデバッグ

LINE⇄API⇄DBの三者連携によるデータフロー構築

GitHubでのチーム開発（ブランチ戦略・PRレビュー）

💬 今後の改善案
OAuthトークンのリフレッシュ機能

複数口座への対応

より詳細なログ可視化（LINE通知ログ）

📄 ライセンス
MIT License
