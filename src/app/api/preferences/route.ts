import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    const preferences = await prisma.userPreference.findUnique({
      where: { userId: payload.userId },
    });

    if (!preferences) {
      return NextResponse.json({ preferences: null });
    }

    return NextResponse.json({
      preferences: {
        theme: preferences.theme,
        notificationsEnabled: preferences.notificationsEnabled,
        emailUpdates: preferences.emailUpdates,
        userType: preferences.userType,
        selectedInterests: preferences.selectedInterests ? JSON.parse(preferences.selectedInterests) : [],
        goal: preferences.goal,
        notificationPref: preferences.notificationPref,
        hasCompletedOnboarding: preferences.hasCompletedOnboarding,
      },
    });
  } catch (error) {
    console.error("Get preferences error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
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
    const { theme, notificationsEnabled, emailUpdates } = body;

    const preferences = await prisma.userPreference.update({
      where: { userId: payload.userId },
      data: {
        ...(theme !== undefined && { theme }),
        ...(notificationsEnabled !== undefined && { notificationsEnabled }),
        ...(emailUpdates !== undefined && { emailUpdates }),
      },
    });

    return NextResponse.json({
      preferences: {
        theme: preferences.theme,
        notificationsEnabled: preferences.notificationsEnabled,
        emailUpdates: preferences.emailUpdates,
        userType: preferences.userType,
        selectedInterests: preferences.selectedInterests ? JSON.parse(preferences.selectedInterests) : [],
        goal: preferences.goal,
        notificationPref: preferences.notificationPref,
        hasCompletedOnboarding: preferences.hasCompletedOnboarding,
      },
    });
  } catch (error) {
    console.error("Update preferences error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
