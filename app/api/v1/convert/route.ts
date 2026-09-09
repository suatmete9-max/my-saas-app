import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) { return handleRequest(req); }
export async function GET(req: Request) { return handleRequest(req); }

async function handleRequest(req: Request) {
  try {
    const url = new URL(req.url);
    let apiKey = req.headers.get("x-api-key") || url.searchParams.get("apiKey") || url.searchParams.get("apikey");
    let pageId = url.searchParams.get("pageId") || url.searchParams.get("pageid");

    if (req.method === "POST") {
      try {
        const body = await req.json();
        if (!apiKey && body.apiKey) apiKey = body.apiKey;
        if (!pageId && body.pageId) pageId = body.pageId;
      } catch {}
    }

    if (!pageId) {
      return NextResponse.json({ error: "Page ID is required" }, { status: 400 });
    }

    const cleanPageId = pageId.trim().replace(/-/g, "");
    const token = process.env.NOTION_INTEGRATION_TOKEN || process.env.NOTION_API_KEY || process.env.NOTION_SECRET_KEY || "";

    if (!token) {
      return NextResponse.json({ error: "NOTION_INTEGRATION_TOKEN is missing in environment variables." }, { status: 500 });
    }

    const res = await fetch(`https://api.notion.com/v1/blocks/${cleanPageId}/children?page_size=100`, {
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return NextResponse.json(data, {
      status: res.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-api-key",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Internal Server Error", message: err?.message }, { status: 500 });
  }
}