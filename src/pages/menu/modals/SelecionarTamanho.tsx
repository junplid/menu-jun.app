import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@components/ui/dialog";
import { JSX } from "react";
import { usePizzaStore } from "../../../store/useStore";
import { mocks } from "../mock";
import { formatToBRL } from "brazilian-values";

interface IProps {
  close: (sizeQnt: number) => void;
}

export const ModalSelecionarTamanho: React.FC<IProps> = ({
  close,
}): JSX.Element => {
  const { setSizeSelected } = usePizzaStore();

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
            {mocks.sizes.map((size) => (
              <div
                key={size.name}
                className="bg-orange-200/40 shadow-md flex cursor-pointer duration-200 flex-col py-1 pb-2 rounded-md items-center"
                onClick={() => {
                  setSizeSelected({ name: size.name, qntFlavors: size.sabor });
                  close(size.sabor);
                }}
              >
                <strong className="text-center text-red-700">
                  {size.name}
                </strong>
                <strong className="text-sm text-center text-zinc-500">
                  {formatToBRL(size.price)}
                </strong>
                <span className="leading-4 text-sm text-center text-zinc-500">
                  {size.sabor > 1 ? `${size.sabor} sabores` : "1 sabor"}
                </span>
                <span className="leading-4 text-sm text-center text-zinc-500">
                  {size.fatias > 1 ? `${size.fatias} fatias` : "1 fatia"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </DialogBody>
    </DialogContent>
  );
};
