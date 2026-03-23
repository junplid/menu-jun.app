import { AspectRatio, Presence } from "@chakra-ui/react";
import { LayoutPrivateContext } from "@contexts/layout-private.context";
import clsx from "clsx";
import { JSX, RefObject, useContext, useEffect, useRef, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import GridWithShadows from "./GridRender";
import { DataMenuContext } from "@contexts/data-menu.context";

import { SectionsItems } from "./SectionsItem";
import { CartContext } from "@contexts/cart.context";
import { PreviewCartComponent } from "./PreviewCart";
import { ModalCarrinho } from "./modals/Carrinho";
import { formatToBRL } from "brazilian-values";
import { useSearchParams } from "react-router-dom";
import { TbShoppingBagPlus } from "react-icons/tb";
import { v4 } from "uuid"
import opacity from "hex-color-opacity";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 1,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

export const MenuPage: React.FC = (): JSX.Element => {
  const { categories, items, bg_capa } = useContext(DataMenuContext);
  // const {
  //   items: cartItems,
  // } = useContext(CartContext);

  const { headerOpen, setHeaderOpen } = useContext(LayoutPrivateContext);
  const isMoving = useRef(false);
  const ref = useRef<Carousel>(null);
  const refDefaultStateSection = useRef<{
    sections: Record<string, Record<string, number>>;
    length: number;
    key: string;
  }>(null);

  const categoriesContainerRef = useRef<HTMLDivElement | null>(null);
  const categoriesRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const [currentTab, setCurrentTab] = useState(0);
  // const [showPresence, setShowPresence] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  function handleTab(i: number) {
    ref.current?.goToSlide(i);

    const el = categoriesRefs.current[i];
    el?.scrollIntoView({ behavior: "smooth", inline: "center" });
  }

  // useEffect(() => {
  //   let id: NodeJS.Timeout;
  //   if (cartItems.length) {
  //     id = setTimeout(() => setShowPresence(true), 300);
  //   } else {
  //     setShowPresence(false);
  //   }

  //   return () => clearTimeout(id);
  // }, [cartItems.length]);

  return (
    <main
      className="w-full relative duration-300 max-w-lg mx-auto pb-2 grid grid-rows-[auto_1fr] min-h-0"
      style={{ paddingBottom: "70px" }}
    >
      <div
        className={
          "flex bg-white py-2 border border-neutral-100 overflow-x-scroll hide-scrollbar items-center px-1"
        }
        ref={categoriesContainerRef}
      >
        {categories.map((cat, index) => {
          let background = opacity("#dddddd", index === currentTab ? 0.50 : 0.10);
          let shadow = opacity("#dddddd", index === currentTab ? 0.20 : 0);
          let border = opacity("#dddddd", index === currentTab ? 0.50 : 0);
          let textOn = opacity("#111111", 0.70);

          if (bg_capa) {
            background = opacity(bg_capa, index === currentTab ? 0.20 : 0)
            shadow = opacity(bg_capa, index === currentTab ? 0.20 : 0)
            border = opacity(bg_capa, index === currentTab ? 0.35 : 0);
            if (index === currentTab) {
              textOn = opacity(bg_capa, 1)
            }
          }

          return (
            <div
              key={cat.uuid}
              onClick={() => {
                handleTab(index);
                if (headerOpen) setHeaderOpen(false);
              }}
              style={{
                background: index === currentTab ? `radial-gradient(circle at 60% 50%,${opacity(bg_capa || "#dddddd", 0.06)} 10%, ${background} 100%)` : "#fff",
                borderWidth: "1.5px",
                borderColor: border,
                boxShadow: `0px 0px 10px inset ${shadow}`
              }}
              className="grid border rounded-md grid-cols-[45px_1fr] px-3 pl-1 gap-x-1 items-center cursor-pointer duration-100 active:scale-95 transition-all"
              ref={(el) => {
                categoriesRefs.current[index] = el;
              }}
            >
              <AspectRatio ratio={1} w={"100%"}>
                <div
                  className={clsx(`rounded-xl w-full p-0.5 flex justify-center duration-300 items-center`)}
                >
                  <img
                    src={cat.image45x45png}
                    className="w-full h-auto "
                    alt={cat.name}
                  />
                </div>
              </AspectRatio>
              <span
                className={clsx("duration-300 text-sm text-nowrap transition-all font-bold")}
                style={{ color: textOn }}
              >
                {cat.name}
              </span>
            </div>
          );
        })}
      </div>

      <Carousel
        ref={ref}
        infinite={false}
        arrows={false}
        responsive={responsive}
        minimumTouchDrag={3}
        beforeChange={() => {
          isMoving.current = true;
        }}
        afterChange={(_, { currentSlide }) => {
          setCurrentTab(currentSlide);
          const el = categoriesRefs.current[currentSlide];
          const container = categoriesContainerRef.current;

          if (el && container) {
            const left =
              el.offsetLeft - container.clientWidth / 2 + el.clientWidth / 2;

            container.scrollTo({
              left,
              behavior: "smooth",
            });
          }

          if (headerOpen) setHeaderOpen(false);
          setTimeout(() => {
            isMoving.current = false;
          }, 20);
        }}
      >
        {categories.map((cat, index) => {
          const itemsOfCat = items.filter((ii) =>
            ii.categories.some((itemcat) => itemcat.uuid === cat.uuid),
          );

          return (
            <div key={cat.uuid} className="flex flex-col flex-1 h-full">
              <GridWithShadows
                listClassName="grid w-full grid-cols-1 h-full bg-red-300"
                items={[...itemsOfCat, null]}
                grid={false}
                renderItem={(item) => {
                  if (item?.uuid) {
                    return (
                      <div key={item.uuid} className={clsx("p-1 w-full border-b border-neutral-100 px-2.5", itemsOfCat.length - 1 === index && "border-b-0")}>
                        <Item isMoving={isMoving} item={item} />
                      </div>
                    );
                  }
                  return categories[index + 1]?.uuid && (
                    <div className="flex flex-col items-center my-2 mt-5 justify-center py-3 text-sm opacity-40" >
                      <span>Deslize para ver mais</span>
                      <span>👉</span>
                    </div>
                  )
                }}
              />
            </div>
          );
        })}
      </Carousel>

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

      <SectionsItems defaultStateSection={refDefaultStateSection} sendToCategory={(catUuid) => {
        const indexCat = categories.findIndex(c => c.uuid === catUuid);
        if (indexCat >= 0) handleTab(indexCat);
      }} />
    </main>
  );
};

