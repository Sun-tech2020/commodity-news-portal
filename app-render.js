/**
 * 郑商所·研究所 · 大宗商品新闻网 - 前端页面动态数据渲染与交互引擎
 */

window._newsCache = window._newsCache || {};

document.addEventListener('DOMContentLoaded', async () => {
  // 确保 supabase 初始化
  if (!window.newsDataManager || !window.newsDataManager.client) {
    if (window.supabase) {
      window.newsDataManager.initClient();
    }
  }

  const currentPath = window.location.pathname;

  // 1. 首页渲染逻辑 (code.html 或 根路径)
  if (currentPath.endsWith('code.html') || currentPath.endsWith('/') || currentPath.endsWith('index.html')) {
    await renderHomepage();
  }

  // 2. 子页面渲染逻辑
  const channelMap = {
    'exchange-updates.html': 'exchange-updates',
    'market-news.html': 'market-news',
    'regulatory-updates.html': 'regulatory-updates',
    'macro-insights.html': 'macro-insights'
  };

  for (const [filename, catKey] of Object.entries(channelMap)) {
    if (currentPath.includes(filename)) {
      await renderChannelPage(catKey);
      break;
    }
  }
});

/**
 * 首页渲染：仅展示当日新闻，头条 + 各板块多重点卡片 + 普通列表
 */
async function renderHomepage() {
  const data = await window.newsDataManager.fetchTodayNews();
  if (!data) return;

  const { headline, categories } = data;

  // 渲染今日头条 (display_priority = 2)
  if (headline) {
    window._newsCache[headline.title] = headline;
    const headlineSection = document.querySelector('section.bg-surface-container-lowest.rounded-lg');
    if (headlineSection) {
      const h2 = headlineSection.querySelector('h2');
      const p = headlineSection.querySelector('p');
      if (h2) h2.textContent = headline.title;
      if (p) {
        // 取正文第一段作为摘要
        const firstPara = headline.content.split('\n')[0] || headline.content;
        p.textContent = firstPara;
      }
    }
  }

  // 渲染 4 个板块
  const colLinks = {
    'exchange-updates': 'exchange-updates.html',
    'market-news': 'market-news.html',
    'regulatory-updates': 'regulatory-updates.html',
    'macro-insights': 'macro-insights.html'
  };

  for (const [catKey, catData] of Object.entries(categories)) {
    const targetLink = document.querySelector(`a[href="${colLinks[catKey]}"]`);
    if (!targetLink) continue;

    const columnCard = targetLink.closest('.bg-surface-container-lowest');
    if (!columnCard) continue;

    const masthead = columnCard.querySelector('.flex.items-center.justify-between.pb-space-sm');
    if (!masthead) continue;

    // 移除原有内容容器
    const oldContainer = masthead.nextElementSibling;
    if (oldContainer) {
      oldContainer.remove();
    }
    // 移除多余的旧 article
    columnCard.querySelectorAll('article, .space-y-space-sm').forEach(el => el.remove());

    // 创建新的新闻集合容器
    const newsContainer = document.createElement('div');
    newsContainer.className = 'flex flex-col flex-1';

    // 1. 重点展示 (display_priority = 1, 可以有多个，蓝条卡片样式)
    if (catData.highlights && catData.highlights.length > 0) {
      catData.highlights.forEach(item => {
        window._newsCache[item.title] = item;
        const article = document.createElement('article');
        article.className = 'bg-[#EBF3FC] border border-[#ABC7FC]/60 p-space-sm rounded-lg mb-space-sm relative overflow-hidden transition-all hover:shadow-sm cursor-pointer group';
        
        const summary = item.content.split('\n')[0] || item.content;
        article.innerHTML = `
          <div class="absolute top-0 left-0 w-1 h-full bg-[#004098]"></div>
          <h4 class="font-headline-sm text-headline-sm text-[#004098] font-bold pl-1 mb-1 leading-snug group-hover:underline">
            ${escapeHtml(item.title)}
          </h4>
          <p class="font-body-sm text-body-sm text-secondary pl-1 line-clamp-2 mb-0 leading-relaxed">
            ${escapeHtml(summary)}
          </p>
        `;
        article.addEventListener('click', () => {
          if (window.newsModal) window.newsModal.open(item);
        });
        newsContainer.appendChild(article);
      });
    }

    // 2. 普通新闻列表 (display_priority = 0, 常规行)
    if (catData.regular && catData.regular.length > 0) {
      const regularList = document.createElement('div');
      regularList.className = 'space-y-space-sm mt-1';

      catData.regular.forEach(item => {
        window._newsCache[item.title] = item;
        const row = document.createElement('div');
        row.className = 'py-1.5 flex items-start justify-between gap-space-xs hover:bg-surface-container-low px-1 rounded transition-colors group cursor-pointer';
        row.innerHTML = `
          <div class="flex items-start gap-1.5 min-w-0">
            <span class="w-1.5 h-1.5 rounded-full bg-[#004098] mt-1.5 shrink-0"></span>
            <span class="font-body-sm text-body-sm text-on-surface group-hover:text-[#004098] line-clamp-1 transition-colors">
              ${escapeHtml(item.title)}
            </span>
          </div>
        `;
        row.addEventListener('click', () => {
          if (window.newsModal) window.newsModal.open(item);
        });
        regularList.appendChild(row);
      });
      newsContainer.appendChild(regularList);
    }

    columnCard.appendChild(newsContainer);
  }
}

