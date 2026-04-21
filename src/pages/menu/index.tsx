import { AspectRatio, Presence } from "@chakra-ui/react";
import clsx from "clsx";
import { JSX, useContext, useEffect, useRef, useState } from "react";
import { DataMenuContext } from "@contexts/data-menu.context";
import { CartContext } from "@contexts/cart.context";
import { PreviewCartComponent } from "./PreviewCart";
import { ModalCarrinho } from "./modals/Carrinho";
import { formatToBRL } from "brazilian-values";
import { useSearchParams } from "react-router-dom";
import { TbShoppingBagPlus } from "react-icons/tb";
import { v4 } from "uuid";
import opacity from "hex-color-opacity";
import { CategoriesFixedComponent } from "./CategoriesFixed";

function smoothScrollToY(targetY: number, duration = 700) {
  const startY = window.scrollY;
  const diff = targetY - startY;
  const start = performance.now();

  function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3);
  }

  function step(now: number) {
    const progress = Math.min((now - start) / duration, 1);
    window.scrollTo(0, startY + diff * easeOutCubic(progress));

    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

export const MenuPage: React.FC = (): JSX.Element => {
  const { categories } = useContext(DataMenuContext);

  const refDefaultStateSection = useRef<{
    sections: Record<string, Record<string, number>>;
    length: number;
    key: string;
  }>(null);

  const categorySectionRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const categoryChipRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const categoriesContainerRef = useRef<HTMLDivElement | null>(null);
  const categoriesRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const [currentTab, setCurrentTab] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();

  function handleTab(i: number) {
    setCurrentTab(i);

    const section = categorySectionRefs.current[i];
    if (section) {
      const headerOffset = 65; // ajuste conforme sua navbar fixa
      const y =
        section.getBoundingClientRect().top + window.scrollY - headerOffset;
      smoothScrollToY(y, 1200); // aumenta aqui para deixar mais lento
    }

    const chip = categoryChipRefs.current[i];
    chip?.scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "start",
    });
  }

  const activeTabTimeoutRef = useRef<number | null>(null);
  const lastVisibleIndexRef = useRef<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (!visible) return;

        const index = Number((visible.target as HTMLElement).dataset.index);
        if (Number.isNaN(index)) return;

        lastVisibleIndexRef.current = index;

        if (activeTabTimeoutRef.current) {
          window.clearTimeout(activeTabTimeoutRef.current);
        }

        activeTabTimeoutRef.current = window.setTimeout(() => {
          if (lastVisibleIndexRef.current === index) {
            setCurrentTab(index);

            const chip = categoryChipRefs.current[index];
            chip?.scrollIntoView({
              behavior: "smooth",
              inline: "start",
              block: "start",
            });
          }
        }, 400);
      },
      {
        threshold: 0.3,
        root: null,
      },
    );

    Object.values(categorySectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      if (activeTabTimeoutRef.current) {
        window.clearTimeout(activeTabTimeoutRef.current);
      }
    };
  }, [categories]);

  return (
    <main
      className="w-full relative duration-300 max-w-lg mx-auto pb-2 flex-1"
      style={{ paddingBottom: "90px" }}
    >
      <div
        className={
          "flex py-2 gap-x-2 overflow-x-scroll hide-scrollbar items-center px-3 scroll-pl-3"
        }
        ref={categoriesContainerRef}
      >
        {categories.map((cat, index) => {
          let background = opacity("#dddddd", index === currentTab ? 0.5 : 0.1);
          let shadow = opacity("#dddddd", index === currentTab ? 0.2 : 0);
          let border = opacity("#dddddd", index === currentTab ? 0.5 : 0);
          let textOn = opacity("#111111", 0.7);

          return (
            <div
              key={cat.uuid}
              onClick={() => {
                handleTab(index);
              }}
              style={{
                background:
                  index === currentTab
                    ? `radial-gradient(circle at 60% 50%,${opacity("#e8e8e8", 0.06)} 10%, ${background} 100%)`
                    : "#fff",
                borderWidth: "1.5px",
                borderColor: border,
                boxShadow: `0px 0px 10px inset ${shadow}`,
              }}
              className="shrink-0 scroll-ml-3 grid border rounded-md -space-y-0.5 px-3 items-center cursor-pointer duration-100 active:scale-95 transition-all"
              ref={(el) => {
                categoriesRefs.current[index] = el;
              }}
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
      <CategoriesFixedComponent
        currentTab={currentTab}
        onTabClick={handleTab}
        categoryChipRefs={categoryChipRefs}
      />

      {categories.map((cat, index) => {
        return (
          <div
            data-index={index}
            ref={(el) => {
              categorySectionRefs.current[index] = el;
            }}
            key={cat.uuid}
            className={clsx(
              "flex px-3 flex-col scroll-mt-16",
              index == 0 ? "mt-5" : "my-10",
            )}
          >
            <h3 className="uppercase font-extrabold mb-1 text-lg">
              {cat.name}
            </h3>
            {cat.items.map((item, itemIndex) => (
              <div
                key={item.uuid}
                className={clsx(
                  "w-full my-1 first:mt-0",
                  cat.items.length - 1 === itemIndex && "border-b-0",
                )}
              >
                <Item item={item} />
              </div>
            ))}
          </div>
        );
      })}

      <ModalCarrinho
        onReturnEdit={(item) => {
          refDefaultStateSection.current = item.ref;
          const next = new URLSearchParams(searchParams);
          next.delete("c");
          next.set("s", item.uuid);
          setTimeout(() => {
            setSearchParams(next);
          }, 10);
        }}
      />

      <PreviewCartComponent
        // showPresence={showPresence}
        onClick={() => {
          const next = new URLSearchParams(searchParams);
          next.set("c", "true");
          setSearchParams(next);
        }}
      />

      {/* <SectionsItems
        defaultStateSection={refDefaultStateSection}
        sendToCategory={(catUuid) => {
          const indexCat = categories.findIndex((c) => c.uuid === catUuid);
          if (indexCat >= 0) handleTab(indexCat);
        }}
      /> */}
    </main>
  );
};

interface Props {
  item: any;
}

function Item({ item }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    items: cartItems,
    addItem: addCartItem,
    incrementQnt: incrementQntItemCart,
  } = useContext(CartContext);

  const [keyPresence, setKeyPresence] = useState("");

  useEffect(() => {
    const kk = setTimeout(() => {
      setKeyPresence("");
    }, 1100);

    return () => {
      clearTimeout(kk);
    };
  }, [keyPresence]);

  const discount =
    item.beforePrice && item.afterPrice
      ? Math.round(
          ((item.beforePrice - item.afterPrice) / item.beforePrice) * 100,
        )
      : null;

  return (
    <article
      className={clsx(
        "rounded-lg p-1 shadow shadow-neutral-700/4 h-full grid grid-cols-[1fr_100px] select-none items-center w-full relative",
        !item.qnt ? "cursor-not-allowed" : "cursor-pointer",
      )}
      onClick={() => {
        if (!item.qnt) return;
        if (!!item.sections.length) {
          const next = new URLSearchParams(searchParams);
          next.set("s", item.uuid);
          setSearchParams(next);
        } else {
          setKeyPresence(v4());
          if (cartItems.some((itemCart) => itemCart.uuid === item.uuid)) {
            incrementQntItemCart(item.uuid, 1);
          } else {
            addCartItem({
              qnt: 1,
              total: item.afterPrice!,
              uuid: item.uuid,
            });
          }
        }
      }}
      style={{ background: "#fff" }}
    >
      <div className="pl-1 flex flex-col gap-y-2 py-1.5 h-full justify-between">
        <div className="flex flex-col gap-y-1">
          <span
            className={clsx(
              "line-clamp-2 w-full text-lg leading-5 font-semibold text-neutral-800",
            )}
          >
            {item.name}
          </span>
          <span
            className={clsx(
              "line-clamp-2 overflow-hidden text-sm leading-4 font-light text-neutral-500",
              // selected ? "text-zinc-700" : "text-zinc-600",
            )}
          >
            {item.desc}
          </span>
        </div>
        <div className="mb-1">
          <div className="w-full flex gap-x-1.5 items-center">
            {item.afterPrice && (
              <span className={`font-bold leading-3 text-neutral-800`}>
                {formatToBRL(item.afterPrice)}
              </span>
            )}
            {item.beforePrice && (
              <span className="text-neutral-300 font-medium line-through text-sm">
                {formatToBRL(item.beforePrice)}
              </span>
            )}
            {discount && (
              <span className="bg-green-600 text-white text-xs font-medium px-1.5 py-0 rounded-full">
                -{discount}%
              </span>
            )}
          </div>
        </div>
      </div>
      <div className={clsx("relative")}>
        {!item.qnt && (
          <div className="bg-neutral-600 rotate-12 absolute z-20 px-1 py-0.5 left-1/2 -translate-x-1/2 top-1/5 translate-y-1/2">
            <span className="text-white font-semibold border-y-2 text-sm">
              ESGOTADO
            </span>
          </div>
        )}
        <AspectRatio
          ratio={1}
          w={"100px"}
          className={clsx(!item.qnt ? "opacity-35" : "")}
        >
          <img
            src={item.img}
            alt={item.name}
            className="p-1 pointer-events-none rounded-xl overflow-hidden w-full h-auto"
            draggable={false}
          />
        </AspectRatio>
        <Presence
          animationName={{
            _open: "slide-from-top, fade-in",
            _closed: "slide-to-bottom, fade-out",
          }}
          animationDuration="moderate"
          present={!!keyPresence}
          className="absolute left-1 border-2 top-1 rounded-lg p-0.5"
          style={{
            background: "#fff",
            color: "oklch(62.7% 0.194 149.214)",
            borderColor: "oklch(62.7% 0.194 149.214)",
          }}
        >
          <TbShoppingBagPlus size={22} />
        </Presence>
      </div>
    </article>
  );
}
