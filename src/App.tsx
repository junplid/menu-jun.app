import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LayoutPrivateProvider } from "@contexts/layout-private.provider";

import { MenuPage } from "./pages/menu";
import { DialogProvider } from "@contexts/dialog.context";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          caseSensitive
          element={
            <DialogProvider>
              <LayoutPrivateProvider />
            </DialogProvider>
          }
        >
          <Route path="" element={<MenuPage />} />
        </Route>

        <Route path="*" caseSensitive element={<Navigate to="" />} />
      </Routes>
    </BrowserRouter>
  );
}
