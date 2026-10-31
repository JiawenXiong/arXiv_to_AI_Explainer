document.addEventListener('DOMContentLoaded', function() {
    // Set i18n text
    document.getElementById('labelPlatform').textContent = chrome.i18n.getMessage('selectAIPlatform');
    document.getElementById('labelPrompt').textContent = chrome.i18n.getMessage('customPromptLabel');
    document.getElementById('labelVariables').textContent = chrome.i18n.getMessage('availableVariables');
    document.getElementById('save').textContent = chrome.i18n.getMessage('saveSettings');
    document.getElementById('reset').textContent = chrome.i18n.getMessage('restoreDefaults');
    document.getElementById('copyPrompt').textContent = chrome.i18n.getMessage('copyPromptText');

    const DEFAULT_PROMPT = chrome.i18n.getMessage('defaultPrompt');

    const textarea = document.getElementById('promptInput');

    // 页面打开时加载已保存的 Prompt
    chrome.storage.local.get(['customTemplate', 'targetAI'], (res) => {
        textarea.value = res.customTemplate || DEFAULT_PROMPT;
        document.getElementById('targetAI').value = res.targetAI || 'chatgpt';
    });

    // 保存按钮
    document.getElementById('save').onclick = () => {
        const targetAI = document.getElementById('targetAI').value;
        chrome.storage.local.set({
            'customTemplate': textarea.value,
            'targetAI': targetAI
        }, () => {
            alert(chrome.i18n.getMessage('settingsSaved'));
        });
    };

    // 恢复默认按钮
    document.getElementById('reset').onclick = () => {
        if (confirm(chrome.i18n.getMessage('confirmRestore'))) {
            textarea.value = DEFAULT_PROMPT;
            chrome.storage.local.set({ 'customTemplate': DEFAULT_PROMPT });
        }
    };

    // ===== 复制提示词：复制模板实例化后的最终文案 =====
    const copyBtn = document.getElementById('copyPrompt');
    const copyHint = document.getElementById('copyHint');
    const COPY_TEXT = chrome.i18n.getMessage('copyPromptText');
    const COPIED_TEXT = chrome.i18n.getMessage('copiedText');
    const COPY_FAILED_TEXT = chrome.i18n.getMessage('copyFailedText');
    let readyPrompt = null;

    // 实例化模板：替换所有 ${title} / ${url} 占位符
    const fillTemplate = (template, title, url) =>
        template.split('${title}').join(title).split('${url}').join(url);

    const setCopyReady = (prompt, hintText) => {
        readyPrompt = prompt;
        copyBtn.disabled = false;
        copyHint.textContent = hintText;
    };

    const setCopyUnavailable = () => {
        readyPrompt = null;
        copyBtn.disabled = true;
        copyHint.textContent = chrome.i18n.getMessage('popupCopyUnavailable');
    };

    // 非 arXiv 页面时退回：复制上次生成的提示词（自动填充失败时依然可用）
    const useLastPromptFallback = () => {
        chrome.storage.local.get(['lastPrompt'], (res) => {
            if (res.lastPrompt) {
                setCopyReady(res.lastPrompt, chrome.i18n.getMessage('popupCopyLast'));
            } else {
                setCopyUnavailable();
            }
        });
    };

    // 识别当前活动标签页：若是 arXiv 论文页，向内容脚本实时获取论文信息
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs && tabs[0];
        if (!tab) return useLastPromptFallback();
        chrome.tabs.sendMessage(tab.id, { type: 'GET_PAPER_INFO' }, (res) => {
            if (chrome.runtime.lastError) {
                chrome.runtime.lastError; // 主动读取，避免控制台出现未检查的错误
                return useLastPromptFallback();
            }
            if (res && typeof res.title === 'string' && typeof res.pdfUrl === 'string') {
                chrome.storage.local.get(['customTemplate'], (stored) => {
                    const template = stored.customTemplate || DEFAULT_PROMPT;
                    const finalPrompt = fillTemplate(template, res.title, res.pdfUrl);
                    setCopyReady(finalPrompt, chrome.i18n.getMessage('popupCopyCurrent', [res.title]));
                });
            } else {
                useLastPromptFallback();
            }
        });
    });

    copyBtn.onclick = () => {
        if (!readyPrompt) return;
        navigator.clipboard.writeText(readyPrompt).then(() => {
            copyBtn.textContent = COPIED_TEXT;
        }).catch(() => {
            copyBtn.textContent = COPY_FAILED_TEXT;
        }).finally(() => {
            setTimeout(() => { copyBtn.textContent = COPY_TEXT; }, 2000);
        });
    };
});
