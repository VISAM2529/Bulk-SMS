import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import Contact from "../../../../models/Contact";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    console.log("WhatsApp webhook received:", data);

    const senderNumber = data.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from;
    if (!senderNumber) {
      return NextResponse.json({ message: "No sender number found" }, { status: 400 });
    }

    const normalizedNumber = senderNumber.replace(/[^0-9]/g, "");

    // Mark contact as opted-in (for any inbound message)
    await Contact.findOneAndUpdate(
      { phoneNumber: normalizedNumber },
      { phoneNumber: normalizedNumber, optedIn: true, optedInAt: new Date(), name: data.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.profile?.name || normalizedNumber },
      { upsert: true }
    );

    return NextResponse.json({ status: "received" });
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Handle webhook verification
  const mode = req.nextUrl.searchParams.get("hub.mode");
  const token = req.nextUrl.searchParams.get("hub.verify_token");
  const challenge = req.nextUrl.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_WEBHOOK_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ message: "Webhook verification failed" }, { status: 403 });
}