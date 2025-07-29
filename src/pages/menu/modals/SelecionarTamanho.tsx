import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@components/ui/dialog";
import { JSX } from "react";
import { usePizzaStore } from "../../../store/useStore";
import { mocks } from "../mock";

interface IProps {
  close: () => void;
}

export const ModalSelecionarTamanho: React.FC<IProps> = ({
  close,
}): JSX.Element => {
  const { setSizeSelected } = usePizzaStore();

  return (
    <DialogContent backdrop w={"320px"}>
      <DialogHeader p={4} pb={2} flexDirection={"column"} gap={0}>
        <DialogTitle className="text-center">
          Escolha o tamanho da pizza
        </DialogTitle>
      </DialogHeader>
      <DialogBody px={4} className="flex flex-col gap-y-2 -mt-6">
        <div className="flex flex-col">
          <div className="grid grid-cols-2 gap-3 mt-5">
            {mocks.sizes.map((size) => (
              <div
                key={size.name}
                className="flex cursor-pointer duration-200 flex-col py-1 pb-2 rounded-md items-center hover:bg-zinc-200 border border-zinc-300"
                onClick={() => {
                  setSizeSelected({ name: size.name, qntFlavors: size.sabor });
                  close();
                }}
              >
                <span className="text-center">{size.name}</span>
                <strong className="text-sm text-center">R$ 37,99</strong>
                <span className="leading-4 text-sm text-center text-zinc-600">
                  {size.sabor} Sabor
                </span>
                <span className="leading-4 text-sm text-center text-zinc-600">
                  {size.fatias} Fatias
                </span>
              </div>
            ))}
          </div>
        </div>
      </DialogBody>
    </DialogContent>
  );
};
