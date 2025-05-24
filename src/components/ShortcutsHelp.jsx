import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function ShortcutsHelp() {
  const [isVisible, setIsVisible] = useState(false);
  const { currentTheme, themes } = useSelector((state) => state.theme);
  const theme = themes[currentTheme];

  useEffect(() => {
    const handleShowShortcuts = () => setIsVisible(true);
    window.addEventListener("showShortcuts", handleShowShortcuts);

    return () => {
      window.removeEventListener("showShortcuts", handleShowShortcuts);
    };
  }, []);

  const shortcuts = [
    { key: "Ctrl/Cmd + Shift + P", description: "Basculer l'aperçu" },
    { key: "Ctrl/Cmd + Shift + T", description: "Changer de thème" },
    { key: "Ctrl/Cmd + S", description: "Sauvegarder automatiquement" },
    { key: "F11", description: "Mode plein écran" },
    { key: "Ctrl/Cmd + /", description: "Afficher cette aide" },
    { key: "Esc", description: "Fermer les modales" },
  ];

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isVisible) {
        setIsVisible(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className={`${theme.bgSecondary} p-6 rounded-lg shadow-xl max-w-md w-full mx-4`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${theme.text}`}>
            Raccourcis clavier
          </h2>
          <button
            onClick={() => setIsVisible(false)}
            className={`${theme.text} hover:${theme.textSecondary} transition`}
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className={`${theme.textSecondary} text-sm`}>
                {shortcut.description}
              </span>
              <code
                className={`${theme.bgTertiary} ${theme.text} px-2 py-1 rounded text-xs font-mono`}
              >
                {shortcut.key}
              </code>
            </div>
          ))}
        </div>

        <div
          className={`mt-4 pt-4 border-t ${theme.borderSecondary} text-center`}
        >
          <span className={`${theme.textSecondary} text-xs`}>
            Appuyez sur Échap pour fermer
          </span>
        </div>
      </div>
    </div>
  );
}
