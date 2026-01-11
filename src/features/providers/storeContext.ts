import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type StoreCtx = { store_id: number; display_name: string } | null;

type StoreState = {
  store: StoreCtx;
  hydrate: () => Promise<void>;
  setStore: (s: StoreCtx) => Promise<void>;
  clearStore: () => Promise<void>;
};

const KEY = "petcare.store_ctx.v1";

export const useStoreContext = create<StoreState>((set) => ({
  store: null,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (!raw) return;
      set({ store: JSON.parse(raw) });
    } catch {
      // ignore
    }
  },

  setStore: async (s) => {
    set({ store: s });
    try {
      if (s) await AsyncStorage.setItem(KEY, JSON.stringify(s));
      else await AsyncStorage.removeItem(KEY);
    } catch {
      // ignore
    }
  },

  clearStore: async () => {
    set({ store: null });
    try {
      await AsyncStorage.removeItem(KEY);
    } catch {
      // ignore
    }
  },
}));
