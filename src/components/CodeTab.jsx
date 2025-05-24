import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCode } from "../features/tabs";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, drawSelection } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";

export default function CodeTab({ code, id }) {
  const dispatch = useDispatch();
  const editorRef = useRef(null);
  const viewRef = useRef(null);
  const tabs = useSelector((state) => state.tabs);
  const { currentTheme, themes } = useSelector((state) => state.theme);
  const theme = themes[currentTheme];
  const currentTab = tabs.find((tab) => tab.id === id);

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
    });
  };

  // Mettre à jour l'attribut data-theme du body
  useEffect(() => {
    document.body.setAttribute("data-theme", currentTheme);
  }, [currentTheme]);

  // Effet pour créer l'éditeur
  useEffect(() => {
    if (editorRef.current && !viewRef.current) {
      // Déterminer le langage à utiliser
      const getLanguage = () => {
        switch (currentTab.lang) {
          case "javascript":
            return javascript();
          case "html":
            return html();
          case "css":
            return css();
          default:
            return javascript();
        }
      };

      const startState = EditorState.create({
        doc: code,
        extensions: [
          keymap.of(defaultKeymap),
          getLanguage(),
          createThemeExtension(),
          drawSelection(),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              dispatch(updateCode({ id, value: update.state.doc.toString() }));
            }
          }),
        ],
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
  }, [id, currentTab.lang, dispatch, currentTheme]);

  // Effet pour mettre à jour le contenu
  useEffect(() => {
    if (viewRef.current && viewRef.current.state.doc.toString() !== code) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: code,
        },
      });
    }
  }, [code]);

  // Effet pour recréer l'éditeur quand le thème change
  useEffect(() => {
    if (viewRef.current && currentTheme) {
      // Détruire et recréer l'éditeur avec le nouveau thème
      const currentDoc = viewRef.current.state.doc.toString();
      viewRef.current.destroy();
      viewRef.current = null;

      // Recréer avec le nouveau thème
      const getLanguage = () => {
        switch (currentTab.lang) {
          case "javascript":
            return javascript();
          case "html":
            return html();
          case "css":
            return css();
          default:
            return javascript();
        }
      };

      const startState = EditorState.create({
        doc: currentDoc,
        extensions: [
          keymap.of(defaultKeymap),
          getLanguage(),
          createThemeExtension(),
          drawSelection(),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              dispatch(updateCode({ id, value: update.state.doc.toString() }));
            }
          }),
        ],
      });

      viewRef.current = new EditorView({
        state: startState,
        parent: editorRef.current,
      });
    }
  }, [currentTheme]);

  return (
    <div
      ref={editorRef}
      className={`${theme.bg} ${theme.text} h-full w-full`}
      data-theme={currentTheme}
      onClick={() => {
        // Forcer le focus au clic pour créer le curseur
        if (viewRef.current) {
          viewRef.current.focus();
        }
      }}
    ></div>
  );
}
