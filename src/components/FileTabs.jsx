import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setActiveFile, closeFile } from "../features/fileSystem";

// Fonction pour obtenir l'icône d'un fichier
const getFileIcon = (extension) => {
  switch (extension) {
    case "html":
      return "🌐";
    case "css":
      return "🎨";
    case "js":
      return "⚡";
    case "json":
      return "📋";
    case "md":
      return "📝";
    case "txt":
      return "📄";
    default:
      return "📄";
  }
};

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

export default function FileTabs() {
  const dispatch = useDispatch();
  const { fileTree, openFiles, activeFileId } = useSelector(
    (state) => state.fileSystem
  );
  const { currentTheme, themes } = useSelector((state) => state.theme);
  const theme = themes[currentTheme];

  const handleTabClick = (fileId) => {
    dispatch(setActiveFile(fileId));
  };

  const handleTabClose = (e, fileId) => {
    e.stopPropagation(); // Empêcher la sélection de l'onglet
    dispatch(closeFile(fileId));
  };

  if (openFiles.length === 0) {
    return (
      <div
        className={`${theme.bgSecondary} ${theme.borderSecondary} border-b h-10 flex items-center justify-center`}
      >
        <span className={`${theme.textSecondary} text-sm`}>
          Aucun fichier ouvert - Cliquez sur un fichier dans l'explorateur
        </span>
      </div>
    );
  }

  return (
    <div
      className={`${theme.bgSecondary} ${theme.borderSecondary} border-b h-10 flex overflow-x-auto scrollbar-thin`}
    >
      {openFiles.map((fileId) => {
        const file = findFileInTree(fileTree, fileId);
        if (!file) return null;

        const isActive = activeFileId === fileId;

        return (
          <div
            key={fileId}
            className={`flex items-center px-3 py-2 cursor-pointer border-r ${
              theme.borderSecondary
            } min-w-0 max-w-48 group relative ${
              isActive
                ? `${theme.bg} ${theme.text} shadow-sm`
                : `${theme.bgSecondary} ${theme.textSecondary} hover:${theme.bg} hover:${theme.text}`
            }`}
            onClick={() => handleTabClick(fileId)}
          >
            <span className="mr-2 text-sm flex-shrink-0">
              {getFileIcon(file.extension)}
            </span>

            <span className="text-sm truncate flex-1 min-w-0">{file.name}</span>

            <button
              onClick={(e) => handleTabClose(e, fileId)}
              className={`ml-2 flex-shrink-0 w-5 h-5 rounded hover:bg-red-500 hover:text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-60 hover:opacity-100 transition-all duration-200`}
              title="Fermer le fichier"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
