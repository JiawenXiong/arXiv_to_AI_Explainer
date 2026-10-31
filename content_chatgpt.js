(function() {
    // ---------- 配置 ----------
    const POLL_INTERVAL = 500;      // 轮询间隔
    const EDITOR_TIMEOUT = 20000;   // 等待输入框出现的最长时长
    const SEND_TIMEOUT = 8000;      // 等待发送按钮出现的最长时长
    const VERIFY_DELAY = 150;       // 填充后确认文本已写入的延迟

    // 输入框候选选择器：新版为 composer 表单内的 ProseMirror 编辑器，旧版为 #prompt-textarea
    const EDITOR_SELECTORS = [
        '#prompt-textarea',                                                  // 旧版
        'form[data-chatgpt-composer] .ProseMirror[contenteditable="true"]',  // 2025-10 新版
        'div[contenteditable="true"].ProseMirror[role="textbox"]'            // 通用兜底
    ];

    // 发送按钮候选选择器：新版按钮仅在输入框有内容后才渲染进 DOM
    const SEND_SELECTORS = [
        '#composer-submit-button',                                          // 新版
        '[data-testid="send-button"]',                                      // 旧版
        'form[data-chatgpt-composer] button[aria-label*="发送"]',
        'form[data-chatgpt-composer] button[aria-label*="Send"]',
        'button[aria-label="发送提示词"]',
        'button[aria-label="Send prompt"]'
    ];

    const findFirst = (selectors) => {
        for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (el) return el;
        }
        return null;
    };

    const log = (...args) => console.log('[arXiv to AI Explainer]', ...args);

    function trySubmit(startTime) {
        chrome.storage.local.get(['pendingArxivTask'], (result) => {
            const prompt = result.pendingArxivTask;
            if (!prompt) return;

            const editor = findFirst(EDITOR_SELECTORS);

            if (editor) {
                fillAndSend(editor, prompt);
            } else if (Date.now() - startTime < EDITOR_TIMEOUT) {
                // 页面还没加载好，稍后重试
                setTimeout(() => trySubmit(startTime), POLL_INTERVAL);
            } else {
                log('等待输入框超时，任务保留在 storage 中');
            }
        });
    }

    // 确认编辑器中已有内容（ProseMirror 可能对文本做 markdown 转换，故只判断非空）
    const isFilled = (editor) => (editor.textContent || '').trim().length > 0;

    // 向 ProseMirror 编辑器写入文本：优先模拟粘贴事件，未生效则退回 execCommand
    function insertText(editor, text, callback) {
        editor.focus();

        let pasteDispatched = false;
        try {
            const dt = new DataTransfer();
            dt.setData('text/plain', text);
            editor.dispatchEvent(new ClipboardEvent('paste', {
                clipboardData: dt, bubbles: true, cancelable: true
            }));
            pasteDispatched = true;
        } catch (e) {
            log('模拟粘贴事件失败，改用 execCommand', e);
        }

        setTimeout(() => {
            if (isFilled(editor)) return callback(true);

            // 兜底：execCommand 走 beforeinput 管线，同样可触发 React 状态更新
            try {
                editor.focus();
                document.execCommand('insertText', false, text);
            } catch (e) { /* ignore */ }
            setTimeout(() => callback(isFilled(editor)), VERIFY_DELAY);
        }, pasteDispatched ? VERIFY_DELAY : 0);
    }

    function fillAndSend(editor, prompt) {
        insertText(editor, prompt, (filled) => {
            if (!filled) {
                // 填充失败时保留任务，用户可通过弹窗/页面按钮复制提示词手动粘贴
                log('文本填充失败，任务保留在 storage 中');
                return;
            }

            // 填充成功即清除任务，避免 SPA 内部跳转后重复填充
            chrome.storage.local.remove('pendingArxivTask');

            // 新版 ChatGPT：输入框为空时发送按钮不在 DOM 中，有内容后才会渲染
            waitForSendButton(Date.now());
        });
    }

    function waitForSendButton(startTime) {
        const btn = findFirst(SEND_SELECTORS);
        if (btn && !btn.disabled && btn.getAttribute('aria-disabled') !== 'true') {
            btn.click();
            log('已点击发送按钮');
            return;
        }
        if (Date.now() - startTime < SEND_TIMEOUT) {
            setTimeout(() => waitForSendButton(startTime), POLL_INTERVAL);
            return;
        }
        // 兜底：模拟回车提交（ChatGPT 中 Enter 默认发送消息）
        const editor = findFirst(EDITOR_SELECTORS);
        if (editor && isFilled(editor)) {
            log('未找到发送按钮，尝试回车提交');
            editor.focus();
            editor.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter', code: 'Enter', keyCode: 13, which: 13,
                bubbles: true, cancelable: true
            }));
        }
    }

    // 初次加载时开始尝试
    trySubmit(Date.now());
})();
