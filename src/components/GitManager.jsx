import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadProject } from "../features/fileSystem";

export default function GitManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [commitMessage, setCommitMessage] = useState("");
  const [stagedFiles, setStagedFiles] = useState(new Set());
  const [commits, setCommits] = useState([]);
  const [currentBranch, setCurrentBranch] = useState("main");
  const [branches, setBranches] = useState(["main"]);
  const [lastCommitSnapshot, setLastCommitSnapshot] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const { currentTheme, themes } = useSelector((state) => state.theme);
  const { fileTree } = useSelector((state) => state.fileSystem);
  const dispatch = useDispatch();
  const theme = themes[currentTheme];

  // Vérifier si Git est initialisé au démarrage
  useEffect(() => {
    const gitData = localStorage.getItem("gitRepo_data");
    if (gitData) {
      try {
        const parsed = JSON.parse(gitData);
        setIsInitialized(true);
        setCommits(parsed.commits || []);
        setCurrentBranch(parsed.currentBranch || "main");
        setBranches(parsed.branches || ["main"]);
        setLastCommitSnapshot(parsed.lastSnapshot || null);
      } catch (error) {
        console.error("Erreur lors du chargement Git:", error);
      }
    }
  }, []);

  // Générer un hash SHA simulé
  const generateCommitHash = () => {
    return Math.random().toString(36).substr(2, 8);
  };

  // Collecter tous les fichiers et leur contenu
  const collectAllFiles = (node, files = []) => {
    if (node.type === "file") {
      files.push({
        id: node.id,
        name: node.name,
        extension: node.extension,
        content: node.content || "",
        path: getFilePath(node.id),
      });
    }
    if (node.children) {
      node.children.forEach((child) => collectAllFiles(child, files));
    }
    return files;
  };

  // Obtenir le chemin d'un fichier (simulation)
  const getFilePath = (fileId) => {
    const findPath = (node, targetId, path = "") => {
      if (node.id === targetId) return path + node.name;
      if (node.children) {
        for (let child of node.children) {
          const childPath = path ? `${path}${node.name}/` : "";
          const found = findPath(child, targetId, childPath);
          if (found) return found;
        }
      }
      return null;
    };
    return findPath(fileTree, fileId) || "unknown";
  };

  // Initialiser le repo Git
  const initGit = () => {
    setIsInitialized(true);
    const gitData = {
      initialized: true,
      commits: [],
      currentBranch: "main",
      branches: ["main"],
      lastSnapshot: null,
    };
    localStorage.setItem("gitRepo_data", JSON.stringify(gitData));
    alert("✅ Repository Git initialisé !");
  };

  // Obtenir les fichiers modifiés
  const getModifiedFiles = () => {
    const currentFiles = collectAllFiles(fileTree);

    if (!lastCommitSnapshot) {
      return {
        modified: [],
        untracked: currentFiles,
        deleted: [],
      };
    }

    const lastFiles = lastCommitSnapshot.files || [];
    const modified = [];
    const untracked = [];
    const deleted = [...lastFiles];

    currentFiles.forEach((currentFile) => {
      const lastFile = lastFiles.find((f) => f.id === currentFile.id);
      if (lastFile) {
        // Fichier existant - vérifier s'il a changé
        if (lastFile.content !== currentFile.content) {
          modified.push({ ...currentFile, status: "modified" });
        }
        // Retirer de la liste des supprimés
        const deleteIndex = deleted.findIndex((f) => f.id === currentFile.id);
        if (deleteIndex > -1) {
          deleted.splice(deleteIndex, 1);
        }
      } else {
        // Nouveau fichier
        untracked.push({ ...currentFile, status: "untracked" });
      }
    });

    return {
      modified,
      untracked,
      deleted: deleted.map((f) => ({ ...f, status: "deleted" })),
    };
  };

  // Stage/Unstage un fichier
  const toggleStageFile = (fileId) => {
    const newStagedFiles = new Set(stagedFiles);
    if (newStagedFiles.has(fileId)) {
      newStagedFiles.delete(fileId);
    } else {
      newStagedFiles.add(fileId);
    }
    setStagedFiles(newStagedFiles);
  };

  // Stage tous les fichiers
  const stageAllFiles = () => {
    const { modified, untracked, deleted } = getModifiedFiles();
    const allFiles = [...modified, ...untracked, ...deleted];
    setStagedFiles(new Set(allFiles.map((f) => f.id)));
  };

  // Unstage tous les fichiers
  const unstageAllFiles = () => {
    setStagedFiles(new Set());
  };

  // Faire un commit
  const makeCommit = () => {
    if (!commitMessage.trim()) {
      alert("Veuillez entrer un message de commit");
      return;
    }

    if (stagedFiles.size === 0) {
      alert("Aucun fichier stagé pour le commit");
      return;
    }

    const currentFiles = collectAllFiles(fileTree);
    const commitData = {
      hash: generateCommitHash(),
      message: commitMessage,
      author: "Développeur",
      timestamp: new Date().toISOString(),
      branch: currentBranch,
      files: currentFiles,
      stagedFiles: Array.from(stagedFiles),
      projectSnapshot: JSON.parse(JSON.stringify(fileTree)), // Deep copy
    };

    const newCommits = [commitData, ...commits];
    setCommits(newCommits);
    setLastCommitSnapshot(commitData);
    setStagedFiles(new Set());
    setCommitMessage("");

    // Sauvegarder dans localStorage
    const gitData = {
      initialized: true,
      commits: newCommits,
      currentBranch,
      branches,
      lastSnapshot: commitData,
    };
    localStorage.setItem("gitRepo_data", JSON.stringify(gitData));

    alert(`✅ Commit ${commitData.hash} créé avec succès !`);
  };

  // Checkout vers un commit
  const checkoutCommit = (commit) => {
    if (
      window.confirm(
        `Voulez-vous revenir au commit ${commit.hash} ?\n"${commit.message}"`
      )
    ) {
      dispatch(loadProject(commit.projectSnapshot));
      alert(`✅ Checkout vers le commit ${commit.hash} effectué !`);
      setIsOpen(false);
    }
  };

  // Créer une nouvelle branche
  const createBranch = () => {
    const branchName = prompt("Nom de la nouvelle branche:");
    if (branchName && !branches.includes(branchName)) {
      const newBranches = [...branches, branchName];
      setBranches(newBranches);
      setCurrentBranch(branchName);

      // Mettre à jour localStorage
      const gitData = JSON.parse(localStorage.getItem("gitRepo_data") || "{}");
      gitData.branches = newBranches;
      gitData.currentBranch = branchName;
      localStorage.setItem("gitRepo_data", JSON.stringify(gitData));

      alert(`✅ Branche "${branchName}" créée et activée !`);
    }
  };

  const { modified, untracked, deleted } = isInitialized
    ? getModifiedFiles()
    : { modified: [], untracked: [], deleted: [] };
  const totalChanges = modified.length + untracked.length + deleted.length;

  const getFileIcon = (file) => {
    if (file.status === "modified") return "📝";
    if (file.status === "untracked") return "➕";
    if (file.status === "deleted") return "➖";
    return "📄";
  };

  const getFileColor = (file) => {
    if (file.status === "modified") return "text-yellow-400";
    if (file.status === "untracked") return "text-green-400";
    if (file.status === "deleted") return "text-red-400";
    return theme.text;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-2 rounded hover:bg-opacity-80 transition text-sm ${
          isInitialized
            ? totalChanges > 0
              ? "bg-orange-600 text-white hover:bg-orange-700"
              : "bg-green-600 text-white hover:bg-green-700"
            : "bg-gray-600 text-white hover:bg-gray-700"
        }`}
        title={
          isInitialized
            ? `Git - ${totalChanges} changement(s)`
            : "Initialiser Git"
        }
      >
        {isInitialized ? `🔄 Git (${totalChanges})` : "📦 Git Init"}
      </button>

      {isOpen && (
        <div
          className={`absolute top-full mt-1 right-0 w-96 ${theme.bgSecondary} shadow-lg rounded-md p-4 z-20 max-h-96 overflow-hidden flex flex-col`}
        >
          {!isInitialized ? (
            <div className="text-center">
              <h3 className={`${theme.text} text-sm font-bold mb-3`}>
                Git Non Initialisé
              </h3>
              <p className={`${theme.textSecondary} text-xs mb-3`}>
                Initialisez un repository Git pour commencer le versioning
              </p>
              <button
                onClick={initGit}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
              >
                🚀 git init
              </button>
            </div>
          ) : (
            <>
              {/* Header avec branche */}
              <div className="flex items-center justify-between mb-3">
                <h3 className={`${theme.text} text-sm font-bold`}>
                  🌿 Branche: {currentBranch}
                </h3>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className={`px-2 py-1 ${theme.bgTertiary} ${theme.text} rounded text-xs hover:${theme.bg} transition`}
                  >
                    {showHistory ? "📝 Statut" : "📜 Historique"}
                  </button>
                  <button
                    onClick={createBranch}
                    className="px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition"
                  >
                    ➕ Branche
                  </button>
                </div>
              </div>

              {showHistory ? (
                // Vue Historique
                <div className="flex-1 overflow-hidden flex flex-col">
                  <h4 className={`${theme.text} text-sm font-semibold mb-2`}>
                    Historique des Commits ({commits.length})
                  </h4>
                  <div className="flex-1 overflow-y-auto space-y-2">
                    {commits.length === 0 ? (
                      <p
                        className={`${theme.textSecondary} text-xs text-center py-4`}
                      >
                        Aucun commit pour le moment
                      </p>
                    ) : (
                      commits.map((commit, index) => (
                        <div
                          key={commit.hash}
                          className={`${theme.bgTertiary} p-3 rounded border ${theme.borderSecondary}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`${theme.text} font-mono text-xs`}>
                              {commit.hash}
                            </span>
                            <span className={`${theme.textSecondary} text-xs`}>
                              {index === 0 ? "HEAD" : `HEAD~${index}`}
                            </span>
                          </div>
                          <p
                            className={`${theme.text} text-sm font-medium mb-1`}
                          >
                            {commit.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className={`${theme.textSecondary} text-xs`}>
                              {new Date(commit.timestamp).toLocaleString()}
                            </span>
                            <button
                              onClick={() => checkoutCommit(commit)}
                              className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
                            >
                              Checkout
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                // Vue Statut
                <>
                  {totalChanges === 0 ? (
                    <div
                      className={`${theme.textSecondary} text-center text-sm py-4`}
                    >
                      ✅ Working tree clean
                      <br />
                      <span className="text-xs">
                        Aucun changement à committer
                      </span>
                    </div>
                  ) : (
                    <>
                      {/* Actions rapides */}
                      <div className="flex space-x-2 mb-3">
                        <button
                          onClick={stageAllFiles}
                          className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition"
                        >
                          ➕ Stage All
                        </button>
                        <button
                          onClick={unstageAllFiles}
                          className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition"
                        >
                          ➖ Unstage All
                        </button>
                      </div>

                      {/* Liste des fichiers modifiés */}
                      <div className="flex-1 overflow-y-auto mb-3">
                        <h4
                          className={`${theme.text} text-sm font-semibold mb-2`}
                        >
                          Changements ({totalChanges})
                        </h4>
                        <div className="space-y-1">
                          {[...modified, ...untracked, ...deleted].map(
                            (file) => (
                              <div
                                key={file.id}
                                className={`flex items-center justify-between p-2 ${theme.bgTertiary} rounded text-xs`}
                              >
                                <div className="flex items-center space-x-2 flex-1">
                                  <span>{getFileIcon(file)}</span>
                                  <span className={getFileColor(file)}>
                                    {file.name}.{file.extension}
                                  </span>
                                  <span
                                    className={`${theme.textSecondary} text-xs`}
                                  >
                                    {file.status}
                                  </span>
                                </div>
                                <button
                                  onClick={() => toggleStageFile(file.id)}
                                  className={`px-2 py-1 rounded text-xs ${
                                    stagedFiles.has(file.id)
                                      ? "bg-green-600 text-white"
                                      : theme.bgTertiary + " " + theme.text
                                  }`}
                                >
                                  {stagedFiles.has(file.id) ? "✓" : "+"}
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Zone de commit */}
                      {stagedFiles.size > 0 && (
                        <div className="border-t pt-3">
                          <p className={`${theme.textSecondary} text-xs mb-2`}>
                            {stagedFiles.size} fichier(s) stagé(s)
                          </p>
                          <input
                            type="text"
                            value={commitMessage}
                            onChange={(e) => setCommitMessage(e.target.value)}
                            placeholder="Message de commit..."
                            className={`w-full px-3 py-2 ${theme.bgTertiary} ${theme.text} rounded focus:outline-none text-sm mb-2`}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                makeCommit();
                              }
                            }}
                          />
                          <button
                            onClick={makeCommit}
                            disabled={!commitMessage.trim()}
                            className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm disabled:opacity-50"
                          >
                            📦 Commit
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}

              <div className={`mt-3 pt-2 border-t ${theme.borderSecondary}`}>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-1 ${theme.bgTertiary} ${theme.text} rounded hover:${theme.bg} transition text-xs w-full`}
                >
                  Fermer
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
