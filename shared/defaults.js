(() => {
  /** @typedef {{ id: string, label: string, patterns: string[], color: string, enabled: boolean, fallback?: boolean }} EnvRule */
  /** @typedef {{ enabled: boolean, domains: string[], showBanner: boolean, showBorder: boolean, borderWidth: number, environments: EnvRule[] }} Settings */

  /** @type {Settings} */
  const DEFAULT_SETTINGS = {
    enabled: true,
    // 確認対象ドメイン。PROD（prefixなし）判定には1件以上の指定が必要。
    domains: [],
    showBanner: true,
    showBorder: true,
    borderWidth: 6,
    environments: [
      {
        id: "local",
        label: "LOCAL",
        patterns: ["local", "localhost"],
        color: "#3b82f6",
        enabled: true,
      },
      {
        id: "dev",
        label: "DEV",
        patterns: ["dev", "develop", "development"],
        color: "#f59e0b",
        enabled: true,
      },
      {
        id: "stg",
        label: "STG",
        patterns: ["stg", "stage", "staging"],
        color: "#eab308",
        enabled: true,
      },
      {
        id: "qa",
        label: "QA",
        patterns: ["qa", "test", "testing"],
        color: "#14b8a6",
        enabled: true,
      },
      {
        id: "prod",
        label: "PROD",
        patterns: ["prod", "prd", "production"],
        color: "#dc2626",
        enabled: true,
        // 監視ドメイン配下で他環境に当てはまらない場合も PROD 扱い
        fallback: true,
      },
    ],
  };

  const STORAGE_KEY = "settings";

  globalThis.ColorizeUI = globalThis.ColorizeUI || {};
  globalThis.ColorizeUI.DEFAULT_SETTINGS = DEFAULT_SETTINGS;
  globalThis.ColorizeUI.STORAGE_KEY = STORAGE_KEY;
})();
