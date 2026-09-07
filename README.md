# Tauri + Vue + TypeScript

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## 发布更新

应用会从 GitHub Releases 检查更新。发布新版本前，请同步提高 `src-tauri/tauri.conf.json` 中的 `version`，然后推送版本标签：

```bash
git tag v0.2.0
git push origin v0.2.0
```

仓库需要配置以下 Actions secrets：

- `TAURI_SIGNING_PRIVATE_KEY`：本地生成的 Tauri 私钥内容
- `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`：私钥密码；当前无密码时可留空

`.github/workflows/release.yml` 会构建 macOS Apple Silicon、macOS Intel 和 Windows 安装包，并发布 updater 所需的 `latest.json`。客户端只有安装了签名的正式构建版本后，才能检查到后续 Release。
