export type UserType = "investor" | "student" | "founder" | "exploring" | null;
export type Interest = "stocks" | "startups" | "economy" | "global" | "tech" | "finance";
export type Goal = "invest" | "stay_updated" | "learn" | null;
export type NotificationPref = "realtime" | "key_only" | "daily" | "none" | null;

export interface UserPreferences {
  userType: UserType;
  selectedInterests: Interest[];
  goal: Goal;
  notificationPref: NotificationPref;
  hasCompletedOnboarding: boolean;
}

export interface Topic {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  time: string;
  hasBriefing: boolean;
  readTime: string;
  icon: React.ElementType;
}

export interface AIResponse {
  mode: string;
  content: string;
  timestamp: number;
  error?: string;
}

export interface BriefingSection {
  title: string;
  content: string;
}

export interface Source {
  name: string;
  category: string;
  url: string;
}
