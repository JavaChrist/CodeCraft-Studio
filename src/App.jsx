import "./App.css";
import Header from "./components/Header";
import FileSystemIDE from "./components/FileSystemIDE";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";

function App() {
  useKeyboardShortcuts();

  return (
    <div className="App h-screen flex flex-col">
      <Header />
      <FileSystemIDE />
    </div>
  );
}

export default App;
