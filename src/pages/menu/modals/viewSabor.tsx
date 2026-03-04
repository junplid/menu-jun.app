import { DialogContent, DialogBody } from "@components/ui/dialog";
import { JSX, useContext, useMemo } from "react";
import clsx from "clsx";
import { usePizzaStore } from "../../../store/useStore";
import { DataMenuContext } from "@contexts/data-menu.context";

interface IProps {
  name: string;
  desc?: string;
  uuid: string;
  close: () => void;
}

export const ModalViewSabor: React.FC<IProps> = (props): JSX.Element => {
  const { bg_primary, sizes, items } = useContext(DataMenuContext);
  const { sizeSelected, flavorsSelected, setFlavorsSelected } = usePizzaStore();

  const qntFlavorsMissing = useMemo(() => {
    const totalQnt = flavorsSelected.reduce((p, c) => p + c.qnt, 0);
    const totalFlavorsSize =
      sizes.find((s) => s.uuid === sizeSelected)?.flavors || 0;
    return totalFlavorsSize - totalQnt;
  }, [sizeSelected, flavorsSelected]);

  return (
    <DialogContent backdrop w={"320px"}>
      <DialogBody px={4} className="flex my-4 flex-col gap-y-2">
        <div className="flex flex-col">
          <span className="text-center text-zinc-400">
            Escolha um sabor para substituir por{" "}
            <strong className="text-neutral-600">{props.name}</strong>
          </span>
          <div className="grid grid-cols-2 gap-2 mt-5">
            {flavorsSelected.map((flavor) => (
              <div
                key={flavor.uuid}
                className="cursor-pointer"
                onClick={() => {
                  const index = flavorsSelected.findIndex(
                    (s) => s.uuid === flavor.uuid,
                  );
                  const nextFlavors = flavorsSelected.filter(
                    (s) => s.uuid !== flavor.uuid,
                  );
                  nextFlavors.splice(index, 0, { uuid: props.uuid, qnt: 1 });
                  setFlavorsSelected(nextFlavors);
                  props.close();
                }}
              >
                <div
                  className={clsx(
                    "flex items-start p-2 gap-x-1 rounded-md border-2 border-zinc-300 bg-neutral-100 duration-100 active:scale-95 transition-all",
                  )}
                >
                  <span className="py-1 text-sm w-5 items-center flex bg-white justify-center rounded-md">
                    {flavor.qnt}
                  </span>
                  <span
                    className={`text-sm font-medium`}
                    style={{ color: `${bg_primary || "#111111"}` }}
                  >
                    {items.find((s) => s.uuid === flavor.uuid)?.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {!!qntFlavorsMissing && (
          <span className="text-center">
            Ainda pode escolher mais{" "}
            {qntFlavorsMissing > 1
              ? `${qntFlavorsMissing} sabores`
              : `${qntFlavorsMissing} sabor`}{" "}
          </span>
        )}
      </DialogBody>
    </DialogContent>
  );
};
