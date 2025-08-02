import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@components/ui/dialog";
import { JSX, useContext } from "react";
import { usePizzaStore } from "../../../store/useStore";
import { formatToBRL } from "brazilian-values";
import { DataMenuContext } from "@contexts/data-menu.context";

interface IProps {
  close: (sizeQnt: number) => void;
}

export const ModalSelecionarTamanho: React.FC<IProps> = ({
  close,
}): JSX.Element => {
  const { bg_primary } = useContext(DataMenuContext);
  const { setSizeSelected } = usePizzaStore();
  const { sizes } = useContext(DataMenuContext);

  return (
    <DialogContent backdrop w={"320px"}>
      <DialogHeader p={4} pb={2} flexDirection={"column"} gap={0}>
        <DialogTitle className="text-center text-black/70">
          Escolha o tamanho da pizza
        </DialogTitle>
      </DialogHeader>
      <DialogBody px={4} className="flex flex-col gap-y-2 -mt-6">
        <div className="flex flex-col">
          <div className="grid grid-cols-2 gap-3 mt-5">
            {sizes.map((size) => (
              <div
                key={size.id}
                className={`shadow-md flex cursor-pointer duration-200 flex-col py-1 pb-2 rounded-md items-center`}
                onClick={() => {
                  setSizeSelected({
                    name: size.name,
                    qntFlavors: size.flavors,
                  });
                  close(size.flavors);
                }}
                style={{ background: `${bg_primary || "#111111"}10` }}
              >
                <strong
                  className={`text-center`}
                  style={{ color: `${bg_primary || "#111111"}` }}
                >
                  {size.name}
                </strong>
                <strong className="text-sm text-center text-zinc-500">
                  {formatToBRL(size.price)}
                </strong>
                <span className="leading-4 text-sm text-center text-zinc-700">
                  {size.flavors > 1 ? `${size.flavors} sabores` : "1 sabor"}
                </span>
                {size.slices && (
                  <span className="leading-4 text-sm text-center text-zinc-500">
                    {size.slices > 1 ? `${size.slices} fatias` : "1 fatia"}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogBody>
    </DialogContent>
  );
};
