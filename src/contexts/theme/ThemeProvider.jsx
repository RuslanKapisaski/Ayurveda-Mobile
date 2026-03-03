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
        primary: "#4A7C59",
        secondary: "#dcf9e1d6",
        cardColor: "#ffffff",
        background: "#ecf0ea",
        header: "#4A7C59",
        text: "#035910",
        buttonText:"#fff"
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
        background: "#303030",
        cardColor: "#4e4e4e",
        primary: "#c25555",
        secondary: "#00da91",
        header: "#000000",
        text: "#ffffff",
        buttonText: "#fff",
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
