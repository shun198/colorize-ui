(() => {
  const { loadSettings, saveSettings, detectEnvironment } = globalThis.ColorizeUI;

  const els = {
    enabled: document.getElementById("enabled"),
    domains: document.getElementById("domains"),
    showBanner: document.getElementById("show-banner"),
    showBorder: document.getElementById("show-border"),
    save: document.getElementById("save"),
    openOptions: document.getElementById("open-options"),
    statusTitle: document.getElementById("status-title"),
    statusDetail: document.getElementById("status-detail"),
    swatch: document.getElementById("swatch"),
    toast: document.getElementById("toast"),
  };

  /** @type {import('../shared/defaults.js').Settings} */
  let settings;

  function domainsToText(domains) {
    return (domains || []).join("\n");
  }

  function textToDomains(text) {
    return String(text || "")
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  async function getActiveHostname() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.url) return null;
    try {
      return new URL(tab.url).hostname;
    } catch {
      return null;
    }
  }

  function renderStatus(hostname) {
    if (!hostname) {
      els.swatch.hidden = true;
      els.statusTitle.textContent = "対象外のページ";
      els.statusDetail.textContent = "http(s) ページで判定します";
      return;
    }

    const { matched, env } = detectEnvironment(hostname, settings);
    if (!settings.enabled) {
      els.swatch.hidden = true;
      els.statusTitle.textContent = "無効";
      els.statusDetail.textContent = hostname;
      return;
    }
    if (!(settings.domains || []).length) {
      els.swatch.hidden = true;
      els.statusTitle.textContent = "ドメイン未設定";
      els.statusDetail.textContent = "確認対象ドメインを入力して保存";
      return;
    }
    if (matched && env) {
      els.swatch.hidden = false;
      els.swatch.style.background = env.color;
      els.statusTitle.textContent = `${env.label} 環境を検出`;
      els.statusDetail.textContent = hostname;
      return;
    }
    els.swatch.hidden = true;
    els.statusTitle.textContent = "確認対象外のドメイン";
    els.statusDetail.textContent = hostname;
  }

  function fillForm() {
    els.enabled.checked = !!settings.enabled;
    els.domains.value = domainsToText(settings.domains);
    els.showBanner.checked = settings.showBanner !== false;
    els.showBorder.checked = settings.showBorder !== false;
  }

  async function init() {
    settings = await loadSettings();
    fillForm();
    const hostname = await getActiveHostname();
    renderStatus(hostname);
  }

  els.save.addEventListener("click", async () => {
    const domains = textToDomains(els.domains.value);
    settings = {
      ...settings,
      enabled: els.enabled.checked,
      domains,
      showBanner: els.showBanner.checked,
      showBorder: els.showBorder.checked,
    };
    await saveSettings(settings);
    const hostname = await getActiveHostname();
    renderStatus(hostname);
    els.toast.hidden = false;
    els.toast.textContent = domains.length
      ? "保存しました"
      : "保存しました（ドメイン未設定のため色付けなし）";
    setTimeout(() => {
      els.toast.hidden = true;
    }, 1400);
  });

  els.enabled.addEventListener("change", async () => {
    settings.enabled = els.enabled.checked;
    await saveSettings(settings);
    const hostname = await getActiveHostname();
    renderStatus(hostname);
  });

  els.openOptions.addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });

  init();
})();
