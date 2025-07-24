import { useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import { JSX } from "@emotion/react/jsx-runtime";
import { LayoutPrivateContext } from "./layout-private.context";
import { Flipper, Flipped } from "react-flip-toolkit";
import clsx from "clsx";
import { IoSearch } from "react-icons/io5";

export function LayoutPrivateProvider(): JSX.Element {
  const [headerOpen, setHeaderOpen] = useState(true);

  const dataValue = useMemo(
    () => ({
      headerOpen,
      setHeaderOpen,
    }),
    [headerOpen]
  );

  return (
    <LayoutPrivateContext.Provider value={dataValue}>
      <div className="h-svh overflow-y-hidden grid grid-rows-[auto_1fr]">
        <header className="sticky top-0">
          <Flipper flipKey={headerOpen}>
            <div
              className={clsx("bg-zinc-300 py-2 duration-300 px-3")}
              style={{ height: headerOpen ? 127 : 58 }}
            >
              <div
                className={clsx(
                  "max-w-lg flex mx-auto w-full",
                  headerOpen
                    ? "flex-col gap-2 items-center"
                    : "items-center gap-3 justify-between"
                )}
              >
                <Flipped flipId="logo">
                  <div
                    className="bg-zinc-400"
                    style={{
                      width: headerOpen ? 70 : 40,
                      height: headerOpen ? 70 : 40,
                    }}
                  />
                </Flipped>

                <Flipped flipId="search">
                  <label
                    className={clsx(
                      "flex bg-white p-1 px-3 items-center gap-x-2.5 rounded-full",
                      headerOpen ? "w-[calc(100%-150px)]" : "w-full"
                    )}
                  >
                    <IoSearch size={22} color="#c8c8c8" />
                    <input
                      type="text"
                      placeholder="Buscar por sabores ou bebidas..."
                      className="outline-none w-full"
                    />
                  </label>
                </Flipped>
              </div>
            </div>
          </Flipper>
        </header>

        <Outlet />
        <footer className="w-full max-w-lg mx-auto px-3 text-xs text-center text-black/70">
          © 2025 - Desenvolvido & mantido por{" "}
          <a
            className="text-blue-600 font-semibold"
            href="https://www.instagram.com/junplid/"
            target="_blank"
          >
            Junplid
          </a>
        </footer>
      </div>
    </LayoutPrivateContext.Provider>
  );
}
