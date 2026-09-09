import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature") || "";
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || "";

    // 1. Digital Signature Check (Taaki koi fake signal na bhej sake)
    const hmac = crypto.createHmac("sha256", secret);
    const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
    const signatureBuffer = Buffer.from(signature, "utf8");

    if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;

    // 2. Sirf tab chalega jab payment sach mein clear ho
    if (eventName === "order_created" || eventName === "subscription_created") {
      const email = payload.data.attributes.user_email;
      const customData = payload.meta.custom_data;
      const userId = customData?.user_id;
      const planId = customData?.plan_id || "monthly";

      const daysLookup: Record<string, number> = {
        "10day": 10,
        "monthly": 30,
        "yearly": 365,
      };

      const days = daysLookup[planId] || 30;
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + days);

      // Un-guessable 256-bit Production Key
      const newApiKey = "live_pk_" + crypto.randomBytes(24).toString("hex");

      // 3. Supabase Database Update
      await supabaseAdmin.from("subscriptions").upsert(
        {
          user_id: userId || email,
          user_email: email,
          plan_name: planId.toUpperCase(),
          api_key: newApiKey,
          is_pro: true,
          expires_at: expiry.toISOString(),
        },
        { onConflict: "user_id" }
      );
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Webhook processing failure" }, { status: 500 });
  }
}