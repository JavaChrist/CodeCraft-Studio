import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateFileContent } from "../features/fileSystem";

export default function SnippetManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { currentTheme, themes } = useSelector((state) => state.theme);
  const { fileTree, activeFileId } = useSelector((state) => state.fileSystem);
  const dispatch = useDispatch();
  const theme = themes[currentTheme];

  const snippets = {
    html: [
      {
        name: "HTML5 Base",
        trigger: "html5",
        content: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    $CURSOR$
</body>
</html>`,
      },
      {
        name: "Div avec classe",
        trigger: "div",
        content: `<div class="$CURSOR$">
    
</div>`,
      },
      {
        name: "Formulaire de contact",
        trigger: "form",
        content: `<form action="#" method="post">
    <div class="form-group">
        <label for="name">Nom :</label>
        <input type="text" id="name" name="name" required>
    </div>
    <div class="form-group">
        <label for="email">Email :</label>
        <input type="email" id="email" name="email" required>
    </div>
    <div class="form-group">
        <label for="message">Message :</label>
        <textarea id="message" name="message" rows="4" required></textarea>
    </div>
    <button type="submit">Envoyer</button>
</form>`,
      },
      {
        name: "Card Bootstrap",
        trigger: "card",
        content: `<div class="card" style="width: 18rem;">
    <img src="..." class="card-img-top" alt="...">
    <div class="card-body">
        <h5 class="card-title">Titre</h5>
        <p class="card-text">Description de la carte.</p>
        <a href="#" class="btn btn-primary">Lien</a>
    </div>
</div>`,
      },
      {
        name: "Navbar",
        trigger: "navbar",
        content: `<nav class="navbar">
    <div class="nav-container">
        <a href="#" class="nav-logo">Logo</a>
        <ul class="nav-menu">
            <li class="nav-item">
                <a href="#" class="nav-link">Accueil</a>
            </li>
            <li class="nav-item">
                <a href="#" class="nav-link">À propos</a>
            </li>
            <li class="nav-item">
                <a href="#" class="nav-link">Contact</a>
            </li>
        </ul>
    </div>
</nav>`,
      },
    ],
    css: [
      {
        name: "Reset CSS",
        trigger: "reset",
        content: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
}`,
      },
      {
        name: "Flexbox Center",
        trigger: "flexcenter",
        content: `.container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}`,
      },
      {
        name: "Grid Layout",
        trigger: "grid",
        content: `.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    padding: 1rem;
}`,
      },
      {
        name: "Button Style",
        trigger: "button",
        content: `.btn {
    display: inline-block;
    padding: 12px 24px;
    background-color: #007bff;
    color: white;
    text-decoration: none;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.btn:hover {
    background-color: #0056b3;
}`,
      },
      {
        name: "Card Component",
        trigger: "cardcss",
        content: `.card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    padding: 1.5rem;
    margin: 1rem 0;
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}`,
      },
      {
        name: "Responsive Breakpoints",
        trigger: "responsive",
        content: `/* Mobile first */
.container {
    width: 100%;
    padding: 0 1rem;
}

/* Tablet */
@media (min-width: 768px) {
    .container {
        max-width: 750px;
        margin: 0 auto;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .container {
        max-width: 1200px;
    }
}`,
      },
    ],
    js: [
      {
        name: "DOM Ready",
        trigger: "ready",
        content: `document.addEventListener('DOMContentLoaded', function() {
    // Code à exécuter quand le DOM est chargé
    $CURSOR$
});`,
      },
      {
        name: "Fetch API",
        trigger: "fetch",
        content: `fetch('https://api.example.com/data')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        $CURSOR$
    })
    .catch(error => {
        console.error('Erreur:', error);
    });`,
      },
      {
        name: "Event Listener",
        trigger: "event",
        content: `document.getElementById('$CURSOR$').addEventListener('click', function(e) {
    e.preventDefault();
    // Votre code ici
});`,
      },
      {
        name: "Function ES6",
        trigger: "func",
        content: `const $CURSOR$ = (param) => {
    return param;
};`,
      },
      {
        name: "Class ES6",
        trigger: "class",
        content: `class $CURSOR$ {
    constructor() {
        // Constructor
    }
    
    method() {
        // Method
    }
}`,
      },
      {
        name: "Async Function",
        trigger: "async",
        content: `const fetchData = async () => {
    try {
        const response = await fetch('$CURSOR$');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur:', error);
    }
};`,
      },
      {
        name: "React Component",
        trigger: "react",
        content: `const $CURSOR$ = ({ props }) => {
    const [state, setState] = React.useState('');
    
    return (
        <div>
            <h1>Composant React</h1>
        </div>
    );
};`,
      },
      {
        name: "Local Storage",
        trigger: "storage",
        content: `// Sauvegarder
localStorage.setItem('$CURSOR$', JSON.stringify(data));

// Récupérer
const data = JSON.parse(localStorage.getItem('$CURSOR$') || '{}');`,
      },
    ],
  };

  // Trouver le fichier actif
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

  const activeFile = activeFileId
    ? findFileInTree(fileTree, activeFileId)
    : null;
  const fileExtension = activeFile?.extension || "html";

  // Filtrer les snippets selon le type de fichier et le terme de recherche
  const relevantSnippets = snippets[fileExtension] || snippets.html;
  const filteredSnippets = relevantSnippets.filter(
    (snippet) =>
      snippet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.trigger.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const insertSnippet = (snippet) => {
    if (!activeFile) {
      alert("Veuillez sélectionner un fichier pour insérer le snippet");
      return;
    }

    // Remplacer $CURSOR$ par un point d'insertion
    let content = snippet.content.replace("$CURSOR$", "");

    // Si le fichier est vide, remplacer tout le contenu
    if (!activeFile.content || activeFile.content.trim() === "") {
      content = snippet.content.replace("$CURSOR$", "");
    } else {
      // Sinon, ajouter à la fin
      content = activeFile.content + "\n\n" + content;
    }

    dispatch(
      updateFileContent({
        fileId: activeFile.id,
        content: content,
      })
    );

    setIsOpen(false);
    setSearchTerm("");
  };

  const getSnippetIcon = (extension) => {
    switch (extension) {
      case "html":
        return "🌐";
      case "css":
        return "🎨";
      case "js":
        return "⚡";
      default:
        return "📄";
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition text-sm"
        title="Snippets de code"
      >
        📝 Snippets
      </button>

      {isOpen && (
        <div
          className={`absolute top-full mt-1 right-0 w-96 ${theme.bgSecondary} shadow-lg rounded-md p-4 z-20 max-h-96 overflow-hidden flex flex-col`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className={`${theme.text} text-sm font-bold`}>
              {getSnippetIcon(fileExtension)} Snippets{" "}
              {fileExtension.toUpperCase()}
            </h3>
            <span className={`${theme.textSecondary} text-xs`}>
              {filteredSnippets.length} disponible(s)
            </span>
          </div>

          {/* Barre de recherche */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un snippet..."
            className={`w-full px-3 py-2 ${theme.bgTertiary} ${theme.text} rounded focus:outline-none text-sm mb-3`}
          />

          {/* Liste des snippets */}
          <div className="flex-1 overflow-y-auto">
            {filteredSnippets.length === 0 ? (
              <p className={`${theme.textSecondary} text-sm text-center py-4`}>
                Aucun snippet trouvé
              </p>
            ) : (
              <div className="space-y-1">
                {filteredSnippets.map((snippet, index) => (
                  <div
                    key={index}
                    onClick={() => insertSnippet(snippet)}
                    className={`p-3 ${theme.text} hover:${theme.bgTertiary} rounded transition cursor-pointer border ${theme.borderSecondary}`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{snippet.name}</h4>
                      <span
                        className={`${theme.textSecondary} text-xs bg-gray-600 px-2 py-1 rounded`}
                      >
                        {snippet.trigger}
                      </span>
                    </div>
                    <p
                      className={`${theme.textSecondary} text-xs mt-1 truncate`}
                    >
                      {snippet.content.split("\n")[0]}...
                    </p>
                  </div>
                ))}
              </div>
            )}
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
