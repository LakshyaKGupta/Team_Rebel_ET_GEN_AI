import { NextRequest, NextResponse } from "next/server";
import { createUser, generateToken, getUserByEmail } from "@/lib/auth";
import { isValidEmail, isValidPassword, sanitizeString } from "@/lib/validation";

export const dynamic = 'force-dynamic';

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

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const user = await createUser(email, password, name);
    const token = generateToken(user.id);

    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name || "",
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
