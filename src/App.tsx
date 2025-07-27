import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LayoutPrivateProvider } from "@contexts/layout-private.provider";

import { MenuPage } from "./pages/menu";
import { CartProvider } from "@contexts/cart.provider";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          caseSensitive
          element={
            <CartProvider>
              <LayoutPrivateProvider />
            </CartProvider>
          }
        >
          <Route path="" element={<MenuPage />} />
        </Route>

        <Route path="*" caseSensitive element={<Navigate to="" />} />
      </Routes>
    </BrowserRouter>
  );
}
