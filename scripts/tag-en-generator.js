const pagination = require('hexo-pagination');

hexo.extend.generator.register('tag-i18n-en', function(locals) {
  const config = this.config;
  const tagConfig = config.tag_generator || {};
  const perPage = typeof tagConfig.per_page !== 'undefined' ? tagConfig.per_page : config.per_page;
  const paginationDir = tagConfig.pagination_dir || config.pagination_dir || 'page';
  const pages = [];

  locals.tags.forEach(tag => {
    const enPosts = tag.posts.toArray().filter(post => post.lang === 'en');
    if (!enPosts.length) return;
    const base = `en/${tag.path}`;
    const data = {
      tag: tag.name,
      posts: enPosts,
      base: base,
      total: enPosts.length,
      lang: 'en'
    };
    const paginated = pagination(base, enPosts, {
      perPage,
      layout: ['tag'],
      format: `${paginationDir}/%d/`,
      data
    });
    pages.push(...paginated);
  });

  return pages;
});
