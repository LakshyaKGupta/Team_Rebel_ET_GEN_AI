import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { getUserByEmail, createUser, generateToken, getUserPreferences } from "@/lib/auth";
import crypto from "crypto";

export const dynamic = 'force-dynamic';

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(request: NextRequest) {
  try {
    const { credential } = await request.json();

    if (!credential) {
      return NextResponse.json(
        { error: "Google token missing" },
        { status: 400 }
      );
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return NextResponse.json(
        { error: "Invalid Google token payload" },
        { status: 400 }
      );
    }

    const email = payload.email.toLowerCase();
    const name = payload.name || "";
    
    let user = await getUserByEmail(email);

    if (!user) {
      // Create user with randomized secure password since they login via google
      const randomPassword = crypto.randomBytes(32).toString('hex');
      user = await createUser(email, randomPassword, name);
    }

    const token = generateToken(user.id);
    const preferences = await getUserPreferences(user.id);

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name || "",
        avatarUrl: user.avatarUrl || payload.picture,
      },
      preferences: {
        userType: preferences?.userType,
        selectedInterests: preferences?.selectedInterests || [],
        goal: preferences?.goal,
        notificationPref: preferences?.notificationPref,
        hasCompletedOnboarding: preferences?.hasCompletedOnboarding || false,
        theme: preferences?.theme || "light",
        notificationsEnabled: preferences?.notificationsEnabled ?? true,
        emailUpdates: preferences?.emailUpdates ?? false,
      },
      token,
    });

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Google Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
