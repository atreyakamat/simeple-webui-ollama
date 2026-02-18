# OllaDesk Release Guide

Follow these steps to package OllaDesk into a desktop installer and publish it to GitHub for students to download.

## 1. Prepare for Release

Before building, ensure the version numbers match in the configuration files.

1.  **Check `package.json`**:
    ```json
    "version": "1.0.0"
    ```
2.  **Check `src-tauri/tauri.conf.json`**:
    ```json
    "version": "1.0.0"
    ```

## 2. Option A: Manual Release (Local Build)

Use this method if you want to build the installer on your own machine.

### Windows Build (on Windows)
1.  Run the build command:
    ```bash
    npm run tauri:build
    ```
2.  The installers will be generated here:
    `src-tauri/target/release/bundle/msi/OllaDesk_1.0.0_x64_en-US.msi`
    `src-tauri/target/release/bundle/nsis/OllaDesk_1.0.0_x64-setup.exe`

### macOS Build (on Mac)
1.  Run the build command:
    ```bash
    npm run tauri:build
    ```
2.  The installers will be generated here:
    `src-tauri/target/release/bundle/dmg/OllaDesk_1.0.0_x64.dmg`

---

## 3. Option B: Automated Release (GitHub Actions)

This is the **recommended** method. It automatically builds installers for Windows, macOS, and Linux whenever you push a new version tag to GitHub.

### Setup Instructions
1.  Create a file at `.github/workflows/release.yml`.
2.  Paste the following configuration:

```yaml
name: "publish"
on:
  push:
    tags:
      - 'v*'

jobs:
  publish-tauri:
    permissions:
      contents: write
    strategy:
      fail-fast: false
      matrix:
        platform: [macos-latest, ubuntu-22.04, windows-latest]
    runs-on: ${{ matrix.platform }}
    steps:
      - uses: actions/checkout@v4
      - name: setup node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: install Rust stable
        uses: dtolnay/rust-toolchain@stable
      - name: install dependencies (ubuntu only)
        if: matrix.platform == 'ubuntu-22.04'
        run: |
          sudo apt-get update
          sudo apt-get install -y libgtk-3-dev libwebkit2gtk-4.0-dev libjavascriptcoregtk-4.0-dev libsoup2.4-dev librsvg2-dev
      - name: install frontend dependencies
        run: npm install
      - uses: tauri-apps/tauri-action@v0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tagName: v__VERSION__ # the action automatically replaces this with data from tauri.conf.json
          releaseName: "OllaDesk v__VERSION__"
          releaseBody: "OllaDesk Desktop Release"
          releaseDraft: true
          prerelease: false
```

### How to use CI Release
1.  Commit and push the workflow file.
2.  Tag your version: `git tag v1.0.0`.
3.  Push the tag: `git push origin v1.0.0`.
4.  GitHub will start building the apps. Once finished, a **Draft Release** will appear in your GitHub "Releases" tab with all installers attached.

---

## 4. Publishing on GitHub (Manual Upload)

If you built the app locally (Option A), follow these steps:

1.  Go to your GitHub repository.
2.  Click **Releases** -> **Draft a new release**.
3.  Choose a tag (e.g., `v1.0.0`).
4.  Title: `OllaDesk v1.0.0`.
5.  **Drag and drop** the installer files (`.exe`, `.msi`, or `.dmg`) into the "Attach binaries" box.
6.  Click **Publish release**.

Students can now download the installer directly from this page!

> [!NOTE]
> Students will still need to have **Ollama** running on their machines for the app to function. You should include a link to [ollama.com](https://ollama.com) in your release notes.