interface Props {
  isMoving: RefObject<boolean>
  item: any;
}

function Item({ isMoving, item }: Props) {
  const { bg_primary, bg_capa } = useContext(DataMenuContext);
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
    }
  }, [keyPresence]);

  const discount =
    item.beforePrice && item.afterPrice
      ? Math.round(((item.beforePrice - item.afterPrice) / item.beforePrice) * 100)
      : null;

  return (
    <article
      className={clsx(
        "rounded-xl p-1 h-full grid grid-cols-[1fr_100px] select-none items-center w-full relative",
        !item.qnt ? "cursor-not-allowed" : "cursor-pointer",
      )}
      onClick={() => {
        if (isMoving.current) return;
        if (!item.qnt) return;
        if (!!item.sections.length) {
          const next = new URLSearchParams(searchParams);
          next.set("s", item.uuid);
          setSearchParams(next);
        } else {
          setKeyPresence(v4());
          if (
            cartItems.some(
              (itemCart) => itemCart.uuid === item.uuid,
            )
          ) {
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
              "line-clamp-2 w-full text-lg leading-5 font-normal",
            )}
            style={{
              color: false
                ? `${bg_primary || "#111111"}`
                : undefined,
            }}
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
              <span
                className={`font-normal leading-3`}
                style={{
                  color: `${bg_primary || "#0c0c0c"}e6`,
                }}
              >
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
            <span className="text-white font-semibold border-y-2 text-sm">ESGOTADO</span>
          </div>
        )}
        <AspectRatio ratio={1} w={"100px"} className={clsx(!item.qnt ? "opacity-35" : "",)}>
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
            color: bg_capa || "oklch(62.7% 0.194 149.214)",
            borderColor: bg_capa || "oklch(62.7% 0.194 149.214)"
          }}
        >
          <TbShoppingBagPlus size={22} />
        </Presence>
      </div>
    </article>
  )
}
