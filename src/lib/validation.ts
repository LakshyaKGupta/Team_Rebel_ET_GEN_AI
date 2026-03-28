function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password: string): boolean {
  return typeof password === "string" && password.length >= 6;
}

function sanitizeString(str: string | undefined): string | undefined {
  if (!str) return undefined;
  return str.replace(/[<>]/g, "").trim().slice(0, 255);
}

export { isValidEmail, isValidPassword, sanitizeString };
