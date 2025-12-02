import { useState, useEffect, useCallback } from "react";
import { storage, User, AuthState } from "@/lib/storage";

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadAuth = useCallback(async () => {
    try {
      const auth = await storage.getAuth();
      setAuthState(auth);
    } catch (error) {
      console.error("Error loading auth:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  const login = useCallback(async (user: User) => {
    try {
      await storage.login(user);
      setAuthState({ isAuthenticated: true, user });
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await storage.logout();
      setAuthState({ isAuthenticated: false, user: null });
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  }, []);

  return {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    isLoading,
    login,
    logout,
    refreshAuth: loadAuth,
  };
}
