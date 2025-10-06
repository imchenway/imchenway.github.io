---
title: "打造高可见性的个人博客：一次 Hexo SEO 与 Adsense 优化实录"
date: 2025-10-04
lang: zh-CN
tags: ['#SEO', '#Performance', '#Adsense']
---

### 本文目录
<!-- toc -->

# 1. 项目背景与目标
- 站点基于 Hexo + Anatole 主题，长期运行但缺少系统化的 SEO 与广告收益配置。
- 目标是提升搜索可见度、改善页面体验，并让 Google AdSense 自动广告与手动广告位协同工作。
- 本次优化在本地完成后，通过 Hexo 构建并一键发布，确保流程可复用。

# 2. SEO 基础设施与信息架构
## 2.1 明确站点标识
- 在 `_config.yml` 中把 `url` 改为 `https://imchenway.com`，保证 canonical、RSS、分页链接指向真实域名。
- 同步新增 `sitemap` 配置，输出 `public/sitemap.xml` 供搜索引擎抓取[1]。
- 创建 `source/robots.txt`，显式允许抓取并指向 sitemap，有利于快速收录[2]。

## 2.2 元数据与多语言治理
- 在 `themes/anatole/layout/partial/head.pug` 注入 canonical、Open Graph、Twitter Card 元标签，动态拼接标题和描述。
- `themes/anatole/layout/partial/layout.pug` 根据页面或站点语言计算 `<html lang>`，避免英文文章误标中文，有助于国际化 SEO[3]。
- 打开主题的标签云，恢复文章顶部/底部的内部链接，提升站内权重流转效率。

# 3. 性能与可用性优化
## 3.1 图片懒加载与资源压缩
- 引入 `hexo-lazyload-image` 插件，在 `_config.yml` 中启用 `lazyload`，为文章图像自动加上占位图与惰性加载。
- 安装 `hexo-all-minifier`，开启 CSS/JS/HTML 压缩，减少首屏加载体积。

## 3.2 前端细节打磨
- 将公共脚本 (`jquery.js` 等) 改为 `defer`，降低阻塞渲染风险。
- 在文章模板中添加上一页/下一页导航，用最小的改动补上可访问性与用户留存能力。
- 构建后通过 `npx hexo clean && npx hexo generate` 验证输出，确保 sitemap、robots、懒加载、压缩结果全部落盘。

# 4. Adsense 自动广告 + 手动广告联动
## 4.1 自动广告健康度
- 主题头部仅保留一次 `adsbygoogle.js` 脚本，避免重复加载。
- 在 AdSense 后台确认域名“准备就绪”后，使用无痕模式访问线上站点验证自动广告展示。

## 4.2 文章内嵌广告位
- 在 `themes/anatole/layout/post.pug` 增加 `.post-ad` 区块，注入 in-article 广告代码：
```pug
.post-ad
  ins.adsbygoogle(...)
  script.
    (adsbygoogle = window.adsbygoogle || []).push({});
```
- 由于脚本已在头部加载，这里只需 push 请求，既兼容自动广告，也能保证每篇文章都存在稳定的展示位[4]。

# 5. 构建、验证与发布流水
1. `npm install` 安装 sitemap、lazyload、minifier 依赖。 
2. `npx hexo clean && npx hexo generate` 生成静态文件，检查 `public/sitemap.xml`、`public/robots.txt` 与广告片段。 
3. 访问 `public/en/ai-performance-budgeting/index.html`，确认 canonical、OG、广告代码全部生效。 
4. 运行 `/Users/david/hypha/sync-all.sh`，自动执行 pull → build → push，把静态资源同步到 GitHub Pages。 
5. 登录 Google Search Console 提交 `https://imchenway.com/sitemap.xml`，并对新文章执行“URL 检查”请求索引。 

# 6. 经验总结与后续路线
- **配置一致性**：`url`、`canonical`、`robots`、`sitemap` 必须协同，遗漏任何一项都会削弱整体 SEO 效果。
- **主题演进**：通过最小改动改写 Pug 模板即可补齐多语言、可访问性、广告位；未来可考虑迁移到原生支持 Core Web Vitals 的主题。
- **性能与收益并重**：懒加载与压缩降低了首屏负担，也让自动广告更容易获得曝光；后续可继续接入 WebP、Critical CSS 等手段。
- **运营落地**：Search Console 的数据可以反哺内容选题；AdSense 手动广告位则提供了精细化运营的抓手。

# 7. 参考资料
- [1] Hexo 官方文档《Configuration》，https://hexo.io/docs/configuration
- [2] Google Search Central《Sitemaps Overview》，https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
- [3] Google Search Central《Localized Versions》，https://developers.google.com/search/docs/specialty/international/localized-versions
- [4] Google AdSense《Create in-article ads》，https://support.google.com/adsense/answer/9183363

