import { createContext, useMemo, useState } from "react";
import { Platform } from "react-native";
import { DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createShadow } from "../../utils/createShadow";


export const ThemeContext = createContext(null);

export default function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const lightTheme = useMemo(
    () => ({
      ...DefaultTheme,
      dark: false,
      colors: {
        ...DefaultTheme.colors,
        primary: "#4A7C59",
        secondary: "#e2f0e5d6",
        cardColor: "#ffffff",
        background: "#ecf0ea",
        header: "#4A7C59",
        text: "#035910",
        buttonText: "#fff",
      },
      shadows: {
        small: createShadow("#000", 0.1, 2),
        medium: createShadow("#000", 0.15, 4),
        large: createShadow("#000", 0.25, 8),
      },
      fonts: Platform.select({
        ios: "San Francisco",
        android: "Roboto",
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
        background: "#303030",
        cardColor: "#4e4e4e",
        primary: "#c25555",
        secondary: "#030303",
        header: "#000000",
        text: "#ffffff",
        buttonText: "#fff",
      },
      shadows: {
        small: createShadow("#000", 0.3, 2),  
        medium: createShadow("#000", 0.4, 4),
        large: createShadow("#000", 0.6, 8),
      },
      fonts: Platform.select({
        ios: "San Francisco",
        android: "Roboto",
        default: "System",
      }),
    }),
    [],
  );

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        setIsDarkMode,
        theme: isDarkMode ? darkTheme : lightTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}