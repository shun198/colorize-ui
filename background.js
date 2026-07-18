importScripts("shared/defaults.js");

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason !== "install") return;
  const { STORAGE_KEY, DEFAULT_SETTINGS } = globalThis.ColorizeUI;
  const current = await chrome.storage.sync.get(STORAGE_KEY);
  if (!current[STORAGE_KEY]) {
    await chrome.storage.sync.set({
      [STORAGE_KEY]: JSON.parse(JSON.stringify(DEFAULT_SETTINGS)),
    });
  }
});
