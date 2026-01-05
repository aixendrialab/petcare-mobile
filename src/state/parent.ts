// src/state/parent.ts
import { create } from 'zustand'
import type { PetDraft } from '@/src/features/parent/pets/components/PetRow'  // ✅ single source of truth

type ParentStore = {
  // account slice
  userName: string
  email: string
  phoneReadOnly: string

  // pets slice
  pets: PetDraft[]

  // baselines (for dirtiness checks)
  baseUserName: string
  baseEmail: string
  basePetsJson: string

  // actions
  resetFromServer: (seed: {
    userName?: string
    email?: string
    phoneReadOnly?: string
    pets?: PetDraft[]
  }) => void

  setAccount: (patch: Partial<Pick<ParentStore, 'userName' | 'email'>>) => void

  setPets: (pets: PetDraft[]) => void
  upsertPet: (idx: number, patch: PetDraft) => void   // keep signature aligned with PetRow
  addPet: () => void
  removePet: (idx: number) => void
}

export const useParentStore = create<ParentStore>((set, get) => ({
  userName: '',
  email: '',
  phoneReadOnly: '',
  pets: [],

  baseUserName: '',
  baseEmail: '',
  basePetsJson: '[]',

  resetFromServer: (seed) => {
    const userName = seed.userName ?? ''
    const email = seed.email ?? ''
    const phoneReadOnly = seed.phoneReadOnly ?? ''
    const pets = Array.isArray(seed.pets) ? seed.pets : []

    set({
      userName,
      email,
      phoneReadOnly,
      pets,
      baseUserName: userName,
      baseEmail: email,
      basePetsJson: JSON.stringify(pets),
    })
  },

  setAccount: (patch) => set(patch),

  setPets: (pets) => set({ pets }),

  upsertPet: (idx, patch) => {
    const next = [...get().pets]
    next[idx] = { ...(next[idx] ?? {}), ...patch } // merge to be resilient to partial updates
    set({ pets: next })
  },

  addPet: () => set({ pets: [...get().pets, {}] }),

  removePet: (idx) => {
    const next = get().pets.filter((_, i) => i !== idx)
    set({ pets: next })
  },
}))
