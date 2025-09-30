// src/auth.tsx
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { api, setAuthToken } from '@/src/api'
import * as storage from '@/src/storage'

/** Domain types kept simple (no org binding in roles) */
export type Role = 'parent'|'vet'|'hostel'|'vendor'|'pharmacist'|'nutritionist'|'walker'
export type RoleRef = { role: Role }
export type User = { id:number, phone:string, name?:string|null, email?:string|null }

/** Context state: union with the same shape you used originally */
export type AuthState =
  | { status:'guest'; roles:RoleRef[]; active?:RoleRef; user?:User }
  | { status:'authed'; roles:RoleRef[]; active?:RoleRef; user?:User }

/** Server shapes used by /me and /auth/otp/verify */
type MeResponse = { user?:User; roles:RoleRef[]; active?:RoleRef|null }
type VerifyResponse = { type:'pre'|'actual'; token?:string; roles?:RoleRef[]; active?:RoleRef|null }

type Ctx = {
  state: AuthState
  /** Read-only slices for convenience */
  user?: User
  roles: RoleRef[]
  active?: RoleRef

  /** Ops */
  bootstrap: () => Promise<void>           // read token, hit /me (if token)
  saveToken: (token: string) => Promise<void>
  clearToken: () => Promise<void>
  fetchMe: () => Promise<void>             // GET /me to refresh state
  setActiveContext: (role: Role) => Promise<void> // POST /me/active
  logout: () => Promise<void>              // clear token + set guest (no routing here)
  verifyOtp: (phone: string, otp: string) => Promise<void>
}

const AuthCtx = createContext<Ctx | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'guest', roles: [] })

  /** hydrate from storage on mount */
  const bootstrap = useCallback(async () => {
    const token = await storage.getToken()
    if (!token) {
      setState({ status: 'guest', roles: [] })
      return
    }
    setAuthToken(token)
    await fetchMe()
  }, [])

  /** persist token + set axios header */
  const saveToken = useCallback(async (token: string) => {
    await storage.setToken(token)
    setAuthToken(token)
  }, [])

  /** clear token completely */
  const clearToken = useCallback(async () => {
    await storage.clearToken()
    setAuthToken(undefined)
  }, [])

  /** pull latest /me (single source of truth for roles/active/user) */
  const fetchMe = useCallback(async () => {
    try {
      const r = await api.get<MeResponse>('/me')
      const { user, roles, active } = r.data
      setState({
        status: 'authed',
        roles: roles ?? [],
        active: active ?? undefined,
        user: user ?? undefined,
      })
    } catch {
      // token invalid or server down -> become guest
      await clearToken()
      setState({ status: 'guest', roles: [] })
    }
  }, [clearToken])

  const verifyOtp = useCallback(async (phone: string, otp: string) => {
    // server returns { type: 'pre' | 'actual', token?: string, roles?: RoleRef[] }
    const r = await api.post('/auth/otp/verify', { phone, otp })
    const body = r.data as { type: 'pre'|'actual'; token?: string }
    if (body.token) {
      await storage.setToken( body.token)
      setAuthToken(body.token)
    } else {
      // pre token-less flow is OK; /me will still be guest
      setAuthToken(undefined)
    }
    await fetchMe()
  }, [fetchMe])

  /** switch the active role (no routing here) */
  const setActiveContext = useCallback(async (role: Role) => {
    await api.post('/me/active', { role })
    // reflect server truth
    await fetchMe()
  }, [fetchMe])

  /** logout: just clear token + state */
  const logout = useCallback(async () => {
    await clearToken()
    setState({ status: 'guest', roles: [] })
  }, [clearToken])

  useEffect(() => { void bootstrap() }, [bootstrap])

  const value = useMemo<Ctx>(() => ({
    state,
    user: state.user,
    roles: state.roles,
    active: state.active,
    bootstrap,
    saveToken,
    clearToken,
    fetchMe,
    setActiveContext,
    logout,
    verifyOtp
  }), [state, bootstrap, saveToken, clearToken, fetchMe, setActiveContext, logout, verifyOtp])

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth(): Ctx {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
