import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LayoutPrivateProvider } from "@contexts/layout-private.provider";

import { MenuPage } from "./pages/menu";
import { CartProvider } from "@contexts/cart.provider";
import { DataMenuProvider } from "@contexts/data-menu.provider";
import { Image } from "@chakra-ui/react";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          caseSensitive
          path=":identifier"
          element={
            <DataMenuProvider>
              <CartProvider>
                <LayoutPrivateProvider />
              </CartProvider>
            </DataMenuProvider>
          }
        >
          <Route path="" element={<MenuPage />} />
        </Route>

        <Route
          path="*"
          caseSensitive
          element={
            <div className="h-svh overflow-y-hidden flex gap-y-5 flex-col justify-center items-center">
              <Image
                src="/undraw_page-not-found.svg"
                style={{ width: "100%", maxWidth: "250px", height: "auto" }}
              />
              <span className="text-black/80">Cardápio não encontrado 😢</span>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
