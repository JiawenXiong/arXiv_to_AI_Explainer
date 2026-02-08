(function() {
    function trySubmitKimi() {
        console.log('Kimi任务执行中');
        chrome.storage.local.get(['pendingArxivTask'], (result) => {
            const prompt = result.pendingArxivTask;
            if (!prompt) return;

            // Kimi 的输入框选择器
            const textarea = document.querySelector('.chat-input-editor');

            console.log('Kimi: 查找输入框...');
            console.log('Kimi: 找到的输入框:', textarea);

            if (textarea) {
                chrome.storage.local.remove('pendingArxivTask');
                
                // 然后再聚焦
                textarea.focus();
                console.log('Kimi: 输入框已聚焦，准备输入文本');

                // 稍作延迟后使用 execCommand 输入文本
                setTimeout(() => {
                    document.execCommand('insertText', false, prompt);
                    console.log('Kimi: 文本已输入');

                    // 再稍作延迟后模拟按回车键发送
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
                        console.log('Kimi: 已模拟按回车键');
                    }, 300);
                }, 300);
            } else {
                console.log('Kimi: 未找到输入框，1秒后重试');
                // 如果页面还没加载好，1秒后重试
                setTimeout(trySubmitKimi, 1000);
            }
        });
    }

    // 初次加载时尝试
    trySubmitKimi();
})();