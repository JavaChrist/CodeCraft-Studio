import React from "react";
import showView from "../assets/view.svg";
import hideView from "../assets/hide.svg";
import { useSelector, useDispatch } from "react-redux";
import { togglePreview } from "../features/preview";

export default function PreviewButton() {
  const previewData = useSelector((state) => state.preview);
  const { currentTheme, themes } = useSelector((state) => state.theme);
  const theme = themes[currentTheme];
  const dispatch = useDispatch();

  return (
    <button
      onClick={() => dispatch(togglePreview())}
      className="py-2 px-3 rounded bg-blue-600 hover:bg-blue-700 transition flex items-center text-white w-24 justify-center text-sm"
    >
      <img
        className="w-4 mr-2"
        src={previewData.preview ? hideView : showView}
        alt=""
      />
      <span>{previewData.preview ? "Code" : "Aperçu"}</span>
    </button>
  );
}
