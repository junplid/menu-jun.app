import { AspectRatio, Image } from "@chakra-ui/react";
import { InViewComponent } from "@components/InView";
import { DataMenuContext } from "@contexts/data-menu.context";
import clsx from "clsx";
import opacity from "hex-color-opacity";
import { RefObject, useContext, useRef, useState } from "react";

interface Props {
  currentTab: number;
  onTabClick: (index: number) => void;
  categoryChipRefs: RefObject<Record<number, HTMLDivElement | null>>;
}

export function CategoriesFixedComponent({
  currentTab,
  onTabClick,
  categoryChipRefs,
}: Props) {
  const categoriesContainerRef = useRef<HTMLDivElement | null>(null);
  const { categories, logoImg } = useContext(DataMenuContext);
  const [inView, setInView] = useState(true);

  return (
    <>
      <InViewComponent onChange={(view) => setInView(view)} />
      <div
        className={clsx(
          "fixed z-30 shadow-md shadow-neutral-400/14 w-full left-0 bg-white duration-300",
          !inView ? "top-0" : "-top-16",
        )}
      >
        <div className="flex mx-auto py-1 max-w-lg w-full gap-x-2 items-center px-3">
          <div className="flex justify-center relative">
            <Image
              src={logoImg}
              style={{
                minWidth: 45,
                maxWidth: 45,
                height: "auto",
                backgroundColor: "#fff",
              }}
              className={clsx(
                "border-[3px] border-white duration-300 shadow-md transition-all rounded-full object-cover",
              )}
            />
          </div>
          <div
            ref={categoriesContainerRef}
            className="overflow-x-scroll hide-scrollbar flex items-center scroll-pl-3"
          >
            {categories.map((cat, index) => {
              const active = index === currentTab;
              let background = opacity("#dddddd", active ? 0.5 : 0.1);
              let shadow = opacity("#dddddd", active ? 0.2 : 0);
              let border = opacity("#dddddd", active ? 0.5 : 0);
              let textOn = opacity("#111111", 0.7);

              return (
                <div
                  key={cat.uuid}
                  ref={(el) => {
                    categoryChipRefs.current[index] = el;
                  }}
                  onClick={() => onTabClick(index)}
                  style={{
                    background: active
                      ? `radial-gradient(circle at 60% 50%,${opacity("#e8e8e8", 0.06)} 10%, ${background} 100%)`
                      : "#fff",
                    borderWidth: "1.5px",
                    borderColor: border,
                    boxShadow: `0px 0px 10px inset ${shadow}`,
                  }}
                  className="shrink-0 scroll-ml-3 grid border rounded-md -space-y-0.5 px-3 items-center cursor-pointer duration-100 active:scale-95 transition-all"
                >
                  {cat.image45x45png && (
                    <AspectRatio ratio={1} w={"45px"} className="mx-auto">
                      <div
                        className={clsx(
                          `rounded-xl w-full p-0.5 flex justify-center duration-300 items-center`,
                        )}
                      >
                        <img
                          src={cat.image45x45png}
                          className="w-full h-auto"
                          alt={cat.name}
                        />
                      </div>
                    </AspectRatio>
                  )}
                  <span
                    className={clsx(
                      "duration-300 text-sm text-center text-nowrap transition-all font-bold",
                      cat.image45x45png ? "" : "py-2",
                    )}
                    style={{ color: textOn }}
                  >
                    {cat.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
