import { createContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../fireBaseConfig";

import * as authService from "../services/authService";

export const AuthContext = createContext({
  isLoading: false,
  isAuthenticated: false,
  error: null,
  user: null,
  auth: null,
  register: async (username, email, password) => {},
  login: async (email, password) => {},
  logout: () => {},
  clearError: () => {},
});

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({ user: null });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthState({
          user: {
            id: user.uid,
            email: user.email,
          },
        });
      } else {
        setAuthState({ user: null });
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const user = await authService.login(email, password);
      setAuthState({
        user: {
          id: user.uid,
          email: user.email,
          name: user.displayName,
        },
      });
    } catch (error) {
      setError(error.message || "Login error, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setIsLoading(true);

      const user = await authService.register(name, email, password);

      setAuthState({
        user: {
          id: user.uid,
          email: user.email,
          name: user.displayName,
        },
      });
    } catch (error) {
      setError(error.message || "Login error, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = useMemo(
    () => ({
      isAuthenticated: !!authState.user,
      isLoading,
      error,
      user: authState.user,
      auth: authState,
      login,
      register,
      logout: async () => {
        try {
          await signOut(auth);
          setAuthState({ user: null });
        } catch (error) {
          setError(error.message || "An error occured while logging out");
        }
      },
      clearError: () => setError(null),
    }),
    [authState, isLoading, error],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
