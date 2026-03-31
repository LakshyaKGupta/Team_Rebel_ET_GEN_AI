import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const DEMO_USERS: Record<string, { id: string; email: string; name: string; avatarUrl: string | null; createdAt: Date }> = {};

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    let user = null;
    
    try {
      const { getUserById, getUserPreferences } = await import("@/lib/auth");
      user = await getUserById(payload.userId);
      
      if (user) {
        const preferences = await getUserPreferences(user.id);
        return NextResponse.json({
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            avatarUrl: user.avatarUrl,
            createdAt: user.createdAt,
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
        });
      }
    } catch (e) {
      console.log("Database not available, using demo mode");
    }

    if (DEMO_USERS[payload.userId]) {
      user = DEMO_USERS[payload.userId];
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
      preferences: {
        userType: "exploring",
        selectedInterests: ["business", "technology"],
        goal: null,
        notificationPref: "key",
        hasCompletedOnboarding: true,
        theme: "light",
        notificationsEnabled: true,
        emailUpdates: false,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
