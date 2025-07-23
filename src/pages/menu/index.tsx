import { InViewComponent } from "@components/InView";
import { LayoutPrivateContext } from "@contexts/layout-private.context";
import clsx from "clsx";
import { FC, JSX, useContext, useRef, useState } from "react";
import Carousel, { ResponsiveType } from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

interface PropsShadow {
  onChange?: (isTop: boolean) => void;
}

const ShadowTopMemoComponent: FC<PropsShadow> = ({ onChange }) => {
  const [shadow, setShadow] = useState(false);

  return (
    <>
      <InViewComponent
        onChange={(isTop) => {
          onChange?.(isTop);
          setShadow(isTop);
        }}
      />
      <div
        className={`pointer-events-none absolute left-0 z-30 h-10 w-full`}
        style={{
          background:
            "linear-gradient(rgba(255, 255, 255, 0.797) 0%, rgba(214, 214, 214, 0) 90%)",
          opacity: Number(!shadow),
          top: -2,
        }}
      ></div>
    </>
  );
};

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
    partialVisibilityGutter: 5,
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

export const MenuPage: React.FC = (): JSX.Element => {
  const ref = useRef<Carousel>(null);
  const { headerOpen, setHeaderOpen } = useContext(LayoutPrivateContext);
  const [tSelected, setTSelected] = useState<string | null>(null);

  function irPara(i: number) {
    ref.current?.goToSlide(i); // animação normal
    // ref.current?.goToSlide(i, true); // pula animação e callbacks
  }

  return (
    <main className="w-full max-w-lg mx-auto relative px-3 grid grid-rows-[auto_auto_1fr_100px] min-h-0">
      <div className="flex items-center gap-x-3">
        <span
          onClick={() => {
            irPara(0);
          }}
        >
          Pizzas
        </span>
        <span
          onClick={() => {
            irPara(1);
          }}
        >
          Burgers
        </span>
        <span onClick={() => irPara(2)}>Bebidas</span>
      </div>

      <div className="grid grid-rows-[20px_auto] gap-y-2">
        {tSelected && (
          <div className="flex items-center font-semibold gap-x-2">
            <span>Pizza tamanho: {tSelected}</span>
            <a
              className="text-blue-500 cursor-pointer"
              onClick={() => setTSelected(null)}
            >
              {"(Clique para alterar)"}
            </a>
          </div>
        )}
        {tSelected && (
          <Carousel
            ref={ref}
            infinite={false}
            responsive={responsiveSabores}
            partialVisible
            arrows={false}
            itemClass="relative select-none cursor-pointer"
          >
            {sabores.map((tamanho) => (
              <div className="first:pr-1 px-1" key={tamanho.name}>
                <div className="flex flex-col p-2 h-[90px] rounded-md border justify-between border-zinc-200">
                  <span className="text-sm font-medium">{tamanho.name}</span>
                  <div className="flex gap-x-1">
                    <span className="bg-zinc-200 py-1 text-sm w-12 flex items-center justify-center rounded-md">
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
            ref={ref}
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

      <Carousel
        ref={ref}
        infinite={false}
        arrows={false}
        responsive={responsive}
        itemClass="relative"
      >
        <div
          className={clsx(
            "duration-200 overflow-y-scroll",
            headerOpen ? "h-[200px]" : "h-[300px]"
          )}
        >
          <ShadowTopMemoComponent
            onChange={(isTop) => {
              if (headerOpen && !isTop) setHeaderOpen(false);
            }}
          />
          <div className="bg-red-400 min-h-[100px] w-10 my-1"></div>
          <div className="bg-red-400 min-h-[100px] w-10 my-1"></div>
          <div className="bg-red-400 min-h-[100px] w-10 my-1"></div>
          <div className="bg-red-400 min-h-[100px] w-10 my-1"></div>
          <div className="bg-red-400 min-h-[100px] w-10 my-1"></div>
        </div>

        <div
          className={clsx(
            "overflow-y-scroll duration-200",
            headerOpen ? "h-[200px]" : "h-[300px]"
          )}
        >
          <ShadowTopMemoComponent />
          <div className="bg-blue-400 min-h-[100px] w-10 my-1"></div>
          <div className="bg-blue-400 min-h-[100px] w-10 my-1"></div>
          <div className="bg-blue-400 min-h-[100px] w-10 my-1"></div>
          <div className="bg-blue-400 min-h-[100px] w-10 my-1"></div>
          <div className="bg-blue-400 min-h-[100px] w-10 my-1"></div>
        </div>
        <div
          className={clsx(
            "overflow-y-scroll duration-200",
            headerOpen ? "h-[200px]" : "h-[300px]"
          )}
        >
          <ShadowTopMemoComponent />
          <div className="bg-green-400 min-h-[100px] w-10 my-1"></div>
          <div className="bg-green-400 min-h-[100px] w-10 my-1"></div>
          <div className="bg-green-400 min-h-[100px] w-10 my-1"></div>
          <div className="bg-green-400 min-h-[100px] w-10 my-1"></div>
          <div className="bg-green-400 min-h-[100px] w-10 my-1"></div>
        </div>
      </Carousel>

      <div>as</div>
    </main>
  );
};
