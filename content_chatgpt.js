(function() {
    function trySubmit() {
        chrome.storage.local.get(['pendingArxivTask'], (result) => {
            const prompt = result.pendingArxivTask;
            if (!prompt) return;

            // 寻找 ChatGPT 的输入框
            const textarea = document.querySelector('#prompt-textarea');
            
            if (textarea) {
                // 1. 成功找到输入框，清除存储中的任务，防止重复触发
                chrome.storage.local.remove('pendingArxivTask');

                // 2. 聚焦并填入文字
                textarea.focus();
                // 使用 execCommand 以触发 React 的状态更新
                document.execCommand('insertText', false, prompt);

                // 3. 稍作延迟后模拟点击发送按钮
                setTimeout(() => {
                    const sendBtn = document.querySelector('[data-testid="send-button"]') || 
                                    document.querySelector('button[aria-label="发送提示词"]');
                    if (sendBtn) {
                        sendBtn.click();
                    }
                }, 600);
            } else {
                // 如果页面还没加载好，1秒后重试
                setTimeout(trySubmit, 1000);
            }
        });
    }

    // 初次加载和页面切换时尝试
    trySubmit();
})();