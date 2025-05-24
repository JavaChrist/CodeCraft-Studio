import { createSlice } from "@reduxjs/toolkit";

// Récupérer le thème sauvegardé ou utiliser le thème sombre par défaut
const getSavedTheme = () => {
  try {
    const savedTheme = localStorage.getItem("editorTheme");
    return savedTheme || "dark";
  } catch (error) {
    console.error("Erreur lors de la récupération du thème:", error);
    return "dark";
  }
};

const themes = {
  dark: {
    name: "Sombre",
    bg: "bg-zinc-900",
    bgSecondary: "bg-zinc-800",
    bgTertiary: "bg-zinc-700",
    text: "text-slate-200",
    textSecondary: "text-slate-300",
    border: "border-slate-200",
    borderSecondary: "border-zinc-700",
    hoverBg: "bg-zinc-700",
    selectedBg: "bg-zinc-600",
    editorTheme: {
      "&": {
        backgroundColor: "#18181b",
        color: "#e2e8f0",
      },
      ".cm-content": {
        fontFamily: "monospace",
        padding: "10px",
        backgroundColor: "#18181b",
      },
      ".cm-focused": {
        outline: "none",
      },
      ".cm-line": {
        padding: "0 8px",
      },
      ".cm-gutters": {
        backgroundColor: "#27272a",
        color: "#71717a",
        borderRight: "1px solid #3f3f46",
      },
      ".cm-cursor, .cm-dropCursor": {
        borderLeft: "2px solid #ffffff !important",
        borderLeftColor: "#ffffff !important",
        borderLeftWidth: "2px !important",
      },
      ".cm-focused .cm-cursor": {
        borderLeft: "2px solid #ffffff !important",
      },
      ".cm-selectionBackground": {
        backgroundColor: "#3f3f46 !important",
      },
      ".cm-focused .cm-selectionBackground": {
        backgroundColor: "#4f46e5 !important",
      },
      "&.cm-focused .cm-cursor": {
        borderLeft: "2px solid #ffffff !important",
      },
    },
  },
  light: {
    name: "Clair",
    bg: "bg-white",
    bgSecondary: "bg-gray-100",
    bgTertiary: "bg-gray-200",
    text: "text-gray-900",
    textSecondary: "text-gray-700",
    border: "border-gray-300",
    borderSecondary: "border-gray-200",
    hoverBg: "bg-gray-200",
    selectedBg: "bg-blue-100",
    editorTheme: {
      "&": {
        backgroundColor: "#ffffff",
        color: "#1f2937",
      },
      ".cm-content": {
        fontFamily: "monospace",
        padding: "10px",
        backgroundColor: "#ffffff",
      },
      ".cm-focused": {
        outline: "none",
      },
      ".cm-line": {
        padding: "0 8px",
      },
      ".cm-gutters": {
        backgroundColor: "#f3f4f6",
        color: "#6b7280",
        borderRight: "1px solid #d1d5db",
      },
      ".cm-cursor, .cm-dropCursor": {
        borderLeft: "2px solid #1f2937 !important",
        borderLeftColor: "#1f2937 !important",
        borderLeftWidth: "2px !important",
      },
      ".cm-focused .cm-cursor": {
        borderLeft: "2px solid #1f2937 !important",
      },
      ".cm-selectionBackground": {
        backgroundColor: "#e5e7eb !important",
      },
      ".cm-focused .cm-selectionBackground": {
        backgroundColor: "#3b82f6 !important",
      },
      "&.cm-focused .cm-cursor": {
        borderLeft: "2px solid #1f2937 !important",
      },
    },
  },
};

const initialState = {
  currentTheme: getSavedTheme(),
  themes,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.currentTheme = action.payload;
      localStorage.setItem("editorTheme", action.payload);
    },
    toggleTheme: (state) => {
      const newTheme = state.currentTheme === "dark" ? "light" : "dark";
      state.currentTheme = newTheme;
      localStorage.setItem("editorTheme", newTheme);
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
