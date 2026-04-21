import { Circle } from "@chakra-ui/react";
import { CartContext } from "@contexts/cart.context";
import { DataMenuContext } from "@contexts/data-menu.context";
import { formatToBRL } from "brazilian-values";
import opacity from "hex-color-opacity";
import { memo, useContext, useMemo } from "react";
import { HiOutlineShoppingBag } from "react-icons/hi";

interface IProps {
  onClick(): void;
}

function PreviewCartComponent_(props: IProps) {
  const { bg_capa } = useContext(DataMenuContext);
  const { items } = useContext(CartContext);

  // Mantive sua lógica exata de valor total
  const totalValues = useMemo(() => {
    if (!items.length) return 0;
    return items.reduce((prev, curr) => {
      prev += curr.total * curr.qnt;
      return prev;
    }, 0);
  }, [items]);

  // Extraí a contagem de itens para o useMemo para ficar mais limpo
  const totalItems = useMemo(() => {
    return items.reduce((prev, curr) => prev + curr.qnt, 0);
  }, [items]);

  return (
    <div
      style={{
        boxShadow: "0 -8px 24px rgba(0,0,0,0.06)",
        // Garante que não vai bugar com a barra de home do iPhone
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
      }}
      // Mudei para fixed e z-50 para garantir que fique sempre por cima de tudo
      className="fixed z-50 w-full left-0 bottom-0 bg-white rounded-t-3xl border-t border-neutral-100"
    >
      <div
        onClick={items.length ? props.onClick : undefined}
        className="max-w-lg mx-auto flex justify-between items-center w-full gap-x-3 pb-2 pt-4 px-5 cursor-pointer active:scale-[0.98] transition-transform duration-200"
      >
        {/* Lado Esquerdo: Ícone com Badge (Notificação) */}
        <div className="flex items-center relative">
          <div className="relative">
            <HiOutlineShoppingBag
              color={opacity(bg_capa || "#111111", 0.95)}
              size={32}
            />
            {totalItems > 0 && (
              <Circle
                size="5"
                fontSize="11px"
                fontWeight="black"
                bg={bg_capa || "#111111"}
                color="#ffffff"
                position="absolute"
                top="-4px"
                right="-6px"
                borderWidth="2px"
                borderStyle="solid"
                borderColor="#ffffff" // Borda branca cria um recorte no ícone de baixo (efeito nativo)
                boxShadow="sm"
              >
                {totalItems}
              </Circle>
            )}
          </div>
        </div>

        {/* Centro: Textos e Subtextos */}
        <div className="flex-1 px-2 flex flex-col justify-center">
          <span
            className="text-[17px] font-semibold leading-tight tracking-tight"
            style={{ color: bg_capa || "#111111" }}
          >
            {items.length ? "Ver pedido" : "Sacola vazia"}
          </span>
          {items.length > 0 && (
            <span className="text-base font-medium text-neutral-400">
              {totalItems}{" "}
              {totalItems === 1 ? "item adicionado" : "itens adicionados"}
            </span>
          )}
        </div>

        {/* Lado Direito: Total */}
        <div className="flex flex-col items-end justify-center">
          {items.length > 0 ? (
            <span
              className="text-xl sm:text-2xl font-bold tracking-tight"
              style={{ color: bg_capa || "#111111" }}
            >
              {formatToBRL(totalValues)}
            </span>
          ) : (
            <span className="text-base font-semibold text-neutral-300">
              {formatToBRL(0)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export const PreviewCartComponent = memo(PreviewCartComponent_);
