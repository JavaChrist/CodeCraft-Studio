import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addFile, addFolder } from "../features/fileSystem";

export default function DragDropUpload() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { currentTheme, themes } = useSelector((state) => state.theme);
  const { fileTree } = useSelector((state) => state.fileSystem);
  const dispatch = useDispatch();
  const theme = themes[currentTheme];

  // Générer un ID unique
  const generateId = () =>
    Date.now().toString() + Math.random().toString(36).substr(2, 9);

  // Déterminer l'extension et le type de fichier
  const getFileInfo = (filename) => {
    const extension = filename.split(".").pop()?.toLowerCase() || "";
    const supportedExtensions = ["html", "css", "js", "json", "txt", "md"];

    return {
      extension: supportedExtensions.includes(extension) ? extension : "txt",
      isSupported: supportedExtensions.includes(extension),
    };
  };

  // Traiter un fichier
  const processFile = useCallback(async (file, parentId = null) => {
    const { extension, isSupported } = getFileInfo(file.name);

    if (!isSupported) {
      console.warn(`Type de fichier non supporté: ${file.name}`);
      return null;
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData = {
          id: generateId(),
          name: file.name.replace(/\.[^/.]+$/, ""), // Nom sans extension
          extension: extension,
          content: e.target.result,
          type: "file",
          parentId: parentId,
        };
        resolve(fileData);
      };
      reader.onerror = () => {
        console.error(`Erreur lors de la lecture du fichier: ${file.name}`);
        resolve(null);
      };
      reader.readAsText(file);
    });
  }, []);

  // Traiter un dossier (avec WebkitGetAsEntry si disponible)
  const processFolderEntry = useCallback(
    async (entry, parentId = null) => {
      if (entry.isFile) {
        return new Promise((resolve) => {
          entry.file(async (file) => {
            const fileData = await processFile(file, parentId);
            resolve(fileData);
          });
        });
      } else if (entry.isDirectory) {
        const folderId = generateId();
        const folderData = {
          id: folderId,
          name: entry.name,
          type: "folder",
          parentId: parentId,
          children: [],
        };

        // Lire le contenu du dossier
        const reader = entry.createReader();
        const entries = await new Promise((resolve) => {
          reader.readEntries(resolve);
        });

        // Traiter récursivement les sous-éléments
        const children = [];
        for (const childEntry of entries) {
          const childData = await processFolderEntry(childEntry, folderId);
          if (childData) {
            children.push(childData);
          }
        }

        folderData.children = children;
        return folderData;
      }
      return null;
    },
    [processFile]
  );

  // Gérer le drop
  const handleDrop = useCallback(
    async (e) => {
      e.preventDefault();
      setIsDragOver(false);
      setIsProcessing(true);

      try {
        const items = Array.from(e.dataTransfer.items);

        // Si le navigateur supporte webkitGetAsEntry (dossiers)
        if (items[0]?.webkitGetAsEntry) {
          for (const item of items) {
            const entry = item.webkitGetAsEntry();
            if (entry) {
              const data = await processFolderEntry(entry);
              if (data) {
                if (data.type === "folder") {
                  dispatch(addFolder(data));
                } else {
                  dispatch(addFile(data));
                }
              }
            }
          }
        } else {
          // Fallback pour les fichiers simples
          const files = Array.from(e.dataTransfer.files);
          for (const file of files) {
            const fileData = await processFile(file);
            if (fileData) {
              dispatch(addFile(fileData));
            }
          }
        }
      } catch (error) {
        console.error("Erreur lors du traitement des fichiers:", error);
        alert("Erreur lors de l'importation des fichiers");
      } finally {
        setIsProcessing(false);
      }
    },
    [dispatch, processFile, processFolderEntry]
  );

  // Gérer le drag over
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  // Gérer le drag leave
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  }, []);

  // Upload manuel via input file
  const handleFileInput = useCallback(
    async (e) => {
      const files = Array.from(e.target.files);
      setIsProcessing(true);

      try {
        for (const file of files) {
          const fileData = await processFile(file);
          if (fileData) {
            dispatch(addFile(fileData));
          }
        }
      } catch (error) {
        console.error("Erreur lors de l'upload:", error);
      } finally {
        setIsProcessing(false);
      }

      // Reset input
      e.target.value = "";
    },
    [dispatch, processFile]
  );

  return (
    <>
      {/* Zone de drag & drop overlay */}
      {(isDragOver || isProcessing) && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div
            className={`${theme.bgSecondary} border-2 border-dashed ${
              isDragOver ? "border-blue-500" : theme.borderSecondary
            } rounded-lg p-8 m-4 text-center max-w-md`}
          >
            {isProcessing ? (
              <div className={`${theme.text}`}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <h3 className="text-lg font-bold mb-2">
                  Traitement en cours...
                </h3>
                <p className={`${theme.textSecondary} text-sm`}>
                  Importation des fichiers et dossiers
                </p>
              </div>
            ) : (
              <div className={`${theme.text}`}>
                <div className="text-6xl mb-4">📁</div>
                <h3 className="text-lg font-bold mb-2">
                  Déposez vos fichiers ici
                </h3>
                <p className={`${theme.textSecondary} text-sm mb-4`}>
                  Fichiers supportés: HTML, CSS, JS, JSON, TXT, MD
                </p>
                <p className={`${theme.textSecondary} text-xs`}>
                  Vous pouvez également glisser des dossiers complets !
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bouton d'upload */}
      <div className="relative">
        <button
          onClick={() => document.getElementById("file-input").click()}
          className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
          title="Importer des fichiers"
          disabled={isProcessing}
        >
          📤 Import
        </button>

        <input
          id="file-input"
          type="file"
          multiple
          accept=".html,.css,.js,.json,.txt,.md"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* Event listeners globaux pour le drag & drop */}
      <DragDropGlobalListeners
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      />
    </>
  );
}

// Composant pour les event listeners globaux
function DragDropGlobalListeners({ onDragOver, onDragLeave, onDrop }) {
  React.useEffect(() => {
    const preventDefault = (e) => e.preventDefault();

    // Empêcher le comportement par défaut du navigateur
    document.addEventListener("dragenter", preventDefault);
    document.addEventListener("dragover", preventDefault);
    document.addEventListener("dragleave", onDragLeave);
    document.addEventListener("drop", onDrop);

    return () => {
      document.removeEventListener("dragenter", preventDefault);
      document.removeEventListener("dragover", preventDefault);
      document.removeEventListener("dragleave", onDragLeave);
      document.removeEventListener("drop", onDrop);
    };
  }, [onDragLeave, onDrop]);

  return null;
}
