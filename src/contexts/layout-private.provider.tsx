import { useContext, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import { JSX } from "@emotion/react/jsx-runtime";
import { LayoutPrivateContext } from "./layout-private.context";
import { Flipper, Flipped } from "react-flip-toolkit";
import clsx from "clsx";
import { Image, Presence } from "@chakra-ui/react";
import { DataMenuContext } from "./data-menu.context";

export function LayoutPrivateProvider(): JSX.Element {
  const { bg_primary, logoImg } = useContext(DataMenuContext);
  const [headerOpen, setHeaderOpen] = useState(true);

  const dataValue = useMemo(
    () => ({
      headerOpen,
      setHeaderOpen,
    }),
    [headerOpen],
  );

  return (
    <LayoutPrivateContext.Provider value={dataValue}>
      <div className="h-svh overflow-y-hidden grid grid-rows-[auto_1fr_20px]">
        <header className="">
          <Flipper flipKey={headerOpen}>
            <div
              className={clsx("py-1.5 duration-400 px-3")}
              style={{
                // height: headerOpen ? 100 : 61,
                background: bg_primary || "#111111",
              }}
            >
              <div
                className={clsx(
                  "max-w-lg grid mx-auto w-full",
                  headerOpen
                    ? "gap-2 items-center"
                    : "items-center gap-3 grid-cols-[auto_1fr] justify-between",
                )}
              >
                <Flipped flipId="logo">
                  <div className="flex items-center gap-x-1 mx-auto">
                    <Image
                      src={logoImg}
                      style={{
                        minWidth: headerOpen ? 85 : 46,
                        maxWidth: headerOpen ? 85 : 46,
                        height: headerOpen ? 85 : 46,
                      }}
                    />
                    <Presence
                      animationName={{
                        _open: "slide-from-left, fade-in",
                        _closed: "slide-to-left, fade-out",
                      }}
                      animationDuration="moderate"
                      present={!headerOpen}
                    >
                      <div className="flex flex-col font-semibold -space-y-1.5">
                        <span className="text-white text-sm sm:text-lg">
                          ITALIANA PIZZA
                        </span>
                      </div>
                    </Presence>
                  </div>
                </Flipped>
              </div>
            </div>
          </Flipper>
        </header>

        <Outlet />
        <footer className="w-full max-w-lg mx-auto px-3 text-xs text-center text-black/50">
          © 2025 - Desenvolvido & mantido por{" "}
          <a
            className={`font-semibold`}
            href="https://www.instagram.com/junplid/"
            target="_blank"
            style={{
              color: `${bg_primary || "#111111"}`,
            }}
          >
            Junplid
          </a>
        </footer>
      </div>
    </LayoutPrivateContext.Provider>
  );
}
