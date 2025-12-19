// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config

export default defineConfig({
  site: 'https://example.com',
  output: 'static',
  integrations: [tailwind(), mdx(), sitemap({
    // 配置sitemap选项
    filter: (page) => page !== 'https://example.com/admin', // 排除某些页面
    // 可以添加更多配置选项
  })],
});