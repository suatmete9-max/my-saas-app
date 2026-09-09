import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature") || "";
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || "";

    // Signature verification if secret is provided in environment
    if (secret) {
      const hmac = crypto.createHmac("sha256", secret);
      const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
      const signatureBuffer = Buffer.from(signature, "utf8");

      if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload?.meta?.event_name;
    const customerEmail = payload?.data?.attributes?.user_email;
    const orderId = payload?.data?.id;

    if (eventName === "order_created" || eventName === "subscription_created") {
      console.log(`[PAYMENT VERIFIED] Order ${orderId} confirmed for ${customerEmail}`);
      // Success verified
    }

    return NextResponse.json({ status: "success", received: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: "Webhook Error", message: err.message }, { status: 500 });
  }
}