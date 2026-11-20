'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [roles, setRoles] = useState<UserRole[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  const fetchProfile = useCallback(async (userId: string) => {
    const [profileResult, rolesResult] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('user_roles').select('role').eq('user_id', userId),
    ])

    if (profileResult.data) {
      const userRoles = (rolesResult.data?.map(r => r.role) || []) as UserRole[]
      setProfile({ ...profileResult.data, roles: userRoles })
      setRoles(userRoles)
    }
  }, [supabase])

  useEffect(() => {
    const initAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) await fetchProfile(user.id)
      setIsLoading(false)
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
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
  }, [supabase, fetchProfile])

  const signOut = async () => {
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
