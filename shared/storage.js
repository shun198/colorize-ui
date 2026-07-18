(() => {
  const { DEFAULT_SETTINGS, STORAGE_KEY } = globalThis.ColorizeUI;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
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
      environments:
        Array.isArray(stored.environments) && stored.environments.length > 0
          ? stored.environments
          : clone(DEFAULT_SETTINGS.environments),
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
  });
})();
