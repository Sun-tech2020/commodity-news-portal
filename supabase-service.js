/**
 * 郑商所·研究所 · 大宗商品新闻网 - Supabase 云端数据驱动与渲染层
 */

const SUPABASE_CONFIG = {
  url: 'https://nyfkydlmqoojocgqjjdk.supabase.co',
  anonKey: 'sb_publishable_vzlirkATR-WLtGlFp9rPUA_w-hn1YNP'
};

// 板块中文名称映射
const CATEGORY_NAMES = {
  'exchange-updates': '交易所动态',
  'market-news': '市场动态',
  'regulatory-updates': '监管动态',
  'macro-insights': '宏观市场动态'
};

class NewsDataManager {
  constructor() {
    this.client = null;
    this.initClient();
  }

  initClient() {
    if (window.supabase) {
      this.client = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    }
  }

  // 获取当前日期字符串 YYYY-MM-DD
  getTodayString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // 1. 首页：获取当日新闻
  async fetchTodayNews() {
    try {
      const todayStr = this.getTodayString();
      
      // 优先获取当天真实新闻（id > 48 彻底排除测试种子数据）
      let { data, error } = await this.client
        .from('news')
        .select('*')
        .gt('id', 48)
        .eq('publish_date', todayStr)
        .order('display_priority', { ascending: false })
        .order('id', { ascending: false });

      if (error) throw error;

      // 如果当天新闻为空，降级获取最新一天的真实新闻记录
      if (!data || data.length === 0) {
        const latestResp = await this.client
          .from('news')
          .select('publish_date')
          .gt('id', 48)
          .order('publish_date', { ascending: false })
          .limit(1);
        
        if (latestResp.data && latestResp.data.length > 0) {
          const latestDate = latestResp.data[0].publish_date;
          const fallbackResp = await this.client
            .from('news')
            .select('*')
            .gt('id', 48)
            .eq('publish_date', latestDate)
            .order('display_priority', { ascending: false })
            .order('id', { ascending: false });
          data = fallbackResp.data || [];
        }
      }

      // 归并数据：头条 (priority=2)，各板块重点 (priority=1, 可以有多个)，各板块普通 (priority=0)
      let headline = null;
      const categoriesData = {
        'exchange-updates': { highlights: [], regular: [] },
        'market-news': { highlights: [], regular: [] },
        'regulatory-updates': { highlights: [], regular: [] },
        'macro-insights': { highlights: [], regular: [] }
      };

      data.forEach(item => {
        if (item.display_priority === 2 && !headline) {
          headline = item;
        }

        const cat = item.category;
        if (categoriesData[cat]) {
          if (item.display_priority === 1) {
            // 板块重点展示，放入 highlights（不限数量）
            categoriesData[cat].highlights.push(item);
          } else if (item.display_priority === 0) {
            // 普通新闻
            categoriesData[cat].regular.push(item);
          } else if (item.display_priority === 2) {
            // 若头条同时归属于该板块，也作为重点展示
            categoriesData[cat].highlights.push(item);
          }
        }
      });

      return { headline, categories: categoriesData };
    } catch (err) {
      console.warn('获取当日新闻异常，使用预置本地视图:', err);
      return null;
    }
  }

  // 2. 子页面：获取该板块的历史新闻（最多支持 5 页分页）
  async fetchChannelNews(category, page = 1, pageSize = 10) {
    try {
      // 业务限制：子页面最多展示 5 页
      if (page > 5) page = 5;
      if (page < 1) page = 1;

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // 仅查询真实新闻（id > 48），总条数上限为 50 条 (5 页 * 10 条)
      const { data, count, error } = await this.client
        .from('news')
        .select('*', { count: 'exact' })
        .gt('id', 48)
        .eq('category', category)
        .order('publish_date', { ascending: false })
        .order('display_priority', { ascending: false })
        .order('id', { ascending: false })
        .range(from, to);

      if (error) throw error;

      const totalItems = Math.min(count || 0, 50); // 最多 50 条
      const totalPages = Math.min(Math.ceil(totalItems / pageSize), 5) || 1;

      return {
        items: data || [],
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalItems
      };
    } catch (err) {
      console.warn(`获取频道 [${category}] 新闻异常:`, err);
      return null;
    }
  }

  // 3. 管理后台：获取最新入库的新闻列表
  async fetchRecentNews(limit = 30) {
    try {
      const { data, error } = await this.client
        .from('news')
        .select('*')
        .gt('id', 48)
        .order('publish_date', { ascending: false })
        .order('id', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('获取近期新闻异常:', err);
      return [];
    }
  }

  // 3. 运维录入：发布新新闻入库
  async insertNews(newsPayload) {
    try {
      const { data, error } = await this.client
        .from('news')
        .insert([newsPayload])
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (err) {
      console.error('发布新闻失败:', err);
      return { success: false, error: err.message || err };
    }
  }
}

window.newsDataManager = new NewsDataManager();
