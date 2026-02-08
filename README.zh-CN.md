# arXiv to AI Explainer 🚀

[English](README.md) | [简体中文](README.zh-CN.md)

**arXiv 论文一键 AI 解读助手** —— 这是一个轻量级的浏览器插件，旨在帮助科研人员通过 ChatGPT 或 Google Gemini 一键深入解读 arXiv 论文。

---

## 🌟 功能亮点

* **一键触达**：在 arXiv 论文详情页自动注入“🚀 AI 论文解读”按钮。
* **多模型支持**：支持跳转至 **ChatGPT** 或 **Google Gemini**，可在设置中随时切换。
* **参数自动抓取**：自动提取论文**标题**及 **PDF 链接**，无需手动复制。
* **完全自定义 Prompt**：
* 支持用户自定义提示词模板。
* 提供变量占位符：`${title}`（标题）、`${url}`（PDF 链接）。
* 支持**一键恢复默认设置**，防止配置错误导致功能失效。


* **隐私友好**：代码开源，不收集用户数据，仅在本地存储配置。

---

## 📂 项目结构

```text
arxiv-chatgpt-helper/
├── manifest.json       # 插件配置文件 (V3)
├── content_arxiv.js    # 页面注入脚本：抓取信息与添加按钮
├── content_chatgpt.js  # ChatGPT 自动化脚本：填入内容并提交
├── content_gemini.js   # Gemini 自动化脚本：填入内容并提交
├── popup.html          # 设置弹窗界面
├── popup.js            # 设置逻辑与持久化存储
└── icons
	└── icon.png        # 插件图标 (128x128)
```

---

## 🛠️ 安装方法 (开发者模式)

目前插件支持手动加载安装：

1. **克隆仓库**：
```bash
git clone https://github.com/JiawenXiong/arXiv_to_AI_Explainer.git
```


2. **打开扩展程序管理**：
在 Chrome 浏览器地址栏输入 `chrome://extensions/`。
3. **开启开发者模式**：
打开页面右上角的“**开发者模式**”开关。
4. **加载插件**：
点击“**加载已解压的扩展程序**”，选择本项目所属的文件夹。

---

## 📖 使用说明

1. 访问任何 [arXiv](https://arxiv.org/) 论文的摘要页面。
2. 点击页面右上角醒目的绿色按钮 **“🚀 AI 论文解读”**。
3. 插件将自动打开 AI 站点（默认 ChatGPT），并填入你预设的提示词和论文链接。
4. **自定义设置**：
* 点击浏览器工具栏的插件图标。
* 在弹窗中修改默认 Prompt。
* 切换 **Target AI** 为 Gemini。
* 点击 **保存设置** 即可生效。



---

## 📝 变量说明 (Custom Prompt)

在设置界面的 Prompt 模板中，你可以使用以下变量：

| 变量名 | 说明 | 示例输出 |
| --- | --- | --- |
| `${title}` | 论文标题 | Attention Is All You Need |
| `${url}` | PDF 直链 | [https://arxiv.org/pdf/1706.03762.pdf](https://www.google.com/search?q=https://arxiv.org/pdf/1706.03762.pdf) |

---

## 🛡️ 隐私政策 (Privacy Policy)

* **数据收集**：本插件不收集、不上传任何个人用户数据。
* **权限使用**：
* `storage`：仅用于在本地存储用户的 Prompt 模板和 AI 偏好设置。
* `host permissions`：仅用于在指定的 arXiv 和 AI 站点上运行自动化脚本。


* **第三方服务**：插件通过 URL 跳转方式与 ChatGPT/Gemini 交互，其数据处理遵循各 AI 平台自身的隐私政策。

---

## 🤝 贡献建议

欢迎提交 Issue 或 Pull Request 来改进本项目！

* [ ] 增加对 Claude 的支持。
* [ ] 增加对其他论文网站（如 OpenReview, CVPR）的支持。

## 📄 开源协议

本项目采用 [MIT License](https://www.google.com/search?q=LICENSE) 开源协议。

---

## 📮 作者

[Jiawen XIONG] - [xiong.jia.wen@163.com]