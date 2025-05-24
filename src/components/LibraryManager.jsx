import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCode } from "../features/tabs";

export default function LibraryManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [customLibrary, setCustomLibrary] = useState("");
  const { currentTheme, themes } = useSelector((state) => state.theme);
  const tabs = useSelector((state) => state.tabs);
  const theme = themes[currentTheme];
  const dispatch = useDispatch();

  const popularLibraries = [
    {
      name: "React",
      cdnUrl: "https://unpkg.com/react@18/umd/react.development.js",
    },
    {
      name: "React DOM",
      cdnUrl: "https://unpkg.com/react-dom@18/umd/react-dom.development.js",
    },
    { name: "jQuery", cdnUrl: "https://code.jquery.com/jquery-3.7.1.min.js" },
    {
      name: "Bootstrap CSS",
      cdnUrl:
        "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css",
      type: "css",
    },
    {
      name: "Bootstrap JS",
      cdnUrl:
        "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js",
    },
    {
      name: "Tailwind CSS",
      cdnUrl: "https://cdn.tailwindcss.com",
      type: "css",
    },
    {
      name: "Alpine.js",
      cdnUrl: "https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js",
    },
    { name: "Chart.js", cdnUrl: "https://cdn.jsdelivr.net/npm/chart.js" },
    {
      name: "Three.js",
      cdnUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
    },
    { name: "D3.js", cdnUrl: "https://d3js.org/d3.v7.min.js" },
    {
      name: "Anime.js",
      cdnUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js",
    },
    {
      name: "Moment.js",
      cdnUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js",
    },
  ];

  const addLibrary = (library) => {
    const htmlTab = tabs.find((tab) => tab.lang === "html");
    if (!htmlTab) return;

    let currentCode = htmlTab.code;

    // Vérifier si la bibliothèque n'est pas déjà incluse
    if (currentCode.includes(library.cdnUrl)) {
      alert("Cette bibliothèque est déjà incluse !");
      return;
    }

    let newTag;
    if (library.type === "css") {
      newTag = `  <link rel="stylesheet" href="${library.cdnUrl}">`;
    } else {
      newTag = `  <script src="${library.cdnUrl}"></script>`;
    }

    // Ajouter la balise dans le head si elle existe, sinon l'ajouter au début
    if (currentCode.includes("<head>")) {
      currentCode = currentCode.replace("</head>", `${newTag}\n</head>`);
    } else if (currentCode.includes("<html>")) {
      currentCode = currentCode.replace(
        "<html>",
        `<html>\n<head>\n${newTag}\n</head>`
      );
    } else {
      // Si pas de structure HTML, l'ajouter au début
      currentCode = `${newTag}\n${currentCode}`;
    }

    dispatch(updateCode({ id: htmlTab.id, value: currentCode }));
    setIsOpen(false);
  };

  const addCustomLibrary = () => {
    if (!customLibrary.trim()) {
      alert("Veuillez entrer une URL de bibliothèque");
      return;
    }

    const isCSS =
      customLibrary.includes(".css") || customLibrary.includes("css");
    const library = {
      name: "Bibliothèque personnalisée",
      cdnUrl: customLibrary,
      type: isCSS ? "css" : "js",
    };

    addLibrary(library);
    setCustomLibrary("");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition text-sm"
        title="Gestionnaire de bibliothèques"
      >
        📚 Libs
      </button>

      {isOpen && (
        <div
          className={`absolute top-full mt-1 right-0 w-80 ${theme.bgSecondary} shadow-lg rounded-md p-4 z-10 max-h-96 overflow-y-auto`}
        >
          <h3 className={`${theme.text} text-sm font-bold mb-3`}>
            Ajouter une bibliothèque
          </h3>

          {/* Bibliothèque personnalisée */}
          <div className="mb-4">
            <label className={`${theme.textSecondary} text-xs block mb-1`}>
              URL personnalisée :
            </label>
            <div className="flex">
              <input
                type="text"
                value={customLibrary}
                onChange={(e) => setCustomLibrary(e.target.value)}
                placeholder="https://example.com/library.js"
                className={`flex-grow px-2 py-1 ${theme.bgTertiary} ${theme.text} rounded-l focus:outline-none text-xs`}
              />
              <button
                onClick={addCustomLibrary}
                className="px-2 py-1 bg-green-600 text-white rounded-r hover:bg-green-700 transition text-xs"
              >
                Ajouter
              </button>
            </div>
          </div>

          {/* Bibliothèques populaires */}
          <div>
            <h4 className={`${theme.textSecondary} text-xs font-semibold mb-2`}>
              Bibliothèques populaires :
            </h4>
            <div className="grid grid-cols-1 gap-1">
              {popularLibraries.map((library, index) => (
                <button
                  key={index}
                  onClick={() => addLibrary(library)}
                  className={`text-left px-2 py-1 ${theme.text} hover:${theme.bgTertiary} rounded transition text-xs`}
                >
                  <span className="font-medium">{library.name}</span>
                  <span className={`${theme.textSecondary} ml-1`}>
                    ({library.type === "css" ? "CSS" : "JS"})
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className={`mt-3 pt-2 border-t ${theme.borderSecondary}`}>
            <button
              onClick={() => setIsOpen(false)}
              className={`px-3 py-1 ${theme.bgTertiary} ${theme.text} rounded hover:${theme.bg} transition text-xs w-full`}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
