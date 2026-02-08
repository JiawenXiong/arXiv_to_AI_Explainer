(function () {
    // 1. 提取 PDF 链接（arxiv 的结构比较稳定，通常可以直接推导）
    const pdfUrl = window.location.href.replace('abs', 'pdf') + ".pdf";
    const paperTitle = document.querySelector('h1.title.mathjax')?.innerText.replace('Title:', '').trim() || "这篇文章";

    // 2. 创建按钮
    const btn = document.createElement('button');
    btn.innerHTML = `🚀 AI 解读论文`;
    // ... 样式保持不变 (见前一条回复) ...
    Object.assign(btn.style, {
        position: 'fixed', top: '20px', right: '20px', zIndex: '10000',
        padding: '12px 20px', backgroundColor: '#10a37f', color: 'white',
        border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
    });

    // 悬停动画
    btn.onmouseover = () => btn.style.transform = 'scale(1.05)';
    btn.onmouseout = () => btn.style.transform = 'scale(1)';

    btn.onclick = () => {
        chrome.storage.local.get(['customTemplate', 'targetAI'], (res) => {
            const target = res.targetAI || 'chatgpt';
            let template = res.customTemplate || defaultTemplate;
            let finalPrompt = template.replace('${title}', paperTitle).replace('${url}', pdfUrl);

            // 将任务存入 storage
            chrome.storage.local.set({ 'pendingArxivTask': finalPrompt }, () => {
                const url = target === 'gemini' ? 'https://gemini.google.com/app' : 'https://chatgpt.com/';
                window.open(url, '_blank');
            });
        });
    };

    document.body.appendChild(btn);
})();