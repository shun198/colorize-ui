(() => {
  /** @typedef {{ id: string, label: string, patterns: string[], color: string, enabled: boolean }} EnvRule */
  /** @typedef {{ enabled: boolean, domains: string[], showBanner: boolean, showBorder: boolean, borderWidth: number, environments: EnvRule[] }} Settings */

  /** @type {Settings} */
  const DEFAULT_SETTINGS = {
    enabled: true,
    // 空の場合は全ドメインが対象。指定するとそのドメイン配下のみ色変更する。
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
    ],
  };

  const STORAGE_KEY = "settings";

  globalThis.ColorizeUI = globalThis.ColorizeUI || {};
  globalThis.ColorizeUI.DEFAULT_SETTINGS = DEFAULT_SETTINGS;
  globalThis.ColorizeUI.STORAGE_KEY = STORAGE_KEY;
})();
