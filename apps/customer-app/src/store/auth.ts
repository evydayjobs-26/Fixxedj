import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

type User = {
  id: string;
  phone: string;
  full_name?: string;
  role: string;
};

type AuthState = {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  setAuth: (token: string, refreshToken: string, user?: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  refreshToken: null,
  user: null,

  setAuth: (token, refreshToken, user) => {
    SecureStore.setItemAsync("access_token", token);
    SecureStore.setItemAsync("refresh_token", refreshToken);
    set({ token, refreshToken, user: user ?? null });
  },

  logout: () => {
    SecureStore.deleteItemAsync("access_token");
    SecureStore.deleteItemAsync("refresh_token");
    set({ token: null, refreshToken: null, user: null });
  },
}));
