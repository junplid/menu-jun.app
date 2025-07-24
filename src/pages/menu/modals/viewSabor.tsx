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
    <DialogContent backdrop w={"290px"}>
      <DialogHeader flexDirection={"column"} gap={0}>
        <DialogTitle>Frango com catupiry</DialogTitle>
      </DialogHeader>
      <DialogBody className="flex flex-col gap-y-2 -my-4 -mt-6">
        <p className="text-black/80">
          Mussarela, ervilha, milho, cebola, tomate, pimentão, azeitonas,
          orégano
        </p>
        <span>Ainda pode escolher mais 2 sabores</span>
      </DialogBody>
      <DialogFooter>
        <Button colorPalette={"green"}>Adicionar sabor</Button>
      </DialogFooter>
    </DialogContent>
  );
};
