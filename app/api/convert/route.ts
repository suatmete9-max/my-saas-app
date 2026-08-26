import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get('x-api-key');

    // 1. Validate API Key
    if (!apiKey || apiKey !== 'notion_sec_HDu6BMZK_live') {
      return NextResponse.json({ error: 'Unauthorized key' }, { status: 401 });
    }

    const { pageId } = await req.json();
    if (!pageId) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
    }

    // 2. Fetch Notion Data
    const notionRes = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
      },
    });

    const data = await notionRes.json();

    if (!notionRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch Notion data', details: data }, { status: notionRes.status });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}