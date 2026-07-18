(() => {
  const { DEFAULT_SETTINGS, STORAGE_KEY } = globalThis.ColorizeUI;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  /**
   * 既存設定に不足しているデフォルト環境（特に PROD）を補完する。
   * @param {import('./defaults.js').EnvRule[] | undefined} stored
   */
  function mergeEnvironments(stored) {
    const defaults = clone(DEFAULT_SETTINGS.environments);
    if (!Array.isArray(stored) || stored.length === 0) {
      return defaults;
    }

    const byId = new Map();
    for (const env of stored) {
      if (env && env.id) byId.set(env.id, env);
    }

    const merged = stored.map((env) => ({ ...env }));
    for (const def of defaults) {
      if (!byId.has(def.id)) {
        merged.push(def);
      } else if (def.fallback && byId.get(def.id).fallback == null) {
        const idx = merged.findIndex((e) => e.id === def.id);
        if (idx >= 0) {
          merged[idx] = { ...merged[idx], fallback: true };
        }
      }
    }
    return merged;
  }

  async function loadSettings() {
    const data = await chrome.storage.sync.get(STORAGE_KEY);
    const stored = data[STORAGE_KEY];
    if (!stored || typeof stored !== "object") {
      return clone(DEFAULT_SETTINGS);
    }
    return {
      ...clone(DEFAULT_SETTINGS),
      ...stored,
      environments: mergeEnvironments(stored.environments),
      domains: Array.isArray(stored.domains) ? stored.domains : [],
    };
  }

  async function saveSettings(settings) {
    await chrome.storage.sync.set({ [STORAGE_KEY]: settings });
  }

  async function resetSettings() {
    const next = clone(DEFAULT_SETTINGS);
    await chrome.storage.sync.set({ [STORAGE_KEY]: next });
    return next;
  }

  Object.assign(globalThis.ColorizeUI, {
    loadSettings,
    saveSettings,
    resetSettings,
    mergeEnvironments,
  });
})();
