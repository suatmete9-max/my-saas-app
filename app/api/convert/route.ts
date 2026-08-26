import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { pageId } = await req.json();
    if (!pageId) return NextResponse.json({ error: "Page ID is required" }, { status: 400 });

    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    const response = await notion.blocks.children.list({ block_id: pageId });

    return NextResponse.json({ success: true, api_data: response.results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}