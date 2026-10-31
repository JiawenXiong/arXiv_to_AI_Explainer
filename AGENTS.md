# 项目概述

**arXiv to AI Explainer** 是一个轻量级的浏览器扩展项目，旨在帮助研究人员通过一键操作将 arXiv 论文提交给 ChatGPT 或 Google Gemini 进行 AI 辅助解读。

## 项目类型

这是一个 **浏览器扩展项目**，基于 Chrome Extension Manifest V3 规范开发，使用纯 JavaScript 实现，无需构建工具或依赖管理。

## 技术栈

- **语言**: JavaScript (ES6+)
- **扩展标准**: Chrome Extension Manifest V3
- **权限**: 仅使用 `storage` 权限（本地存储配置），无数据收集
- **目标平台**: 
  - Chrome / Chromium 浏览器
  - Edge / Brave 等 Chromium 内核浏览器

## 项目架构

项目采用内容脚本（Content Scripts）模式，通过在特定页面注入脚本实现自动化功能：

```
arXiv 页面 (content_arxiv.js)
    ↓ 提取标题和 PDF 链接
    ↓ 用户点击按钮
    ↓ 存储任务到 chrome.storage.local
    ↓ 打开 AI 平台页面
        ↓
ChatGPT 页面 (content_chatgpt.js)
    ↓ 读取存储的任务
    ↓ 自动填充输入框
    ↓ 自动点击发送
        ↓
Gemini 页面 (content_gemini.js)
    ↓ 读取存储的任务
    ↓ 自动填充输入框
    ↓ 自动点击发送
```

## 核心文件说明

### 配置文件

- **manifest.json**: 扩展配置文件，定义权限、内容脚本匹配规则和扩展元信息
  - 权限：`storage`（用于存储用户自定义的 Prompt 和 AI 平台选择）
  - 内容脚本：
    - `https://arxiv.org/abs/*` - 注入 "🚀 AI 解读论文" 按钮
    - `https://chatgpt.com/*` - 自动填充并发送 ChatGPT
    - `https://gemini.google.com/*` - 自动填充并发送 Gemini

### 核心脚本

- **content_arxiv.js**: arXiv 页面注入脚本
  - 提取论文标题：从 `h1.title.mathjax` 元素获取
  - 生成 PDF 链接：将 URL 中的 `abs` 替换为 `pdf` 并添加 `.pdf` 后缀
  - 创建悬浮按钮：固定在页面右上角，纵向排列两个按钮（绿色主按钮 + 蓝色复制按钮），带悬停动画
  - 处理点击：读取用户配置，替换 Prompt 中的变量，存储任务并打开 AI 平台（同时将实例化结果永久存为 `lastPrompt`，供弹窗复制兜底）
  - 复制提示词：将实例化后的 Prompt（变量已替换）复制到剪贴板，优先 `navigator.clipboard`，失败时降级为 `execCommand('copy')`，作为自动填充失效时的手动兜底
  - 消息响应：监听 `chrome.runtime.onMessage`（`GET_PAPER_INFO`），向弹窗返回当前论文标题与 PDF 链接

- **content_chatgpt.js**: ChatGPT 自动化脚本
  - 轮询机制：每 500ms 检查页面是否加载完成（输入框最多等待 20s，超时放弃并保留任务）
  - 输入框定位：新版为 `form[data-chatgpt-composer] .ProseMirror[contenteditable="true"]`，兼容旧版 `#prompt-textarea`，另有通用 ProseMirror 兜底
  - 文本填充：优先向编辑器派发模拟 `paste` 事件（`ClipboardEvent` + `DataTransfer`），未生效时降级为 `document.execCommand('insertText')`，以触发 ProseMirror/React 状态更新
  - 自动发送：新版发送按钮在输入框有内容后才渲染进 DOM，因此填充成功后每 500ms 轮询等待（最多 8s）再点击（`#composer-submit-button`、`[data-testid="send-button"]` 等）；仍找不到则以模拟 Enter 键提交兜底
  - 防重复：确认填充成功后立即清除 storage 中的任务；填充失败则保留任务，供下次打开重试或手动复制粘贴

- **content_gemini.js**: Gemini 自动化脚本
  - 轮询机制：每秒检查页面是否加载完成
  - 输入框定位：选择器 `div[role="textbox"]` 或 `.ql-editor`
  - 文本填充：使用 `document.execCommand('insertText')`
  - 自动发送：800ms 延迟后点击发送按钮（`button[aria-label*="发送"]` 或 `button[aria-label*="Send"]`）
  - 防重复：成功填充后立即清除 storage 中的任务

### 用户界面

- **popup.html**: 设置弹窗界面
  - AI 平台选择下拉框（ChatGPT / Gemini）
  - Prompt 输入文本框（支持多行）
  - 复制提示词按钮（复制模板实例化后的最终文案）及其提示文字
  - 保存和恢复默认按钮
  - 变量提示文字

