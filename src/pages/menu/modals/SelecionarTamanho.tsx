import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@components/ui/dialog";
import { JSX } from "react";

interface IProps {
  id: number;
  close: () => void;
}

const tamanhos = [
  { name: "Pequena", price: "", sabor: 1, fatias: 4 },
  { name: "Média", price: "", sabor: 1, fatias: 4 },
  { name: "Grande", price: "", sabor: 1, fatias: 4 },
  { name: "Familia", price: "", sabor: 1, fatias: 4 },
];

export const ModalSelecionarTamanho: React.FC<IProps> = (): JSX.Element => {
  return (
    <DialogContent backdrop w={"320px"}>
      <DialogHeader p={4} pb={2} flexDirection={"column"} gap={0}>
        <DialogTitle className="text-center">
          Selecione o tamanho da Pizza
        </DialogTitle>
      </DialogHeader>
      <DialogBody px={4} className="flex flex-col gap-y-2 -mt-6">
        <div className="flex flex-col">
          <div className="grid grid-cols-2 gap-3 mt-5">
            {tamanhos.map((tamanho) => (
              <div
                key={tamanho.name}
                className="flex cursor-pointer duration-200 flex-col py-1 pb-2 rounded-md items-center hover:bg-zinc-200 border border-zinc-300"
                onClick={() => {
                  // fechar o modal e selecionar o tamanho e sabor
                }}
              >
                <span className="text-center">{tamanho.name}</span>
                <strong className="text-sm text-center">R$ 37,99</strong>
                <span className="leading-4 text-sm text-center text-zinc-600">
                  {tamanho.sabor} Sabor
                </span>
                <span className="leading-4 text-sm text-center text-zinc-600">
                  {tamanho.fatias} Fatias
                </span>
              </div>
            ))}
          </div>
        </div>
      </DialogBody>
    </DialogContent>
  );
};
