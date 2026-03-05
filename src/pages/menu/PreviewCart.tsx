import { Circle, Float, Presence } from "@chakra-ui/react";
import { CartContext } from "@contexts/cart.context";
import { DataMenuContext } from "@contexts/data-menu.context";
import { formatToBRL } from "brazilian-values";
import { memo, useContext, useMemo } from "react";
import { HiOutlineShoppingBag } from "react-icons/hi";

interface IProps {
  onClick(): void;
  showPresence: boolean;
}

function PreviewCartComponent_(props: IProps) {
  const { bg_primary, items: dataItems, sizes } = useContext(DataMenuContext);
  const { items } = useContext(CartContext);
  const totalValues = useMemo(() => {
    if (!items.length) return { after: 0, before: 0 };

    return items.reduce(
      (prev, curr) => {
        if (curr.type === "pizza") {
          const { price } = sizes.find((d) => d.uuid === curr.uuid) || {};
          prev.after += price || 0;
        } else {
          const { afterPrice, beforePrice } =
            dataItems.find((d) => d.uuid === curr.uuid) || {};
          prev.after += afterPrice || 0;
          prev.before += beforePrice || 0;
        }
        return prev;
      },
      { after: 0, before: 0 },
    );
  }, [items, sizes]);

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
      <div
        onClick={props.onClick}
        className="max-w-lg active:scale-95 border-t border-neutral-200 transition-all flex mx-auto justify-between items-center w-full gap-x-1 pt-2 p-6 px-2"
      >
        <div className="relative">
          <Float placement={"bottom-end"}>
            <Circle
              size="5"
              fontSize={"12px"}
              fontWeight={"medium"}
              bg="black"
              color="white"
            >
              {items.length}
            </Circle>
          </Float>
          <HiOutlineShoppingBag size={30} />
        </div>

        <span className="ml-3 font-medium">Ver sacola</span>

        <div className="flex flex-col items-end -space-y-2 h-13.25">
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
      </div>
    </Presence>
  );
}

export const PreviewCartComponent = memo(
  PreviewCartComponent_,
  (prev, next) => prev.showPresence === next.showPresence,
);
