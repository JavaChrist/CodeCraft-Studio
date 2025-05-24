import React, { useState } from "react";
import { useSelector } from "react-redux";

export default function ShareButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const tabs = useSelector((state) => state.tabs);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateShareLink = () => {
    // Créer un objet avec seulement les données de code
    const shareData = tabs.map(({ id, lang, code }) => ({ id, lang, code }));

    // Convertir en chaîne Base64 pour partager
    const base64Data = btoa(encodeURIComponent(JSON.stringify(shareData)));
    const link = `${window.location.origin}${window.location.pathname}?share=${base64Data}`;

    setShareLink(link);
    setIsModalOpen(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(shareLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error("Erreur lors de la copie:", err));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCopied(false);
  };

  return (
    <>
      <button
        onClick={generateShareLink}
        className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition text-sm"
        title="Partager le projet actuel"
        disabled={isGenerating}
      >
        {isGenerating ? "..." : "🔗 Partager"}
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-zinc-800 p-4 rounded-md shadow-lg max-w-lg w-full mx-4">
            <h3 className="text-xl text-white mb-4">Partager le code</h3>
            <div className="mb-4">
              <p className="text-slate-300 mb-2">
                Copiez ce lien pour partager votre code:
              </p>
              <div className="flex">
                <input
                  type="text"
                  readOnly
                  value={shareLink}
                  className="flex-grow p-2 bg-zinc-700 text-white rounded-l focus:outline-none text-sm overflow-hidden"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 bg-blue-600 text-white rounded-r hover:bg-blue-700 transition"
                >
                  {copied ? "Copié !" : "Copier"}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-1 bg-zinc-700 text-white rounded hover:bg-zinc-600 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
