'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import type { UserProfile, UserRole } from '@/types'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  roles: UserRole[]
  isAdmin: boolean
  isLoading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  roles: [],
  isAdmin: false,
  isLoading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
})

interface ProfileRow {
  id: string
  full_name: string
  phone: string | null
  company_name: string | null
  avatar_url: string | null
}

function getClient() {
  // Lazy import to avoid creating client during SSR/build when env vars aren't set
  const { createClient } = require('@/lib/supabase/client')
  return createClient()
}

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  return !!url && url.startsWith('http')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [roles, setRoles] = useState<UserRole[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsLoading(false)
      return
    }

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

  const signOut = async () => {
    if (!isSupabaseConfigured()) return
    const supabase = getClient()
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setRoles([])
  }

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        roles,
        isAdmin: roles.includes('admin'),
        isLoading,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
