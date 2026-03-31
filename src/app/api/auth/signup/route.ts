import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/lib/auth";
import { isValidEmail, isValidPassword, sanitizeString } from "@/lib/validation";

const DEMO_USERS: Record<string, { id: string; email: string; name: string; password: string; avatarUrl: string | null }> = {};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = sanitizeString(body.email?.toLowerCase());
    const password = body.password;
    const name = sanitizeString(body.name);

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

    let existingUser = null;
    try {
      const { getUserByEmail } = await import("@/lib/auth");
      existingUser = await getUserByEmail(email);
    } catch (e) {
      if (DEMO_USERS[email]) {
        existingUser = { email };
      }
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    let user: { id: string; email: string; name: string; avatarUrl: string | null };
    
    try {
      const { createUser } = await import("@/lib/auth");
      user = await createUser(email, password, name);
    } catch (e) {
      const userId = `demo-${Date.now()}`;
      DEMO_USERS[email] = { id: userId, email, name: name || "User", password, avatarUrl: null };
      user = { id: userId, email, name: name || "User", avatarUrl: null };
    }

    const token = generateToken(user.id);

    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
        token,
      },
      { status: 201 }
    );

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
