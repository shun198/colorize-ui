(() => {
  const { loadSettings, saveSettings, resetSettings } = globalThis.ColorizeUI;

  const els = {
    enabled: document.getElementById("enabled"),
    showBanner: document.getElementById("show-banner"),
    showBorder: document.getElementById("show-border"),
    borderWidth: document.getElementById("border-width"),
    domains: document.getElementById("domains"),
    envList: document.getElementById("env-list"),
    addEnv: document.getElementById("add-env"),
    save: document.getElementById("save"),
    reset: document.getElementById("reset"),
    toast: document.getElementById("toast"),
    template: document.getElementById("env-row-template"),
  };

  /** @type {import('../shared/defaults.js').Settings} */
  let settings;

  function uid() {
    return `env-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  }

  function showToast(message) {
    els.toast.hidden = false;
    els.toast.textContent = message;
    setTimeout(() => {
      els.toast.hidden = true;
    }, 1400);
  }

  function domainsToText(domains) {
    return (domains || []).join("\n");
  }

  function textToDomains(text) {
    return String(text || "")
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function createEnvRow(env) {
    const node = els.template.content.firstElementChild.cloneNode(true);
    const label = node.querySelector(".env-label");
    const patterns = node.querySelector(".env-patterns");
    const color = node.querySelector(".env-color");
    const enabled = node.querySelector(".env-enabled");
    const remove = node.querySelector(".env-remove");

    node.dataset.id = env.id;
    label.value = env.label || "";
    patterns.value = (env.patterns || []).join(", ");
    color.value = /^#[0-9a-fA-F]{6}$/.test(env.color) ? env.color : "#f59e0b";
    enabled.checked = env.enabled !== false;

    remove.addEventListener("click", () => {
      node.remove();
    });

    return node;
  }

  function renderEnvs() {
    els.envList.replaceChildren();
    for (const env of settings.environments || []) {
      els.envList.appendChild(createEnvRow(env));
    }
  }

  function fillForm() {
    els.enabled.checked = !!settings.enabled;
    els.showBanner.checked = settings.showBanner !== false;
    els.showBorder.checked = settings.showBorder !== false;
    els.borderWidth.value = String(settings.borderWidth ?? 6);
    els.domains.value = domainsToText(settings.domains);
    renderEnvs();
  }

  function readEnvsFromDom() {
    return [...els.envList.querySelectorAll(".env-row")].map((row, index) => {
      const label = row.querySelector(".env-label").value.trim() || `ENV${index + 1}`;
      const patterns = row
        .querySelector(".env-patterns")
        .value.split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean);
      return {
        id: row.dataset.id || uid(),
        label,
        patterns,
        color: row.querySelector(".env-color").value || "#f59e0b",
        enabled: row.querySelector(".env-enabled").checked,
      };
    });
  }

  function readForm() {
    const width = Number(els.borderWidth.value);
    return {
      ...settings,
      enabled: els.enabled.checked,
      showBanner: els.showBanner.checked,
      showBorder: els.showBorder.checked,
      borderWidth: Number.isFinite(width)
        ? Math.min(24, Math.max(2, Math.round(width)))
        : 6,
      domains: textToDomains(els.domains.value),
      environments: readEnvsFromDom(),
    };
  }

  els.addEnv.addEventListener("click", () => {
    els.envList.appendChild(
      createEnvRow({
        id: uid(),
        label: "CUSTOM",
        patterns: ["custom"],
        color: "#ef4444",
        enabled: true,
      })
    );
  });

  els.save.addEventListener("click", async () => {
    settings = readForm();
    if (!settings.environments.length) {
      showToast("環境ルールを1つ以上追加してください");
      return;
    }
    await saveSettings(settings);
    showToast("保存しました");
  });

  els.reset.addEventListener("click", async () => {
    if (!confirm("初期設定に戻しますか？")) return;
    settings = await resetSettings();
    fillForm();
    showToast("初期設定に戻しました");
  });

  async function init() {
    settings = await loadSettings();
    fillForm();
  }

  init();
})();