/**
 * 子页面渲染：历史新闻 + 最多 5 页分页器
 */
async function renderChannelPage(categoryKey) {
  const container = document.querySelector('section.bg-surface-container-lowest');
  if (!container) return;

  const ul = container.querySelector('ul.flex.flex-col');
  if (!ul) return;

  // 加载指定页
  async function loadPage(pageNumber) {
    ul.innerHTML = `
      <div class="py-12 flex flex-col items-center justify-center text-secondary gap-2">
        <svg class="animate-spin w-6 h-6 text-[#004098]" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
        <span class="text-xs">正在同步云端历史资讯...</span>
      </div>
    `;

    const res = await window.newsDataManager.fetchChannelNews(categoryKey, pageNumber, 10);
    if (!res || res.items.length === 0) {
      ul.innerHTML = `<li class="py-8 text-center text-secondary text-sm">暂无该频道新闻数据</li>`;
      return;
    }

    // 渲染新闻列表项
    ul.innerHTML = '';
    res.items.forEach(item => {
      window._newsCache[item.title] = item;
      const li = document.createElement('li');
      li.className = 'py-3.5 px-3 flex items-center justify-between hover:bg-surface-container-low/70 rounded transition-colors group cursor-pointer border-b border-surface-container-low last:border-b-0';
      li.innerHTML = `
        <div class="flex items-center gap-3 min-w-0 pr-4">
          <span class="w-1.5 h-1.5 rounded-full ${item.display_priority === 1 ? 'bg-[#004098] ring-2 ring-[#004098]/20' : 'bg-[#004098]'} shrink-0"></span>
          <span class="font-body-md text-body-md text-on-surface group-hover:text-[#004098] transition-colors truncate">
            ${escapeHtml(item.title)}
          </span>
          <span class="text-xs text-secondary/60 hidden sm:inline shrink-0 font-mono">
            ${item.publish_date}
          </span>
        </div>
        <svg class="w-4 h-4 text-secondary/40 group-hover:text-[#004098] group-hover:translate-x-0.5 transition-all shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
      `;
      li.addEventListener('click', () => {
        if (window.newsModal) window.newsModal.open(item);
      });
      ul.appendChild(li);
    });

    // 渲染分页器 (限制最多 5 页)
    renderPagination(res.currentPage, res.totalPages);
  }

  function renderPagination(currentPage, totalPages) {
    let paginationContainer = container.querySelector('#channel-pagination');
    if (!paginationContainer) {
      paginationContainer = document.createElement('div');
      paginationContainer.id = 'channel-pagination';
      paginationContainer.className = 'flex items-center justify-between pt-space-lg mt-space-md border-t border-surface-container-low text-xs text-secondary';
      container.appendChild(paginationContainer);
    }

    const pages = Math.min(totalPages, 5); // 严格最多放 5 页
    let pageButtonsHtml = '';

    for (let p = 1; p <= pages; p++) {
      if (p === currentPage) {
        pageButtonsHtml += `<span class="px-2.5 py-1 rounded bg-[#004098] text-white font-bold cursor-default shadow-xs">${p}</span>`;
      } else {
        pageButtonsHtml += `<button data-page="${p}" class="page-nav-btn px-2.5 py-1 rounded hover:bg-surface-container text-on-surface transition-colors cursor-pointer">${p}</button>`;
      }
    }

    if (currentPage < pages) {
      pageButtonsHtml += `<button data-page="${currentPage + 1}" class="page-nav-btn px-2.5 py-1 rounded hover:bg-surface-container text-[#004098] font-medium transition-colors cursor-pointer">下一页</button>`;
    }

    paginationContainer.innerHTML = `
      <div class="flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
        <span>历史新闻资讯库（最多归档 5 页）</span>
      </div>
      <div class="flex items-center gap-1.5">
        ${pageButtonsHtml}
      </div>
    `;

    // 绑定分页按钮点击事件
    paginationContainer.querySelectorAll('.page-nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetPage = parseInt(e.currentTarget.getAttribute('data-page'));
        if (targetPage) {
          loadPage(targetPage);
        }
      });
    });
  }

  // 初始加载第 1 页
  await loadPage(1);
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
