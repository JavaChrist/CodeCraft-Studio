import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import PreviewButton from "./PreviewButton";
import ProjectManager from "./ProjectManager";
import ShareButton from "./ShareButton";
import ThemeToggle from "./ThemeToggle";
import ShortcutsHelp from "./ShortcutsHelp";
import LibraryManager from "./LibraryManager";
import SnippetManager from "./SnippetManager";
import DragDropUpload from "./DragDropUpload";
import GlobalSearch from "./GlobalSearch";
import GitManager from "./GitManager";

export default function Header() {
  const { currentTheme, themes } = useSelector((state) => state.theme);
  const { fileTree } = useSelector((state) => state.fileSystem);
  const theme = themes[currentTheme];

  // État local pour la console
  const [isConsoleVisible, setIsConsoleVisible] = useState(false);

  return (
    <>
      <div
        className={`${theme.bg} px-4 py-4 ${theme.borderSecondary} border-b flex items-center relative z-10 flex-shrink-0`}
      >
        <h1 className={`w-full ${theme.text} text-2xl`}>
          🔥 <span className="text-orange-500">CodeCraft</span>{" "}
          <span className="text-blue-500">Studio</span>
          <span className={`ml-3 text-sm ${theme.textSecondary} font-normal`}>
            📁 {fileTree?.name || "Projet"}
          </span>
        </h1>
        <div className="w-full flex space-x-2 justify-center header-section">
          <PreviewButton />
          <ProjectManager />
          <ShareButton />
          <LibraryManager />
          <SnippetManager />
          <DragDropUpload />
          <GlobalSearch />
          <GitManager />
          <button
            onClick={() => setIsConsoleVisible(!isConsoleVisible)}
            className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition text-sm"
            title={isConsoleVisible ? "Fermer la console" : "Ouvrir la console"}
          >
            Console
          </button>
          <ThemeToggle />
        </div>
        <div className="w-full flex">
          <div className="ml-auto mr-2">
            <div
              className={`w-[6px] h-[6px] ${theme.text.replace(
                "text-",
                "bg-"
              )} rounded-full my-1`}
            ></div>
            <div
              className={`w-[6px] h-[6px] ${theme.text.replace(
                "text-",
                "bg-"
              )} rounded-full my-1`}
            ></div>
            <div
              className={`w-[6px] h-[6px] ${theme.text.replace(
                "text-",
                "bg-"
              )} rounded-full`}
            ></div>
          </div>
        </div>
      </div>
      <ConsoleComponent
        isVisible={isConsoleVisible}
        setIsVisible={setIsConsoleVisible}
      />
      <ShortcutsHelp />
    </>
  );
}

// Composant Console intégré
function ConsoleComponent({ isVisible, setIsVisible }) {
  const [logs, setLogs] = useState([]);
  const consoleRef = useRef(null);
  const { currentTheme, themes } = useSelector((state) => state.theme);
  const theme = themes[currentTheme];

  useEffect(() => {
    // Intercepter console.log, console.error, etc.
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;

    const addLog = (type, args) => {
      const timestamp = new Date().toLocaleTimeString();
      const message = args
        .map((arg) =>
          typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
        )
        .join(" ");

      setLogs((prevLogs) => [
        ...prevLogs,
        { type, message, timestamp, id: Date.now() + Math.random() },
      ]);
    };

    console.log = (...args) => {
      originalLog.apply(console, args);
      addLog("log", args);
    };

    console.error = (...args) => {
      originalError.apply(console, args);
      addLog("error", args);
    };

    console.warn = (...args) => {
      originalWarn.apply(console, args);
      addLog("warn", args);
    };

    console.info = (...args) => {
      originalInfo.apply(console, args);
      addLog("info", args);
    };

    // Intercepter les erreurs JavaScript
    const handleError = (event) => {
      addLog("error", [
        `${event.error?.message || event.message} at ${event.filename}:${
          event.lineno
        }`,
      ]);
    };

    window.addEventListener("error", handleError);

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      console.info = originalInfo;
      window.removeEventListener("error", handleError);
    };
  }, []);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  const clearLogs = () => {
    setLogs([]);
  };

  const getLogColor = (type) => {
    switch (type) {
      case "error":
        return "text-red-400";
      case "warn":
        return "text-yellow-400";
      case "info":
        return "text-blue-400";
      default:
        return theme.text;
    }
  };

  const getLogIcon = (type) => {
    switch (type) {
      case "error":
        return "❌";
      case "warn":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "📝";
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-0 right-0 w-3/4 h-64 ${theme.bgSecondary} ${theme.borderSecondary} border-l border-t shadow-2xl z-50 flex flex-col`}
    >
      <div
        className={`flex items-center justify-between p-2 ${theme.bgTertiary} ${theme.borderSecondary} border-b`}
      >
        <h3 className={`${theme.text} font-bold text-sm`}>
          Console de développement
        </h3>
        <div className="flex space-x-1">
          <button
            onClick={clearLogs}
            className={`px-2 py-1 text-xs ${theme.text} hover:${theme.bgSecondary} rounded transition`}
            title="Vider la console"
          >
            🗑️
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className={`px-2 py-1 text-xs ${theme.text} hover:${theme.bgSecondary} rounded transition`}
            title="Fermer la console"
          >
            ✕
          </button>
        </div>
      </div>

      <div
        ref={consoleRef}
        className={`flex-1 overflow-y-auto p-3 text-sm font-mono ${theme.bg}`}
      >
        {logs.length === 0 ? (
          <div className={`${theme.textSecondary} italic`}>
            Console vide - Les logs JavaScript apparaîtront ici...
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className={`mb-2 ${getLogColor(log.type)}`}>
              <span className="opacity-60 text-xs mr-2">{log.timestamp}</span>
              <span className="mr-2">{getLogIcon(log.type)}</span>
              <span className="whitespace-pre-wrap break-words">
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
