import { Presence } from "@chakra-ui/react";
import { CartContext } from "@contexts/cart.context";
import { formatToBRL } from "brazilian-values";
import { memo, useContext, useMemo } from "react";
import { PiShoppingCartBold } from "react-icons/pi";

interface IProps {
  onClick(): void;
  showPresence: boolean;
}

export function _PreviewCartComponent(props: IProps) {
  const { items } = useContext(CartContext);
  const totalValues = useMemo(() => {
    if (!items.length) return { after: 0, before: 0 };
    return items.reduce(
      (prev, curr) => {
        prev.after += curr.priceAfter || 0;
        prev.before += curr.priceBefore || 0;
        return prev;
      },
      { after: 0, before: 0 }
    );
  }, [items]);

  return (
    <Presence
      animationName={{
        _open: "slide-from-bottom-full, fade-in",
        _closed: "slide-to-bottom-full",
      }}
      animationDuration="moderate"
      present={props.showPresence}
      position={"fixed"}
      left={0}
      zIndex={1}
      style={{ boxShadow: "0 -12px 14px #a2a2a22e" }}
      className="absolute w-full left-0 bottom-0 bg-white border-t border-t-zinc-300"
    >
      <div className="max-w-lg flex mx-auto justify-between items-center w-full gap-x-1 pt-2 p-6 px-2">
        <div className="flex flex-col -space-y-2 h-[53px]">
          {totalValues.before > 0 && (
            <span className="text-zinc-400 font-medium line-through text-sm sm:text-lg">
              {formatToBRL(totalValues.before)}
            </span>
          )}
          <span className="text-xl sm:text-2xl text-red-600 font-bold">
            {formatToBRL(totalValues.after)}
          </span>
        </div>
        <div className="flex gap-x-2">
          <button
            onClick={props.onClick}
            className="duration-200 flex gap-x-1 items-center text-sm cursor-pointer border-2 rounded-full border-red-600 hover:bg-blue-100 text-red-600 p-2.5 px-3 font-semibold"
          >
            <PiShoppingCartBold size={20} />
            Ver meu carrinho
          </button>
        </div>
      </div>
    </Presence>
  );
}

export const PreviewCartComponent = memo(
  _PreviewCartComponent,
  (prev, next) => prev.showPresence === next.showPresence
);
