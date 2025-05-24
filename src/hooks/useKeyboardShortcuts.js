import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { togglePreview } from "../features/preview";
import { toggleTheme } from "../features/theme";

export const useKeyboardShortcuts = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl/Cmd + Shift + P : Toggle Preview
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === "P"
      ) {
        event.preventDefault();
        dispatch(togglePreview());
      }

      // Ctrl/Cmd + Shift + T : Toggle Theme
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === "T"
      ) {
        event.preventDefault();
        dispatch(toggleTheme());
      }

      // Ctrl/Cmd + S : Trigger save (preventDefault pour éviter le save navigateur)
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        // Émettre un événement personnalisé pour signaler la sauvegarde
        window.dispatchEvent(new CustomEvent("editorSave"));
      }

      // F11 : Mode plein écran
      if (event.key === "F11") {
        event.preventDefault();
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          document.documentElement.requestFullscreen();
        }
      }

      // Ctrl/Cmd + / : Afficher l'aide des raccourcis
      if ((event.ctrlKey || event.metaKey) && event.key === "/") {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent("showShortcuts"));
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch]);
};
