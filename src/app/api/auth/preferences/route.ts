import { NextRequest, NextResponse } from "next/server";
import { verifyToken, updateUserPreferences, getUserPreferences } from "@/lib/auth";

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

    const preferences = await getUserPreferences(payload.userId);

    return NextResponse.json({ preferences });
  } catch (error) {
    console.error("Get preferences error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    
    const {
      theme,
      notificationsEnabled,
      emailUpdates,
      userType,
      selectedInterests,
      goal,
      notificationPref,
      hasCompletedOnboarding,
      experienceLevel,
      riskAppetite,
      timeHorizon,
    } = body;

    const preferences = await updateUserPreferences(payload.userId, {
      theme,
      notificationsEnabled,
      emailUpdates,
      userType,
      selectedInterests,
      goal,
      notificationPref,
      hasCompletedOnboarding,
      experienceLevel,
      riskAppetite,
      timeHorizon,
    });

    return NextResponse.json({ preferences });
  } catch (error) {
    console.error("Update preferences error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
