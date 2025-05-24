import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Structure de fichiers en arbre
  fileTree: {
    id: "root",
    name: "Mon Projet",
    type: "folder",
    isRoot: true,
    isOpen: true,
    children: [
      {
        id: "index-html",
        name: "index.html",
        type: "file",
        extension: "html",
        content: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mon Projet</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Bonjour le monde !</h1>
    <p>Ceci est mon projet web.</p>
    <script src="script.js"></script>
</body>
</html>`,
      },
      {
        id: "style-css",
        name: "style.css",
        type: "file",
        extension: "css",
        content: `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f0f0f0;
}

h1 {
    color: #333;
    text-align: center;
}

p {
    font-size: 16px;
    line-height: 1.6;
    color: #666;
}`,
      },
      {
        id: "script-js",
        name: "script.js",
        type: "file",
        extension: "js",
        content: `console.log("Bonjour depuis JavaScript !");

// Ajouter un événement au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log("Page chargée !");
    
    // Exemple d'interaction
    const h1 = document.querySelector('h1');
    if (h1) {
        h1.addEventListener('click', function() {
            alert('Titre cliqué !');
        });
    }
});`,
      },
    ],
  },
  // Fichiers ouverts en onglets
  openFiles: ["index-html"],
  // Fichier actuellement actif
  activeFileId: "index-html",
  // Fichier sélectionné dans l'explorateur
  selectedFileId: "index-html",
  // Compteur pour IDs uniques
  nextId: 1,
};

const fileSystemSlice = createSlice({
  name: "fileSystem",
  initialState,
  reducers: {
    // Ouvrir un fichier dans un onglet
    openFile: (state, action) => {
      const fileId = action.payload;
      if (!state.openFiles.includes(fileId)) {
        state.openFiles.push(fileId);
      }
      state.activeFileId = fileId;
      state.selectedFileId = fileId;
    },

    // Fermer un fichier
    closeFile: (state, action) => {
      const fileId = action.payload;
      const index = state.openFiles.indexOf(fileId);
      if (index > -1) {
        state.openFiles.splice(index, 1);

        // Si c'était le fichier actif, changer vers un autre
        if (state.activeFileId === fileId) {
          state.activeFileId =
            state.openFiles.length > 0 ? state.openFiles[0] : null;
        }
      }
    },

    // Changer le fichier actif
    setActiveFile: (state, action) => {
      state.activeFileId = action.payload;
      state.selectedFileId = action.payload;
    },

    // Sélectionner un fichier dans l'explorateur
    selectFile: (state, action) => {
      state.selectedFileId = action.payload;
    },

    // Mettre à jour le contenu d'un fichier
    updateFileContent: (state, action) => {
      const { fileId, content } = action.payload;

      function updateInTree(node) {
        if (node.id === fileId) {
          node.content = content;
          return true;
        }
        if (node.children) {
          for (let child of node.children) {
            if (updateInTree(child)) return true;
          }
        }
        return false;
      }

      updateInTree(state.fileTree);
    },

    // Basculer l'état ouvert/fermé d'un dossier
    toggleFolder: (state, action) => {
      const folderId = action.payload;

      function toggleInTree(node) {
        if (node.id === folderId && node.type === "folder") {
          node.isOpen = !node.isOpen;
          return true;
        }
        if (node.children) {
          for (let child of node.children) {
            if (toggleInTree(child)) return true;
          }
        }
        return false;
      }

      toggleInTree(state.fileTree);
    },

    // Créer un nouveau fichier
    createFile: (state, action) => {
      const { parentId, name, type = "file" } = action.payload;
      const newId = `file-${state.nextId++}`;

      // Déterminer l'extension
      const extension = name.includes(".") ? name.split(".").pop() : "txt";

      const newFile = {
        id: newId,
        name,
        type,
        extension: type === "file" ? extension : undefined,
        content: type === "file" ? "" : undefined,
        children: type === "folder" ? [] : undefined,
        isOpen: type === "folder" ? false : undefined,
      };

      function addToTree(node) {
        if (node.id === parentId && node.type === "folder") {
          if (!node.children) node.children = [];
          node.children.push(newFile);
          return true;
        }
        if (node.children) {
          for (let child of node.children) {
            if (addToTree(child)) return true;
          }
        }
        return false;
      }

      addToTree(state.fileTree);
    },

    // Supprimer un fichier ou dossier
    deleteFile: (state, action) => {
      const fileId = action.payload;

      function deleteFromTree(node) {
        if (node.children) {
          const index = node.children.findIndex((child) => child.id === fileId);
          if (index > -1) {
            node.children.splice(index, 1);
            return true;
          }
          for (let child of node.children) {
            if (deleteFromTree(child)) return true;
          }
        }
        return false;
      }

      deleteFromTree(state.fileTree);

      // Fermer le fichier s'il est ouvert
      const index = state.openFiles.indexOf(fileId);
      if (index > -1) {
        state.openFiles.splice(index, 1);
        if (state.activeFileId === fileId) {
          state.activeFileId =
            state.openFiles.length > 0 ? state.openFiles[0] : null;
        }
      }
    },

    // Renommer un fichier ou dossier
    renameFile: (state, action) => {
      const { fileId, newName } = action.payload;

      function renameInTree(node) {
        if (node.id === fileId) {
          node.name = newName;
          if (node.type === "file") {
            node.extension = newName.includes(".")
              ? newName.split(".").pop()
              : "txt";
          }
          return true;
        }
        if (node.children) {
          for (let child of node.children) {
            if (renameInTree(child)) return true;
          }
        }
        return false;
      }

      renameInTree(state.fileTree);
    },

    // Charger un projet complet
    loadProject: (state, action) => {
      const loadedFileTree = action.payload;

      console.log("🔄 loadProject - Ancien état:", {
        nom: state.fileTree.name,
        fichiers: state.fileTree.children?.length || 0,
      });

      console.log("🔄 loadProject - Nouveau projet:", {
        nom: loadedFileTree.name,
        fichiers: loadedFileTree.children?.length || 0,
      });

      // Remplacer complètement l'arbre de fichiers
      state.fileTree = loadedFileTree;

      // Réinitialiser les fichiers ouverts
      state.openFiles = [];
      state.activeFileId = null;
      state.selectedFileId = null;

      // Ouvrir le premier fichier trouvé
      function findFirstFile(node) {
        if (node.type === "file") {
          return node.id;
        }
        if (node.children) {
          for (let child of node.children) {
            const foundFile = findFirstFile(child);
            if (foundFile) return foundFile;
          }
        }
        return null;
      }

      const firstFileId = findFirstFile(loadedFileTree);
      if (firstFileId) {
        state.openFiles = [firstFileId];
        state.activeFileId = firstFileId;
        state.selectedFileId = firstFileId;

        console.log("🔄 loadProject - Premier fichier ouvert:", firstFileId);
      }
    },

    // Ajouter un fichier importé
    addFile: (state, action) => {
      const fileData = action.payload;
      const parentId = fileData.parentId || "root";

      function addToTree(node) {
        if (node.id === parentId && node.type === "folder") {
          if (!node.children) node.children = [];
          node.children.push({
            ...fileData,
            id: fileData.id || `file-${state.nextId++}`,
          });
          return true;
        }
        if (node.children) {
          for (let child of node.children) {
            if (addToTree(child)) return true;
          }
        }
        return false;
      }

      addToTree(state.fileTree);
    },

    // Ajouter un dossier importé avec tous ses enfants
    addFolder: (state, action) => {
      const folderData = action.payload;
      const parentId = folderData.parentId || "root";

      function addToTree(node) {
        if (node.id === parentId && node.type === "folder") {
          if (!node.children) node.children = [];

          // Ajouter le dossier avec récursion pour les enfants
          const processFolder = (folder) => ({
            ...folder,
            id: folder.id || `folder-${state.nextId++}`,
            children: folder.children
              ? folder.children.map((child) =>
                  child.type === "folder"
                    ? processFolder(child)
                    : {
                        ...child,
                        id: child.id || `file-${state.nextId++}`,
                      }
                )
              : [],
          });

          node.children.push(processFolder(folderData));
          return true;
        }
        if (node.children) {
          for (let child of node.children) {
            if (addToTree(child)) return true;
          }
        }
        return false;
      }

      addToTree(state.fileTree);
    },
  },
});

export const {
  openFile,
  closeFile,
  setActiveFile,
  selectFile,
  updateFileContent,
  toggleFolder,
  createFile,
  deleteFile,
  renameFile,
  loadProject,
  addFile,
  addFolder,
} = fileSystemSlice.actions;

export default fileSystemSlice.reducer;
