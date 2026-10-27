import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadProject } from "../features/fileSystem";
import JSZip from "jszip";

export default function ProjectManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [savedProjects, setSavedProjects] = useState([]);
  const dispatch = useDispatch();
  const { fileTree } = useSelector((state) => state.fileSystem);
  const { currentTheme, themes } = useSelector((state) => state.theme);
  const theme = themes[currentTheme];

  useEffect(() => {
    // Récupérer la liste des projets sauvegardés
    const projects = Object.keys(localStorage)
      .filter((key) => key.startsWith("fileSystemProject_"))
      .map((key) => key.replace("fileSystemProject_", ""));
    setSavedProjects(projects);
  }, [isOpen]); // Mettre à jour quand le menu est ouvert

  const handleSave = () => {
    if (!projectName.trim()) {
      alert("Veuillez entrer un nom de projet");
      return;
    }

    // Créer une copie complète du projet avec le bon nom
    const projectToSave = {
      ...fileTree,
      name: projectName,
    };

    // Sauvegarder le projet avec le nouveau système de fichiers
    const projectData = {
      fileTree: projectToSave,
      timestamp: new Date().toISOString(),
    };

    // Debug : Afficher ce qui est sauvegardé
    console.log("Sauvegarde du projet :", projectName);
    console.log("Données sauvegardées :", JSON.stringify(projectData, null, 2));

    localStorage.setItem(
      `fileSystemProject_${projectName}`,
      JSON.stringify(projectData)
    );

    // Mettre à jour le nom du projet actuel dans l'état Redux
    dispatch({
      type: "fileSystem/renameFile",
      payload: { fileId: "root", newName: projectName },
    });

    setProjectName("");
    setIsOpen(false);
    // Mettre à jour la liste des projets
    const updatedProjects = [...savedProjects];
    if (!updatedProjects.includes(projectName)) {
      updatedProjects.push(projectName);
      setSavedProjects(updatedProjects);
    }
    alert(`✅ Projet "${projectName}" sauvegardé avec succès !`);
  };

  const handleLoad = (name) => {
    try {
      const projectData = localStorage.getItem(`fileSystemProject_${name}`);
      if (projectData) {
        const parsed = JSON.parse(projectData);

        // Debug : Afficher ce qui est chargé
        console.log("Chargement du projet :", name);
        console.log("Données chargées :", JSON.stringify(parsed, null, 2));

        // Charger le projet dans le store avec l'action Redux appropriée
        dispatch(loadProject(parsed.fileTree));

        setIsOpen(false);
        alert(`✅ Projet "${name}" chargé avec succès !`);
      } else {
        alert("❌ Projet introuvable !");
      }
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
      alert("❌ Erreur lors du chargement du projet");
    }
  };

  const handleReset = () => {
    if (
      window.confirm("Êtes-vous sûr de vouloir créer un nouveau projet vide?")
    ) {
      // Créer un nouveau projet vide
      const newProject = {
        id: "root",
        name: "Nouveau Projet",
        type: "folder",
        isRoot: true,
        isOpen: true,
        children: [
          {
            id: "index-html-" + Date.now(),
            name: "index.html",
            type: "file",
            extension: "html",
            content: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouveau Projet</title>
</head>
<body>
    <h1>Nouveau Projet</h1>
    <p>Commencez à coder ici !</p>
</body>
</html>`,
          },
        ],
      };

      dispatch(loadProject(newProject));
      setIsOpen(false);
    }
  };

  const handleDelete = (projectName) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer le projet "${projectName}" ?`
      )
    ) {
      localStorage.removeItem(`fileSystemProject_${projectName}`);
      setSavedProjects(savedProjects.filter((p) => p !== projectName));
    }
  };

  // Fonction pour télécharger le projet actuel en ZIP
  const handleDownload = async () => {
    try {
      const zip = new JSZip();

      // Fonction récursive pour ajouter les fichiers au ZIP
      const addToZip = (node, path = "") => {
        if (node.type === "file") {
          const filePath = path ? `${path}/${node.name}` : node.name;
          zip.file(filePath, node.content || "");
        } else if (node.type === "folder" && node.children) {
          const folderPath = path ? `${path}/${node.name}` : node.name;
          node.children.forEach((child) => {
            addToZip(child, folderPath);
          });
        }
      };

      // Ajouter tous les fichiers du projet (en partant des children pour éviter le dossier racine)
      if (fileTree.children) {
        fileTree.children.forEach((child) => {
          addToZip(child);
        });
      }

      // Générer le ZIP
      const content = await zip.generateAsync({ type: "blob" });

      // Créer le lien de téléchargement
      const url = window.URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileTree.name || "Mon_Projet"}.zip`;

      // Déclencher le téléchargement
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Nettoyer l'URL
      window.URL.revokeObjectURL(url);

      alert(`✅ Projet "${fileTree.name}" téléchargé avec succès !`);
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      alert("❌ Erreur lors du téléchargement du projet");
    }
  };

  // Fonction pour télécharger un projet sauvegardé en ZIP
  const handleDownloadSaved = async (projectName) => {
    try {
      const projectData = localStorage.getItem(
        `fileSystemProject_${projectName}`
      );
      if (!projectData) {
        alert("❌ Projet introuvable !");
        return;
      }

      const parsed = JSON.parse(projectData);
      const zip = new JSZip();

      // Fonction récursive pour ajouter les fichiers au ZIP
      const addToZip = (node, path = "") => {
        if (node.type === "file") {
          const filePath = path ? `${path}/${node.name}` : node.name;
          zip.file(filePath, node.content || "");
        } else if (node.type === "folder" && node.children) {
          const folderPath = path ? `${path}/${node.name}` : node.name;
          node.children.forEach((child) => {
            addToZip(child, folderPath);
          });
        }
      };

      // Ajouter tous les fichiers du projet sauvegardé
      if (parsed.fileTree.children) {
        parsed.fileTree.children.forEach((child) => {
          addToZip(child);
        });
      }

      // Générer le ZIP
      const content = await zip.generateAsync({ type: "blob" });

      // Créer le lien de téléchargement
      const url = window.URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${projectName}.zip`;

      // Déclencher le téléchargement
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Nettoyer l'URL
      window.URL.revokeObjectURL(url);

      alert(`✅ Projet "${projectName}" téléchargé avec succès !`);
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      alert("❌ Erreur lors du téléchargement du projet");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
        title="Gestion des projets"
      >
        💾 Projets
      </button>

      {isOpen && (
        <div
          className={`absolute top-full mt-1 right-0 w-80 ${theme.bgSecondary} shadow-lg rounded-md p-4 z-20`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className={`${theme.text} text-sm font-bold`}>
              Gestionnaire de Projets
            </h3>
            <span className={`${theme.textSecondary} text-xs`}>
              {savedProjects.length} projet(s)
            </span>
          </div>

          {/* Section Nouveau Projet */}
          <div className="mb-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Nom du nouveau projet..."
                className={`flex-1 px-3 py-2 ${theme.bgTertiary} ${theme.text} rounded focus:outline-none text-sm`}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSave();
                  }
                }}
              />
              <button
                onClick={handleSave}
                className="px-3 py-2 bg-green-600 text-white rounded-r hover:bg-green-700 transition text-sm whitespace-nowrap"
                disabled={!projectName.trim()}
                title="Sauvegarder le projet actuel"
              >
                Sauver
              </button>
            </div>
            <button
              onClick={handleReset}
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm w-full"
              title="Créer un nouveau projet vide"
              style={{ marginTop: "8px" }}
            >
              ➕ Nouveau Projet
            </button>
          </div>

          {savedProjects.length > 0 && (
            <div className="mb-3">
              <h3 className={`${theme.text} text-sm font-bold mb-2`}>
                Charger un projet ({savedProjects.length})
              </h3>
              <ul className="max-h-32 overflow-y-auto">
                {savedProjects.map((project) => (
                  <li
                    key={project}
                    className={`flex items-center justify-between px-2 py-1 ${theme.textSecondary} hover:${theme.hoverBg} rounded text-sm mb-1`}
                  >
                    <span
                      onClick={() => handleLoad(project)}
                      className="cursor-pointer flex-1 truncate"
                      title={`Charger le projet "${project}"`}
                    >
                      📁 {project}
                    </span>
                    <div className="flex space-x-1 ml-2">
                      <button
                        onClick={() => handleDownloadSaved(project)}
                        className="text-blue-400 hover:text-blue-300 text-xs"
                        title={`Télécharger le projet "${project}"`}
                      >
                        💾
                      </button>
                      <button
                        onClick={() => handleDelete(project)}
                        className="text-red-400 hover:text-red-300 text-xs"
                        title="Supprimer le projet"
                      >
                        🗑️
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
