/**
 * Node 上で共有マッチャのユニットテストを実行する。
 * chrome API は使わない。
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

function loadShared() {
  const root = path.join(__dirname, "..");
  const sandbox = { globalThis: {} };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  for (const file of ["shared/defaults.js", "shared/matcher.js"]) {
    const code = fs.readFileSync(path.join(root, file), "utf8");
    vm.runInContext(code, sandbox, { filename: file });
  }
  return sandbox.ColorizeUI;
}

const {
  hostnameMatchesPattern,
  isWatchedDomain,
  detectEnvironment,
  DEFAULT_SETTINGS,
} = loadShared();

assert.strictEqual(hostnameMatchesPattern("dev.example.com", ["dev"]), true);
assert.strictEqual(hostnameMatchesPattern("api-stg.example.com", ["stg"]), true);
assert.strictEqual(hostnameMatchesPattern("myapp.local", ["local"]), true);
assert.strictEqual(hostnameMatchesPattern("prd.example.com", ["prd"]), true);
assert.strictEqual(hostnameMatchesPattern("developer.example.com", ["dev"]), false);
assert.strictEqual(hostnameMatchesPattern("example.com", ["dev"]), false);

assert.strictEqual(isWatchedDomain("dev.example.com", []), false);
assert.strictEqual(isWatchedDomain("dev.example.com", ["example.com"]), true);
assert.strictEqual(isWatchedDomain("evil.com", ["example.com"]), false);
assert.strictEqual(isWatchedDomain("example.com.evil.com", ["example.com"]), false);

const settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
settings.domains = ["example.com"];

assert.strictEqual(
  detectEnvironment("dev.example.com", settings).env.label,
  "DEV"
);
assert.strictEqual(
  detectEnvironment("api-stg.example.com", settings).env.label,
  "STG"
);
assert.strictEqual(
  detectEnvironment("prd.example.com", settings).env.label,
  "PROD"
);
assert.strictEqual(
  detectEnvironment("prod.example.com", settings).env.label,
  "PROD"
);

// prefix なし → PROD（赤）
assert.strictEqual(detectEnvironment("example.com", settings).env.label, "PROD");
assert.strictEqual(detectEnvironment("www.example.com", settings).env.label, "PROD");
assert.strictEqual(detectEnvironment("app.example.com", settings).env.label, "PROD");
assert.strictEqual(detectEnvironment("example.com", settings).env.color, "#dc2626");

assert.strictEqual(detectEnvironment("dev.other.com", settings).matched, false);

// ドメイン未設定時は色付けしない
const noDomains = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
noDomains.domains = [];
assert.strictEqual(detectEnvironment("dev.example.com", noDomains).matched, false);
assert.strictEqual(detectEnvironment("example.com", noDomains).matched, false);

settings.enabled = false;
assert.strictEqual(detectEnvironment("dev.example.com", settings).matched, false);
assert.strictEqual(detectEnvironment("example.com", settings).matched, false);

console.log("All matcher tests passed.");
