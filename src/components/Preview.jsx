import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

// Fonction pour obtenir un fichier par extension dans l'arbre
const findFileByExtension = (tree, extension) => {
  if (tree.extension === extension && tree.type === "file") {
    return tree;
  }

  if (tree.children) {
    for (let child of tree.children) {
      const found = findFileByExtension(child, extension);
      if (found) return found;
    }
  }

  return null;
};

// Fonction pour collecter tous les fichiers d'un type
const findAllFilesByExtension = (tree, extension, result = []) => {
  if (tree.extension === extension && tree.type === "file") {
    result.push(tree);
  }

  if (tree.children) {
    for (let child of tree.children) {
      findAllFilesByExtension(child, extension, result);
    }
  }

  return result;
};

export default function Preview() {
  const iframeRef = useRef(null);
  const { fileTree } = useSelector((state) => state.fileSystem);
  const previewData = useSelector((state) => state.preview) || {
    preview: false,
    viewportSize: "desktop",
  };
  const { currentTheme, themes } = useSelector((state) => state.theme);
  const theme = themes[currentTheme];

  // Fonction pour générer le HTML combiné
  const generateCombinedHTML = () => {
    // Trouver le fichier HTML principal (index.html ou premier fichier .html)
    let htmlFile = findFileByExtension(fileTree, "html");

    // Si pas de fichier HTML principal, créer un template de base
    let htmlContent =
      htmlFile?.content ||
      `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prévisualisation</title>
</head>
<body>
    <h1>Prévisualisation</h1>
    <p>Créez un fichier index.html pour voir votre projet ici.</p>
</body>
</html>`;

    // Collecter tous les fichiers CSS et JS
    const cssFiles = findAllFilesByExtension(fileTree, "css");
    const jsFiles = findAllFilesByExtension(fileTree, "js");

    // Si on a un fichier HTML, on injecte CSS et JS
    if (htmlFile && htmlFile.content) {
      let modifiedHTML = htmlContent;

      // Injecter le CSS dans le head
      if (cssFiles.length > 0) {
        const cssContent = cssFiles
          .map((file) => `<style>\n${file.content || ""}\n</style>`)
          .join("\n");

        // Remplacer les liens CSS externes par du CSS inline
        modifiedHTML = modifiedHTML.replace(
          /<link[^>]*rel=["']stylesheet["'][^>]*>/gi,
          ""
        );

        if (modifiedHTML.includes("</head>")) {
          modifiedHTML = modifiedHTML.replace(
            "</head>",
            `${cssContent}\n</head>`
          );
        } else {
          modifiedHTML = cssContent + modifiedHTML;
        }
      }

      // Injecter le JavaScript avant la fermeture du body
      if (jsFiles.length > 0) {
        const jsContent = jsFiles
          .map((file) => `<script>\n${file.content || ""}\n</script>`)
          .join("\n");

        // Remplacer les scripts externes par du JS inline
        modifiedHTML = modifiedHTML.replace(
          /<script[^>]*src=["'][^"']*["'][^>]*><\/script>/gi,
          ""
        );

        if (modifiedHTML.includes("</body>")) {
          modifiedHTML = modifiedHTML.replace(
            "</body>",
            `${jsContent}\n</body>`
          );
        } else {
          modifiedHTML = modifiedHTML + jsContent;
        }
      }

      return modifiedHTML;
    }

    return htmlContent;
  };

  // Mettre à jour la prévisualisation quand les fichiers changent
  useEffect(() => {
    if (iframeRef.current) {
      const combinedHTML = generateCombinedHTML();
      const iframe = iframeRef.current;

      // Écrire le contenu dans l'iframe
      try {
        iframe.srcdoc = combinedHTML;
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour de la prévisualisation:",
          error
        );
      }
    }
  }, [fileTree]); // Se met à jour quand l'arbre de fichiers change

  const getPreviewStyle = () => {
    const viewportSize = previewData?.viewportSize || "desktop";
    switch (viewportSize) {
      case "mobile":
        return { width: "375px", height: "667px" };
      case "tablet":
        return { width: "768px", height: "1024px" };
      case "desktop":
      default:
        return { width: "100%", height: "100%" };
    }
  };

  const previewStyle = getPreviewStyle();
  const isFullScreen = (previewData?.viewportSize || "desktop") === "desktop";

  return (
    <div
      className={`${theme.bg} ${theme.borderSecondary} border-l w-1/2 flex flex-col`}
    >
      {/* En-tête de la prévisualisation */}
      <div
        className={`${theme.bgSecondary} ${theme.text} px-3 py-2 border-b ${theme.borderSecondary} font-medium text-sm flex items-center justify-between`}
      >
        <span>PRÉVISUALISATION</span>
        <span className={`${theme.textSecondary} text-xs`}>
          {(previewData?.viewportSize || "desktop") === "mobile" && "📱 Mobile"}
          {(previewData?.viewportSize || "desktop") === "tablet" &&
            "📱 Tablette"}
          {(previewData?.viewportSize || "desktop") === "desktop" &&
            "🖥️ Bureau"}
        </span>
      </div>

      {/* Zone de prévisualisation */}
      <div className="flex-1 overflow-auto p-4 flex justify-center items-start">
        <div
          className="bg-white shadow-lg border border-gray-300"
          style={
            isFullScreen ? { width: "100%", height: "100%" } : previewStyle
          }
        >
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            title="Prévisualisation"
            sandbox="allow-scripts"
            style={{
              maxWidth: isFullScreen ? "100%" : previewStyle.width,
              maxHeight: isFullScreen ? "100%" : previewStyle.height,
            }}
          />
        </div>
      </div>
    </div>
  );
}
