import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat_theme") || "cupcake",
  setTheme: (theme) => {
    localStorage.setItem("chat_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    set({ theme });
  },
}));


