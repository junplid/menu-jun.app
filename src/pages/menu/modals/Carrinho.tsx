import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@components/ui/dialog";
import { JSX } from "react";
import { Button, SegmentGroup } from "@chakra-ui/react";
import { formatToBRL } from "brazilian-values";
import GridWithShadows from "../GridRender";

interface IProps {
  id: number;
  close: () => void;
}

const mockdata = [
  { name: "Baurú", desc: "mussarela, frango, tomate, orégano" },
  { name: "Calabresa", desc: "mussarela, calabresa, orégano" },
  { name: "Catupiry", desc: "mussarela, catupiry, orégano" },
  { name: "Cheddar", desc: "mussarela, cheddar, orégano" },
  { name: "Dois queijos", desc: "mussarela, provolone, orégano" },
  { name: "Frango", desc: "mussarela, frango, catupiry, orégano" },
  { name: "Mussarela", desc: "molho especial, orégano" },
  { name: "Marguerita", desc: "mussarela, tomate, majericão, orégano" },
  { name: "Milho verde", desc: "mussarela, milho, orégano" },
  { name: "Napolitana", desc: "mussarela, molho, tomate, orégano" },
  { name: "Palmito", desc: "mussarela, palmito, orégano" },
  { name: "Presunto", desc: "mussarela, presunto, orégano" },
  { name: "Portuguesa", desc: "mussarela, presunto, ovos, cebola, orégano" },
  {
    name: "Quatro Queijos",
    desc: "mussarela, provolone, gorgonzola, catupiry, orégano",
  },
  { name: "Siciliana", desc: "mussarela, calabresa, cebola, orégano" },
  { name: "Três Queijos", desc: "mussarela, provolone, catupiry, orégano" },
  {
    name: "Vegetariana",
    desc: "mussarela, ervilha, milho, cebola, tomate, pimentão, azeitonas, orégano",
  },
  { name: "Alemão", desc: "mussarela, frango, bacon, ervilha orégano" },
];

export const ModalCarrinho: React.FC<IProps> = (): JSX.Element => {
  return (
    <DialogContent backdrop w={"100%"} className="!h-[calc(100svh-100px)]">
      <DialogHeader p={4} flexDirection={"column"} gap={0}>
        <DialogTitle>Meu carrinho</DialogTitle>
      </DialogHeader>
      <DialogBody px={4} className="flex flex-col gap-y-2 -my-4 h-full -mt-6">
        <div className="relative h-full">
          <GridWithShadows
            listClassName="grid w-full grid-cols-1 !relative h-full"
            items={mockdata}
            renderItem={(item) => {
              return (
                <div className="py-1">
                  <article
                    key={item.name}
                    className="bg-red-300 w-full"
                    onClick={() => {}}
                  >
                    {/* <AspectRatio ratio={1 / 1} w={"100%"}>
                  <img
                    src="/pizza-img.png"
                    alt=""
                    className="p-1 pointer-events-none"
                    draggable={false}
                  />
                </AspectRatio> */}
                    <div>
                      <span className="line-clamp-2 text-sm font-medium text-center">
                        {item.name}
                      </span>
                      <span className="line-clamp-2 overflow-hidden text-xs text-center font-light">
                        {item.desc}
                      </span>
                    </div>
                  </article>
                </div>
              );
            }}
          />
        </div>
        <span className="font-medium text-lg">Endereço de entrega</span>
        <div className="font-medium text-lg">
          <span className="text-center block mb-1">Formas de pagamento</span>
          <SegmentGroup.Root
            bg={"#f7f7f7"}
            className="w-full py-2 px-2"
            defaultValue="React"
          >
            <SegmentGroup.Indicator className="py-2" bg={"#d4d4d4"} />
            <SegmentGroup.Items
              className="w-full"
              items={[
                {
                  label: "PIX",
                  value: "pix",
                },
                {
                  label: "Dinheiro",
                  value: "money",
                },
                {
                  label: (
                    <div className="flex flex-col">
                      <span>Cartão</span>
                      <span>credito</span>
                    </div>
                  ),
                  value: "credit_card",
                },
                {
                  label: (
                    <div className="flex flex-col">
                      <span>Cartão</span>
                      <span>debito</span>
                    </div>
                  ),
                  value: "debit_card",
                },
              ]}
            />
          </SegmentGroup.Root>
        </div>
      </DialogBody>
      <DialogFooter justifyContent={"space-between"} p={4} gap={2}>
        <div className="flex flex-col -space-y-1.5">
          <span className="text-zinc-400 font-medium line-through text-sm sm:text-lg">
            {formatToBRL(138)}
          </span>
          <span className="text-xl font-bold">{formatToBRL(98.3)}</span>
        </div>
        <Button
          colorPalette={"green"}
          color={"green"}
          bg={"#b3e793"}
          rounded={"full"}
        >
          Fazer pedido
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
