import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/lib/auth";
import { isValidEmail, isValidPassword, sanitizeString } from "@/lib/validation";

const DEMO_USERS = [
  { id: "demo-1", email: "demo@et.com", name: "Demo User", password: "demo123", avatarUrl: null },
  { id: "demo-2", email: "investor@et.com", name: "Investor User", password: "investor123", avatarUrl: null },
  { id: "demo-3", email: "founder@et.com", name: "Founder User", password: "founder123", avatarUrl: null },
];

export async function POST(request: NextRequest) {
  try {
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

    let user = null;
    
    try {
      const { authenticateUser, getUserPreferences } = await import("@/lib/auth");
      user = await authenticateUser(email, password);
    } catch (dbError) {
      console.log("Database not available, using demo mode");
    }

    if (!user) {
      const demoUser = DEMO_USERS.find(u => u.email === email && u.password === password);
      if (demoUser) {
        user = { id: demoUser.id, email: demoUser.email, name: demoUser.name, avatarUrl: demoUser.avatarUrl };
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = generateToken(user.id);
    
    let preferences = {
      userType: "exploring" as const,
      selectedInterests: ["business", "technology"],
      goal: null,
      notificationPref: "key" as const,
      hasCompletedOnboarding: true,
      theme: "light" as const,
      notificationsEnabled: true,
      emailUpdates: false,
    };

    try {
      const { getUserPreferences } = await import("@/lib/auth");
      const dbPreferences = await getUserPreferences(user.id);
      if (dbPreferences) {
        preferences = {
          userType: dbPreferences.userType as typeof preferences.userType || "exploring",
          selectedInterests: dbPreferences.selectedInterests || preferences.selectedInterests,
          goal: dbPreferences.goal as typeof preferences.goal,
          notificationPref: dbPreferences.notificationPref as typeof preferences.notificationPref || "key",
          hasCompletedOnboarding: dbPreferences.hasCompletedOnboarding ?? true,
          theme: (dbPreferences.theme as typeof preferences.theme) || "light",
          notificationsEnabled: dbPreferences.notificationsEnabled ?? true,
          emailUpdates: dbPreferences.emailUpdates ?? false,
        };
      }
    } catch (e) {
      console.log("Using default preferences");
    }

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      preferences,
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
