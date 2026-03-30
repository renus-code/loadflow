"use client";

// Auth State: Manages user login sessions globally without slowing down the app.

import React, { createContext, useContext, useRef, useEffect } from 'react';
import { createStore, useStore } from 'zustand';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  fetchUser: () => Promise<void>;
  logout: (router: any) => Promise<void>;
  refreshUser: () => Promise<void>; // Alias for backwards compatibility
}

type AuthStoreType = AuthState & AuthActions;
type AuthStore = ReturnType<typeof createAuthStore>;

const createAuthStore = () =>
  createStore<AuthStoreType>()((set, get) => ({
    user: null,
    isLoading: true,
    error: null,
    fetchUser: async () => {
      try {
        set({ isLoading: true });
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const text = await res.text();
          const data = text ? JSON.parse(text) : {};
          set({ user: data.user || null, isLoading: false });
        } else {
          set({ user: null, isLoading: false });
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
        set({ error: 'Connection error', isLoading: false });
      }
    },
    refreshUser: async () => {
      await get().fetchUser();
    },
    logout: async (router) => {
      try {
        const res = await fetch('/api/auth/logout', { method: 'POST' });
        if (res.ok) {
          set({ user: null });
          router.push('/');
        }
      } catch (err) {
        console.error('Logout failed:', err);
      }
    }
  }));

const AuthContext = createContext<AuthStore | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AuthStore | null>(null);
  const router = useRouter();

  if (!storeRef.current) {
    storeRef.current = createAuthStore();
  }

  // Initial Fetch logic
  useEffect(() => {
    if (storeRef.current) {
      storeRef.current.getState().fetchUser();
    }
  }, []);

  // ─── IDLE SESSION TIMEOUT (30 MINUTES) ───────────────────────────────────────
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const store = storeRef.current;
    if (!store) return;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      // Only execute the timeout logic if we actually have an active user session
      if (!store.getState().user) return;

      // 30 minutes in milliseconds
      timeoutId = setTimeout(() => {
         console.log("Idle timeout reached. Logging out...");
         store.getState().logout(router);
      }, 30 * 60 * 1000); 
    };

    // Events that count as activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Subscribe to state explicitly within useEffect to bootstrap initial timer
    const unsubscribe = store.subscribe(
      (state, prevState) => {
         if (state.user && !prevState.user) {
            resetTimer(); 
         } else if (!state.user && prevState.user) {
            if (timeoutId) clearTimeout(timeoutId);
         }
      }
    );

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      unsubscribe();
    };
  }, [router]);

  return (
    <AuthContext.Provider value={storeRef.current}>
      {children}
    </AuthContext.Provider>
  );
}

// Atomic Selector Pattern implementation
export function useAuth<T>(selector: (state: AuthStoreType) => T): T {
  const store = useContext(AuthContext);
  if (!store) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return useStore(store, selector);
}
