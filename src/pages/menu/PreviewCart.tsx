import { Circle, Float, Presence } from "@chakra-ui/react";
import { CartContext } from "@contexts/cart.context";
import { formatToBRL } from "brazilian-values";
import { memo, useContext, useMemo } from "react";
import { HiOutlineShoppingBag } from "react-icons/hi";

interface IProps {
  onClick(): void;
  showPresence: boolean;
}

function PreviewCartComponent_(props: IProps) {
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
        className="text-neutral-500 max-w-lg border-t border-neutral-200 flex mx-auto justify-between items-center w-full gap-x-1 pt-3 p-6 px-4"
      >
        <div className="relative">
          <Float offset={1} placement={"bottom-end"}>
            <Circle
              size="5"
              fontSize={"11px"}
              fontWeight={"black"}
              bg="white"
              color="black"
              border={"1px solid #acacac"}
            >
              {items.reduce((prev, curr) => {
                prev = prev + curr.qnt;
                return prev;
              }, 0)}
            </Circle>
          </Float>
          <HiOutlineShoppingBag size={30} />
        </div>

        <span className="ml-3 text-lg text-black font-light">Ver pedido</span>

        <div className="flex flex-col items-end -space-y-2">
          <span
            className={`text-xl sm:text-2xl font-bold`}
          // style={{ color: `${bg_primary || "#111111"}` }}
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
