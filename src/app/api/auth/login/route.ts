import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { authenticateUser, generateToken, getUserPreferences } = await import("@/lib/auth");
    const { isValidEmail, isValidPassword, sanitizeString } = await import("@/lib/validation");
    
    const body = await request.json();
    const email = sanitizeString(body.email?.toLowerCase());
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const user = await authenticateUser(email, password);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = generateToken(user.id);
    const preferences = await getUserPreferences(user.id);

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name || "",
        avatarUrl: user.avatarUrl,
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
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
