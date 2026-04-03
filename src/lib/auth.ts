import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("Missing JWT_SECRET in production environment variables. Cannot start securely.");
}
const ACTIVE_SECRET = JWT_SECRET || "fallback-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const userWithPreferencesSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  passwordHash: true,
  name: true,
  avatarUrl: true,
  createdAt: true,
  updatedAt: true,
  preferences: true,
});


export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: string): string {
  return jwt.sign(
    { userId },
    ACTIVE_SECRET as jwt.Secret,
    { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
  );
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const payload = jwt.verify(token, ACTIVE_SECRET);
    if (typeof payload === 'object' && payload !== null && 'userId' in payload) {
      return payload as { userId: string };
    }
    return null;
  } catch {
    return null;
  }
}

export async function createUser(email: string, password: string, name?: string) {
  const { prisma } = await import("./prisma");
  const passwordHash = await hashPassword(password);
  
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      preferences: {
        create: {
          theme: "light",
          notificationsEnabled: true,
          emailUpdates: false,
        },
      },
    },
    select: userWithPreferencesSelect,
  });
  
  return user;
}

export async function authenticateUser(email: string, password: string) {
  const { prisma } = await import("./prisma");
  const user = await prisma.user.findUnique({
    where: { email },
    select: userWithPreferencesSelect,
  });
  
  if (!user) return null;
  
  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) return null;
  
  return user;
}

export async function getUserById(userId: string) {
  const { prisma } = await import("./prisma");
  return prisma.user.findUnique({
    where: { id: userId },
    select: userWithPreferencesSelect,
  });
}

export async function getUserByEmail(email: string) {
  const { prisma } = await import("./prisma");
  return prisma.user.findUnique({
    where: { email },
    select: userWithPreferencesSelect,
  });
}

export async function updateUserPreferences(
  userId: string,
  data: {
    theme?: string;
    notificationsEnabled?: boolean;
    emailUpdates?: boolean;
    userType?: string;
    selectedInterests?: string[];
    goal?: string;
    notificationPref?: string;
    hasCompletedOnboarding?: boolean;
    experienceLevel?: string;
    riskAppetite?: string;
    timeHorizon?: string;
  }
) {
  const { prisma } = await import("./prisma");
  return prisma.userPreference.update({
    where: { userId },
    data: {
      ...(data.theme !== undefined && { theme: data.theme }),
      ...(data.notificationsEnabled !== undefined && { notificationsEnabled: data.notificationsEnabled }),
      ...(data.emailUpdates !== undefined && { emailUpdates: data.emailUpdates }),
      ...(data.userType !== undefined && { userType: data.userType }),
      ...(data.selectedInterests !== undefined && { selectedInterests: JSON.stringify(data.selectedInterests) }),
      ...(data.goal !== undefined && { goal: data.goal }),
      ...(data.notificationPref !== undefined && { notificationPref: data.notificationPref }),
      ...(data.hasCompletedOnboarding !== undefined && { hasCompletedOnboarding: data.hasCompletedOnboarding }),
      ...(data.experienceLevel !== undefined && { experienceLevel: data.experienceLevel }),
      ...(data.riskAppetite !== undefined && { riskAppetite: data.riskAppetite }),
      ...(data.timeHorizon !== undefined && { timeHorizon: data.timeHorizon }),
    },
  });
}

export async function getUserPreferences(userId: string) {
  const { prisma } = await import("./prisma");
  const prefs = await prisma.userPreference.findUnique({
    where: { userId },
  });
  
  if (!prefs) return null;
  
  return {
    ...prefs,
    selectedInterests: prefs.selectedInterests ? JSON.parse(prefs.selectedInterests) : [],
  };
}
