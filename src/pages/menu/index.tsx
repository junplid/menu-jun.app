import { AspectRatio, Collapsible, Presence } from "@chakra-ui/react";
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
import { PiShoppingCartBold } from "react-icons/pi";
import { ModalCarrinho } from "./modals/Carrinho";
import { usePizzaStore } from "../../store/useStore";

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
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 4,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    partialVisibilityGutter: 10,
    items: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 4,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 4,
  },
};

const responsiveSabores: ResponsiveType = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 34,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    partialVisibilityGutter: 25,
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 4,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 3,
    partialVisibilityGutter: 10,
  },
};

const tamanhos = [
  { name: "Pequena", price: 28, sabor: 1, fatias: 4 },
  { name: "Média", price: 36, sabor: 2, fatias: 6 },
  { name: "Grande", price: 45.99, sabor: 3, fatias: 8 },
  { name: "Familia", price: 57.99, sabor: 4, fatias: 12 },
];

const mockdata = [
  { name: "Baurú", desc: "mussarela, frango, tomate, orégano" },
  { name: "Calabresa com catupiry", desc: "mussarela, calabresa, orégano" },
  { name: "Catupiry", desc: "mussarela, catupiry, orégano" },
  { name: "Cheddar", desc: "mussarela, cheddar, orégano" },
  { name: "Dois queijos", desc: "mussarela, provolone, orégano" },
  { name: "Frango", desc: "mussarela, frango, catupiry, orégano" },
  { name: "Mussarela", desc: "molho especial, orégano" },
  { name: "Marguerita", desc: "mussarela, tomate, majericão, orégano" },
  { name: "Milho verde", desc: "mussarela, milho, orégano" },
  { name: "Napolitana", desc: "mussarela, molho, tomate, orégano" },
  { name: "Palmito", desc: "mussarela, palmito, orégano" },
  { name: "Presunto", desc: "mussarela, presunto, orégano" },
  { name: "Portuguesa", desc: "mussarela, presunto, ovos, cebola, orégano" },
  {
    name: "Quatro Queijos",
    desc: "mussarela, provolone, gorgonzola, catupiry, orégano",
  },
  { name: "Siciliana", desc: "mussarela, calabresa, cebola, orégano" },
  { name: "Três Queijos", desc: "mussarela, provolone, catupiry, orégano" },
  {
    name: "Vegetariana",
    desc: "mussarela, ervilha, milho, cebola, tomate, pimentão, azeitonas, orégano",
  },
  { name: "Alemão", desc: "mussarela, frango, bacon, ervilha orégano" },
];

