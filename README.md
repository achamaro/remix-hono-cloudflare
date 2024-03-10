# Remix + Hono + Cloudflare Workers

## Environment Variables

| 環境変数            | 説明                          | 備考                            |
| ------------------- | ----------------------------- | ------------------------------- |
| MAIL_FROM           | 送信元メールアドレス          |                                 |
| MAIL_TO             | 送信先メールアドレス          |                                 |
| BASIC_AUTH_USERNAME | Basic認証のユーザー名         | Basic認証が有効にする場合に設定 |
| BASIC_AUTH_PASSWORD | Basic認証のパスワード         | Basic認証が有効にする場合に設定 |
| ADMIN_JWT_SECRET    | 管理画面認証用JWTシークレット | 例: `openssl rand -hex 32`      |
| ADMIN_CREDENTIALS   | 管理者の認証情報              | `{login_id}={password}`         |
| MAILTRAP_API_TOKEN  | Mailtrap APIトークン          | ローカル環境でのメール送信用    |
| MAILTRAP_INBOX_ID   | Mailtrap inbox ID             | ローカル環境でのメール送信用    |
| DKIM_KEY            | DKIM秘密鍵                    | Workers環境のMailChannels用     |

## Development

1. `.env.sample` を元に `.dev.vars` を作成する
2. 開発環境起動
   ```sh
   npm run dev
   ```

## Deployment

Github Actions でブランチごとに対応する環境にデプロイされる。

事前に対応するR2バケットを作成しておく。

| ブランチ名 | デプロイ先                       | R2                               |
| ---------- | -------------------------------- | -------------------------------- |
| main       | remix-cloudflare-workers         | remix-cloudflare-workers         |
| develop    | remix-cloudflare-workers-staging | remix-cloudflare-workers-staging |
