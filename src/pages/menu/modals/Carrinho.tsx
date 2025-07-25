import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
} from "@components/ui/dialog";
import { JSX, useState } from "react";
import { Button, Input, SegmentGroup } from "@chakra-ui/react";
import { formatToBRL } from "brazilian-values";
import GridWithShadows from "../GridRender";
import { Field } from "@components/ui/field";
import { withMask } from "use-mask-input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

const FormSchema = z.object({
  address: z.string().min(1),
  cep: z.string().length(9),
  persona: z.string().min(1),
  complement: z.string().optional(),
});

type Fields = z.infer<typeof FormSchema>;

export const ModalCarrinho: React.FC<IProps> = (): JSX.Element => {
  const [isAddress, setIsAddress] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Fields>({
    resolver: zodResolver(FormSchema),
  });

  const handleAddress = (fields: Fields) => {
    console.log(fields);
  };

  return (
    <DialogContent backdrop w={"100%"} className="!h-[calc(100svh-100px)]">
      <DialogHeader
        zIndex={999}
        position={"relative"}
        p={4}
        flexDirection={"column"}
        gap={0}
      >
        <DialogTitle>Meu carrinho</DialogTitle>
      </DialogHeader>
      <DialogBody px={4} className="flex flex-col gap-y-2 -my-4 h-full -mt-6">
        <DialogCloseTrigger />
        {!isAddress && (
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
        )}

        <div className="flex flex-col justify-between mb-2">
          <div className="flex items-center justify-end gap-x-1.5">
            <a
              className="p-2 px-3 border text-center border-zinc-200"
              onClick={() => setIsAddress(false)}
            >
              Vou retirar na loja
            </a>
            {!isAddress && (
              <a
                className="p-2 px-3 border border-zinc-200"
                onClick={() => {
                  setIsAddress(true);
                }}
              >
                Adicionar endereço
              </a>
            )}
          </div>
          {isAddress && (
            <form
              onSubmit={handleSubmit(handleAddress)}
              className="flex flex-col gap-y-1.5"
              style={{ marginTop: 10 }}
            >
              <Field label="Endereço completo" invalid={!!errors.address}>
                <Input
                  {...register("address")}
                  placeholder="Digite o endereço"
                  size={"sm"}
                  autoComplete="off"
                />
              </Field>
              <div className="grid grid-cols-[90px_1fr] justify-between gap-x-1.5 mb-2">
                <Field label=" CEP" invalid={!!errors.cep}>
                  <Input
                    {...register("cep")}
                    ref={withMask("99999-999")}
                    placeholder="00000-000"
                    size={"sm"}
                    autoComplete="off"
                  />
                </Field>
                <Field label="Quem recebe?" invalid={!!errors.persona}>
                  <Input
                    {...register("persona")}
                    placeholder="Digite o nome"
                    size={"sm"}
                    autoComplete="off"
                  />
                </Field>
              </div>
              <Field label="Complemento" invalid={!!errors.complement}>
                <Input
                  size={"sm"}
                  {...register("complement")}
                  placeholder="Ao lado da ..."
                  autoComplete="off"
                />
              </Field>
              <Button type={"submit"} className="mt-4">
                Salvar endereço
              </Button>
            </form>
          )}
        </div>

        {!isAddress && (
          <div className="font-medium">
            <span className="block text-end pr-[60px] text-sm font-semibold">
              Cartão
            </span>

            <SegmentGroup.Root
              bg={"#f7f7f7"}
              className="w-full py-2 px-2"
              defaultValue="pix"
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
                        <span>Credito</span>
                      </div>
                    ),
                    value: "credit_card",
                  },
                  {
                    label: (
                      <div className="flex flex-col">
                        <span>Debito</span>
                      </div>
                    ),
                    value: "debit_card",
                  },
                ]}
              />
            </SegmentGroup.Root>

            <span className="text-center block font-medium text-zinc-600">
              Forma de pagamento
            </span>
          </div>
        )}
      </DialogBody>
      <DialogFooter justifyContent={"space-between"} p={4} pt={0.5} gap={2}>
        <div className="flex flex-col -space-y-1.5">
          <span className="text-zinc-400 font-medium line-through text-sm sm:text-lg">
            {formatToBRL(138)}
          </span>
          <div className="flex items-center gap-x-2">
            <span>Valor total:</span>
            <span className="text-xl font-bold">{formatToBRL(98.3)}</span>
          </div>
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
