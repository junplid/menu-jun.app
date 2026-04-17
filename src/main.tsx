import "./index.css";

window.onerror = function (msg, url, line, _col, error) {
  document.body.innerHTML = `
    <div style="padding:20px;font-family:sans-serif">
      <h2>Erro detectado</h2>
      <p><b>Mensagem:</b> ${msg}</p>
      <p><b>Linha:</b> ${line}</p>
      <p><b>Arquivo:</b> ${url}</p>
      <p><b>Arquivo:</b> ${error}</p>
    </div>
  `;
};

import { createRoot } from "react-dom/client";
import { Provider } from "@components/ui/provider.tsx";
import App from "./App.tsx";
import { CookiesProvider } from "react-cookie";
import { Toaster } from "@components/ui/toaster.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } },
});

createRoot(document.getElementById("root")!).render(
  <CookiesProvider>
    <Provider>
      <QueryClientProvider client={queryClient}>
        <App />
        {/* <ReactQueryDevtools /> */}
      </QueryClientProvider>
      <Toaster />
    </Provider>
  </CookiesProvider>,
);
