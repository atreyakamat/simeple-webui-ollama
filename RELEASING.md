# OllaDesk Release Guide

## Quick Release (Recommended)

```bash
# 1. Bump versions in package.json, src-tauri/tauri.conf.json, src-tauri/Cargo.toml
# 2. Commit, tag, push:
git add .
git commit -m "Release v1.0.2"
git tag v1.0.2
git push origin main --tags
```

GitHub Actions will automatically build for Windows, macOS, and Linux and create a **Draft Release** with all installers attached.

---

## What the CI Does

The workflow (`.github/workflows/release.yml`) runs on `windows-latest`, `macos-latest`, and `ubuntu-22.04` in parallel.

| Step | Detail |
|---|---|
| Checkout | Full repo clone |
| Node 20 | With npm cache |
| Rust stable | With per-platform target |
| **Rust cache** | `swatinem/rust-cache` — prevents 20min Windows timeouts |
| Linux deps | Tauri v2 packages (webkit2gtk-4.1, libsoup-3.0) |
| `npm ci` | Clean install from lockfile |
| `tauri-action` | Builds + uploads to GitHub Release |

---

## Version Bump Checklist

Before tagging, update the version in **all three** files:

| File | Field |
|---|---|
| `package.json` | `"version"` |
| `src-tauri/tauri.conf.json` | `"version"` |
| `src-tauri/Cargo.toml` | `version` |

---

## Publishing the Release

1. Go to your GitHub repo → **Releases**
2. Find the Draft Release created by CI
3. Review the attached files (`.msi`, `.exe`, `.dmg`, `.AppImage`, `.deb`)
4. Click **Publish release**

Students can then download directly from the Releases page.

> **Reminder**: Students need [Ollama](https://ollama.com/download) installed and running before launching OllaDesk.

---

## Manual Local Build (Optional)

```bash
# macOS
npm run tauri:build
# → src-tauri/target/release/bundle/dmg/OllaDesk_1.0.x_x64.dmg

# Windows (run on Windows machine)
npm run tauri:build
# → src-tauri/target/release/bundle/msi/OllaDesk_1.0.x_x64_en-US.msi
```
