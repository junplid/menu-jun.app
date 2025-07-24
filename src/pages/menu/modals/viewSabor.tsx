import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@components/ui/dialog";
import { JSX } from "react";
import { Button } from "@chakra-ui/react";

interface IProps {
  id: number;
  close: () => void;
}

export const ModalViewSabor: React.FC<IProps> = (): JSX.Element => {
  return (
    <DialogContent backdrop w={"320px"}>
      <DialogHeader p={4} flexDirection={"column"} gap={0}>
        <DialogTitle>Frango com catupiry</DialogTitle>
      </DialogHeader>
      <DialogBody px={4} className="flex flex-col gap-y-2 -my-4 -mt-6">
        <p className="text-black/80">
          Mussarela, ervilha, milho, cebola, tomate, pimentão, azeitonas,
          orégano
        </p>
        <div className="flex flex-col">
          <span className="text-center font-medium">
            Sabores atuais da sua pizza
          </span>
          <div className="grid grid-cols-2 gap-2 gap-y-5 mt-5">
            <div className="relative">
              <a
                onClick={() => {}}
                className="cursor-pointer text-red-400 absolute bg-red-200 hover:bg-red-300 hover:text-red-700 text-sm p-0.5 px-2 rounded-full -top-3.5 right-3 duration-200"
              >
                Retirar
              </a>
              <div className="flex flex-col p-2 h-[95px] rounded-md border justify-between border-zinc-400 bg-zinc-200">
                <span className="text-sm font-medium">
                  Calabresa c/ catupiry
                </span>
                <div className="flex gap-x-1">
                  <span className="bg-white border border-zinc-300 py-1 text-sm w-10 flex items-center justify-center rounded-md">
                    1
                  </span>
                  <a className="bg-green-200 py-1 text-lg leading-0 w-8 flex items-center justify-center rounded-md">
                    +
                  </a>
                  <a className="bg-red-200 py-1 w-8 text-lg leading-0 flex items-center justify-center rounded-md">
                    -
                  </a>
                </div>
              </div>
            </div>
            <div className="relative">
              <a
                onClick={() => {}}
                className="cursor-pointer text-red-400 absolute bg-red-200 hover:bg-red-300 hover:text-red-700 text-sm p-0.5 px-2 rounded-full -top-3.5 right-3 duration-200"
              >
                Retirar
              </a>
              <div className="flex flex-col p-2 h-[95px] rounded-md border justify-between border-zinc-200">
                <span className="text-sm font-medium">
                  Calabresa c/ catupiry
                </span>
                <div className="flex gap-x-1">
                  <span className="bg-white border border-zinc-300 py-1 text-sm w-10 flex items-center justify-center rounded-md">
                    1
                  </span>
                  <a className="bg-green-200 py-1 text-lg leading-0 w-8 flex items-center justify-center rounded-md">
                    +
                  </a>
                  <a className="bg-red-200 py-1 w-8 text-lg leading-0 flex items-center justify-center rounded-md">
                    -
                  </a>
                </div>
              </div>
            </div>
            <div className="relative">
              <a
                onClick={() => {}}
                className="cursor-pointer text-red-400 absolute bg-red-200 hover:bg-red-300 hover:text-red-700 text-sm p-0.5 px-2 rounded-full -top-3.5 right-3 duration-200"
              >
                Retirar
              </a>
              <div className="flex flex-col p-2 h-[95px] rounded-md border justify-between border-zinc-200">
                <span className="text-sm font-medium">
                  Calabresa c/ catupiry
                </span>
                <div className="flex gap-x-1">
                  <span className="bg-white border border-zinc-300 py-1 text-sm w-10 flex items-center justify-center rounded-md">
                    1
                  </span>
                  <a className="bg-green-200 py-1 text-lg leading-0 w-8 flex items-center justify-center rounded-md">
                    +
                  </a>
                  <a className="bg-red-200 py-1 w-8 text-lg leading-0 flex items-center justify-center rounded-md">
                    -
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <span className="text-center">Ainda pode escolher mais 2 sabores</span>
      </DialogBody>
      <DialogFooter p={4} gap={2}>
        <Button colorPalette={"teal"}>Substituir</Button>
        <Button colorPalette={"green"} disabled>
          Adicionar sabor
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