const mockbebidasdata = [
  {
    key: "1",
    name: "Coca-Cola",
    desc: "Sem açucar 220ml",
    priceAfter: 6.8,
    priceBefore: 8,
  },
  {
    key: "2",
    name: "Coca-Cola",
    desc: "Sem açucar 220ml",
    priceAfter: 6.8,
    priceBefore: 8,
  },
  {
    key: "3",
    name: "Coca-Cola",
    desc: "Sem açucar 220ml",
    priceAfter: 6.8,
    priceBefore: 8,
  },
  {
    key: "4",
    name: "Coca-Cola",
    desc: "Sem açucar 220ml",
    priceAfter: 6.8,
    priceBefore: 8,
  },
  {
    key: "5",
    name: "Coca-Cola",
    desc: "Sem açucar 220ml",
    priceAfter: 6.8,
    priceBefore: 8,
  },
  {
    key: "6",
    name: "Coca-Cola",
    desc: "Sem açucar 220ml",
    priceAfter: 6.8,
    priceBefore: 8,
  },
  {
    key: "7",
    name: "Coca-Cola",
    desc: "Sem açucar 220ml",
    priceAfter: 6.8,
    priceBefore: 8,
  },
  {
    key: "8",
    name: "Coca-Cola",
    desc: "Sem açucar 220ml",
    priceAfter: 6.8,
    priceBefore: 8,
  },
  {
    key: "9",
    name: "Coca-Cola",
    desc: "Sem açucar 220ml",
    priceAfter: 6.8,
    priceBefore: 8,
  },
  {
    key: "10",
    name: "Coca-Cola",
    desc: "Sem açucar 220ml",
    priceAfter: 6.8,
    priceBefore: 8,
  },
  {
    key: "11",
    name: "Coca-Cola",
    desc: "Sem açucar 220ml",
    priceAfter: 6.8,
    priceBefore: 8,
  },
  {
    key: "12",
    name: "Coca-Cola",
    desc: "Sem açucar 220ml",
    priceAfter: 6.8,
    priceBefore: 8,
  },
  {
    key: "13",
    name: "Coca-Cola",
    desc: "Sem açucar 220ml",
    priceAfter: 6.8,
    priceBefore: 8,
  },
  {
    key: "14",
    name: "Coca-Cola",
    desc: "Sem açucar 220ml",
    priceAfter: 6.8,
    priceBefore: 8,
  },
  {
    key: "15",
    name: "Coca-Cola",
    desc: "Sem açucar 220ml",
    priceAfter: 6.8,
    priceBefore: 8,
  },
  {
    key: "16",
    name: "Coca-Cola",
    desc: "Sem açucar 220ml",
    priceAfter: 6.8,
    priceBefore: 8,
  },
  {
    key: "17",
    name: "Coca-Cola",
    desc: "Sem açucar 220ml",
    priceAfter: 6.8,
    priceBefore: 8,
  },
  {
    key: "18",
    name: "Coca-Cola",
    desc: "Sem açucar 220ml",
    priceAfter: 6.8,
    priceBefore: 8,
  },
  {
    key: "19",
    name: "Coca-Cola",
    desc: "Sem açucar 220ml",
    priceAfter: 6.8,
    priceBefore: 8,
  },
  {
    key: "20",
    name: "Coca-Cola",
    desc: "Sem açucar 220ml",
    priceAfter: 6.8,
    priceBefore: 8,
  },
  {
    key: "21",
    name: "Coca-Cola",
    desc: "Sem açucar 220ml",
    priceAfter: 6.8,
    priceBefore: 8,
  },
];

