import { AspectRatio, Collapsible, Presence } from "@chakra-ui/react";
import { LayoutPrivateContext } from "@contexts/layout-private.context";
import clsx from "clsx";
import { JSX, useContext, useEffect, useRef, useState } from "react";
import Carousel, { ResponsiveType } from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import GridWithShadows from "./GridRender";
import { useDialogModal } from "../../hooks/dialog.modal";
import { ModalViewSabor } from "./modals/viewSabor";
import { ModalSelecionarTamanho } from "./modals/SelecionarTamanho";
import { formatToBRL } from "brazilian-values";
import { PiShoppingCartBold } from "react-icons/pi";

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
    items: 3,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 3,
  },
};

const tamanhos = [
  { name: "Pequena", price: "", sabor: 1, fatias: 4 },
  { name: "Média", price: "", sabor: 1, fatias: 4 },
  { name: "Grande", price: "", sabor: 1, fatias: 4 },
  { name: "Familia", price: "", sabor: 1, fatias: 4 },
];

const sabores = [
  { name: "Calabresa c/ catupiry" },
  { name: "Sertaneja c/ catupiry" },
  { name: "Calabresa" },
  { name: "Calabresa" },
  { name: "Calabresa" },
  { name: "Calabresa" },
];

const mockdata = [
  { name: "Baurú", desc: "mussarela, frango, tomate, orégano" },
  { name: "Calabresa", desc: "mussarela, calabresa, orégano" },
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

  const ref = useRef<Carousel>(null);
  const { headerOpen, setHeaderOpen } = useContext(LayoutPrivateContext);
  const [tSelected, setTSelected] = useState<string | null>(null);
  const [currentTag, setCurrentTab] = useState(0);

  function irPara(i: number) {
    ref.current?.goToSlide(i);
  }

  const [showPresence, setShowPresence] = useState(false);

  useEffect(() => {
    let id: NodeJS.Timeout;

    if (tSelected) {
      id = setTimeout(() => setShowPresence(true), 500); // 300 ms
    } else {
      setShowPresence(false); // fecha imediatamente
    }

    return () => clearTimeout(id); // limpeza se o usuário cancelar antes
  }, [tSelected]);

  return (
    <main
      className="w-full duration-300 max-w-lg mx-auto relative pb-2 grid grid-rows-[auto_auto_1fr] min-h-0"
      style={{
        paddingBottom: showPresence ? "80px" : "8px",
      }}
    >
      <div className="grid grid-cols-5 items-center gap-x-3 mt-2 px-3">
        <div onClick={() => irPara(0)} className="flex flex-col items-center">
          <AspectRatio ratio={1 / 1} w={"100%"}>
            <div
              className={clsx(
                "p-1.5 rounded-xl w-full flex justify-center duration-300 items-center cursor-pointer",
                currentTag === 0 && "bg-zinc-200"
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
                currentTag === 0 ? "text-zinc-900" : "text-zinc-500"
              )}
            >
              Pizzas
            </span>
          )}
        </div>

        <div
          onClick={() => irPara(1)}
          className="flex flex-col items-center cursor-pointer"
        >
          <AspectRatio ratio={1 / 1} w={"100%"}>
            <div
              className={clsx(
                "p-1.5 rounded-xl w-full flex justify-center duration-300 items-center",
                currentTag === 1 && "bg-zinc-200"
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
                currentTag === 1 ? "text-zinc-900" : "text-zinc-500"
              )}
            >
              Bebidas
            </span>
          )}
        </div>
      </div>

      <Collapsible.Root open={!currentTag}>
        <Collapsible.Content>
          <div className="flex flex-col gap-y-2 mt-2">
            <div className="grid grid-rows-[20px_auto] gap-y-1">
              {tSelected && (
                <div className="flex items-center font-semibold gap-x-2 px-3">
                  <span>
                    <span className="text-zinc-500 text-sm">
                      Tamanho selecionado:
                    </span>{" "}
                    {tSelected}
                  </span>
                  <a
                    className="text-blue-500 cursor-pointer text-sm"
                    onClick={() => setTSelected(null)}
                  >
                    {"(Alterar tamanho)"}
                  </a>
                </div>
              )}
              {tSelected && (
                <Carousel
                  infinite={false}
                  responsive={responsiveSabores}
                  partialVisible
                  arrows={false}
                  itemClass="relative select-none cursor-pointer mt-4"
                  className=""
                >
                  {sabores.map((tamanho) => (
                    <div
                      className="first:pr-1 px-1 relative"
                      key={tamanho.name}
                    >
                      <a
                        onClick={() => {}}
                        className="cursor-pointer text-red-400  bg-red-200 hover:bg-red-300 hover:text-red-700 absolute text-sm p-0.5 px-2 rounded-full -top-3.5 right-3 duration-200"
                      >
                        Retirar
                      </a>
                      <div className="flex flex-col p-2 h-[95px] rounded-md border justify-between border-zinc-200">
                        <span className="text-sm font-medium">
                          {tamanho.name}
                        </span>
                        <div className="flex gap-x-1">
                          <span className="bg-white border border-zinc-300 py-1 text-sm w-10 flex items-center justify-center rounded-md">
                            1
                          </span>
                          <a className="bg-green-200 py-1 text-lg leading-0 w-8 flex items-center justify-center rounded-md">
                            +
                          </a>
                          <a className="bg-red-200 py-1 w-8 text-lg leading-0 flex items-center justify-center rounded-md">
                            -
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </Carousel>
              )}
              {!tSelected && (
                <span className="font-semibold text-center px-3">
                  Selecione o tamanho da pizza
                </span>
              )}
              {!tSelected && (
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
                        setTSelected(tamanho.name);
                        setHeaderOpen(false);
                      }}
                    >
                      <div className="flex flex-col py-1 pb-2 rounded-md items-center bg-zinc-100 border border-zinc-300">
                        <span className="text-center">{tamanho.name}</span>
                        <strong className="text-sm text-center">
                          R$ 37,99
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
            {tSelected && (
              <div className="flex items-center gap-x-1 justify-center">
                <a
                  onClick={() => setTSelected(null)}
                  className="cursor-pointer text-red-400  bg-red-200 hover:bg-red-300 hover:text-red-700 text-sm duration-200 font-medium p-2 px-2.5 rounded-full"
                >
                  Desfazer
                </a>
                <a className="cursor-pointer bg-orange-200 text-orange-500 p-2 font-medium px-4 rounded-full">
                  Adicionar pizza ao carrinho
                </a>
              </div>
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
          items={mockdata}
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
                  if (tSelected) {
                    onOpen({
                      content: <ModalViewSabor close={close} id={1} />,
                    });
                  } else {
                    onOpen({
                      content: <ModalSelecionarTamanho close={close} id={1} />,
                    });
                  }
                  // if (selected) {
                  // } else {
                  // }
                }}
              >
                <AspectRatio ratio={1 / 1} w={"100%"}>
                  <img
                    src="/pizza-img.png"
                    alt=""
                    className="p-1 pointer-events-none"
                    draggable={false}
                  />
                </AspectRatio>
                <div>
                  <span className="line-clamp-2 text-sm font-medium text-center">
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
        <GridWithShadows
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
                  if (tSelected) {
                    onOpen({
                      content: <ModalViewSabor close={close} id={1} />,
                    });
                  } else {
                    onOpen({
                      content: <ModalSelecionarTamanho close={close} id={1} />,
                    });
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
        className="absolute w-full left-0 bottom-0 bg-white"
      >
        <div className="max-w-lg flex mx-auto justify-between items-center w-full gap-x-1 pt-2 p-7 px-2">
          <div className="flex flex-col">
            <span className="text-zinc-400 font-medium line-through text-sm sm:text-lg">
              {formatToBRL(138)}
            </span>
            <span className="text-xl sm:text-2xl font-bold">
              {formatToBRL(98.3)}
            </span>
          </div>
          <div className="flex gap-x-2">
            <button className="duration-200 flex gap-x-1 items-center text-sm cursor-pointer border-2 rounded-full border-blue-500 hover:bg-blue-100 text-blue-600 p-2 font-semibold">
              <PiShoppingCartBold size={20} />
              Ver carrinho
            </button>
            <button className="duration-200 cursor-pointer hover:bg-[#bedeaf] bg-[#c0eaac] rounded-full text-green-700 p-2 px-3 font-semibold">
              Fazer pedido
            </button>
          </div>
        </div>
      </Presence>

      {DialogModal}
    </main>
  );
};
