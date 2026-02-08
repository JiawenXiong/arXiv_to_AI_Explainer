Here is the English translation of your README file, optimized for a professional GitHub repository.
# arXiv to AI Explainer 🚀

[English](README.md) | [简体中文](README.zh-CN.md)

**One-click AI Insights for arXiv Papers** —— A lightweight browser extension designed to help researchers instantly analyze arXiv papers using ChatGPT or Google Gemini.

---

## 🌟 Key Features

* **Instant Access**: Automatically injects a "🚀 AI Explainer" button directly onto arXiv paper detail pages.
* **Multi-Model Support**: Seamlessly jump to **ChatGPT**, **Google Gemini**, **Kimi**, or **Doubao** (豆包) (switchable in settings).
* **Automatic Data Extraction**: Automatically extracts the paper **Title** and **PDF Link**—no more manual copying.
* **Fully Customizable Prompts**:
* Supports user-defined prompt templates.
* Provides variable placeholders: `${title}` (Paper Title) and `${url}` (PDF Link).
* Includes a **"Restore Defaults"** button to prevent configuration errors.


* **Privacy-Friendly**: Open-source code; no user data collection; all configurations are stored locally.

---

## 📂 Project Structure

```text
arxiv-chatgpt-helper/
├── manifest.json       # Extension configuration (Manifest V3)
├── content_arxiv.js    # Injection script: Scrapes info & adds the button
├── content_chatgpt.js  # ChatGPT automation: Fills content & submits
├── content_gemini.js   # Gemini automation: Fills content & submits
├── content_kimi.js     # Kimi automation: Fills content & submits
├── content_doubao.js   # Doubao automation: Fills content & submits
├── popup.html          # Settings popup interface
├── popup.js            # Settings logic & persistent storage
└── icons
    └── icon.png        # Extension icon (128x128)

```

---

## 🛠️ Installation (Developer Mode)

Currently, the extension can be installed manually:

1. **Clone the Repository**:
```bash
git clone https://github.com/JiawenXiong/arXiv_to_AI_Explainer.git

```


2. **Open Extensions Management**:
Type `chrome://extensions/` in your Chrome address bar.
3. **Enable Developer Mode**:
Toggle the "**Developer mode**" switch in the top right corner.
4. **Load Extension**:
Click "**Load unpacked**" and select the folder containing this project.

---

## 📖 How to Use

1. Visit any [arXiv](https://arxiv.org/) abstract page.
2. Click the green **"🚀 AI Explainer"** button located at the top right of the page.
3. The extension will open your chosen AI platform (default: ChatGPT) and automatically paste your prompt and the paper link.
4. **Customization**:
* Click the extension icon in the browser toolbar.
* Modify the default Prompt in the popup.
* Switch the **Target AI** to Gemini, Kimi, or Doubao (豆包).
* Click **Save Settings** to apply changes.



---

## 📝 Variable Definitions (Custom Prompt)

You can use the following variables in your Prompt template:

| Variable | Description | Example Output |
| --- | --- | --- |
| `${title}` | Paper Title | Attention Is All You Need |
| `${url}` | Direct PDF Link | [https://arxiv.org/pdf/1706.03762.pdf](https://arxiv.org/pdf/1706.03762.pdf) |

---

## 🛡️ Privacy Policy

* **Data Collection**: This extension does not collect or upload any personal user data.
* **Permissions Usage**:
* `storage`: Used exclusively to store your Prompt templates and AI preferences locally.
* `host permissions`: Used only to run automation scripts on specified arXiv and AI domains.


* **Third-Party Services**: The extension interacts with ChatGPT/Gemini via URL redirection; data handling is subject to the respective AI platforms' privacy policies.

---

## 🤝 Contributing

Issues and Pull Requests are welcome to improve this project!

* [ ] Add support for Claude.
* [ ] Add support for other paper repositories (e.g., OpenReview, CVPR).

## 📄 License

This project is licensed under the [MIT License](https://www.google.com/search?q=LICENSE).

---

## 📮 Author

**Jiawen XIONG** - [xiong.jia.wen@163.com]