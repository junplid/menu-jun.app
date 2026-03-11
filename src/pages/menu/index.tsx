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
  const { categories, items, bg_primary } = useContext(DataMenuContext);
  const {
    items: cartItems,
  } = useContext(CartContext);

  const { headerOpen, setHeaderOpen } = useContext(LayoutPrivateContext);
  const isMoving = useRef(false);
  const ref = useRef<Carousel>(null);
  const refDefaultStateSection = useRef<{
    sections: Record<string, Record<string, number>>;
    length: number;
    key: string;
  }>(null);

  const [currentTab, setCurrentTab] = useState(0);
  const [showPresence, setShowPresence] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  function handleTab(i: number) {
    ref.current?.goToSlide(i);
  }

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (cartItems.length) {
      id = setTimeout(() => setShowPresence(true), 300);
    } else {
      setShowPresence(false);
    }

    return () => clearTimeout(id);
  }, [cartItems.length]);

  return (
    <main
      className="w-full relative duration-300 max-w-lg mx-auto pb-2 grid grid-rows-[auto_1fr] min-h-0"
      style={{
        paddingBottom: showPresence ? "70px" : "10px",
      }}
    >
      <div
        className={
          "grid grid-cols-[repeat(4,1fr)] bg-white py-2 border border-neutral-200 min-[480px]:grid-cols-[repeat(5,1fr)_50px] items-center gap-x-1 mt-1 px-3"
        }
      >
        {categories.map((cat, index) => {
          const background = `${bg_primary || "#dddddd"}${index === currentTab ? "90" : "10"}`;
          const textOn = `${bg_primary || "#111111"}${index === currentTab ? "" : "60"}`;

          return (
            <div
              key={cat.uuid}
              onClick={() => {
                handleTab(index);
                if (headerOpen) setHeaderOpen(false);
              }}
              style={{ background }}
              className="grid rounded-lg grid-cols-[45px_1fr] px-2 pl-1 gap-x-1 items-center cursor-pointer duration-100 active:scale-95 transition-all"
            >
              <AspectRatio ratio={1} w={"100%"}>
                <div
                  className={`rounded-xl w-full p-0.5 flex justify-center duration-300 items-center`}
                >
                  <img
                    src={cat.image45x45png}
                    className="w-full h-auto "
                    alt={cat.name}
                  />
                </div>
              </AspectRatio>
              <span
                className={clsx("font-semibold duration-300 text-sm")}
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
          if (headerOpen) setHeaderOpen(false);
          setTimeout(() => {
            isMoving.current = false;
          }, 20);
        }}
      >
        {categories.map((cat) => {
          const itemsOfCat = items.filter((ii) =>
            ii.categories.some((itemcat) => itemcat.uuid === cat.uuid),
          );

          return (
            <GridWithShadows
              listClassName="grid w-full grid-cols-1"
              items={itemsOfCat}
              grid={false}
              renderItem={(item) => {
                const background = false
                  ? `${bg_primary || "#111111"}10`
                  : undefined;
                // const bgPoint = `${bg_primary || "#111111"}70`;

                return (
                  <div key={item.uuid} className="p-1 w-full px-2.5">
                    <Item background={background} isMoving={isMoving} item={item} />
                  </div>
                );
              }}
            />
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
        showPresence={showPresence}
        onClick={() => {
          const next = new URLSearchParams(searchParams);
          next.set("c", "true");
          setSearchParams(next);
        }}
      />

      <SectionsItems defaultStateSection={refDefaultStateSection} />
    </main>
  );
};

interface Props {
  isMoving: RefObject<boolean>
  item: any;
  background?: string;
}

function Item({ isMoving, item, background }: Props) {
  const { bg_primary } = useContext(DataMenuContext);
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

  return (
    <article
      className={clsx(
        "bg-white cursor-pointer rounded-xl p-1 h-full grid grid-cols-[100px_1fr] select-none items-center w-full relative",
        // selected && "shadow",
      )}
      onClick={() => {
        if (isMoving.current) return;
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
      style={{ background }}
    >
      <div className="relative">
        <AspectRatio ratio={1} w={"100px"}>
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
          className="absolute left-1 border-2 border-green-600 top-1 text-green-600 rounded-lg bg-green-100 p-0.5"
        >
          <TbShoppingBagPlus size={22} />
        </Presence>
      </div>
      <div className="pl-1 flex flex-col gap-y-2 py-1.5 h-full justify-between">
        <div className="flex flex-col gap-y-1">
          <span
            className={clsx(
              "line-clamp-1 w-full text-lg leading-5 font-semibold",
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
              "line-clamp-2 overflow-hidden text-sm leading-4 font-light",
              // selected ? "text-zinc-700" : "text-zinc-600",
            )}
          >
            {item.desc}
          </span>
        </div>
        <div className="mb-1">
          <div className="w-full flex flex-col items-start">
            {item.beforePrice && (
              <span className="text-zinc-500 line-through text-xs">
                {formatToBRL(item.beforePrice)}
              </span>
            )}
            {item.afterPrice && (
              <span
                className={`font-semibold leading-3 text-sm`}
                style={{
                  color: `${bg_primary || "#0c0c0c"}e6`,
                }}
              >
                {formatToBRL(item.afterPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
