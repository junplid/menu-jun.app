import { AspectRatio, Collapsible } from "@chakra-ui/react";
import { LayoutPrivateContext } from "@contexts/layout-private.context";
import clsx from "clsx";
import { JSX, useContext, useEffect, useMemo, useRef, useState } from "react";
import Carousel, { ResponsiveType } from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import GridWithShadows from "./GridRender";
import { useDialogModal } from "../../hooks/dialog.modal";
import { ModalViewSabor } from "./modals/viewSabor";
import { ModalSelecionarTamanho } from "./modals/SelecionarTamanho";
import { formatToBRL } from "brazilian-values";
import { ModalCarrinho } from "./modals/Carrinho";
import { usePizzaStore } from "../../store/useStore";
import { CartContext } from "@contexts/cart.context";
import { PreviewCartComponent } from "./PreviewCart";
import { nanoid } from "nanoid";
import { MdOutlineEdit } from "react-icons/md";
import { DataMenuContext } from "@contexts/data-menu.context";

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

const responsiveTamanhos: ResponsiveType = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 465 },
    items: 4,
  },
  mobile: {
    breakpoint: { max: 465, min: 0 },
    partialVisibilityGutter: 15,
    items: 3,
  },
};

const responsiveSabores: ResponsiveType = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 600, min: 450 },
    items: 2,
    partialVisibilityGutter: 30,
  },
  xmobile: {
    breakpoint: { max: 450, min: 0 },
    items: 2,
    partialVisibilityGutter: 10,
  },
};

const categories = [
  { name: "Pizzas", img: "/img-icons/pizza-img-icon.png" },
  { name: "Bebidas", img: "/img-icons/drinks-img-icon.png" },
];

