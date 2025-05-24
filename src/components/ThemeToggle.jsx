import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../features/theme";

export default function ThemeToggle() {
  const { currentTheme, themes } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const theme = themes[currentTheme];

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className={`px-3 py-2 rounded transition-colors duration-200 text-sm ${
        currentTheme === "dark"
          ? "bg-yellow-600 text-white hover:bg-yellow-700"
          : "bg-slate-700 text-white hover:bg-slate-800"
      }`}
      title={`Basculer vers le thème ${
        currentTheme === "dark" ? "clair" : "sombre"
      }`}
    >
      {currentTheme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
