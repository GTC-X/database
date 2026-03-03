"use client";

const STORAGE_KEY = "gtc_user_logged_in";
const USER_EMAIL_KEY = "gtc_user_email";

// Demo login credentials from env (NEXT_PUBLIC_ so they're available client-side)
export const STATIC_EMAIL = process.env.NEXT_PUBLIC_AUTH_EMAIL || "";
export const STATIC_PASSWORD = process.env.NEXT_PUBLIC_AUTH_PASSWORD || "";

export function validateCredentials(email, password) {
  return (
    String(email).trim().toLowerCase() === STATIC_EMAIL.toLowerCase() &&
    password === STATIC_PASSWORD
  );
}

export function setLoggedIn(email) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(STORAGE_KEY, "true");
    sessionStorage.setItem(USER_EMAIL_KEY, email || STATIC_EMAIL);
  }
}

export function setLoggedOut() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(USER_EMAIL_KEY);
  }
}

export function isLoggedIn() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(STORAGE_KEY) === "true";
}

export function getLoggedInEmail() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(USER_EMAIL_KEY);
}
