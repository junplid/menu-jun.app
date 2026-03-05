import { useContext, useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import { JSX } from "@emotion/react/jsx-runtime";
import { LayoutPrivateContext } from "./layout-private.context";
import clsx from "clsx";
import { Image } from "@chakra-ui/react";
import { DataMenuContext } from "./data-menu.context";
import { PiMapPinFill } from "react-icons/pi";

export function LayoutPrivateProvider(): JSX.Element {
  const { bg_primary, logoImg } = useContext(DataMenuContext);
  const [headerOpen, setHeaderOpen] = useState(true);
  const [headerOpenDelay, setHeaderOpenDelay] = useState(true);

  useEffect(() => {
    if (!headerOpen) {
      setTimeout(() => {
        setHeaderOpenDelay(false);
      }, 700);
    }
  }, [headerOpen]);

  const dataValue = useMemo(
    () => ({
      headerOpen,
      setHeaderOpen,
    }),
    [headerOpen],
  );

  return (
    <LayoutPrivateContext.Provider value={dataValue}>
      <div className="h-svh overflow-y-hidden grid grid-rows-[auto_1fr_20px] bg-neutral-100">
        <header className="">
          <div
            className={clsx(
              "bg-neutral-600 w-full transition-all duration-300",
              headerOpenDelay ? "h-28" : "h-12",
            )}
          >
            {/* capa imagem */}
          </div>

          <div
            className={clsx(
              "duration-100 border mb-1 active:scale-95 shadow-sm mx-auto transition-all w-full max-w-lg px-3 rounded-2xl pb-2 -mt-4 border-neutral-200",
            )}
            style={{ background: bg_primary || "#fff" }}
          >
            <div className={"flex flex-col"}>
              <div className="flex flex-col items-center mx-auto">
                <Image
                  src={logoImg}
                  style={{
                    minWidth: headerOpenDelay ? 85 : 55,
                    maxWidth: headerOpenDelay ? 85 : 55,
                    height: headerOpenDelay ? 85 : 55,
                  }}
                  className={clsx(
                    "border-4 border-white duration-500 shadow-sm transition-all rounded-full bg-red-700",
                    headerOpenDelay ? "-mt-[42.5px]" : "-mt-[22.5px]",
                  )}
                />
                <div
                  className={clsx(
                    "flex flex-col -mt-1 items-center -space-y-0.5 transition-all",
                    headerOpenDelay ? "pt-1" : "",
                  )}
                >
                  <span className="text-neutral-900 font-extrabold text-lg sm:text-2xl">
                    Italiana Pizza
                  </span>
                  <span className="text-neutral-600 flex gap-x-2 items-center text-sm sm:text-lg">
                    <PiMapPinFill /> Salvador - BA • Mais informações
                  </span>
                  <span className="text-green-600 font-extrabold flex gap-x-2 items-center text-sm sm:text-lg">
                    Aberto até às 23h00
                  </span>
                </div>
                {/* <Presence
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
                </Presence> */}
              </div>
            </div>
          </div>
        </header>

        <Outlet />
        <footer className="w-full max-w-lg mx-auto px-3 text-xs text-center text-black/50">
          © 2025 - Desenvolvido por Junplid
        </footer>
      </div>
    </LayoutPrivateContext.Provider>
  );
}
