import { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";

const THEME_STORAGE_KEY = "brainboost-theme";
const themes = ["default", "light", "dark"];

function getSavedTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  return themes.includes(savedTheme) ? savedTheme : "default";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getSavedTheme);

  useEffect(() => {
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const resolvedTheme = theme === "default"
        ? systemPreference.matches ? "dark" : "light"
        : theme;

      document.documentElement.dataset.theme = resolvedTheme;
      document.documentElement.style.colorScheme = resolvedTheme;
    };

    applyTheme();
    if (theme !== "default") {
      return undefined;
    }

    systemPreference.addEventListener("change", applyTheme);
    return () => systemPreference.removeEventListener("change", applyTheme);
  }, [theme]);

  function updateTheme(nextTheme) {
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
