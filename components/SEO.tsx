import { Metadata } from 'next';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = []
}: SEOProps): Metadata {
  const siteName = 'Buzz Blog';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://buzz-blog.vercel.app';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const imageUrl = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : `${siteUrl}/og-image.jpg`;

  const metadata: Metadata = {
    title: `${title} | ${siteName}`,
    description,
    keywords: keywords.join(', '),
    
    // Open Graph
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'zh_CN',
      type: type === 'article' ? 'article' : 'website',
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : undefined,
        section,
        tags,
      }),
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@buzzblog',
    },

    // 其他元数据
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // 规范链接
    alternates: {
      canonical: fullUrl,
    },

    // 应用信息
    applicationName: siteName,
    generator: 'Next.js',
    referrer: 'origin-when-cross-origin',
    
    // 作者信息
    ...(author && { authors: [{ name: author }] }),

    // 分类信息
    ...(section && { category: section }),
  };

  return metadata;
}

// 结构化数据生成器
export function generateStructuredData(props: SEOProps & { 
  datePublished?: string;
  dateModified?: string;
  wordCount?: number;
  readingTime?: string;
}) {
  const {
    title,
    description,
    author,
    datePublished,
    dateModified,
    image,
    url,
    wordCount,
    readingTime,
    section,
    tags = []
  } = props;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://buzz-blog.vercel.app';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const imageUrl = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : `${siteUrl}/og-image.jpg`;

  // 文章结构化数据
  if (datePublished) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      image: imageUrl,
      url: fullUrl,
      datePublished,
      dateModified: dateModified || datePublished,
      author: {
        '@type': 'Person',
        name: author || 'Buzz Blog',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Buzz Blog',
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/logo.png`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': fullUrl,
      },
      ...(wordCount && { wordCount }),
      ...(readingTime && { 
        timeRequired: readingTime.replace(/\D/g, '') + 'M' // 转换为 ISO 8601 格式
      }),
      ...(section && { articleSection: section }),
      ...(tags.length > 0 && { keywords: tags.join(', ') }),
    };
  }

  // 网站结构化数据
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Buzz Blog',
    description: '技术分享与个人思考的博客',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}