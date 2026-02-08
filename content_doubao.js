(function() {
    function trySubmitDoubao() {
        console.log('豆包任务执行中');
        chrome.storage.local.get(['pendingArxivTask'], (result) => {
            const prompt = result.pendingArxivTask;
            if (!prompt) return;

            // 豆包的输入框选择器（需要根据实际页面结构调整）
            // 常见选择器：textarea, div[contenteditable], div[role="textbox"]
            const textarea = document.querySelector('textarea') ||
                           document.querySelector('div[contenteditable]') ||
                           document.querySelector('div[role="textbox"]') ||
                           document.querySelector('[data-testid="chat-input"]') ||
                           document.querySelector('.input-area textarea');

            if (textarea) {
                chrome.storage.local.remove('pendingArxivTask');

                textarea.focus();
                // 使用 execCommand 以触发框架的状态更新
                document.execCommand('insertText', false, prompt);

                // 稍作延迟后模拟按回车键发送
                setTimeout(() => {
                    const enterEvent = new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13,
                        bubbles: true,
                        cancelable: true
                    });
                    textarea.dispatchEvent(enterEvent);
                }, 800);
            } else {
                // 如果页面还没加载好，1秒后重试
                setTimeout(trySubmitDoubao, 1000);
            }
        });
    }

    // 初次加载时尝试
    trySubmitDoubao();
})();