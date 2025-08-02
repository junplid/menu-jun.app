import { Presence } from "@chakra-ui/react";
import { CartContext } from "@contexts/cart.context";
import { DataMenuContext } from "@contexts/data-menu.context";
import { formatToBRL } from "brazilian-values";
import { memo, useContext, useMemo } from "react";
import { PiShoppingCartBold } from "react-icons/pi";

interface IProps {
  onClick(): void;
  showPresence: boolean;
}

function PreviewCartComponent_(props: IProps) {
  const { bg_primary } = useContext(DataMenuContext);
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
      style={{ boxShadow: "0 -12px 14px #bebebe2d" }}
      className="absolute w-full left-0 bottom-0 bg-white"
    >
      <div className="max-w-lg flex mx-auto justify-between items-center w-full gap-x-1 pt-2 p-6 px-2">
        <div className="flex flex-col -space-y-2 h-[53px]">
          {totalValues.before > 0 && (
            <span className="text-zinc-400 font-medium line-through text-sm sm:text-lg">
              {formatToBRL(totalValues.before)}
            </span>
          )}
          <span
            className={`text-xl sm:text-2xl font-bold`}
            style={{ color: `${bg_primary || "#111111"}` }}
          >
            {formatToBRL(totalValues.after)}
          </span>
        </div>
        <div className="flex gap-x-2">
          <button
            onClick={props.onClick}
            className={`duration-200 flex gap-x-1 items-center text-sm cursor-pointer border-2 rounded-full p-2.5 px-3 font-semibold`}
            style={{
              borderColor: `${bg_primary || "#111111"}`,
              color: `${bg_primary || "#111111"}`,
            }}
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
  PreviewCartComponent_,
  (prev, next) => prev.showPresence === next.showPresence
);
