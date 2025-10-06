---
title: "Hardening a Hexo Blog: SEO, Performance, and AdSense Tune-Up"
date: 2025-10-04
lang: en
lang_ref: hexo-seo-ads-optimization
permalink: en/hexo-seo-ads-optimization/
tags: ['#SEO', '#Performance', '#AdTech']
---

### Table of Contents
<!-- toc -->

# 1. Starting Point and Objectives
- The blog runs on Hexo with the Anatole theme. It had years of content, but little investment in search hygiene or monetization.
- The mission: align canonical URLs, ship a sitemap and robots policy, improve load experience, and make Google AdSense automatic + manual units work together.
- All work was executed locally, validated with `hexo generate`, and published through the existing sync script for repeatability.

# 2. SEO Plumbing
## 2.1 Make the domain authoritative
- Updated `_config.yml` to use `https://imchenway.com` for `url`, ensuring canonical, RSS, and pagination links point to the live hostname.
- Added a `sitemap` section so Hexo emits `public/sitemap.xml`, then surfaced it in `source/robots.txt` for crawler discovery[1][2].
- Keeping `ads.txt` in place prevents monetization warnings and aligns with AdSense best practice.

## 2.2 Metadata & internationalization
- Extended `themes/anatole/layout/partial/head.pug` with canonical, Open Graph, and Twitter Card tags that respect page titles, excerpts, and full URLs.
- Calculated the `<html lang>` attribute from page metadata or global defaults inside `partial/layout.pug`, so English posts no longer appear as Simplified Chinese in SERPs[3].
- Re-enabled the tag cloud and previous/next navigation to boost internal link density without touching individual posts.

# 3. Performance & Experience Upgrades
## 3.1 Lazyload and minification
- Installed `hexo-lazyload-image`, turning on global lazyload with a neutral placeholder so long-form posts don’t block first paint.
- Added `hexo-all-minifier` to compress CSS, JavaScript, and HTML. Combined with lazyload, this trims network payloads before any CDN work.

## 3.2 Front-end hygiene
- Switched shared scripts (`jquery.js`, `jquery-migrate`, `jquery.appear`) to `defer`, reducing render-blocking time.
- Verified output via `npx hexo clean && npx hexo generate` to inspect the generated HTML, check for lazyload attributes, and ensure no duplicate script tags remained.

# 4. AdSense: automatic + in-article hybrid
- Left a single `adsbygoogle.js` include in the site head so automatic ads can decide placement without script duplication.
- Introduced a `.post-ad` block in `themes/anatole/layout/post.pug` with the provided in-article unit (`data-ad-slot="8561874775"`). Each article ends with:
```pug
.post-ad
  ins.adsbygoogle(...)
  script.
    (adsbygoogle = window.adsbygoogle || []).push({});
```
- The manual slot coexists with automatic ads, giving predictable inventory for long-form readers while leaving the rest to Google’s layout engine[4].

# 5. Build & validation checklist
1. `npm install` after editing `package.json` to pull in sitemap, lazyload, and minifier plugins.  
2. `npx hexo clean && npx hexo generate` to produce static assets; confirm `public/sitemap.xml`, `public/robots.txt`, and the `.post-ad` fragment exist.  
3. Spot-check `public/en/ai-performance-budgeting/index.html` to verify canonical/OG tags and ad markup.  
4. Publish via `/Users/david/hypha/sync-all.sh`, which stashes other repos, builds, commits, and pushes the Hexo site.  
5. Submit `https://imchenway.com/sitemap.xml` in Google Search Console, then run “URL Inspection” on updated posts to prompt reindexing.  

# 6. Lessons & next bets
- **Coherence beats silver bullets**: canonical + sitemap + robots deliver the best return when deployed together.
- **Minimal theme surgery goes a long way**: small Pug tweaks fixed language detection, metadata, and navigation without redesigning the theme.
- **Perf + monetization synergy**: lazyload and minification improve Core Web Vitals and create more opportunities for AdSense to fill impressions.
- **Iteration continues**: future improvements could include WebP conversion, critical CSS inlining, and richer dashboards in Search Console to steer content strategy.

# 7. References
- [1] Hexo Docs, “Configuration,” https://hexo.io/docs/configuration
- [2] Google Search Central, “Sitemaps overview,” https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
- [3] Google Search Central, “Localized versions,” https://developers.google.com/search/docs/specialty/international/localized-versions
- [4] Google AdSense Help, “Create in-article ads,” https://support.google.com/adsense/answer/9183363
