import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateFileContent } from "../features/fileSystem";
import { EditorState } from "@codemirror/state";
import {
  EditorView,
  keymap,
  drawSelection,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  highlightActiveLine,
} from "@codemirror/view";
import { defaultKeymap, selectAll } from "@codemirror/commands";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { autocompletion, closeBrackets } from "@codemirror/autocomplete";
import {
  syntaxHighlighting,
  defaultHighlightStyle,
  bracketMatching,
} from "@codemirror/language";
import { createAutocompleteExtension } from "./AutocompleteExtension";

// Fonction pour obtenir un fichier par ID dans l'arbre
const findFileInTree = (tree, targetId) => {
  if (tree.id === targetId) return tree;

  if (tree.children) {
    for (let child of tree.children) {
      const found = findFileInTree(child, targetId);
      if (found) return found;
    }
  }

  return null;
};

export default function FileCodeTab() {
  const dispatch = useDispatch();
  const editorRef = useRef(null);
  const viewRef = useRef(null);
  const { fileTree, activeFileId } = useSelector((state) => state.fileSystem);
  const { currentTheme, themes } = useSelector((state) => state.theme);
  const theme = themes[currentTheme];

  // Trouver le fichier actif
  const activeFile = activeFileId
    ? findFileInTree(fileTree, activeFileId)
    : null;

  // Fonction pour obtenir le langage selon l'extension
  const getLanguageExtension = (extension) => {
    switch (extension) {
      case "js":
        return javascript();
      case "html":
        return html();
      case "css":
        return css();
      case "json":
        return json();
      default:
        return javascript(); // Par défaut
    }
  };

  // Fonction pour créer l'extension de thème
  const createThemeExtension = () => {
    return EditorView.theme({
      "&": {
        height: "100%",
        fontSize: "16px",
        ...theme.editorTheme["&"],
      },
      ".cm-content": {
        fontFamily: "monospace",
        padding: "10px",
        ...theme.editorTheme[".cm-content"],
      },
      ".cm-focused": {
        outline: "none",
        ...theme.editorTheme[".cm-focused"],
      },
      ".cm-line": {
        padding: "0 8px",
        ...theme.editorTheme[".cm-line"],
      },
      ".cm-gutters": {
        ...theme.editorTheme[".cm-gutters"],
      },
      ".cm-cursor": {
        borderLeft:
          currentTheme === "dark" ? "2px solid #ffffff" : "2px solid #000000",
        animation: "cm-blink 1.2s step-end infinite",
      },
      ".cm-dropCursor": {
        borderLeft:
          currentTheme === "dark" ? "2px solid #ffffff" : "2px solid #000000",
      },
      // Styles de sélection plus simples et visibles
      ".cm-selectionBackground": {
        backgroundColor:
          currentTheme === "dark" ? "#0066cc !important" : "#0066cc !important",
        opacity: "0.3 !important",
      },
      ".cm-focused .cm-selectionBackground": {
        backgroundColor:
          currentTheme === "dark" ? "#0066cc !important" : "#0066cc !important",
        opacity: "0.4 !important",
      },
      ".cm-content ::selection": {
        backgroundColor: currentTheme === "dark" ? "#0066cc" : "#0066cc",
        opacity: "0.4",
      },
      ".cm-selectedText": {
        backgroundColor: "transparent",
      },
      // Style pour la ligne active
      ".cm-activeLine": {
        backgroundColor:
          currentTheme === "dark"
            ? "rgba(255, 255, 255, 0.03)"
            : "rgba(0, 0, 0, 0.02)",
      },
      // Style pour correspondance des parenthèses
      "&.cm-focused .cm-matchingBracket": {
        backgroundColor: currentTheme === "dark" ? "#374151" : "#e5e7eb",
        outline:
          "1px solid " + (currentTheme === "dark" ? "#6b7280" : "#9ca3af"),
        borderRadius: "2px",
      },
    });
  };

  // Mettre à jour l'attribut data-theme du body
  useEffect(() => {
    document.body.setAttribute("data-theme", currentTheme);
  }, [currentTheme]);

  // Effet pour créer/recréer l'éditeur
  useEffect(() => {
    if (editorRef.current && activeFile) {
      // Détruire l'éditeur existant
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }

      // Créer les extensions de base
      const baseExtensions = [
        keymap.of(defaultKeymap),
        keymap.of(searchKeymap),
        keymap.of([
          {
            key: "Ctrl-a",
            run: selectAll,
            preventDefault: true,
          },
          {
            key: "Cmd-a", // Pour Mac
            run: selectAll,
            preventDefault: true,
          },
        ]),
        createThemeExtension(),
        drawSelection(),
        dropCursor(),
        rectangularSelection(),
        crosshairCursor(),
        highlightActiveLine(),
        highlightSelectionMatches(),

        // NOUVELLES EXTENSIONS
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }), // Coloration syntaxique
        bracketMatching(), // Correspondance des parenthèses
        closeBrackets(), // Auto-fermeture des parenthèses et guillemets
        autocompletion({ activateOnTyping: true }), // Autocomplétion basique

        EditorView.domEventHandlers({
          mousedown: (event, view) => {
            // S'assurer que les événements de souris sont bien traités
            return false; // Laisser CodeMirror gérer
          },
          mouseup: (event, view) => {
            return false; // Laisser CodeMirror gérer
          },
          dragstart: (event, view) => {
            // Désactiver le glisser-déposer
            event.preventDefault();
            return true;
          },
        }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            dispatch(
              updateFileContent({
                fileId: activeFile.id,
                content: update.state.doc.toString(),
              })
            );
          }
        }),
      ];

      // Ajouter l'extension de langage
      try {
        const languageExt = getLanguageExtension(activeFile.extension);
        if (languageExt) {
          baseExtensions.push(languageExt);
        }
      } catch (error) {
        console.warn("Erreur extension langage:", error);
      }

      // Ajouter l'autocomplétion
      try {
        const autocompleteExt = createAutocompleteExtension(
          activeFile.extension
        );
        if (autocompleteExt && Array.isArray(autocompleteExt)) {
          baseExtensions.push(...autocompleteExt);
        }
      } catch (error) {
        console.warn("Erreur autocomplétion:", error);
      }

      const startState = EditorState.create({
        doc: activeFile.content || "",
        extensions: baseExtensions,
      });

      viewRef.current = new EditorView({
        state: startState,
        parent: editorRef.current,
      });

      return () => {
        if (viewRef.current) {
          viewRef.current.destroy();
          viewRef.current = null;
        }
      };
    }
  }, [activeFile?.id, activeFile?.extension, currentTheme, dispatch]);

  // Effet pour mettre à jour le contenu si le fichier change (plus agressif)
  useEffect(() => {
    if (viewRef.current && activeFile) {
      const currentContent = viewRef.current.state.doc.toString();
      const newContent = activeFile.content || "";

      if (currentContent !== newContent) {
        console.log(`🔄 Mise à jour contenu fichier ${activeFile.name}:`, {
          ancien: currentContent.substring(0, 100) + "...",
          nouveau: newContent.substring(0, 100) + "...",
        });

        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: viewRef.current.state.doc.length,
            insert: newContent,
          },
        });
      }
    }
  }, [activeFile?.content, activeFile?.id]);

  if (!activeFile) {
    return (
      <div
        className={`${theme.bg} ${theme.text} h-full w-full flex items-center justify-center`}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">📁</div>
          <h2 className="text-xl font-medium mb-2">
            Aucun fichier sélectionné
          </h2>
          <p className={`${theme.textSecondary}`}>
            Sélectionnez un fichier dans l'explorateur pour commencer à coder
          </p>
        </div>
      </div>
    );
  }

  if (activeFile.type === "folder") {
    return (
      <div
        className={`${theme.bg} ${theme.text} h-full w-full flex items-center justify-center`}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">📂</div>
          <h2 className="text-xl font-medium mb-2">Dossier sélectionné</h2>
          <p className={`${theme.textSecondary}`}>
            Sélectionnez un fichier pour l'éditer
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={editorRef}
      className={`${theme.bg} ${theme.text} h-full w-full`}
      data-theme={currentTheme}
      tabIndex={0}
      style={{ outline: "none" }}
      onClick={() => {
        // Forcer le focus au clic pour créer le curseur
        if (viewRef.current) {
          viewRef.current.focus();
        }
      }}
      onMouseDown={(e) => {
        // S'assurer que l'éditeur reçoit le focus sur mousedown
        if (viewRef.current) {
          viewRef.current.focus();
        }
      }}
    ></div>
  );
}
