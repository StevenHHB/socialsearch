import { NextResponse } from 'next/server';
import { createServerClient } from "@supabase/ssr";

export async function GET() {
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    { cookies: {} }
  );

  try {
    const { data: posts, error } = await supabase
      .from('BlogPost')
      .select('*')
      .order('createdAt', { ascending: false })
      .limit(10);

    if (error) throw error;

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" 
         xmlns:atom="http://www.w3.org/2005/Atom"
         xmlns:content="http://purl.org/rss/1.0/modules/content/"
         xmlns:dc="http://purl.org/dc/elements/1.1/"
         xmlns:media="http://search.yahoo.com/mrss/">
      <channel>
        <title>SocialTargeter Blog</title>
        <link>${baseUrl}</link>
        <description>Latest insights on social media lead generation and marketing automation</description>
        <language>en</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml"/>
        <image>
          <url>${baseUrl}/images/logo.png</url>
          <title>SocialTargeter Blog</title>
          <link>${baseUrl}</link>
        </image>
        ${posts.map(post => `
          <item>
            <title>${post.title}</title>
            <link>${baseUrl}/blogs/${post.slug}</link>
            <guid isPermaLink="true">${baseUrl}/blogs/${post.slug}</guid>
            <description><![CDATA[${post.excerpt}]]></description>
            <content:encoded><![CDATA[${post.content}]]></content:encoded>
            <dc:creator>${post.author}</dc:creator>
            <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
            ${post.image ? `
            <media:content 
              url="${post.image}"
              medium="image"
              type="image/jpeg"
            />` : ''}
            <category>Social Media Marketing</category>
            <category>Lead Generation</category>
          </item>
        `).join('')}
      </channel>
    </rss>`;

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
}
