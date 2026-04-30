import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Clerk webhook event types we care about
interface ClerkEmailAddress {
  email_address: string;
  id: string;
}

interface ClerkUserCreatedEvent {
  type: "user.created";
  data: {
    id: string;
    email_addresses: ClerkEmailAddress[];
    first_name: string | null;
    last_name: string | null;
  };
}

type ClerkWebhookEvent = ClerkUserCreatedEvent;

export async function POST(req: Request) {
  // ── 1. Verify the webhook signature using svix ──────────────────────────────
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("CLERK_WEBHOOK_SECRET is not set.");
    return NextResponse.json(
      { error: "Server misconfiguration." },
      { status: 500 }
    );
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: "Missing svix headers." },
      { status: 400 }
    );
  }

  const body = await req.text();

  let event: ClerkWebhookEvent;
  try {
    const wh = new Webhook(webhookSecret);
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 401 }
    );
  }

  // ── 2. Handle user.created event ────────────────────────────────────────────
  if (event.type === "user.created") {
    const { id: clerk_id, email_addresses, first_name, last_name } = event.data;

    const email = email_addresses?.[0]?.email_address ?? null;
    const name = [first_name, last_name].filter(Boolean).join(" ") || null;

    if (!email) {
      console.error("No email address found for user_id:", clerk_id);
      return NextResponse.json({ error: "No email found." }, { status: 400 });
    }

    console.log('✅ Webhook received for user:', email);

    // ── 3. Insert into Supabase users table (using service role key) ───────────
    console.log('Attempting to insert:', { user_id: clerk_id, email });

    if (!supabaseAdmin) {
      console.error("supabaseAdmin is not initialized — SUPABASE_SERVICE_ROLE_KEY is missing.");
      return NextResponse.json({ error: "Server misconfiguration." }, { status: 500 });
    }

    const { error } = await supabaseAdmin.from("users").insert({
      user_id: clerk_id,
      email: email,
      name: name,
      credits: 10,
    });

    if (error) {
      // Ignore duplicate inserts (user already exists)
      if (error.code === "23505") {
        console.warn("User already exists in Supabase. user_id:", clerk_id);
        return NextResponse.json({ message: "User already exists." });
      }
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Database insert failed." },
        { status: 500 }
      );
    }

    console.log(`✅ Ghost Creator Synced: ${name} is now in Supabase.`);
    return NextResponse.json({ message: "User synced successfully." });
  }

  // Acknowledge other event types without processing them
  return NextResponse.json({ message: "Event received." });
}
