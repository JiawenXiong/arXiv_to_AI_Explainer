const DEFAULT_PROMPT = `你好！请帮我深度解读这篇名为《\${title}》的论文。
请重点分析：
1. 论文解决了什么问题？
2. 核心创新点和方法论是什么？
3. 实验结果说明了什么？
论文 PDF 地址：\${url}`;

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
        alert('配置已保存！');
    });
};

// 恢复默认按钮
document.getElementById('reset').onclick = () => {
    if (confirm('确定要恢复默认提示词吗？')) {
        textarea.value = DEFAULT_PROMPT;
        chrome.storage.local.set({ 'customTemplate': DEFAULT_PROMPT });
    }
};




