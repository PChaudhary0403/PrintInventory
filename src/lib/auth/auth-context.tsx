'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import type { UserProfile, UserRole } from '@/types'

// ── Admin credentials from environment variables ────────────────────
// Set NEXT_PUBLIC_ADMIN_EMAIL and NEXT_PUBLIC_ADMIN_PASSWORD in .env.local
// This local-admin login works without Supabase and is meant for
// initial setup / demo purposes. Remove these env vars once real
// Supabase auth with DB-based roles is fully connected.
function getLocalAdminCreds() {
  const email = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim()
  const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD?.trim()
  if (email && password) return { email, password }
  return null
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  roles: UserRole[]
  isAdmin: boolean
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string; isAdmin?: boolean }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  /** Admin-only: grant admin role to another user (by email). Supabase-only. */
  grantAdminRole: (targetEmail: string) => Promise<{ error?: string }>
  /** Admin-only: revoke admin role from another user. Supabase-only. */
  revokeAdminRole: (targetUserId: string) => Promise<{ error?: string }>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  roles: [],
  isAdmin: false,
  isLoading: true,
  signIn: async () => ({}),
  signOut: async () => {},
  refreshProfile: async () => {},
  grantAdminRole: async () => ({ error: 'Not implemented' }),
  revokeAdminRole: async () => ({ error: 'Not implemented' }),
})

interface ProfileRow {
  id: string
  full_name: string
  phone: string | null
  company_name: string | null
  avatar_url: string | null
}

function getClient() {
  const { createClient } = require('@/lib/supabase/client')
  return createClient()
}

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  return !!url && url.startsWith('http') && !url.includes('your-')
}

// ── Fake User object for the local admin (matches Supabase shape) ───
function makeLocalAdminUser(email: string): User {
  return {
    id: 'local-admin-00000000-0000-0000-0000-000000000001',
    email,
    app_metadata: {},
    user_metadata: { full_name: 'Administrator' },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  } as unknown as User
}

function makeLocalAdminProfile(email: string): UserProfile {
  return {
    id: 'local-admin-00000000-0000-0000-0000-000000000001',
    full_name: 'Administrator',
    phone: null,
    company_name: 'Digital Heroes',
    avatar_url: null,
    roles: ['admin'],
  }
}

// Session-storage key so the local-admin login survives page reloads
const LOCAL_ADMIN_SESSION_KEY = 'dh_local_admin_session'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [roles, setRoles] = useState<UserRole[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // ── Supabase profile fetch ───────────────────────────────────────
  const fetchProfile = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured()) return
    const supabase = getClient()

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    const { data: rolesData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)

    if (!profileError && profileData) {
      const pd = profileData as unknown as ProfileRow
      const userRoles = (rolesData?.map((r: { role: string }) => r.role) || []) as UserRole[]
      const p: UserProfile = {
        id: pd.id,
        full_name: pd.full_name,
        phone: pd.phone,
        company_name: pd.company_name,
        avatar_url: pd.avatar_url,
        roles: userRoles,
      }
      setProfile(p)
      setRoles(userRoles)
    }
  }, [])

  // ── Initialise session ───────────────────────────────────────────
  useEffect(() => {
    const adminCreds = getLocalAdminCreds()

    // 1. Check for a persisted local-admin session
    if (typeof window !== 'undefined' && adminCreds) {
      const stored = sessionStorage.getItem(LOCAL_ADMIN_SESSION_KEY)
      const hasCookie = document.cookie.includes('dh_admin_session=1')
      if (stored === 'true' || hasCookie) {
        setUser(makeLocalAdminUser(adminCreds.email))
        setProfile(makeLocalAdminProfile(adminCreds.email))
        setRoles(['admin'])
        sessionStorage.setItem(LOCAL_ADMIN_SESSION_KEY, 'true')
        document.cookie = 'dh_admin_session=1; path=/; max-age=86400; SameSite=Lax'
        setIsLoading(false)
        return
      }
    }

    // 2. If Supabase isn't configured, nothing more to do
    if (!isSupabaseConfigured()) {
      setIsLoading(false)
      return
    }

    // 3. Normal Supabase auth flow
    const supabase = getClient()

    const initAuth = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)
      if (currentUser) await fetchProfile(currentUser.id)
      setIsLoading(false)
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: string, session: { user: User } | null) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
          setRoles([])
        }
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  // ── Sign-in (supports local admin via env vars + Supabase) ───────
  const signIn = useCallback(async (email: string, password: string): Promise<{ error?: string; isAdmin?: boolean }> => {
    const adminCreds = getLocalAdminCreds()
    const cleanEmail = email.trim().toLowerCase()
    const cleanPassword = password.trim()

    // Check local admin env-var credentials
    if (adminCreds && cleanEmail === adminCreds.email.toLowerCase() && cleanPassword === adminCreds.password) {
      setUser(makeLocalAdminUser(adminCreds.email))
      setProfile(makeLocalAdminProfile(adminCreds.email))
      setRoles(['admin'])
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(LOCAL_ADMIN_SESSION_KEY, 'true')
        document.cookie = 'dh_admin_session=1; path=/; max-age=86400; SameSite=Lax'
      }
      return { isAdmin: true }
    }

    // Otherwise use Supabase
    if (!isSupabaseConfigured()) {
      return { error: 'Invalid login credentials. Please check your email and password.' }
    }

    try {
      const supabase = getClient()
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      })

      if (authError) {
        return { error: authError.message || 'Invalid email or password.' }
      }

      if (data?.user) {
        const { data: rolesData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)

        const isUserAdmin = rolesData?.some((r: { role: string }) => r.role === 'admin') || false
        return { isAdmin: isUserAdmin }
      }

      return {}
    } catch {
      return { error: 'Authentication failed. Please try again.' }
    }
  }, [])

  // ── Sign-out ─────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(LOCAL_ADMIN_SESSION_KEY)
      document.cookie = 'dh_admin_session=; path=/; max-age=0'
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = getClient()
        await supabase.auth.signOut()
      } catch {
        // ignore sign out network error
      }
    }

    setUser(null)
    setProfile(null)
    setRoles([])
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user && !user.id.startsWith('local-admin-')) {
      await fetchProfile(user.id)
    }
  }, [user, fetchProfile])

  // ── Admin role management (Supabase-only) ────────────────────────
  const grantAdminRole = useCallback(async (targetEmail: string): Promise<{ error?: string }> => {
    try {
      const res = await fetch('/api/admin/grant-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, role: 'admin' }),
      })
      if (!res.ok) {
        const data = await res.json()
        return { error: data.error || 'Failed to grant admin role' }
      }
      return {}
    } catch {
      return { error: 'Network error' }
    }
  }, [])

  const revokeAdminRole = useCallback(async (targetUserId: string): Promise<{ error?: string }> => {
    try {
      const res = await fetch('/api/admin/revoke-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetUserId, role: 'admin' }),
      })
      if (!res.ok) {
        const data = await res.json()
        return { error: data.error || 'Failed to revoke admin role' }
      }
      return {}
    } catch {
      return { error: 'Network error' }
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        roles,
        isAdmin: roles.includes('admin'),
        isLoading,
        signIn,
        signOut,
        refreshProfile,
        grantAdminRole,
        revokeAdminRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
