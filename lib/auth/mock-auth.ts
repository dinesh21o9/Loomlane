// Mock authentication system for testing without Supabase
// This provides demo credentials and localStorage-based session management

export const TEST_CREDENTIALS = {
  student: {
    email: "student@university.edu",
    password: "demo123456",
    role: "student",
    university: "Stanford University",
  },
  admin: {
    email: "admin@loomlane.com",
    password: "admin123456",
    role: "admin",
    university: "Loomlane HQ",
  },
  superadmin: {
    email: "superadmin@loomlane.com",
    password: "super123456",
    role: "superadmin",
    university: "Loomlane HQ",
  },
}

export interface MockUser {
  id: string
  email: string
  role: "student" | "admin" | "superadmin"
  university: string
  createdAt: string
}

const MOCK_USER_KEY = "mock_user"
const MOCK_TOKEN_KEY = "mock_session_token"
const MOCK_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

type CookieReader = {
  get: (name: string) => { value: string } | undefined
}

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined"
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (!isBrowser()) return
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; samesite=lax`
}

function clearCookie(name: string) {
  if (!isBrowser()) return
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`
}

function readCookie(name: string, cookieStore?: CookieReader): string | null {
  if (cookieStore) {
    const cookie = cookieStore.get(name)
    return cookie?.value ?? null
  }

  if (!isBrowser()) return null

  const match = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.split("=")[1]) : null
}

export function setMockSession(user: MockUser) {
  if (!isBrowser()) return

  const token = `token_${Date.now()}`

  localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user))
  localStorage.setItem(MOCK_TOKEN_KEY, token)

  setCookie(MOCK_USER_KEY, JSON.stringify(user), MOCK_COOKIE_MAX_AGE)
  setCookie(MOCK_TOKEN_KEY, token, MOCK_COOKIE_MAX_AGE)
}

export function getMockSession(cookieStore?: CookieReader): MockUser | null {
  const userFromCookie = readCookie(MOCK_USER_KEY, cookieStore)
  const tokenFromCookie = readCookie(MOCK_TOKEN_KEY, cookieStore)

  if (userFromCookie && tokenFromCookie) {
    try {
      return JSON.parse(userFromCookie)
    } catch (error) {
      console.error("Failed to parse mock user cookie", error)
    }
  }

  if (isBrowser()) {
    const user = localStorage.getItem(MOCK_USER_KEY)
    const token = localStorage.getItem(MOCK_TOKEN_KEY)
    if (user && token) {
      return JSON.parse(user)
    }
  }

  return null
}

export function clearMockSession() {
  if (!isBrowser()) return

  localStorage.removeItem(MOCK_USER_KEY)
  localStorage.removeItem(MOCK_TOKEN_KEY)
  clearCookie(MOCK_USER_KEY)
  clearCookie(MOCK_TOKEN_KEY)
}

export function validateMockCredentials(email: string, password: string): MockUser | null {
  const credentials = Object.values(TEST_CREDENTIALS)
  const found = credentials.find((cred) => cred.email === email && cred.password === password)

  if (found) {
    return {
      id: `user_${Date.now()}`,
      email: found.email,
      role: found.role as "student" | "admin" | "superadmin",
      university: found.university,
      createdAt: new Date().toISOString(),
    }
  }
  return null
}
