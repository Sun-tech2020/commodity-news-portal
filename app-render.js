/**
 * 大宗商品新闻网 - 前端页面动态数据渲染与交互引擎
 */

window._newsCache = window._newsCache || {};

document.addEventListener('DOMContentLoaded', async () => {
  // 1. 初始化 Supabase 客户端（若未初始化）
  if (window.newsDataManager && !window.newsDataManager.client) {
    if (window.supabase) {
      window.newsDataManager.initClient();
    }
  }

  const currentPath = window.location.pathname;

  // 2. 判断当前页面类型：首页还是子页面
  const channelMap = {
    'exchange-updates': 'exchange-updates',
    'market-news': 'market-news',
    'regulatory-updates': 'regulatory-updates',
    'macro-insights': 'macro-insights'
  };

  let matchedChannel = null;
  for (const [key, catKey] of Object.entries(channelMap)) {
    if (currentPath.includes(key)) {
      matchedChannel = catKey;
      break;
    }
  }

  if (matchedChannel) {
    // 渲染子页面历史列表与分页
    await renderChannelPage(matchedChannel);
  } else {
    // 渲染首页今日要闻与 4 板块
    await renderHomepage();
  }

  // 3. 绑定全局点击事件委托（确保详情弹窗 100% 触发）
  setupGlobalModalTriggers();
});

/**
 * 首页渲染：当日真实新闻（头条 + 4 大板块重点卡片与普通列表）
 */
async function renderHomepage() {
  if (!window.newsDataManager) return;

  const data = await window.newsDataManager.fetchTodayNews();
  if (!data) return;

  const { headline, categories } = data;

  // 1. 渲染今日头条 (display_priority = 2)
  if (headline) {
    window._newsCache[headline.title] = headline;
    const headlineSection = document.querySelector('section.bg-surface-container-lowest.rounded-lg');
    if (headlineSection) {
      const h2 = headlineSection.querySelector('h2');
      const p = headlineSection.querySelector('p');
      if (h2) h2.textContent = headline.title;
      if (p) {
        const firstPara = headline.content.split('\n')[0] || headline.content;
        p.textContent = firstPara;
      }
      headlineSection.setAttribute('data-title', headline.title);
      headlineSection.classList.add('cursor-pointer');
    }
  }

  // 2. 渲染 4 个板块
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

    // 清理 masthead 下面的旧内容兄弟节点
    let nextNode = masthead.nextElementSibling;
    while (nextNode) {
      const toRemove = nextNode;
      nextNode = nextNode.nextElementSibling;
      toRemove.remove();
    }

    // 创建新的新闻集合容器
    const newsContainer = document.createElement('div');
    newsContainer.className = 'flex flex-col flex-1';

    // 重点展示 (display_priority = 1, 蓝条卡片样式)
    if (catData.highlights && catData.highlights.length > 0) {
      catData.highlights.forEach(item => {
        window._newsCache[item.title] = item;
        const article = document.createElement('article');
        article.className = 'bg-[#EBF3FC] border border-[#ABC7FC]/60 p-space-sm rounded-lg mb-space-sm relative overflow-hidden transition-all hover:shadow-sm cursor-pointer group news-card-item';
        article.setAttribute('data-title', item.title);
        
        let summary = item.content.split('\n')[0] || item.content;
        if (summary.length > 75) summary = summary.substring(0, 75) + '...';

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

    // 普通新闻列表 (display_priority = 0, 常规单行)
    if (catData.regular && catData.regular.length > 0) {
      const regularList = document.createElement('div');
      regularList.className = 'space-y-space-sm mt-1';

      catData.regular.forEach(item => {
        window._newsCache[item.title] = item;
        const row = document.createElement('div');
        row.className = 'py-1.5 flex items-start justify-between gap-space-xs hover:bg-surface-container-low px-1 rounded transition-colors group cursor-pointer news-card-item';
        row.setAttribute('data-title', item.title);
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

    // 挂载到 masthead 之后
    masthead.after(newsContainer);
  }
}

/**
 * 子页面渲染：历史新闻 + 严格最多 5 页分页器
 */
async function renderChannelPage(categoryKey) {
  const container = document.querySelector('section.bg-surface-container-lowest');
  if (!container) return;

  const ul = container.querySelector('ul.flex.flex-col');
  if (!ul) return;

  async function loadPage(pageNumber) {
    const res = await window.newsDataManager.fetchChannelNews(categoryKey, pageNumber, 10);
    if (!res || !res.items || res.items.length === 0) {
      return;
    }

    ul.innerHTML = '';
    res.items.forEach(item => {
      window._newsCache[item.title] = item;
      const li = document.createElement('li');
      li.className = 'py-3.5 px-3 flex items-center justify-between hover:bg-surface-container-low/70 rounded transition-colors group cursor-pointer border-b border-surface-container-low last:border-b-0 news-card-item';
      li.setAttribute('data-title', item.title);
      li.innerHTML = `
        <div class="flex items-center gap-3 min-w-0 pr-4">
          <span class="w-1.5 h-1.5 rounded-full bg-[#004098] shrink-0"></span>
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

    const pages = Math.min(totalPages, 5);
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
        <span>权威内参历史归档（最多 5 页）</span>
      </div>
      <div class="flex items-center gap-1.5">
        ${pageButtonsHtml}
      </div>
    `;

    paginationContainer.querySelectorAll('.page-nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetPage = parseInt(e.currentTarget.getAttribute('data-page'));
        if (targetPage) {
          loadPage(targetPage);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }

  await loadPage(1);
}

/**
 * 全局点击监听（双重兜底，无论是静态 HTML 还是动态生成的元素，点击必能唤起弹窗）
 */
function setupGlobalModalTriggers() {
  document.addEventListener('click', (e) => {
    // 忽略导航栏和更多链接
    if (e.target.closest('header nav a, .masthead-more-link, #news-detail-modal, .page-nav-btn')) {
      return;
    }

    // 1. 头条大卡片
    const headlineSection = e.target.closest('section.bg-surface-container-lowest.rounded-lg');
    if (headlineSection && !headlineSection.closest('.grid')) {
      const h2 = headlineSection.querySelector('h2');
      if (h2) {
        e.preventDefault();
        if (window.newsModal) window.newsModal.open(h2.textContent.trim());
        return;
      }
    }

    // 2. 带 data-title 属性的元素
    const targetWithTitle = e.target.closest('[data-title]');
    if (targetWithTitle) {
      const title = targetWithTitle.getAttribute('data-title');
      if (title && window.newsModal) {
        e.preventDefault();
        window.newsModal.open(title);
        return;
      }
    }

    // 3. 普通卡片或列表项
    const itemEl = e.target.closest('article, li.py-3\\.5, .py-1\\.5');
    if (itemEl) {
      const titleEl = itemEl.querySelector('h4, h3, h2, span.text-on-surface, span.font-body-md');
      if (titleEl && window.newsModal) {
        const title = titleEl.textContent.trim();
        if (title.length > 3) {
          e.preventDefault();
          window.newsModal.open(title);
          return;
        }
      }
    }
  });
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
