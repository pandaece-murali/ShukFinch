import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/thank-you'],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'cohere-ai'],
        allow: '/',
        disallow: ['/api/', '/thank-you'],
      },
    ],
    sitemap: 'https://shukfinch.com/sitemap.xml',
    host: 'https://shukfinch.com',
  };
}
