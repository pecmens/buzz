import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(gfm)  // 支持 GitHub Flavored Markdown
    .use(html) // 将Markdown转换为HTML
    .process(markdown);
  
  return result.toString();
}