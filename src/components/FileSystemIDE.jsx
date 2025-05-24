import React from "react";
import { useSelector } from "react-redux";
import FileExplorer from "./FileExplorer";
import FileTabs from "./FileTabs";
import FileCodeTab from "./FileCodeTab";
import Preview from "./Preview";

export default function FileSystemIDE() {
  const previewData = useSelector((state) => state.preview);
  const { currentTheme, themes } = useSelector((state) => state.theme);
  const theme = themes[currentTheme];

  return (
    <div className="flex grow h-full">
      {/* Explorateur de fichiers à gauche */}
      <FileExplorer />

      {/* Zone principale d'édition */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Onglets des fichiers ouverts */}
        <FileTabs />

        {/* Zone d'édition et prévisualisation */}
        <div className="flex flex-1 relative min-h-0">
          {/* Éditeur de code */}
          <div className="flex-1 min-w-0">
            <FileCodeTab />
          </div>

          {/* Prévisualisation conditionnelle */}
          {previewData?.preview && <Preview />}
        </div>
      </div>
    </div>
  );
}
