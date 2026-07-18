(() => {
  const ROOT_ID = "colorize-ui-root";
  const DISMISS_KEY = "colorize-ui-dismissed";
  const { detectEnvironment, loadSettings } = globalThis.ColorizeUI;

  let rootEl = null;
  let borderEl = null;
  let bannerEl = null;
  let labelEl = null;
  let hostEl = null;

  function sessionDismissed(envId) {
    try {
      return sessionStorage.getItem(`${DISMISS_KEY}:${envId}`) === "1";
    } catch {
      return false;
    }
  }

  function dismissBanner(envId) {
    try {
      sessionStorage.setItem(`${DISMISS_KEY}:${envId}`, "1");
    } catch {
      /* ignore */
    }
    if (bannerEl) bannerEl.hidden = true;
  }

  function ensureUi() {
    if (rootEl && document.documentElement.contains(rootEl)) return;

    rootEl = document.createElement("div");
    rootEl.id = ROOT_ID;
    rootEl.setAttribute("data-active", "false");

    borderEl = document.createElement("div");
    borderEl.id = "colorize-ui-border";

    bannerEl = document.createElement("div");
    bannerEl.id = "colorize-ui-banner";

    labelEl = document.createElement("span");
    labelEl.className = "colorize-ui-label";

    hostEl = document.createElement("span");
    hostEl.className = "colorize-ui-host";

    const dismiss = document.createElement("button");
    dismiss.id = "colorize-ui-dismiss";
    dismiss.type = "button";
    dismiss.setAttribute("aria-label", "バナーを閉じる");
    dismiss.textContent = "×";
    dismiss.addEventListener("click", () => {
      const envId = rootEl?.dataset.envId || "unknown";
      dismissBanner(envId);
    });

    bannerEl.append(labelEl, hostEl, dismiss);
    rootEl.append(borderEl, bannerEl);
    document.documentElement.appendChild(rootEl);
  }

  function clearUi() {
    if (!rootEl) return;
    rootEl.setAttribute("data-active", "false");
    delete rootEl.dataset.envId;
  }

  function applyUi(settings, env) {
    ensureUi();
    rootEl.setAttribute("data-active", "true");
    rootEl.dataset.envId = env.id;
    rootEl.style.setProperty("--colorize-ui-color", env.color);
    rootEl.style.setProperty(
      "--colorize-ui-border-width",
      `${Number(settings.borderWidth) || 6}px`
    );

    borderEl.style.display = settings.showBorder === false ? "none" : "block";

    const showBanner = settings.showBanner !== false && !sessionDismissed(env.id);
    bannerEl.hidden = !showBanner;
    labelEl.textContent = env.label || env.id;
    hostEl.textContent = location.hostname;
  }

  async function refresh() {
    const settings = await loadSettings();
    const { matched, env } = detectEnvironment(location.hostname, settings);
    if (!matched || !env) {
      clearUi();
      return;
    }
    applyUi(settings, env);
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes[globalThis.ColorizeUI.STORAGE_KEY]) {
      refresh();
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", refresh, { once: true });
  } else {
    refresh();
  }
})();
