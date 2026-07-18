# Colorize UI

確認対象ドメインを指定し、hostname の環境キーワード（`dev` / `stg` など）や **prefix なし = PROD** に応じて、ページUIの色を変える Chrome 拡張機能（Manifest V3）です。

## できること

- **確認対象ドメイン**を Settings / ポップアップで指定
- hostname のラベル境界で環境キーワードを検出
  - 例: `dev.example.com`, `api-stg.example.com`, `prd.example.com`
- **prefix がない場合は PROD（赤）**
  - 例: `example.com`, `www.example.com`, `app.example.com`
- 環境ごとに色・ラベル・キーワードをカスタム可能
- バナー / 枠線の表示切替

## デフォルトの環境ルール

| 環境 | キーワード | 色 |
| --- | --- | --- |
| LOCAL | `local`, `localhost` | 青 |
| DEV | `dev`, `develop`, `development` | オレンジ |
| STG | `stg`, `stage`, `staging` | 黄 |
| QA | `qa`, `test`, `testing` | ティール |
| PROD | `prod`, `prd`, `production` / **prefixなし** | 赤 |

判定はキーワードを上から順に見て、どれにも当てはまらない確認対象ドメインは PROD になります。  
ドメイン未設定のあいだは、誤検知を避けるためどのページにも色は付きません。

## インストール（開発者モード）

1. Chrome で `chrome://extensions` を開く
2. 「デベロッパーモード」をオン
3. 「パッケージ化されていない拡張機能を読み込む」
4. このリポジトリのルート（`manifest.json` があるフォルダ）を選択

## 使い方

1. 拡張機能アイコン（または詳細設定）を開く
2. **確認対象ドメイン**を入力（例: `example.com`）して保存
3. 以下のように色分けされます
   - `dev.example.com` → DEV（オレンジ）
   - `stg.example.com` → STG（黄）
   - `example.com` / `www.example.com` → PROD（赤）
4. 色やキーワードの追加は「詳細設定」から

## ディレクトリ構成

```
manifest.json
background.js
content/          # ページへの枠線・バナー注入
popup/            # クイック設定
options/          # 詳細設定（確認対象ドメイン）
shared/           # 設定・マッチング共通ロジック
icons/
```

## 補足

- バナー右上の × で、そのタブのセッション中だけバナーを非表示にできます（枠線は残ります）
- `chrome.storage.sync` に設定を保存するため、同一 Google アカウントなら端末間で同期されます
- ユニットテスト: `node test/matcher.test.js`
