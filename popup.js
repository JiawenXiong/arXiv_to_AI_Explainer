document.addEventListener('DOMContentLoaded', function() {
    // Set i18n text
    document.getElementById('labelPlatform').textContent = chrome.i18n.getMessage('selectAIPlatform');
    document.getElementById('labelPrompt').textContent = chrome.i18n.getMessage('customPromptLabel');
    document.getElementById('labelVariables').textContent = chrome.i18n.getMessage('availableVariables');
    document.getElementById('save').textContent = chrome.i18n.getMessage('saveSettings');
    document.getElementById('reset').textContent = chrome.i18n.getMessage('restoreDefaults');

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
});




