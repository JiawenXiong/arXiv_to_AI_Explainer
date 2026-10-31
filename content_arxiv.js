(function () {
    // 1. 提取 PDF 链接（arxiv 的结构比较稳定，通常可以直接推导）
    const pdfUrl = window.location.href.replace('abs', 'pdf') + ".pdf";
    const paperTitle = document.querySelector('h1.title.mathjax')?.innerText.replace('Title:', '').trim() || chrome.i18n.getMessage('fallbackTitle');
    const DEFAULT_PROMPT = chrome.i18n.getMessage('defaultPrompt');

    // 响应 popup 的查询，返回当前论文信息（供弹窗复制实例化后的提示词）
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        if (msg && msg.type === 'GET_PAPER_INFO') {
            sendResponse({ title: paperTitle, pdfUrl: pdfUrl });
        }
    });

    // 读取用户模板并实例化提示词（替换所有 ${title} / ${url} 占位符）
    const buildFinalPrompt = (callback) => {
        chrome.storage.local.get(['customTemplate'], (res) => {
            const template = res.customTemplate || DEFAULT_PROMPT;
            const finalPrompt = template
                .split('${title}').join(paperTitle)
                .split('${url}').join(pdfUrl);
            callback(finalPrompt);
        });
    };

    // 兜底复制方案：隐藏 textarea + execCommand（兼容 Clipboard API 不可用的场景）
    const fallbackCopy = (text) => new Promise((resolve, reject) => {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        let ok = false;
        try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
        document.body.removeChild(ta);
        ok ? resolve() : reject(new Error('execCommand copy failed'));
    });

    // 复制到剪贴板：优先 Clipboard API，失败时降级
    const copyToClipboard = (text) => {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
        }
        return fallbackCopy(text);
    };

    // 按钮通用样式与悬停动画
    const styleButton = (btn, backgroundColor) => {
        Object.assign(btn.style, {
            padding: '12px 20px', backgroundColor: backgroundColor, color: 'white',
            border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)', transition: 'transform 0.15s ease'
        });
        btn.onmouseover = () => btn.style.transform = 'scale(1.05)';
        btn.onmouseout = () => btn.style.transform = 'scale(1)';
    };

    // 2. 创建按钮容器（固定在页面右上角，纵向排列）
    const container = document.createElement('div');
    Object.assign(container.style, {
        position: 'fixed', top: '20px', right: '20px', zIndex: '10000',
        display: 'flex', flexDirection: 'column', gap: '10px'
    });

    // 主按钮：存储任务并跳转 AI 平台
    const btn = document.createElement('button');
    btn.innerHTML = chrome.i18n.getMessage('buttonText');
    styleButton(btn, '#10a37f');

    btn.onclick = () => {
        chrome.storage.local.get(['customTemplate', 'targetAI'], (res) => {
            const target = res.targetAI || 'chatgpt';
            buildFinalPrompt((finalPrompt) => {
                // 将任务存入 storage；lastPrompt 不随自动填充成功而清除，供弹窗复制兜底
                chrome.storage.local.set({ 'pendingArxivTask': finalPrompt, 'lastPrompt': finalPrompt }, () => {
                    let url;
                    switch(target) {
                        case 'gemini':
                            url = 'https://gemini.google.com/app';
                            break;
                        case 'kimi':
                            url = 'https://www.kimi.com/';
                            break;
                        case 'doubao':
                            url = 'https://www.doubao.com/chat/?from_login=1';
                            break;
                        case 'chatgpt':
                        default:
                            url = 'https://chatgpt.com/';
                            break;
                    }
                    window.open(url, '_blank');
                });
            });
        });
    };

    // 复制按钮：将实例化后的提示词复制到剪贴板，作为自动填充失效时的手动兜底
    const copyBtn = document.createElement('button');
    const COPY_TEXT = chrome.i18n.getMessage('copyPromptText');
    const COPIED_TEXT = chrome.i18n.getMessage('copiedText');
    const COPY_FAILED_TEXT = chrome.i18n.getMessage('copyFailedText');
    copyBtn.innerHTML = COPY_TEXT;
    styleButton(copyBtn, '#2563eb');

    copyBtn.onclick = () => {
        buildFinalPrompt((finalPrompt) => {
            copyToClipboard(finalPrompt)
                .then(() => { copyBtn.innerHTML = COPIED_TEXT; })
                .catch(() => { copyBtn.innerHTML = COPY_FAILED_TEXT; })
                .finally(() => {
                    setTimeout(() => { copyBtn.innerHTML = COPY_TEXT; }, 2000);
                });
        });
    };

    container.appendChild(btn);
    container.appendChild(copyBtn);
    document.body.appendChild(container);
})();
