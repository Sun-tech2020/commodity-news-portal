# 大宗商品新闻网

权威 · 及时 · 专业的期货与衍生品资讯平台

## 一、 系统架构
本项目基于现代 **Serverless / Jamstack** 架构开发：
* **前端**：Vanilla HTML5 + TailwindCSS + 原生高性能 JavaScript，极简金融专业设计，零页面跳转，全站毛玻璃详情弹窗；
* **云端数据库**：**Supabase (PostgreSQL)**，支持高并发实时数据同步；
* **全球分发**：托管于 **Netlify** 全球 CDN 边缘节点，秒级响应，自动 HTTPS。

## 二、 核心业务逻辑
1. **所属板块 (`category`)**：
   * `exchange-updates`（交易所动态）
   * `market-news`（市场动态）
   * `regulatory-updates`（监管动态）
   * `macro-insights`（宏观市场动态）
2. **展示优先级 (`display_priority`)**：
   * `0`：普通新闻（排在重点新闻后，常规列表行样式）；
   * `1`：板块重点展示（置顶于所属板块最前，每个板块支持多个，呈深蓝竖条高亮卡片样式）；
   * `2`：今日头条要闻（置顶于首页焦点要闻展示）。
3. **展示规则**：
   * **首页**：严格展示当日新闻；
   * **子页面**：展示历史新闻，最多放 5 页（带无刷新动态分页器）。
4. **运维采编后台 (`admin.html`)**：
   * 运维人员每天访问 `/admin.html`（或 `/admin`）即可录入当日新闻，即时写入 Supabase，全网秒级同步更新。

## 三、 本地运行与开发
直接使用任意静态服务器打开：
```bash
npx serve .
# 或直接双击用浏览器打开 code.html
```

## 四、 Netlify 部署
代码推送到 GitHub 后，在 Netlify 关联本仓库即可自动完成全球发布。
