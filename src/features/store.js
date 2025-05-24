import { configureStore } from "@reduxjs/toolkit";
import tabsReducer from "./tabs";
import previewReducer from "./preview";
import themeReducer from "./theme";
import fileSystemReducer from "./fileSystem";

export default configureStore({
  reducer: {
    tabs: tabsReducer,
    preview: previewReducer,
    theme: themeReducer,
    fileSystem: fileSystemReducer,
  },
});
