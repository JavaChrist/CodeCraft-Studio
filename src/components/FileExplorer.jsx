import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  openFile,
  selectFile,
  toggleFolder,
  createFile,
  deleteFile,
  renameFile,
} from "../features/fileSystem";

// Icônes pour différents types de fichiers
const getFileIcon = (extension, type) => {
  if (type === "folder") return "📁";

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

// Composant pour un élément de fichier/dossier
const FileItem = ({ item, level = 0, onContextMenu }) => {
  const dispatch = useDispatch();
  const { selectedFileId } = useSelector((state) => state.fileSystem);
  const { currentTheme, themes } = useSelector((state) => state.theme);
  const theme = themes[currentTheme];
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(item.name);

  const handleClick = () => {
    if (item.type === "folder") {
      dispatch(toggleFolder(item.id));
    } else {
      dispatch(openFile(item.id));
    }
    dispatch(selectFile(item.id));
  };

  const handleRename = () => {
    if (newName.trim() && newName !== item.name) {
      dispatch(renameFile({ fileId: item.id, newName: newName.trim() }));
    }
    setIsRenaming(false);
    setNewName(item.name);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleRename();
    } else if (e.key === "Escape") {
      setIsRenaming(false);
      setNewName(item.name);
    }
  };

  const isSelected = selectedFileId === item.id;

  return (
    <div>
      <div
        className={`flex items-center py-1 px-2 cursor-pointer hover:${
          theme.hoverBg
        } ${isSelected ? theme.selectedBg : ""}`}
        style={{ paddingLeft: `${8 + level * 16}px` }}
        onClick={handleClick}
        onContextMenu={(e) => onContextMenu(e, item)}
      >
        <span className="mr-2 text-sm">
          {item.type === "folder"
            ? item.isOpen
              ? "📂"
              : "📁"
            : getFileIcon(item.extension, item.type)}
        </span>

        {isRenaming ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
            className={`${theme.bg} ${theme.text} border rounded px-1 text-sm flex-1`}
            autoFocus
          />
        ) : (
          <span className={`text-sm ${theme.text} truncate`}>{item.name}</span>
        )}
      </div>

      {item.type === "folder" && item.isOpen && item.children && (
        <div>
          {item.children.map((child) => (
            <FileItem
              key={child.id}
              item={child}
              level={level + 1}
              onContextMenu={onContextMenu}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Menu contextuel
const ContextMenu = ({ isOpen, position, item, onClose, onAction }) => {
  const { currentTheme, themes } = useSelector((state) => state.theme);
  const theme = themes[currentTheme];

  if (!isOpen) return null;

  const menuItems = [
    { label: "Nouveau fichier", action: "newFile", icon: "📄" },
    { label: "Nouveau dossier", action: "newFolder", icon: "📁" },
    { label: "Renommer", action: "rename", icon: "✏️" },
    { label: "Supprimer", action: "delete", icon: "🗑️" },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      <div
        className={`fixed z-50 ${theme.bg} ${theme.border} border rounded shadow-lg py-1 min-w-40`}
        style={{
          left: position.x,
          top: position.y,
        }}
      >
        {menuItems.map((menuItem) => (
          <div
            key={menuItem.action}
            className={`px-3 py-2 cursor-pointer hover:${theme.hoverBg} ${theme.text} text-sm flex items-center`}
            onClick={() => onAction(menuItem.action)}
          >
            <span className="mr-2">{menuItem.icon}</span>
            {menuItem.label}
          </div>
        ))}
      </div>
    </>
  );
};

// Composant principal FileExplorer
export default function FileExplorer() {
  const dispatch = useDispatch();
  const { fileTree } = useSelector((state) => state.fileSystem);
  const { currentTheme, themes } = useSelector((state) => state.theme);
  const theme = themes[currentTheme];

  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    position: { x: 0, y: 0 },
    item: null,
  });

  const [newItemDialog, setNewItemDialog] = useState({
    isOpen: false,
    type: "file",
    parentId: null,
    name: "",
  });

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    setContextMenu({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY },
      item,
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ isOpen: false, position: { x: 0, y: 0 }, item: null });
  };

  const handleContextAction = (action) => {
    const { item } = contextMenu;

    switch (action) {
      case "newFile":
        setNewItemDialog({
          isOpen: true,
          type: "file",
          parentId: item.type === "folder" ? item.id : "root",
          name: "",
        });
        break;
      case "newFolder":
        setNewItemDialog({
          isOpen: true,
          type: "folder",
          parentId: item.type === "folder" ? item.id : "root",
          name: "",
        });
        break;
      case "rename":
        // Cette action sera gérée par le composant FileItem
        break;
      case "delete":
        if (
          window.confirm(`Êtes-vous sûr de vouloir supprimer "${item.name}" ?`)
        ) {
          dispatch(deleteFile(item.id));
        }
        break;
    }

    closeContextMenu();
  };

  const handleCreateItem = () => {
    if (newItemDialog.name.trim()) {
      dispatch(
        createFile({
          parentId: newItemDialog.parentId,
          name: newItemDialog.name.trim(),
          type: newItemDialog.type,
        })
      );
      setNewItemDialog({
        isOpen: false,
        type: "file",
        parentId: null,
        name: "",
      });
    }
  };

  const handleNewItemKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCreateItem();
    } else if (e.key === "Escape") {
      setNewItemDialog({
        isOpen: false,
        type: "file",
        parentId: null,
        name: "",
      });
    }
  };

  return (
    <div
      className={`${theme.bg} ${theme.borderSecondary} border-r h-full w-64 flex-shrink-0`}
    >
      {/* En-tête */}
      <div
        className={`${theme.bgSecondary} ${theme.text} px-3 py-2 border-b ${theme.borderSecondary} font-medium text-sm`}
      >
        EXPLORATEUR
      </div>

      {/* Arborescence des fichiers */}
      <div className="overflow-y-auto h-full">
        <FileItem item={fileTree} level={0} onContextMenu={handleContextMenu} />
      </div>

      {/* Menu contextuel */}
      <ContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        item={contextMenu.item}
        onClose={closeContextMenu}
        onAction={handleContextAction}
      />

      {/* Dialog pour créer un nouveau fichier/dossier */}
      {newItemDialog.isOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div
              className={`${theme.bg} ${theme.border} border rounded-lg p-4 w-80`}
            >
              <h3 className={`${theme.text} font-medium mb-3`}>
                Créer un nouveau{" "}
                {newItemDialog.type === "file" ? "fichier" : "dossier"}
              </h3>
              <input
                type="text"
                value={newItemDialog.name}
                onChange={(e) =>
                  setNewItemDialog({ ...newItemDialog, name: e.target.value })
                }
                onKeyDown={handleNewItemKeyDown}
                placeholder={
                  newItemDialog.type === "file"
                    ? "nom-fichier.html"
                    : "nom-dossier"
                }
                className={`w-full px-3 py-2 border rounded ${theme.bg} ${theme.text} ${theme.border}`}
                autoFocus
              />
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() =>
                    setNewItemDialog({
                      isOpen: false,
                      type: "file",
                      parentId: null,
                      name: "",
                    })
                  }
                  className={`px-3 py-1 rounded ${theme.bgSecondary} ${theme.textSecondary} hover:${theme.hoverBg}`}
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateItem}
                  className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
