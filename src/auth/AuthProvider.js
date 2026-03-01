import { createContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../fireBaseConfig";
import * as authService from "../services/authService";

export const AuthContext = createContext({
  isLoading: false,
  isAuthenticated: false,
  hasCompletedOnBoarding: false,
  error: null,
  user: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  clearError: () => {},
});

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    user: null,
    hasCompletedOnBoarding: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const firestoreUser = await authService.getCurrentUserData();

          setAuthState({
            user: {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              dosha: firestoreUser?.dosha || null,
            },
            hasCompletedOnBoarding:
              firestoreUser?.hasCompletedOnBoarding || false,
          });
        } catch (err) {
          setError("Failed to load user data");
        }
      } else {
        setAuthState({
          user: null,
          hasCompletedOnBoarding: false,
        });
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);

      const { firestoreUser } = await authService.login(email, password);

      setAuthState({
        user: {
          id: firestoreUser.uid,
          email: firestoreUser.email,
          name: firestoreUser.name,
          dosha: firestoreUser.dosha,
        },
        hasCompletedOnBoarding: firestoreUser.hasCompletedOnBoarding,
      });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setIsLoading(true);

      const user = await authService.register(name, email, password);
      const firestoreUser = await authService.getCurrentUserData();

      setAuthState({
        user: {
          id: user.uid,
          email: user.email,
          name: user.displayName,
          dosha: null,
        },
        hasCompletedOnBoarding: firestoreUser?.hasCompletedOnBoarding,
      });
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setAuthState({
        user: null,
        hasCompletedOnBoarding: false,
      });
    } catch (err) {
      setError("Logout failed");
    }
  };

  const contextValue = useMemo(
    () => ({
      isAuthenticated: !!authState.user,
      hasCompletedOnBoarding: authState.hasCompletedOnBoarding,
      isLoading,
      error,
      user: authState.user,
      login,
      register,
      logout,
      clearError: () => setError(null),
    }),
    [authState, isLoading, error],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