export const MenuPage: React.FC = (): JSX.Element => {
  const { sizes, items, bg_primary } = useContext(DataMenuContext);
  const {
    items: cartItems,
    addItem: addCartItem,
    removeItem: removeCartItem,
  } = useContext(CartContext);
  const {
    dialog: DialogModal,
    close,
    onOpen,
  } = useDialogModal({ placement: "center" });
  const { headerOpen, setHeaderOpen } = useContext(LayoutPrivateContext);

  const {
    sizeSelected,
    setSizeSelected,
    flavorsSelected,
    setFlavorsSelected,
    addFlavor,
    removeFlavor,
  } = usePizzaStore();

  const [currentTab, setCurrentTab] = useState(0);
  const ref = useRef<Carousel>(null);

  function handleTab(i: number) {
    ref.current?.goToSlide(i);
  }

  const [showPresence, setShowPresence] = useState(false);
  useEffect(() => {
    let id: NodeJS.Timeout;

    if (cartItems.length) {
      id = setTimeout(() => setShowPresence(true), 500);
    } else {
      setShowPresence(false);
    }

    return () => clearTimeout(id);
  }, [cartItems.length]);

  const qntFlavorsMissing = useMemo(() => {
    const totalQnt = flavorsSelected.reduce((p, c) => p + c.qnt, 0);
    const totalFlavorsSize =
      sizes.find((s) => s.uuid === sizeSelected)?.flavors || 0;
    return totalFlavorsSize - totalQnt;
  }, [sizeSelected, flavorsSelected]);

  const listPizza = useMemo(() => {
    return items.filter((i) => i.category === "pizzas");
  }, []);

  const listDrink = useMemo(() => {
    return items.filter((i) => i.category === "drinks");
  }, []);

  return (
    <main
      className="w-full duration-300 max-w-lg mx-auto relative pb-2 grid grid-rows-[auto_auto_1fr] min-h-0"
      style={{ paddingBottom: showPresence ? "57px" : "8px" }}
    >
      <div
        className={
          "grid grid-cols-[repeat(5,1fr)_30px] min-[480px]:grid-cols-[repeat(5,1fr)_50px] items-center gap-x-3 mt-2 px-3"
        }
      >
        {categories.map((cat, index) => {
          const background = `${bg_primary || "#111111"}${index === currentTab ? "90" : "10"}`;
          const textOn = `${bg_primary || "#111111"}${index === currentTab ? "" : "60"}`;

          return (
            <div
              key={cat.name}
              onClick={() => {
                handleTab(index);
                if (headerOpen) setHeaderOpen(false);
              }}
              className="flex flex-col items-center"
            >
              <AspectRatio ratio={1} w={"100%"}>
                <div
                  className={`p-1.5 rounded-xl w-full flex justify-center duration-300 items-center cursor-pointer`}
                  style={{
                    background,
                  }}
                >
                  <img
                    src={cat.img}
                    className="max-h-[50px] min-h-[40px]"
                    alt={cat.name}
                  />
                </div>
              </AspectRatio>
              {headerOpen && (
                <span
                  className={clsx("font-semibold duration-300 text-sm")}
                  style={{ color: textOn }}
                >
                  {cat.name}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <Collapsible.Root
        lazyMount={true}
        unmountOnExit={true}
        open={!!!currentTab}
      >
        <Collapsible.Content>
          <div className="grid mt-2 px-2">
            {sizeSelected && !!flavorsSelected.length && (
              <div className="grid grid-cols-[1fr_86px] rounded-sm gap-x-2">
                <Carousel
                  infinite={false}
                  responsive={responsiveSabores}
                  partialVisible
                  arrows={false}
                  itemClass="relative select-none cursor-pointer"
                >
                  {flavorsSelected.map((flavor, index) => (
                    <div className="first:pr-1 px-1 relative" key={flavor.uuid}>
                      <div className="flex flex-col p-2 h-[82px] rounded-md bg-zinc-50 border border-zinc-100 justify-between">
                        <span
                          className={`text-sm font-medium leading-[15px]`}
                          style={{ color: `${bg_primary || "#111111"}` }}
                        >
                          {listPizza.find((p) => p.uuid === flavor.uuid)?.name}
                        </span>
                        <div className="flex gap-x-1">
                          <span className="bg-white border-zinc-100 py-1 text-sm w-10 flex items-center justify-center rounded-md">
                            {flavor.qnt}
                          </span>
                          <a
                            onClick={() => {
                              if (qntFlavorsMissing) {
                                setFlavorsSelected(
                                  flavorsSelected.map((fl) => {
                                    if (fl.uuid === flavor.uuid) fl.qnt += 1;
                                    return fl;
                                  })
                                );
                              }
                            }}
                            className={clsx(
                              "bg-green-200 text-green-600 py-1 text-lg leading-0 w-7 flex items-center justify-center rounded-md",
                              qntFlavorsMissing
                                ? "hover:bg-green-300 duration-200 cursor-pointer"
                                : "opacity-30 cursor-not-allowed"
                            )}
                          >
                            +
                          </a>
                          <a
                            onClick={() => {
                              const total = flavorsSelected[index].qnt - 1;
                              if (total === 0) {
                                setFlavorsSelected(
                                  flavorsSelected.filter(
                                    (s) => s.uuid !== flavor.uuid
                                  )
                                );
                              } else {
                                setFlavorsSelected(
                                  flavorsSelected.map((fl) => {
                                    if (fl.uuid === flavor.uuid) fl.qnt = total;
                                    return fl;
                                  })
                                );
                              }
                            }}
                            className="bg-red-200 cursor-pointer hover:bg-red-300 text-red-600 duration-200 py-1 w-7 text-lg leading-0 flex items-center justify-center rounded-md"
                          >
                            -
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </Carousel>
                <a
                  className={`cursor-pointer leading-4 p-2 font-semibold text-center flex items-center justify-center rounded-md text-sm`}
                  onClick={() => {
                    addCartItem({
                      type: "pizza",
                      flavors: flavorsSelected,
                      uuid: sizeSelected,
                      key: nanoid(),
                      qnt: 1,
                    });
                    setTimeout(() => {
                      setFlavorsSelected([]);
                      setSizeSelected(null);
                      setTimeout(() => {
                        handleTab(1);
                      }, 100);
                    }, 300);
                  }}
                  style={{
                    color: `${bg_primary || "#111111"}`,
                    background: `${bg_primary || "#111111"}20`,
                  }}
                >
                  Adicionar ao carrinho
                </a>
              </div>
            )}
            {!sizeSelected && (
              <Carousel
                infinite={false}
                responsive={responsiveTamanhos}
                partialVisible
                arrows={false}
                itemClass="relative select-none cursor-pointer"
              >
                {sizes.map((size) => (
                  <div
                    className="px-1 pb-1.5"
                    key={size.uuid}
                    onClick={() => {
                      setSizeSelected(size.uuid);
                      const nextFlavors = flavorsSelected.slice(
                        0,
                        size.flavors
                      );
                      setFlavorsSelected(nextFlavors);
                      if (headerOpen) setHeaderOpen(false);
                    }}
                  >
                    <div
                      className={`flex flex-col py-2 rounded-md items-center shadow-md`}
                      style={{ background: `${bg_primary || "#111111"}10` }}
                    >
                      <strong
                        className={`text-center leading-4`}
                        style={{ color: `${bg_primary || "#111111"}` }}
                      >
                        {size.name}
                      </strong>
                      <strong className="text-sm text-center leading-4 text-zinc-700">
                        {formatToBRL(size.price)}
                      </strong>
                      <span className="leading-4 text-sm text-center text-zinc-500">
                        {size.flavors > 1
                          ? `${size.flavors} sabores`
                          : "1 sabor"}
                      </span>
                      {size.slices !== null && (
                        <span className="leading-3 text-sm text-center text-zinc-500">
                          {size.slices > 1
                            ? `${size.slices} fatias`
                            : "1 fatia"}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </Carousel>
            )}
          </div>
        </Collapsible.Content>
      </Collapsible.Root>

      <Carousel
        ref={ref}
        infinite={false}
        arrows={false}
        responsive={responsive}
        beforeChange={(before) => setCurrentTab(before)}
        className={clsx(
          "duration-300 mt-2 border-t",
          !currentTab ? "border-transparent" : "border-zinc-200"
        )}
      >
        <GridWithShadows
          listClassName="grid w-full min-[460px]:grid-cols-4 grid-cols-3 mt-1"
          items={listPizza}
          renderItem={(flavor) => {
            const selected = !!flavorsSelected.find(
              (f) => f.uuid === flavor.uuid
            );
            const background = selected
              ? `${bg_primary || "#111111"}10`
              : undefined;
            const bgPoint = `${bg_primary || "#111111"}70`;

            return (
              <div key={flavor.uuid} className="p-0.5 w-full">
                <article
                  className={clsx(
                    "cursor-pointer rounded-xl duration-200 p-0.5 pb-2 h-full flex flex-col select-none items-center w-full relative",
                    selected && "shadow"
                  )}
                  onClick={() => {
                    if (sizeSelected) {
                      const sizeFlavors =
                        sizes.find((s) => s.uuid === sizeSelected)?.flavors ||
                        0;
                      if (sizeFlavors > 1) {
                        if (qntFlavorsMissing) {
                          const exist = flavorsSelected.some(
                            (s) => s.uuid === flavor.uuid
                          );
                          if (exist) {
                            removeFlavor(flavor.name);
                          } else {
                            addFlavor({ uuid: flavor.uuid, qnt: 1 });
                          }
                        } else {
                          const exist = flavorsSelected.some(
                            (s) => s.uuid === flavor.uuid
                          );
                          if (exist) {
                            removeFlavor(flavor.uuid);
                          } else {
                            onOpen({
                              content: (
                                <ModalViewSabor
                                  close={close}
                                  name={flavor.name}
                                  desc={flavor.desc || undefined}
                                />
                              ),
                            });
                          }
                        }
                      } else {
                        setFlavorsSelected([{ uuid: flavor.uuid, qnt: 1 }]);
                      }
                    } else {
                      onOpen({
                        content: (
                          <ModalSelecionarTamanho
                            close={(sizeQnt) => {
                              const nextFlavors = flavorsSelected.slice(
                                0,
                                sizeQnt - 1
                              );
                              setFlavorsSelected(nextFlavors);
                              close();
                              addFlavor({ uuid: flavor.uuid, qnt: 1 });
                              if (headerOpen) setHeaderOpen(false);
                            }}
                          />
                        ),
                      });
                    }
                  }}
                  style={{ background }}
                >
                  <span
                    className={clsx(
                      `h-5 z-10 w-5 rounded-full border-2 absolute top-1.5 left-1.5 duration-200`,
                      selected ? "opacity-100 border-white" : "opacity-0"
                    )}
                    style={{ background: bgPoint }}
                  />
                  <AspectRatio ratio={1 / 1} w={"100%"}>
                    <img
                      src={flavor.img}
                      alt={flavor.name}
                      className="p-1 pointer-events-none"
                      draggable={false}
                    />
                  </AspectRatio>
                  <div className="-mt-3 h-[72px]">
                    <span
                      className={clsx(
                        "line-clamp-2 text-sm font-semibold text-center"
                      )}
                      style={{
                        color: selected
                          ? `${bg_primary || "#111111"}`
                          : undefined,
                      }}
                    >
                      {flavor.name}
                    </span>
                    <span
                      className={clsx(
                        "line-clamp-2 overflow-hidden text-xs text-center font-light",
                        selected ? "text-zinc-700" : "text-zinc-600"
                      )}
                    >
                      {flavor.desc}
                    </span>
                  </div>
                </article>
              </div>
            );
          }}
        />
        <GridWithShadows
          listClassName="grid w-full sm:grid-cols-4 grid-cols-3"
          items={listDrink}
          renderItem={(drink) => {
            const selected = cartItems.some(
              (cItem) => cItem.key === drink.uuid
            );
            const background = selected
              ? `${bg_primary || "#111111"}10`
              : undefined;
            const bgPoint = `${bg_primary || "#111111"}70`;

            return (
              <div key={drink.uuid} className="p-0.5 w-full">
                <article
                  className={clsx(
                    "cursor-pointer rounded-xl duration-200 p-0.5 pb-2 h-full flex flex-col select-none items-center w-full relative",
                    selected && "shadow"
                  )}
                  onClick={() => {
                    if (selected) {
                      removeCartItem(drink.uuid);
                    } else {
                      addCartItem({
                        type: "drink",
                        qnt: 1,
                        uuid: drink.uuid,
                        key: nanoid(),
                      });
                    }
                  }}
                  style={{ background }}
                >
                  <span
                    className={clsx(
                      `h-5 z-10 w-5 rounded-full border-2 absolute top-1.5 left-1.5 duration-200`,
                      selected ? "opacity-100 border-white" : "opacity-0"
                    )}
                    style={{ background: bgPoint }}
                  />
                  <AspectRatio ratio={1 / 1} w={"100%"}>
                    <img
                      src={drink.img}
                      alt={drink.name}
                      className="p-2 pointer-events-none"
                      draggable={false}
                    />
                  </AspectRatio>
                  <div className="w-full flex flex-col items-end -mt-3 pr-4 mb-0.5 h-[29px]">
                    {drink.beforePrice && (
                      <span className="text-zinc-500 line-through text-xs">
                        {formatToBRL(drink.beforePrice)}
                      </span>
                    )}
                    <span
                      className={`font-semibold leading-3 text-sm`}
                      style={{ color: `${bg_primary || "#111111"}80` }}
                    >
                      {formatToBRL(drink.afterPrice!)}
                    </span>
                  </div>
                  <div>
                    <span
                      className={clsx("line-clamp-2 font-medium text-center")}
                      style={{
                        color: selected
                          ? `${bg_primary || "#111111"}`
                          : undefined,
                      }}
                    >
                      {drink.name}
                    </span>
                    <span
                      className={clsx(
                        "line-clamp-2 overflow-hidden text-xs text-center font-light",
                        selected ? "text-zinc-700" : "text-zinc-600"
                      )}
                    >
                      {drink.desc}
                    </span>
                  </div>
                </article>
              </div>
            );
          }}
        />
      </Carousel>

      <PreviewCartComponent
        showPresence={showPresence}
        onClick={() => {
          onOpen({
            content: (
              <ModalCarrinho
                onReturnEdit={(pizza) => {
                  setSizeSelected(pizza.uuid);
                  setFlavorsSelected(pizza.flavors);
                  handleTab(0);
                }}
                close={close}
              />
            ),
          });
        }}
      />

      <div
        className={clsx(
          "fixed text-center duration-300 left-1/2 -translate-x-1/2 w-full",
          !currentTab && sizeSelected
            ? showPresence
              ? !!qntFlavorsMissing
                ? "bottom-22"
                : "bottom-[68px]"
              : !!qntFlavorsMissing
                ? "bottom-8"
                : "bottom-2"
            : "-bottom-12 opacity-0"
        )}
        onClick={() => setSizeSelected(null)}
      >
        <div className="flex flex-col items-center -space-y-1 h-[49px]">
          <div
            className={`flex items-center font-semibold gap-x-1 bg-white/30 backdrop-blur-xs px-2 pt-0.5`}
            style={{
              color: `${bg_primary || "#111111"}`,
            }}
          >
            <span>
              Pizza {sizes.find((s) => s.uuid === sizeSelected)?.name}
            </span>
            <a className="flex items-center text-blue-500 text-sm ml-1 gap-x-1 font-bold cursor-pointer hover:orange-blue-800 duration-200">
              Alterar
              <MdOutlineEdit size={20} />
            </a>
          </div>
          {!!qntFlavorsMissing && (
            <span className="block bg-white/30 text-sm text-zinc-500 backdrop-blur-xs px-2 pb-0.5">
              {qntFlavorsMissing > 1
                ? `Faltam ${qntFlavorsMissing} sabores`
                : "Falta 1 sabor"}
              *
            </span>
          )}
        </div>
      </div>

      {DialogModal}
    </main>
  );
};
