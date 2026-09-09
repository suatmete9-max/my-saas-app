import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;

    if (!apiKey || !storeId || !variantId) {
      return NextResponse.json(
        { error: `Keys missing on Vercel: API Key=${!!apiKey}, Store=${!!storeId}, Variant=${!!variantId}` },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: { custom: { user_id: "user_123" } },
          },
          relationships: {
            store: { data: { type: "stores", id: String(storeId) } },
            variant: { data: { type: "variants", id: String(variantId) } },
          },
        },
      }),
    });

    const resData = await response.json();

    if (!response.ok) {
      const errMsg = resData?.errors?.[0]?.detail || "LemonSqueezy API Error";
      return NextResponse.json({ error: errMsg }, { status: response.status });
    }

    return NextResponse.json({ url: resData?.data?.attributes?.url });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}