- **popup.js**: 设置逻辑
  - 页面加载时从 storage 读取已保存的配置
  - 复制提示词：优先通过 `chrome.tabs.sendMessage` 向当前 arXiv 页面的内容脚本实时获取论文信息并实例化模板；若当前页面不是 arXiv 论文页，则退回复制 storage 中永久保存的 `lastPrompt`；两者皆无时按钮禁用并提示
  - 保存按钮：将 Prompt 和 AI 平台选择存储到 chrome.storage.local
  - 恢复默认按钮：重置为默认 Prompt 模板

### 文档文件

- **README.md**: 英文项目说明
- **README.zh-CN.md**: 中文项目说明
- **prompts.md**: 参考提示词模板（详细的论文解读 Prompt 模板，包含 Mermaid 流程图示例）

## 安装与使用

### 开发模式安装

1. 克隆仓库：
```bash
git clone https://github.com/JiawenXiong/arXiv_to_AI_Explainer.git
```

2. 打开 Chrome 扩展管理页面：`chrome://extensions/`

3. 启用右上角的"开发者模式"

4. 点击"加载已解压的扩展程序"，选择项目文件夹

### 使用流程

1. 访问任意 arXiv 论文摘要页面（如：`https://arxiv.org/abs/1706.03762`）

2. 点击页面右上角的绿色"🚀 AI 解读论文"按钮

3. 扩展会自动打开选择的 AI 平台（默认 ChatGPT），并自动填充 Prompt 和论文链接

4. 等待 AI 平台自动提交请求

5. 如需自定义：点击浏览器工具栏中的扩展图标，修改 Prompt 模板或切换 AI 平台

## 可用变量

在自定义 Prompt 中可以使用以下变量：

- `${title}`: 论文标题（自动从 arXiv 页面提取）
- `${url}`: PDF 链接（自动生成：将 arXiv abs 链接转换为 PDF 链接）

示例：
```
你好！请帮我深度解读这篇名为《${title}》的论文。
论文 PDF 地址：${url}
```

## 开发规范

### 代码风格

- 所有脚本使用立即执行函数表达式（IIFE）封装，避免污染全局作用域
- 使用 `document.execCommand('insertText')` 而不是直接修改 `value` 属性，以触发前端框架（如 React）的状态更新
- 使用轮询机制（`setTimeout`）处理页面异步加载，确保元素存在后再操作
- 操作成功后立即从 storage 清除任务，防止重复执行

### 测试方法

由于是浏览器扩展，测试需要手动进行：

1. 在 `chrome://extensions/` 页面重新加载扩展（刷新按钮）
2. 访问 arXiv 论文页面，测试按钮是否正常显示
3. 点击按钮，测试是否能正确提取标题和 PDF 链接
4. 测试 AI 平台页面的自动填充和发送功能
5. 测试自定义 Prompt 和 AI 平台切换功能

### 选择器维护

- **arXiv**: 选择器 `h1.title.mathjax` 用于提取标题，arXiv 网站结构较稳定，一般不需要频繁维护
- **ChatGPT**: 选择器可能随 ChatGPT 界面更新而变化，主要选择器（2025-10 版本，输入框为 ProseMirror 编辑器，发送按钮仅在输入内容后渲染）：
  - 输入框：`form[data-chatgpt-composer] .ProseMirror[contenteditable="true"]`（旧版 `#prompt-textarea` 仍兼容）
  - 发送按钮：`#composer-submit-button` 或 `[data-testid="send-button"]`
- **Gemini**: 选择器可能随 Gemini 界面更新而变化，主要选择器：
  - 输入框：`div[role="textbox"]` 或 `.ql-editor`
  - 发送按钮：`button[aria-label*="发送"]` 或 `button[aria-label*="Send"]`

## 已知限制

1. **仅支持 Chromium 浏览器**：由于使用 Chrome Extension API，不支持 Firefox 和 Safari
2. **选择器依赖**：如果 ChatGPT 或 Gemini 更新 DOM 结构，可能需要更新选择器
3. **轮询机制**：使用 `setTimeout` 轮询可能在某些情况下不够高效，但兼容性最好
4. **仅支持 arXiv**：当前仅支持 arXiv 论文，不支持其他论文库（如 OpenReview、CVPR）

## 未来改进方向

- 添加对 Claude 的支持（待实现）
- 支持其他论文库（如 OpenReview、CVPR）
- 使用 MutationObserver 替代轮询机制，提高性能
- 添加国际化支持
- 提供更多预设 Prompt 模板

## 隐私政策

- 不收集或上传任何用户数据
- 所有配置存储在本地（chrome.storage.local）
- 仅在指定域名（arXiv、ChatGPT、Gemini）运行内容脚本
- 与 AI 平台的交互通过 URL 重定向，数据隐私由 AI 平台政策决定

## 许可证

MIT License

## 作者

Jiawen XIONG - xiong.jia.wen@163.com

## 构建与运行

**注意**：此项目不需要构建步骤，可以直接使用。

1. 安装扩展（见"开发模式安装"部分）
2. 无需额外命令，扩展会自动在匹配的页面上运行

如需修改代码：
1. 编辑相关文件
2. 在 `chrome://extensions/` 页面点击扩展的"刷新"按钮
3. 测试修改后的功能