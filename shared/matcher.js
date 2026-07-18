(() => {
  /**
   * hostname のラベル境界で環境キーワードを検出する。
   * 例: dev.example.com / example-stg.jp / myapp.dev.internal
   * @param {string} hostname
   * @param {string[]} patterns
   */
  function hostnameMatchesPattern(hostname, patterns) {
    const host = hostname.toLowerCase();
    return patterns.some((raw) => {
      const pattern = String(raw || "")
        .trim()
        .toLowerCase();
      if (!pattern) return false;
      if (host === pattern) return true;
      const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(`(^|[.\\-_])${escaped}([.\\-_]|$)`, "i");
      return re.test(host);
    });
  }

  /**
   * 指定ドメイン配下かどうか。domains が空なら全許可。
   * @param {string} hostname
   * @param {string[]} domains
   */
  function isWatchedDomain(hostname, domains) {
    if (!domains || domains.length === 0) return true;
    const host = hostname.toLowerCase();
    return domains.some((raw) => {
      const domain = String(raw || "")
        .trim()
        .toLowerCase()
        .replace(/^\.+/, "");
      if (!domain) return false;
      return host === domain || host.endsWith(`.${domain}`);
    });
  }

  /**
   * @param {string} hostname
   * @param {import('./defaults.js').Settings} settings
   */
  function detectEnvironment(hostname, settings) {
    if (!settings?.enabled) {
      return { matched: false, env: null };
    }
    if (!isWatchedDomain(hostname, settings.domains || [])) {
      return { matched: false, env: null };
    }

    const envs = (settings.environments || []).filter(
      (e) => e && e.enabled !== false
    );
    for (const env of envs) {
      if (hostnameMatchesPattern(hostname, env.patterns || [])) {
        return { matched: true, env };
      }
    }
    return { matched: false, env: null };
  }

  globalThis.ColorizeUI = globalThis.ColorizeUI || {};
  Object.assign(globalThis.ColorizeUI, {
    hostnameMatchesPattern,
    isWatchedDomain,
    detectEnvironment,
  });
})();
