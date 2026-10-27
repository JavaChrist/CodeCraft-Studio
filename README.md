# 🔥 CodeCraft Studio - Éditeur de Code Web Professionnel

Un IDE web complet et moderne construit avec React, Redux et CodeMirror 6, offrant une expérience de développement professionnelle pour HTML, CSS et JavaScript avec système de fichiers avancé et simulation Git.

![IDE Preview](https://img.shields.io/badge/React-18-blue) ![Redux](https://img.shields.io/badge/Redux-Toolkit-purple) ![CodeMirror](https://img.shields.io/badge/CodeMirror-6-green) ![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Fonctionnalités Principales

### 📁 **Système de Fichiers Complet (comme VS Code)**

- **Explorateur de fichiers** : Navigation par dossiers et sous-dossiers
- **Menu contextuel** : Clic droit pour créer/supprimer/renommer
- **Onglets multiples** : Ouvrez plusieurs fichiers simultanément
- **Arborescence** : Structure hiérarchique complète
- **Extensions** : Détection automatique (.html, .css, .js, .json)

### 🎨 **Éditeur de Code Avancé (CodeMirror 6)**

- **Coloration syntaxique riche** : Support complet HTML, CSS, JavaScript, JSON avec mise en valeur des mots-clés, chaînes, commentaires, nombres, opérateurs
- **Auto-fermeture intelligente** :
  - Parenthèses : `(` → `()` avec curseur au milieu
  - Crochets : `[` → `[]`
  - Accolades : `{` → `{}`
  - Guillemets doubles : `"` → `""`
  - Guillemets simples : `'` → `''`
- **Correspondance des parenthèses** : Mise en surbrillance automatique des parenthèses, crochets et accolades correspondants
- **Autocomplétion intelligente** :
  - Balises HTML et attributs
  - Propriétés CSS et valeurs
  - Fermeture automatique des balises
  - Suggestions contextuelles
- **Sélection de texte** : Clic-glisser, Ctrl+A, sélection rectangulaire
- **Curseur visible** : Curseur clignotant optimisé pour thèmes sombre/clair
- **Ligne active** : Mise en surbrillance de la ligne courante
- **Recherche intégrée** : Surlignage des occurrences

### 📝 **Snippets de Code Intelligents**

- **Bibliothèque HTML** : Templates complets (HTML5, formulaires, cartes)
- **Snippets CSS** : Reset, flexbox, grid, animations
- **Templates JavaScript** : DOM ready, fetch API, async/await, React components
- **Recherche filtrée** : Trouvez rapidement le snippet souhaité
- **Déclencheurs courts** : `html5`, `form`, `flexcenter`, `fetch`, etc.
- **Adaptation intelligente** : Snippets adaptés au type de fichier ouvert

### 🔍 **Recherche et Remplacement Global**

- **Recherche multi-fichiers** : Trouvez n'importe quoi dans tout le projet
- **Expressions régulières** : Support regex avancé
- **Options avancées** : Sensible à la casse, mot entier
- **Remplacement intelligent** :
  - Remplacer occurrence par occurrence
  - Remplacement global en un clic
  - Aperçu avant remplacement
- **Navigation rapide** : Cliquez pour aller au fichier/ligne
- **Raccourci** : `Ctrl+Shift+F` pour ouvrir

### 📤 **Import de Fichiers par Drag & Drop**

- **Glisser-déposer** : Importez fichiers et dossiers complets
- **Support multi-formats** : HTML, CSS, JS, JSON, TXT, MD
- **Structure préservée** : Dossiers importés avec hiérarchie complète
- **Interface intuitive** : Zone de dépôt visuelle avec feedback
- **Traitement asynchrone** : Import non-bloquant avec indicateur de progression

### 🔄 **Simulation Git Professionnelle**

- **Repository Git** : Initialisation et gestion complète
- **Statut des fichiers** :
  - 📝 Fichiers modifiés (jaune)
  - ➕ Nouveaux fichiers (vert)
  - ➖ Fichiers supprimés (rouge)
- **Staging Area** : Stage/unstage fichiers individuellement ou en masse
- **Commits avec messages** : Historique complet avec hashes SHA
- **Branches** : Création et navigation entre branches
- **Checkout historique** : Retour vers n'importe quel commit
- **Interface visuelle** : Statut en temps réel dans le bouton header
- **Persistance** : Git repo sauvegardé localement

### 💾 **Gestion de Projets Avancée**

- **Sauvegarde complète** : Projets avec arborescence complète
- **Chargement instantané** : Restauration de l'état exact
- **Projets nommés** : Gestion multiple avec aperçu
- **Export ZIP** : Téléchargement de projets complets (JSZip)
- **Nouveau projet** : Templates de démarrage

### 🔗 **Partage et Export**

- **URLs de partage** : Liens Base64 pour partage instantané
- **Téléchargement ZIP** : Export de projets complets
- **Import automatique** : Chargement depuis URLs partagées
- **Sauvegarde locale** : Persistance navigateur

### 🎨 **Interface et Thèmes**

- **Thème sombre/clair** : Basculement instantané (Ctrl+Shift+T)
- **Interface adaptative** : Design responsive pour tous écrans
- **Header fixe** : Nom du projet affiché en permanence
- **Console intégrée** : Positionnée dans le header avec les autres outils

### 🖥️ **Aperçu en Temps Réel**

- **Rendu instantané** : Voir les changements en direct
- **Modes responsive** : Bureau, Tablette, Mobile
- **Sandbox sécurisé** : Iframe isolée pour l'exécution
- **Génération HTML** : Combinaison automatique des fichiers

### 📚 **Gestionnaire de Bibliothèques**

- **Bibliothèques populaires** : React, jQuery, Bootstrap, Tailwind, Chart.js, D3.js, Three.js
- **URLs personnalisées** : Ajout de n'importe quelle bibliothèque CDN
- **Détection automatique** : CSS et JS reconnus automatiquement
- **Intégration intelligente** : Injection dans le `<head>` HTML

### 🔧 **Console de Développement**

- **Logs en temps réel** : console.log, warn, error, info
- **Gestion d'erreurs** : Capture des erreurs JavaScript
- **Interface intégrée** : Accessible depuis le header
- **Historique complet** : Horodatage et catégorisation

### ⌨️ **Raccourcis Clavier Professionnels**

- `Ctrl/Cmd + A` : Sélectionner tout le code
- `Ctrl/Cmd + Shift + P` : Basculer l'aperçu
- `Ctrl/Cmd + Shift + T` : Changer de thème
- `Ctrl/Cmd + Shift + F` : Recherche globale
- `Ctrl/Cmd + S` : Sauvegarde (automatique)
- `F11` : Mode plein écran
- `Ctrl/Cmd + /` : Aide des raccourcis
- `Esc` : Fermer les modales

## 🛠️ Installation et Démarrage

### Prérequis

- Node.js 16+
- npm ou yarn

### Installation

```bash
# Cloner le projet
git clone https://github.com/votre-username/codecraft-studio.git
cd codecraft-studio

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build pour production
npm run build

# Prévisualiser le build
npm run preview
```

## 🚀 Déploiement sur Vercel

Ce projet est **100% compatible Vercel** !

### Déploiement automatique :

1. **Push vers GitHub** :

```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

2. **Connecter à Vercel** :
   - Allez sur [vercel.com](https://vercel.com)
   - Connectez votre GitHub
   - Importez le projet
   - Deploy automatique ! ✨

### Configuration Vercel :

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

## 📦 Technologies Utilisées

### Core Stack

- **React 18** : Interface utilisateur moderne
- **Redux Toolkit** : Gestion d'état prévisible
- **CodeMirror 6** : Éditeur de code professionnel
- **Vite** : Build tool ultra-rapide
- **Tailwind CSS** : Framework CSS utilitaire

### Bibliothèques Spécialisées

- **JSZip** : Génération d'archives ZIP
- **@codemirror/lang-\*** : Support multi-langages (HTML, CSS, JavaScript, JSON)
- **@codemirror/search** : Fonctionnalités de recherche
- **@codemirror/autocomplete** : Autocomplétion intelligente + auto-fermeture des parenthèses
- **@codemirror/language** : Coloration syntaxique avancée + correspondance des parenthèses
- **@codemirror/view** : Extensions d'affichage avancées

## 🎯 Guide d'Utilisation

### Démarrage Rapide

1. **Créer des fichiers** : Clic droit dans l'explorateur → "Nouveau fichier"
2. **Organiser** : Créez des dossiers pour structurer votre projet
3. **Coder** : Utilisez l'éditeur avec autocomplétion intelligente
4. **Snippets** : Utilisez des templates prédéfinis pour accélérer le développement
5. **Prévisualiser** : Activez l'aperçu temps réel
6. **Git** : Initialisez Git, stagez vos fichiers et commitez vos changements
7. **Rechercher** : Utilisez la recherche globale pour naviguer dans votre code
8. **Importer** : Glissez-déposez des fichiers externes
9. **Sauvegarder** : Menu "Projets" → nom → "Sauvegarder"
10. **Exporter** : Téléchargez votre projet en ZIP

### Fonctionnalités Avancées

- **Multi-onglets** : Ouvrez plusieurs fichiers
- **Autocomplétion** : Tapez `<div` et voyez les suggestions
- **Snippets rapides** : Tapez `html5` + Tab pour un template complet
- **Git workflow** : Status → Stage → Commit → Branch
- **Recherche puissante** : Regex, remplacement global
- **Bibliothèques** : Ajoutez React, Bootstrap, etc.
- **Console** : Debuggez avec les logs intégrés
- **Partage** : Générez des liens pour collaborer
- **Thèmes** : Adaptez l'interface à vos préférences

## 🏗️ Architecture Technique

```
src/
├── components/
│   ├── FileExplorer.jsx      # Explorateur de fichiers
│   ├── FileTabs.jsx          # Gestion des onglets
│   ├── FileCodeTab.jsx       # Éditeur CodeMirror + Autocomplétion
│   ├── Preview.jsx           # Aperçu temps réel
│   ├── ProjectManager.jsx    # Gestion des projets
│   ├── LibraryManager.jsx    # Gestionnaire de bibliothèques
│   ├── SnippetManager.jsx    # Snippets de code
│   ├── GitManager.jsx        # Simulation Git
│   ├── GlobalSearch.jsx      # Recherche/remplacement global
│   ├── DragDropUpload.jsx    # Import par glisser-déposer
│   ├── AutocompleteExtension.js # Extension autocomplétion
│   └── Header.jsx            # Interface principale
├── features/
│   ├── fileSystem.js         # Redux slice pour les fichiers
│   ├── theme.js              # Gestion des thèmes
│   └── preview.js            # État de l'aperçu
├── store/
│   └── fileSystemStore.js    # Store Redux configuré
└── hooks/
    └── useKeyboardShortcuts.js
```

## 🌟 Fonctionnalités Uniques

### Ce qui rend CodeCraft Studio spécial :

- **IDE complet dans le navigateur** : Pas d'installation requise
- **Autocomplétion intelligente** : HTML/CSS contextuelle
- **Système de fichiers virtuel** : Organisation comme un vrai IDE
- **Simulation Git complète** : Workflow professionnel
- **Snippets adaptés** : Templates selon le contexte
- **Recherche avancée** : Regex et remplacement global
- **Import par drag & drop** : Dossiers complets supportés
- **Export ZIP fonctionnel** : Récupérez vos projets localement
- **Interface VS Code-like** : Familier pour les développeurs
- **Performance optimisée** : Vite + React 18 + CodeMirror 6

## 🤝 Contribution

Contributions bienvenues ! Pour contribuer :

1. **Forkez** le projet
2. **Créez** une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Committez** (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. **Push** (`git push origin feature/nouvelle-fonctionnalite`)
5. **Ouvrez** une Pull Request

### Roadmap

- [x] Autocomplétion avancée HTML/CSS
- [x] Coloration syntaxique professionnelle (mots-clés, chaînes, commentaires)
- [x] Auto-fermeture des parenthèses/guillemets avec positionnement du curseur
- [x] Correspondance des parenthèses en temps réel
- [x] Snippets de code prédéfinis
- [x] Recherche/remplacement global
- [x] Git simulation basique
- [x] Upload de fichiers par glisser-déposer
- [x] Interface utilisateur normalisée et professionnelle
- [ ] Minimap pour navigation dans gros fichiers
- [ ] Support TypeScript
- [ ] Intégration Git avancée (merge, rebase)
- [ ] Marketplace d'extensions
- [ ] Collaborative editing
- [ ] Débogueur intégré
- [ ] Terminal intégré

## 📄 Licence

MIT License - voir [LICENSE](LICENSE) pour les détails.

## 🙏 Remerciements

- **CodeMirror** pour l'éditeur de classe mondiale
- **React & Redux** pour l'architecture robuste
- **JSZip** pour l'export de projets
- **Vite** pour les performances de développement
- **Tailwind CSS** pour le design system

---

**🎨 Développé avec passion pour la communauté des développeurs**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/votre-username/codecraft-studio)

## 🎉 Nouvelles Fonctionnalités (Version 2.0)

### ✅ **Récemment Ajouté :**

1. **🌈 Coloration syntaxique professionnelle** :

   - Mise en valeur complète des mots-clés, chaînes, commentaires
   - Support HTML, CSS, JavaScript, JSON avec thèmes adaptatifs
   - Rendu visuel professionnel comparable à VS Code

2. **⚡ Auto-fermeture intelligente** :

   - Parenthèses `()`, crochets `[]`, accolades `{}`
   - Guillemets doubles `""` et simples `''`
   - Curseur automatiquement positionné au milieu

3. **🎯 Correspondance des parenthèses** :

   - Mise en surbrillance automatique des parenthèses correspondantes
   - Navigation visuelle dans le code imbriqué
   - Support complet des structures complexes

4. **🧠 Autocomplétion intelligente** : HTML tags, CSS properties, fermeture automatique
5. **📝 Snippets prédéfinis** : 25+ templates pour HTML, CSS, JS
6. **🔍 Recherche globale avancée** : Regex, remplacement, navigation
7. **🔄 Simulation Git complète** : Status, staging, commits, branches, checkout
8. **📤 Import drag & drop** : Dossiers complets avec hiérarchie
9. **🎨 Interface normalisée** : Boutons uniformes dans le header (hauteur optimisée)

### 💡 **Comment utiliser :**

- **Coloration syntaxique** : Automatique selon l'extension du fichier (.html, .css, .js, .json)
- **Auto-fermeture** : Tapez simplement `(`, `[`, `{`, `"` ou `'` - la fermeture est automatique !
- **Correspondance parenthèses** : Placez votre curseur près d'une parenthèse pour voir la correspondance
- **Autocomplétion** : Tapez `<div` et voyez les suggestions
- **Snippets** : Cliquez "📝 Snippets" et cherchez "html5"
- **Git** : Cliquez "🔄 Git Init" puis modifiez des fichiers
- **Recherche** : `Ctrl+Shift+F` pour chercher dans tout le projet
- **Import** : Glissez des fichiers depuis votre ordinateur
- **Drag & Drop** : Déposez des dossiers complets pour les importer

C'est maintenant un **véritable IDE professionnel** avec une expérience de développement comparable aux éditeurs desktop ! 🚀✨

## 📸 Démonstration des Nouvelles Fonctionnalités

### 🌈 **Coloration Syntaxique Professionnelle**

```html
<!-- HTML avec coloration -->
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>Exemple</title>
  </head>
  <body>
    <div class="container">Contenu</div>
  </body>
</html>
```

```css
/* CSS avec mise en valeur */
.container {
  display: flex;
  justify-content: center;
  background-color: #f0f0f0;
  border-radius: 8px;
}
```

```javascript
// JavaScript avec syntaxe colorée
function fetchData() {
  return fetch("/api/data")
    .then((response) => response.json())
    .catch((error) => console.error("Erreur:", error));
}
```

### ⚡ **Auto-Fermeture en Action**

- Tapez `(` → Obtient automatiquement `(|)` (| = curseur)
- Tapez `[` → Obtient automatiquement `[|]`
- Tapez `{` → Obtient automatiquement `{|}`
- Tapez `"` → Obtient automatiquement `"|"`
- Tapez `'` → Obtient automatiquement `'|'`

### 🎯 **Correspondance des Parenthèses**

```javascript
function complexe() {
  if (condition) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].property) {
        // Placez le curseur sur n'importe quelle parenthèse
        // pour voir sa correspondance mise en surbrillance !
        return processItem(array[i]);
      }
    }
  }
}
```

> **💡 Astuce** : Placez votre curseur à côté d'une parenthèse, crochet ou accolade pour voir instantanément sa correspondance !
