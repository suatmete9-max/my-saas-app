import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  return handleRequest(req);
}

export async function GET(req: Request) {
  return handleRequest(req);
}

async function handleRequest(req: Request) {
  try {
    const url = new URL(req.url);
    let apiKey = req.headers.get('x-api-key') || url.searchParams.get('apiKey') || url.searchParams.get('apikey');
    let pageId = url.searchParams.get('pageId') || url.searchParams.get('pageid');

    if (req.method === 'POST') {
      try {
        const body = await req.json();
        if (!apiKey && body.apiKey) apiKey = body.apiKey;
        if (!pageId && body.pageId) pageId = body.pageId;
      } catch {}
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'Unauthorized key. Please enter a valid API key or subscribe.' }, { status: 401 });
    }

    if (!pageId) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
    }

    const cleanPageId = pageId.trim().replace(/-/g, '');
    const notionToken =
      process.env.NOTION_INTEGRATION_TOKEN ||
      process.env.NOTION_API_KEY ||
      process.env.NOTION_SECRET_KEY;

    if (!notionToken) {
      return NextResponse.json(
        { error: 'Notion token not configured in server environment variables' },
        { status: 500 }
      );
    }

    const notionRes = await fetch(
      `https://api.notion.com/v1/blocks/${cleanPageId}/children?page_size=100`,
      {
        headers: {
          Authorization: `Bearer ${notionToken.trim()}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
      }
    );

    const text = await notionRes.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: 'Invalid response from Notion API', details: text }, { status: 502 });
    }

    return NextResponse.json(data, { 
      status: notionRes.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', message: error?.message }, { status: 500 });
  }
}
