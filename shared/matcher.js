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
   * 指定ドメイン配下かどうか。
   * @param {string} hostname
   * @param {string[]} domains
   */
  function isWatchedDomain(hostname, domains) {
    if (!domains || domains.length === 0) return false;
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
   * @param {import('./defaults.js').EnvRule[]} environments
   */
  function findFallbackEnv(environments) {
    return (
      environments.find((e) => e && e.enabled !== false && e.fallback) || null
    );
  }

  /**
   * @param {string} hostname
   * @param {import('./defaults.js').Settings} settings
   */
  function detectEnvironment(hostname, settings) {
    if (!settings?.enabled) {
      return { matched: false, env: null };
    }

    const domains = settings.domains || [];
    const hasDomains = domains.some((d) => String(d || "").trim());
    // 確認対象ドメイン未設定時は色付けしない（誤って全サイトを PROD 赤にしない）
    if (!hasDomains || !isWatchedDomain(hostname, domains)) {
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

    // prefix なし（例: example.com / www.example.com / app.example.com）→ PROD
    const fallback = findFallbackEnv(envs);
    if (fallback) {
      return { matched: true, env: fallback };
    }

    return { matched: false, env: null };
  }

  globalThis.ColorizeUI = globalThis.ColorizeUI || {};
  Object.assign(globalThis.ColorizeUI, {
    hostnameMatchesPattern,
    isWatchedDomain,
    detectEnvironment,
    findFallbackEnv,
  });
})();
