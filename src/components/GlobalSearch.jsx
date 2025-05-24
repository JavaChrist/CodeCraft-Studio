import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateFileContent,
  openFile,
  setActiveFile,
} from "../features/fileSystem";

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [replaceTerm, setReplaceTerm] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [replaceMode, setReplaceMode] = useState(false);

  const { currentTheme, themes } = useSelector((state) => state.theme);
  const { fileTree } = useSelector((state) => state.fileSystem);
  const dispatch = useDispatch();
  const theme = themes[currentTheme];
  const searchInputRef = useRef(null);

  // Collecter tous les fichiers de l'arbre
  const collectAllFiles = (node, files = []) => {
    if (node.type === "file") {
      files.push(node);
    }
    if (node.children) {
      node.children.forEach((child) => collectAllFiles(child, files));
    }
    return files;
  };

  // Effectuer la recherche
  const performSearch = () => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const allFiles = collectAllFiles(fileTree);
    const searchResults = [];

    try {
      // Construire l'expression de recherche
      let searchRegex;
      if (useRegex) {
        searchRegex = new RegExp(searchTerm, caseSensitive ? "g" : "gi");
      } else {
        let pattern = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Échapper les caractères spéciaux
        if (wholeWord) {
          pattern = `\\b${pattern}\\b`;
        }
        searchRegex = new RegExp(pattern, caseSensitive ? "g" : "gi");
      }

      allFiles.forEach((file) => {
        if (!file.content) return;

        const lines = file.content.split("\n");
        lines.forEach((line, lineIndex) => {
          let match;
          const regex = new RegExp(searchRegex.source, searchRegex.flags);

          while ((match = regex.exec(line)) !== null) {
            const beforeMatch = line.substring(0, match.index);
            const matchText = match[0];
            const afterMatch = line.substring(match.index + matchText.length);

            searchResults.push({
              fileId: file.id,
              fileName: file.name,
              fileExtension: file.extension,
              lineNumber: lineIndex + 1,
              lineContent: line,
              matchIndex: match.index,
              matchText: matchText,
              beforeMatch: beforeMatch,
              afterMatch: afterMatch,
              contextBefore: lines[lineIndex - 1] || "",
              contextAfter: lines[lineIndex + 1] || "",
            });

            // Éviter les boucles infinites avec les regex globales
            if (!searchRegex.global) break;
          }
        });
      });

      setResults(searchResults);
    } catch (error) {
      console.error("Erreur dans la recherche:", error);
      alert("Erreur dans l'expression de recherche");
    }

    setIsSearching(false);
  };

  // Remplacer une occurrence spécifique
  const replaceOccurrence = (result) => {
    const file = findFileInTree(fileTree, result.fileId);
    if (!file) return;

    const lines = file.content.split("\n");
    const lineContent = lines[result.lineNumber - 1];

    // Remplacer seulement cette occurrence spécifique
    const newLineContent = result.beforeMatch + replaceTerm + result.afterMatch;

    lines[result.lineNumber - 1] = newLineContent;
    const newContent = lines.join("\n");

    dispatch(
      updateFileContent({
        fileId: result.fileId,
        content: newContent,
      })
    );

    // Refaire la recherche pour mettre à jour les résultats
    setTimeout(performSearch, 100);
  };

  // Remplacer toutes les occurrences
  const replaceAll = () => {
    if (!replaceTerm && replaceTerm !== "") return;

    const fileUpdates = {};

    // Grouper les remplacements par fichier
    results.forEach((result) => {
      if (!fileUpdates[result.fileId]) {
        const file = findFileInTree(fileTree, result.fileId);
        fileUpdates[result.fileId] = {
          file: file,
          content: file.content,
        };
      }
    });

    // Effectuer les remplacements
    Object.values(fileUpdates).forEach(({ file, content }) => {
      let newContent = content;

      try {
        let searchRegex;
        if (useRegex) {
          searchRegex = new RegExp(searchTerm, caseSensitive ? "g" : "gi");
        } else {
          let pattern = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          if (wholeWord) {
            pattern = `\\b${pattern}\\b`;
          }
          searchRegex = new RegExp(pattern, caseSensitive ? "g" : "gi");
        }

        newContent = newContent.replace(searchRegex, replaceTerm);

        dispatch(
          updateFileContent({
            fileId: file.id,
            content: newContent,
          })
        );
      } catch (error) {
        console.error("Erreur lors du remplacement:", error);
      }
    });

    // Refaire la recherche
    setTimeout(performSearch, 100);
  };

  // Trouver un fichier dans l'arbre
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

  // Naviguer vers un résultat
  const goToResult = (result) => {
    dispatch(openFile(result.fileId));
    dispatch(setActiveFile(result.fileId));
    // Note: En production, on ajouterait ici la navigation vers la ligne spécifique
  };

  // Raccourci clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "F") {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Recherche automatique lors de la saisie
  useEffect(() => {
    const timer = setTimeout(performSearch, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, caseSensitive, wholeWord, useRegex]);

  // Focus sur l'input quand ouvert
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const getFileIcon = (extension) => {
    switch (extension) {
      case "html":
        return "🌐";
      case "css":
        return "🎨";
      case "js":
        return "⚡";
      case "json":
        return "📄";
      default:
        return "📝";
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition text-sm"
        title="Recherche globale (Ctrl+Shift+F)"
      >
        🔍 Recherche
      </button>

      {isOpen && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}
        >
          <div
            className={`${theme.bgSecondary} rounded-lg p-6 w-3/4 max-w-4xl max-h-4/5 flex flex-col`}
          >
            {/* En-tête */}
            <div className="flex items-center justify-between mb-4">
              <h3 className={`${theme.text} text-lg font-bold`}>
                🔍 Recherche et Remplacement Global
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className={`${theme.text} hover:${theme.textSecondary} text-xl`}
              >
                ×
              </button>
            </div>

            {/* Barre de recherche */}
            <div className="space-y-3 mb-4">
              <div className="flex space-x-2">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher..."
                  className={`flex-1 px-3 py-2 ${theme.bgTertiary} ${theme.text} rounded focus:outline-none`}
                />
                <button
                  onClick={() => setReplaceMode(!replaceMode)}
                  className={`px-4 py-2 ${
                    replaceMode ? "bg-blue-600" : theme.bgTertiary
                  } ${theme.text} rounded transition`}
                >
                  {replaceMode ? "🔄 Remplacer" : "🔍 Rechercher"}
                </button>
              </div>

              {replaceMode && (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={replaceTerm}
                    onChange={(e) => setReplaceTerm(e.target.value)}
                    placeholder="Remplacer par..."
                    className={`flex-1 px-3 py-2 ${theme.bgTertiary} ${theme.text} rounded focus:outline-none`}
                  />
                  <button
                    onClick={replaceAll}
                    disabled={!searchTerm || results.length === 0}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50"
                  >
                    Remplacer tout ({results.length})
                  </button>
                </div>
              )}

              {/* Options */}
              <div className="flex space-x-4 text-sm">
                <label className={`flex items-center ${theme.text}`}>
                  <input
                    type="checkbox"
                    checked={caseSensitive}
                    onChange={(e) => setCaseSensitive(e.target.checked)}
                    className="mr-2"
                  />
                  Sensible à la casse
                </label>
                <label className={`flex items-center ${theme.text}`}>
                  <input
                    type="checkbox"
                    checked={wholeWord}
                    onChange={(e) => setWholeWord(e.target.checked)}
                    className="mr-2"
                  />
                  Mot entier
                </label>
                <label className={`flex items-center ${theme.text}`}>
                  <input
                    type="checkbox"
                    checked={useRegex}
                    onChange={(e) => setUseRegex(e.target.checked)}
                    className="mr-2"
                  />
                  Expression régulière
                </label>
              </div>
            </div>

            {/* Résultats */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className={`${theme.textSecondary} text-sm mb-2`}>
                {isSearching
                  ? "Recherche en cours..."
                  : `${results.length} résultat(s) trouvé(s) ${
                      searchTerm ? `pour "${searchTerm}"` : ""
                    }`}
              </div>

              <div className="flex-1 overflow-y-auto space-y-1">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`${theme.bgTertiary} p-3 rounded border ${theme.borderSecondary} hover:${theme.bg} transition cursor-pointer`}
                    onClick={() => goToResult(result)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span>{getFileIcon(result.fileExtension)}</span>
                        <span className={`${theme.text} font-medium`}>
                          {result.fileName}.{result.fileExtension}
                        </span>
                        <span className={`${theme.textSecondary} text-sm`}>
                          ligne {result.lineNumber}
                        </span>
                      </div>
                      {replaceMode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            replaceOccurrence(result);
                          }}
                          className="px-2 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 transition"
                        >
                          Remplacer
                        </button>
                      )}
                    </div>
                    <div className={`${theme.textSecondary} text-sm font-mono`}>
                      {result.beforeMatch}
                      <span className="bg-yellow-300 text-black px-1 rounded">
                        {result.matchText}
                      </span>
                      {result.afterMatch}
                    </div>
                  </div>
                ))}

                {!isSearching && searchTerm && results.length === 0 && (
                  <div className={`${theme.textSecondary} text-center py-8`}>
                    Aucun résultat trouvé pour "{searchTerm}"
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div
              className={`${theme.textSecondary} text-xs mt-4 pt-3 border-t ${theme.borderSecondary}`}
            >
              <strong>Raccourcis :</strong> Ctrl+Shift+F (Ouvrir), Échap
              (Fermer) •<strong>Regex :</strong> .*\.css$ (fichiers CSS), \d+
              (nombres)
            </div>
          </div>
        </div>
      )}
    </>
  );
}
