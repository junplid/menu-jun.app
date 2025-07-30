import { useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import { JSX } from "@emotion/react/jsx-runtime";
import { LayoutPrivateContext } from "./layout-private.context";
import { Flipper, Flipped } from "react-flip-toolkit";
import clsx from "clsx";
import { IoSearch } from "react-icons/io5";
import { Image } from "@chakra-ui/react";

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
      <div className="h-svh overflow-y-hidden grid grid-rows-[auto_1fr_20px]">
        <header className="">
          <Flipper flipKey={headerOpen}>
            <div
              className={clsx("py-1.5 duration-300 px-3")}
              style={{
                height: headerOpen ? 155 : 77,
                background:
                  "linear-gradient(147deg,rgba(130, 3, 11, 1) 38%, rgba(219, 0, 7, 1) 91%)",
              }}
            >
              <div
                className={clsx(
                  "max-w-lg grid mx-auto w-full",
                  headerOpen
                    ? "gap-2 items-center grid-rows-[auto_auto]"
                    : "items-center gap-3 grid-cols-[auto_1fr] justify-between"
                )}
              >
                <Flipped flipId="logo">
                  <div className="flex items-center gap-x-1 mx-auto">
                    <Image
                      src="/logo.png"
                      style={{
                        minWidth: headerOpen ? 85 : 62,
                        maxWidth: headerOpen ? 85 : 62,
                        height: headerOpen ? 85 : 62,
                      }}
                    />
                    <div className="flex flex-col font-semibold -space-y-2">
                      <span className="text-white sm:text-lg">Pizzaria</span>
                      <span className="text-yellow-300 text-lg sm:text-xl font-extrabold">
                        Deliciosa
                      </span>
                    </div>
                  </div>
                </Flipped>

                <Flipped flipId="search">
                  <label
                    className={clsx(
                      "flex bg-orange-100 p-3 px-3 items-center gap-x-2.5 rounded-full"
                    )}
                  >
                    <IoSearch size={22} color="#b2b2b2" />
                    <input
                      disabled
                      type="text"
                      placeholder="Buscar"
                      className="outline-none w-full font-semibold"
                    />
                  </label>
                </Flipped>
              </div>
            </div>
          </Flipper>
        </header>

        <Outlet />
        <footer className="w-full max-w-lg mx-auto px-3 z-50 text-xs text-center text-black/70">
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
