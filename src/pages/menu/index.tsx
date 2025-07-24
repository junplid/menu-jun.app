import { AspectRatio } from "@chakra-ui/react";
import { LayoutPrivateContext } from "@contexts/layout-private.context";
import clsx from "clsx";
import { JSX, useContext, useRef, useState } from "react";
import Carousel, { ResponsiveType } from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import GridWithShadows from "./GridRender";

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
  { name: "FamiliaX", price: "", sabor: 1, fatias: 4 },
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
  { name: "Calabresa", desc: "mussarela, orégano" },
  { name: "Catupiry", desc: "mussarela, orégano" },
  { name: "Cheddar", desc: "mussarela" },
  { name: "Dois queijos", desc: "mussarela, provolone, orégano" },
  { name: "Frango", desc: "mussarela, catupiry, orégano" },
  { name: "Mussarela", desc: "molho especial, orégano" },
  { name: "Marguerita", desc: "mussarela, tomate, majericão, orégano" },
  { name: "Milho verde", desc: "mussarela, orégano" },
  { name: "Napolitana", desc: "mussarela, molho, tomate, orégano" },
  { name: "Palmito", desc: "mussarela, orégano" },
  { name: "Presunto", desc: "mussarela, orégano" },
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

export const MenuPage: React.FC = (): JSX.Element => {
  const ref = useRef<Carousel>(null);
  const { setHeaderOpen } = useContext(LayoutPrivateContext);
  const [tSelected, setTSelected] = useState<string | null>(null);
  const [currentTag, setCurrentTab] = useState(0);

  function irPara(i: number) {
    ref.current?.goToSlide(i);
  }

  return (
    <main className="w-full max-w-lg px-3 mx-auto relative pb-2 grid grid-rows-[auto_auto_1fr] min-h-0">
      <div className="grid grid-cols-5 items-center gap-x-3 mt-2">
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
          <span
            className={clsx(
              "font-semibold duration-300 text-sm",
              currentTag === 0 ? "text-zinc-900" : "text-zinc-500"
            )}
          >
            Pizzas
          </span>
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
          <span
            className={clsx(
              "font-semibold duration-300  text-sm",
              currentTag === 1 ? "text-zinc-900" : "text-zinc-500"
            )}
          >
            Bebidas
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-y-2 mt-2">
        <div className="grid grid-rows-[20px_auto] gap-y-2">
          {tSelected && (
            <div className="flex items-center font-semibold gap-x-2">
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
                <div className="first:pr-1 px-1 relative" key={tamanho.name}>
                  <a
                    onClick={() => {}}
                    className="text-red-700 absolute bg-red-300 text-sm p-0.5 px-2 rounded-full -top-3.5 right-3 opacity-65 hover:opacity-100 duration-200"
                  >
                    Retirar
                  </a>
                  <div className="flex flex-col p-2 h-[90px] rounded-md border justify-between border-zinc-200">
                    <span className="text-sm font-medium">{tamanho.name}</span>
                    <div className="flex gap-x-1">
                      <span className="bg-zinc-200 py-1 text-sm w-10 flex items-center justify-center rounded-md">
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
            <span className="font-semibold text-center">
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
                  className="pr-1"
                  key={tamanho.name}
                  onClick={() => {
                    setTSelected(tamanho.name);
                    setHeaderOpen(false);
                  }}
                >
                  <div className="flex flex-col py-1 pb-2 rounded-md items-center bg-zinc-100 border border-zinc-300">
                    <span className="text-center">{tamanho.name}</span>
                    <strong className="text-sm text-center">R$ 37,99</strong>
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
              className="bg-red-300 text-red-600 text-sm opacity-40 font-medium p-2 px-2.5 rounded-full"
            >
              Desfazer
            </a>
            <a className="bg-orange-200 text-orange-500 p-2 font-medium px-4 rounded-full">
              Adicionar pizza ao carrinho
            </a>
          </div>
        )}
      </div>

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
                  // if (selected) {
                  // } else {
                  // }
                }}
              >
                <AspectRatio ratio={1 / 1} w={"100%"}>
                  <img src="/pizza-img.png" alt="" className="p-1" />
                </AspectRatio>

                <div>
                  <span className="line-clamp-2 text-sm font-medium text-center">
                    {item.name}
                  </span>
                  <span className="line-clamp-3 text-xs text-center font-light">
                    {item.desc}
                  </span>
                </div>
              </article>
            );
          }}
        />
        <GridWithShadows
          items={mockdata}
          renderItem={(item) => {
            // const selected = selecteds.includes(file.id);
            return (
              <article
                key={item.name}
                className="cursor-pointer p-1 h-full flex flex-col select-none items-center w-full gap-1"
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
                  // if (selected) {
                  // } else {
                  // }
                }}
              >
                <div
                  style={{
                    // borderColor: selecteds.includes(file.id)
                    //   ? "transparent"
                    //   : "#272727",
                    border: "2px solid transparent",
                  }}
                  className="cursor-pointer bg-blue-300 w-full h-20 overflow-hidden object-center origin-center bg-center flex items-center justify-center rounded-sm"
                ></div>
                <span className="line-clamp-2 text-xs text-center font-light">
                  teste
                </span>
              </article>
            );
          }}
        />
      </Carousel>
    </main>
  );
};
