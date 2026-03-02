import { createContext, useMemo, useState } from "react";
import { Platform } from "react-native";
import { DefaultTheme, DarkTheme } from "@react-navigation/native";

export const ThemeContext = createContext(null);

export default function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const lightTheme = useMemo(
    () => ({
      ...DefaultTheme,
      dark: false,
      colors: {
        ...DefaultTheme.colors,
        primary: "#4d7534",
        background: "#fbfbe2",
        text: "#747474",
      },
      fonts: Platform.select({
        ios: "San Francisco",
        android: "Robboto",
        default: "System",
      }),
    }),
    [],
  );

  const darkTheme = useMemo(
    () => ({
      ...DarkTheme,
      dark: true,
      colors: {
        ...DarkTheme.colors,
        primary: "#4d7534",
        background: "#110424",
        text: "#f2f2f2",
      },
      fonts: Platform.select({
        ios: "San Francisco",
        android: "Robboto",
        default: "System",
      }),
    }),
    [],
  );

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const contextValue = {
    toggleTheme,
    isDarkMode,
    theme: isDarkMode ? darkTheme : lightTheme,
  };
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
