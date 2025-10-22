import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";

export type Theme = {
  colors: {
    background: string;
    surface: string;
    primary: string;
    accent: string;
    text: string;
    muted: string;
    card: string;
    border: string;
    danger: string;
    success: string;
    gradientStart: string;
    gradientEnd: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
  };
  radii: {
    sm: number;
    md: number;
    lg: number;
  };
};

const light: Theme = {
  colors: {
    background: "#F8F9FA",
    surface: "#FFFFFF",
    primary: "#38B2AC",
    accent: "#4F46E5",
    text: "#1B263B",
    muted: "#778DA9",
    card: "#FFFFFF",
    border: "#E9ECEF",
    danger: "#DC2626",
    success: "#10B981",
    gradientStart: "#F8F9FA",
    gradientEnd: "#E9ECEF",
  },
  spacing: { xs: 6, sm: 8, md: 12, lg: 20 },
  radii: { sm: 8, md: 12, lg: 20 },
};

const dark: Theme = {
  colors: {
    background: "#0B1020",
    surface: "#0F1724",
    primary: "#06B6D4",
    accent: "#8B5CF6",
    text: "#E6EEF6",
    muted: "#9AA8B2",
    card: "#0B1220",
    border: "#213040",
    danger: "#F87171",
    success: "#34D399",
    gradientStart: "#071024",
    gradientEnd: "#0B1220",
  },
  spacing: { xs: 6, sm: 8, md: 12, lg: 20 },
  radii: { sm: 8, md: 12, lg: 20 },
};

type Scheme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  scheme: Scheme;
  setScheme: (s: Scheme) => void;
  toggleScheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const initial: Scheme = system === "dark" ? "dark" : "light";
  const [scheme, setScheme] = useState<Scheme>(initial);

  useEffect(() => {
    // follow system changes by default unless user toggles explicitly
    setScheme(system === "dark" ? "dark" : "light");
  }, [system]);

  const theme = useMemo(() => (scheme === "dark" ? dark : light), [scheme]);

  const value = useMemo(
    () => ({
      theme,
      scheme,
      setScheme,
      toggleScheme: () => setScheme((s) => (s === "dark" ? "light" : "dark")),
    }),
    [theme, scheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
