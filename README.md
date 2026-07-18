# Colorize UI

指定したドメイン配下の hostname に `dev` / `stg` などの環境キーワードがあるとき、ページUIに色付きの枠線とバナーを付けて環境を一目で判別できる Chrome 拡張機能（Manifest V3）です。

## できること

- 監視ドメインを指定（空欄なら全ドメイン）
- hostname のラベル境界で環境キーワードを検出
  - 例: `dev.example.com`, `api-stg.example.com`, `myapp.local`
- 環境ごとに色・ラベル・キーワードをカスタム可能
- バナー / 枠線の表示切替

## デフォルトの環境ルール

| 環境 | キーワード | 色 |
| --- | --- | --- |
| LOCAL | `local`, `localhost` | 青 |
| DEV | `dev`, `develop`, `development` | オレンジ |
| STG | `stg`, `stage`, `staging` | 黄 |
| QA | `qa`, `test`, `testing` | ティール |

判定は上から順です。

## インストール（開発者モード）

1. Chrome で `chrome://extensions` を開く
2. 「デベロッパーモード」をオン
3. 「パッケージ化されていない拡張機能を読み込む」
4. このリポジトリのルート（`manifest.json` があるフォルダ）を選択

## 使い方

1. 拡張機能アイコンをクリック
2. 監視ドメインを入力（例: `example.com`）して保存
3. `dev.example.com` や `stg.example.com` を開くと枠線とバナーが表示される
4. 色やキーワードの追加は「詳細設定」から

## ディレクトリ構成

```
manifest.json
background.js
content/          # ページへの枠線・バナー注入
popup/            # クイック設定
options/          # 詳細設定
shared/           # 設定・マッチング共通ロジック
icons/
```

## 補足

- バナー右上の × で、そのタブのセッション中だけバナーを非表示にできます（枠線は残ります）
- `chrome.storage.sync` に設定を保存するため、同一 Google アカウントなら端末間で同期されます