export const MenuPage: React.FC = (): JSX.Element => {
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
    reset,
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

    if (sizeSelected) {
      id = setTimeout(() => setShowPresence(true), 500);
    } else {
      setShowPresence(false);
    }

    return () => clearTimeout(id);
  }, [sizeSelected]);

  const qntFlavorsMissing = useMemo(() => {
    const totalQnt = flavorsSelected.reduce((p, c) => p + c.qnt, 0);
    return (sizeSelected?.qntFlavors || 0) - totalQnt;
  }, [sizeSelected?.qntFlavors, flavorsSelected]);

  return (
    <main
      className="w-full duration-300 max-w-lg mx-auto relative pb-2 grid grid-rows-[auto_auto_1fr] min-h-0"
      style={{ paddingBottom: showPresence ? "57px" : "8px" }}
    >
      <div className="grid grid-cols-5 items-center gap-x-3 mt-2 px-3">
        <div
          onClick={() => handleTab(0)}
          className="flex flex-col items-center"
        >
          <AspectRatio ratio={1} w={"100%"}>
            <div
              className={clsx(
                "p-1.5 rounded-xl w-full flex justify-center duration-300 items-center cursor-pointer",
                currentTab === 0 && "bg-zinc-200"
              )}
            >
              <img
                src="/img-icons/pizza-img-icon.png"
                className="max-h-[50px] min-h-[40px]"
                alt="pizza"
              />
            </div>
          </AspectRatio>
          {headerOpen && (
            <span
              className={clsx(
                "font-semibold duration-300 text-sm",
                currentTab === 0 ? "text-zinc-900" : "text-zinc-500"
              )}
            >
              Pizzas
            </span>
          )}
        </div>

        <div
          onClick={() => handleTab(1)}
          className="flex flex-col items-center cursor-pointer"
        >
          <AspectRatio ratio={1} w={"100%"}>
            <div
              className={clsx(
                "p-1.5 rounded-xl w-full flex justify-center duration-300 items-center",
                currentTab === 1 && "bg-zinc-200"
              )}
            >
              <img
                src="/img-icons/drinks-img-icon.png"
                className="max-h-[50px]"
                alt="pizza"
              />
            </div>
          </AspectRatio>
          {headerOpen && (
            <span
              className={clsx(
                "font-semibold duration-300  text-sm",
                currentTab === 1 ? "text-zinc-900" : "text-zinc-500"
              )}
            >
              Bebidas
            </span>
          )}
        </div>
      </div>

      <Collapsible.Root
        lazyMount={false}
        unmountOnExit={false}
        open={!currentTab}
      >
        <Collapsible.Content>
          <div className="flex flex-col gap-y-2 mt-1">
            <div className="grid grid-rows-[20px_auto] gap-y-1">
              {sizeSelected && (
                <div className="flex items-center font-semibold gap-x-2 px-3">
                  <span>
                    <span className="text-zinc-500 text-sm">
                      Tamanho selecionado:
                    </span>{" "}
                    {sizeSelected.name}
                  </span>
                  <a
                    className="text-blue-500 cursor-pointer text-sm"
                    onClick={() => setSizeSelected(null)}
                  >
                    {"(Alterar tamanho)"}
                  </a>
                </div>
              )}
              {sizeSelected && !!flavorsSelected.length && (
                <div className="grid grid-cols-[16px_1fr] rounded-sm">
                  <div className="flex flex-col items-center text-sm -space-y-[7px] -translate-y-2 font-medium text-zinc-400">
                    <span>s</span>
                    <span>a</span>
                    <span>b</span>
                    <span>o</span>
                    <span>r</span>
                    <span>e</span>
                    <span>s</span>
                  </div>
                  <Carousel
                    infinite={false}
                    responsive={responsiveSabores}
                    partialVisible
                    arrows={false}
                    itemClass="relative select-none cursor-pointer"
                  >
                    {flavorsSelected.map((flavor, index) => (
                      <div
                        className="first:pr-1 px-1 relative"
                        key={flavor.name}
                      >
                        <div className="flex flex-col p-2 h-[82px] rounded-md border justify-between border-zinc-200">
                          <span className="text-sm font-medium leading-[15px]">
                            {flavor.name}
                          </span>
                          <div className="flex gap-x-1">
                            <span className="bg-white border border-zinc-300 py-1 text-sm w-10 flex items-center justify-center rounded-md">
                              {flavor.qnt}
                            </span>
                            <a
                              onClick={() => {
                                if (qntFlavorsMissing) {
                                  setFlavorsSelected(
                                    flavorsSelected.map((fl) => {
                                      if (fl.name === flavor.name) fl.qnt += 1;
                                      return fl;
                                    })
                                  );
                                }
                              }}
                              className={clsx(
                                "bg-green-200 text-green-600 py-1 text-lg leading-0 w-7 flex items-center justify-center rounded-md",
                                qntFlavorsMissing
                                  ? "hover:bg-green-300 duration-200 cursor-pointer"
                                  : "opacity-50 cursor-not-allowed"
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
                                      (s) => s.name !== flavor.name
                                    )
                                  );
                                } else {
                                  setFlavorsSelected(
                                    flavorsSelected.map((fl) => {
                                      if (fl.name === flavor.name)
                                        fl.qnt = total;
                                      return fl;
                                    })
                                  );
                                }
                              }}
                              className="bg-red-200 hover:bg-red-300 text-red-600 duration-200 py-1 w-7 text-lg leading-0 flex items-center justify-center rounded-md"
                            >
                              -
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Carousel>
                </div>
              )}
              {!sizeSelected && (
                <span className="font-semibold text-center px-3">
                  Escolha o tamanho da pizza
                </span>
              )}
              {!sizeSelected && (
                <Carousel
                  infinite={false}
                  responsive={responsiveTamanhos}
                  partialVisible
                  itemClass="relative select-none cursor-pointer"
                >
                  {tamanhos.map((tamanho) => (
                    <div
                      className="px-1"
                      key={tamanho.name}
                      onClick={() => {
                        setSizeSelected({
                          name: tamanho.name,
                          qntFlavors: tamanho.sabor,
                        });
                        setHeaderOpen(false);
                      }}
                    >
                      <div className="flex flex-col py-1 pb-2 rounded-md items-center bg-zinc-100 border border-zinc-300">
                        <span className="text-center">{tamanho.name}</span>
                        <strong className="text-sm text-center">
                          {formatToBRL(tamanho.price)}
                        </strong>
                        <span className="leading-4 text-sm text-center text-zinc-600">
                          {tamanho.sabor} Sabor
                        </span>
                        <span className="leading-4 text-sm text-center text-zinc-600">
                          {tamanho.fatias} Fatias
                        </span>
                      </div>
                    </div>
                  ))}
                </Carousel>
              )}
            </div>
            {sizeSelected && (
              <>
                {flavorsSelected.length ? (
                  <div className="flex items-center gap-x-1 -mt-4 justify-center">
                    <a
                      onClick={() => reset()}
                      className="cursor-pointer text-red-400  bg-red-200 hover:bg-red-300 hover:text-red-700 text-sm duration-200 font-medium p-2 px-2.5 rounded-full"
                    >
                      Desfazer
                    </a>
                    <a className="cursor-pointer bg-orange-200 text-orange-500 p-2 font-medium px-4 rounded-full text-sm">
                      Adicionar pizza ao carrinho
                    </a>
                  </div>
                ) : (
                  <span className="text-center text-zinc-400">
                    Você pode escolher{" "}
                    <strong className="text-zinc-600">
                      {sizeSelected.qntFlavors > 1
                        ? `até ${sizeSelected.qntFlavors} sabores`
                        : `${sizeSelected.qntFlavors} sabor`}
                    </strong>
                  </span>
                )}
              </>
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
        className="mt-2"
      >
        <GridWithShadows
          listClassName="grid w-full sm:grid-cols-4 grid-cols-3"
          items={mockdata}
          renderItem={(item) => {
            const selected = !!flavorsSelected.find(
              (f) => f.name === item.name
            );
            return (
              <div className="p-0.5 w-full">
                <article
                  key={item.name}
                  className="cursor-pointer rounded-xl duration-200 p-0.5 pb-2 h-full flex flex-col select-none items-center w-full relative"
                  style={{ ...(selected && { background: "#edd7be" }) }}
                  onClick={() => {
                    if (sizeSelected) {
                      if (sizeSelected.qntFlavors > 1) {
                        if (qntFlavorsMissing) {
                          const exist = flavorsSelected.some(
                            (s) => s.name === item.name
                          );
                          if (exist) {
                            removeFlavor(item.name);
                          } else {
                            addFlavor({ name: item.name, qnt: 1 });
                          }
                        } else {
                          const exist = flavorsSelected.some(
                            (s) => s.name === item.name
                          );
                          if (exist) {
                            removeFlavor(item.name);
                          } else {
                            onOpen({
                              content: (
                                <ModalViewSabor
                                  close={close}
                                  name={item.name}
                                  desc={item.desc}
                                />
                              ),
                            });
                          }
                        }
                      } else {
                        setFlavorsSelected([{ name: item.name, qnt: 1 }]);
                      }
                    } else {
                      onOpen({
                        content: (
                          <ModalSelecionarTamanho
                            close={() => {
                              close();
                              addFlavor({ name: item.name, qnt: 1 });
                              setHeaderOpen(false);
                            }}
                            sizes={tamanhos}
                          />
                        ),
                      });
                    }
                    // if (selected) {
                    // } else {
                    // }
                  }}
                >
                  <span
                    className={clsx(
                      "bg-[#e7aa64] h-5 z-10 w-5 rounded-full border-2 absolute top-1.5 left-1.5 duration-200",
                      selected ? "opacity-100 border-white" : "opacity-0"
                    )}
                  />
                  <AspectRatio ratio={1 / 1} w={"100%"}>
                    <img
                      src="/pizza-img.png"
                      alt=""
                      className="p-1 pointer-events-none"
                      draggable={false}
                    />
                  </AspectRatio>
                  <div className="-mt-3 h-[72px]">
                    <span className="line-clamp-2 text-sm font-medium text-center">
                      {item.name}
                    </span>
                    <span className="line-clamp-2 overflow-hidden text-xs text-center font-light">
                      {item.desc}
                    </span>
                  </div>
                </article>
              </div>
            );
          }}
        />
        <GridWithShadows
          listClassName="grid w-full sm:grid-cols-4 grid-cols-3"
          items={mockbebidasdata}
          renderItem={(item) => {
            // const selected = selecteds.includes(file.id);
            return (
              <article
                key={item.name}
                className="cursor-pointer p-0.5 pb-2 h-full flex flex-col select-none items-center w-full"
                // style={{
                //   ...(selected
                //     ? {
                //         borderStyle: "solid",
                //         borderWidth: 2,
                //         borderColor: "#ffffff",
                //       }
                //     : { borderWidth: 2, borderColor: "transparent" }),
                // }}
                onClick={() => {
                  if (sizeSelected) {
                    // onOpen({
                    //   content: <ModalViewSabor close={close} id={1} />,
                    // });
                  } else {
                    // onOpen({
                    //   content: <ModalSelecionarTamanho close={close} id={1} />,
                    // });
                  }
                  // if (selected) {
                  // } else {
                  // }
                }}
              >
                <AspectRatio ratio={1 / 1} w={"100%"}>
                  <img
                    src="/refri-img.png"
                    alt=""
                    className="p-2 pointer-events-none"
                    draggable={false}
                  />
                </AspectRatio>
                <div className="w-full flex flex-col items-end -mt-5 pr-4 mb-1 h-[29px]">
                  <span className="text-zinc-600 line-through text-xs">
                    {formatToBRL(item.priceBefore)}
                  </span>
                  <span className="font-semibold leading-3 text-sm">
                    {formatToBRL(item.priceAfter)}
                  </span>
                </div>
                <div>
                  <span className="line-clamp-2 font-medium text-center">
                    {item.name}
                  </span>
                  <span className="line-clamp-2 overflow-hidden text-xs text-center font-light">
                    {item.desc}
                  </span>
                </div>
              </article>
            );
          }}
        />
      </Carousel>

      <Presence
        animationName={{
          _open: "slide-from-bottom-full, fade-in",
          _closed: "slide-to-bottom-full",
        }}
        animationDuration="moderate"
        present={showPresence}
        position={"fixed"}
        left={0}
        zIndex={1}
        // style={{ boxShadow: "0 -12px 14px #97979752" }}
        className="absolute w-full left-0 bottom-0 bg-white border-t border-t-zinc-300"
      >
        <div className="max-w-lg flex mx-auto justify-between items-center w-full gap-x-1 pt-2 p-6 px-2">
          <div className="flex flex-col -space-y-2">
            <span className="text-zinc-400 font-medium line-through text-sm sm:text-lg">
              {formatToBRL(138)}
            </span>
            <span className="text-xl sm:text-2xl font-bold">
              {formatToBRL(98.3)}
            </span>
          </div>
          <div className="flex gap-x-2">
            <button
              onClick={() => {
                onOpen({
                  content: <ModalCarrinho close={close} id={1} />,
                });
              }}
              className="duration-200 flex gap-x-1 items-center text-sm cursor-pointer border-2 rounded-full border-blue-500 hover:bg-blue-100 text-blue-600 p-2.5 px-3 font-semibold"
            >
              <PiShoppingCartBold size={20} />
              Ver meu carrinho
            </button>
          </div>
        </div>
      </Presence>

      {DialogModal}
    </main>
  );
};
