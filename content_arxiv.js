(function() {
    // 1. 提取 PDF 链接（arxiv 的结构比较稳定，通常可以直接推导）
    const pdfUrl = window.location.href.replace('abs', 'pdf') + ".pdf";
    const paperTitle = document.querySelector('h1.title.mathjax')?.innerText.replace('Title:', '').trim() || "这篇文章";

    // 2. 创建按钮
    const btn = document.createElement('button');
    btn.innerHTML = `
        <span style="margin-right: 8px;">🚀</span>
        ChatGPT 论文解读
    `;
    
    // 3. 按钮样式（放在页面右上角，采用 ChatGPT 标志性的绿色）
    Object.assign(btn.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: '10000',
        padding: '12px 20px',
        backgroundColor: '#10a37f',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        transition: 'transform 0.2s'
    });

    // 悬停动画
    btn.onmouseover = () => btn.style.transform = 'scale(1.05)';
    btn.onmouseout = () => btn.style.transform = 'scale(1)';

    // 4. 点击逻辑
    btn.onclick = () => {
        const prompt = `你好！请帮我深度解读这篇名为《${paperTitle}》的论文。
请重点分析：
1. 论文解决了什么问题？
2. 核心创新点和方法论是什么？
3. 实验结果说明了什么？
4. 有哪些潜在的局限性？
5. 几句话总结这篇论文的核心内容。

论文 PDF 链接：${pdfUrl}`;

        // 将任务存入存储空间
        chrome.storage.local.set({ 'pendingArxivTask': prompt }, () => {
            window.open('https://chatgpt.com/', '_blank');
        });
    };

    document.body.appendChild(btn);
})();