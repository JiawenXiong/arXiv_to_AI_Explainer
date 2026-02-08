(function() {
    function trySubmitGemini() {
        chrome.storage.local.get(['pendingArxivTask'], (result) => {
            const prompt = result.pendingArxivTask;
            if (!prompt) return;

            // Gemini 的输入框选择器通常包含 rich-textarea 或 contenteditable
            const textarea = document.querySelector('div[role="textbox"]') || 
                           document.querySelector('.ql-editor');
            
            if (textarea) {
                chrome.storage.local.remove('pendingArxivTask');
                
                textarea.focus();
                // 模拟输入
                document.execCommand('insertText', false, prompt);

                // 尝试点击发送按钮
                setTimeout(() => {
                    // Gemini 的发送按钮通常带有一个特殊的 aria-label
                    const sendBtn = document.querySelector('button[aria-label*="发送"] span') || 
                                    document.querySelector('button[aria-label*="Send"]');
                    if (sendBtn) {
                        sendBtn.click();
                    }
                }, 800);
            } else {
                setTimeout(trySubmitGemini, 1000); // 轮询
            }
        });
    }
    trySubmitGemini();
})();