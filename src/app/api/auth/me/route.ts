import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getUserById, getUserPreferences } from "@/lib/auth";

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

    const user = await getUserById(payload.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
