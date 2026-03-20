import { Circle, Presence } from "@chakra-ui/react";
import { CartContext } from "@contexts/cart.context";
import { DataMenuContext } from "@contexts/data-menu.context";
import { formatToBRL } from "brazilian-values";
import opacity from "hex-color-opacity";
import { memo, useContext, useMemo } from "react";
import { HiOutlineShoppingBag } from "react-icons/hi";

interface IProps {
  onClick(): void;
  showPresence: boolean;
}

function PreviewCartComponent_(props: IProps) {
  const { bg_capa } = useContext(DataMenuContext);
  const { items } = useContext(CartContext);

  const totalValues = useMemo(() => {
    if (!items.length) return 0;

    return items.reduce((prev, curr) => {
      prev += curr.total * curr.qnt;
      return prev;
    }, 0);
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
      <div
        onClick={props.onClick}
        className="max-w-lg border-t border-neutral-200 flex mx-auto justify-between items-center w-full gap-x-1 pt-3 pb-8 px-4"
      >
        <div className="flex items-center">
          <HiOutlineShoppingBag color={opacity(bg_capa || "#111111", 0.9)} size={30} />
          <Circle
            size="5"
            fontSize={"11px"}
            fontWeight={"black"}
            bg={bg_capa || "#fff"}
            color={"#ffff"}
            borderWidth={"1px"}
            borderStyle={"solid"}
            borderColor={opacity(bg_capa || "#111111", 0.4)}
          >
            {items.reduce((prev, curr) => {
              prev = prev + curr.qnt;
              return prev;
            }, 0)}
          </Circle>
        </div>

        <span className="ml-3 text-lg font-light" style={{ color: bg_capa || "#111111" }}>Ver pedido</span>

        <div className="flex flex-col items-end -space-y-2">
          <span
            className={`text-xl sm:text-2xl font-bold`}
            style={{ color: bg_capa || "#111111" }}
          >
            {formatToBRL(totalValues)}
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
