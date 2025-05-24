import { createSlice } from "@reduxjs/toolkit";
import { html, css, js } from "../assets/index.js";

// Essayer de récupérer les données sauvegardées dans localStorage
const getSavedState = () => {
  try {
    const savedState = localStorage.getItem("codeEditor");
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
  }
  return null;
};

const defaultState = [
  {
    id: 1,
    lang: "html",
    imgURL: html,
    buttonContent: "HTML",
    code: `<div>
    <h1>Editeur de code avec React</h1>
    <p>Codez directement sur votre navigateur.</p>
</div>
    `,
  },
  {
    id: 2,
    lang: "css",
    imgURL: css,
    buttonContent: "CSS",
    code: `body {
      font-family: Roboto, sans-serif;
      padding: 25px;
      color: #111;
      background-color: #f1f1f1;
  }
    `,
  },
  {
    id: 3,
    lang: "javascript",
    imgURL: js,
    buttonContent: "JavaScript",
    code: `console.log("Hello World");
    `,
  },
];

// Essayer de récupérer les données partagées depuis l'URL
const getSharedCode = () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get("share");

    if (sharedData) {
      const decodedData = JSON.parse(decodeURIComponent(atob(sharedData)));

      // Valider le format des données partagées
      if (Array.isArray(decodedData) && decodedData.length > 0) {
        // Récupérer les images depuis l'état par défaut
        const mergedData = decodedData.map((item) => {
          const defaultTab = defaultState.find(
            (tab) => tab.id === item.id || tab.lang === item.lang
          );
          return {
            ...defaultTab, // Prendre toutes les propriétés par défaut (imgURL, buttonContent)
            ...item, // Écraser avec les données partagées (code)
          };
        });

        // Nettoyer l'URL après chargement
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        return mergedData;
      }
    }
  } catch (error) {
    console.error("Erreur lors du décodage des données partagées:", error);
  }
  return null;
};

// Définir l'état initial: priorité 1: URL partagée, priorité 2: localStorage, priorité 3: défaut
const initialState = getSharedCode() || getSavedState() || defaultState;

export const codeUpdater = createSlice({
  name: "code-updateur",
  initialState,
  reducers: {
    updateCode: (state, action) => {
      const updatedState = state.map((tab) =>
        tab.id === action.payload.id
          ? { ...tab, code: action.payload.value }
          : tab
      );
      // Sauvegarder dans localStorage après chaque mise à jour
      localStorage.setItem("codeEditor", JSON.stringify(updatedState));
      return updatedState;
    },
    resetCode: (state) => {
      localStorage.removeItem("codeEditor");
      return defaultState;
    },
    saveProject: (state, action) => {
      localStorage.setItem(
        `project_${action.payload.name}`,
        JSON.stringify(state)
      );
      return state;
    },
    loadProject: (state, action) => {
      try {
        const savedProject = localStorage.getItem(
          `project_${action.payload.name}`
        );
        if (savedProject) {
          const parsedProject = JSON.parse(savedProject);
          localStorage.setItem("codeEditor", JSON.stringify(parsedProject));
          return parsedProject;
        }
      } catch (error) {
        console.error("Erreur lors du chargement du projet:", error);
      }
      return state;
    },
  },
});

export const { updateCode, resetCode, saveProject, loadProject } =
  codeUpdater.actions;
export default codeUpdater.reducer;
