(function() {
    // 1. 提取 PDF 链接（arxiv 的结构比较稳定，通常可以直接推导）
    const pdfUrl = window.location.href.replace('abs', 'pdf') + ".pdf";
    const paperTitle = document.querySelector('h1.title.mathjax')?.innerText.replace('Title:', '').trim() || "这篇文章";

    // 2. 创建按钮
    const btn = document.createElement('button');
    btn.innerHTML = `🚀 ChatGPT 解读`;
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
        const defaultTemplate = `你好！请帮我深度解读这篇名为《\${title}》的论文。
请重点分析：
1. 论文解决了什么问题？
2. 核心创新点和方法论是什么？
3. 实验结果说明了什么？
论文 PDF 地址：\${url}`;
        
        // 1. 获取用户自定义的模板
        chrome.storage.local.get(['customTemplate'], (res) => {
            let template = res.customTemplate || defaultTemplate;
            
            // 2. 替换变量
            let finalPrompt = template
                .replace('${title}', paperTitle)
                .replace('${url}', pdfUrl);

            // 3. 发送给 ChatGPT
            chrome.storage.local.set({ 'pendingArxivTask': finalPrompt }, () => {
                window.open('https://chatgpt.com/', '_blank');
            });
        });
    };

    document.body.appendChild(btn);
})();