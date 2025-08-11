import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
} from "@components/ui/dialog";
import {
  JSX,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AspectRatio, Button, Input, SegmentGroup } from "@chakra-ui/react";
import { formatToBRL } from "brazilian-values";
import GridWithShadows from "../GridRender";
import { Field } from "@components/ui/field";
import { useHookFormMask } from "use-mask-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useAddressStore,
  Fields,
  FormSchema,
} from "../../../hooks/addressStore";
import { CartContext } from "@contexts/cart.context";
import clsx from "clsx";
import { DataMenuContext } from "@contexts/data-menu.context";
import { createOrder } from "../../../services/api/MenuOnline";
import { AxiosError } from "axios";
import { ErrorResponse_I } from "../../../services/api/ErrorResponse";
import { toaster } from "@components/ui/toaster";

interface IProps {
  close: () => void;
  onReturnEdit(props: {
    uuid: string;
    flavors: { qnt: number; uuid: string }[];
  }): void;
}

const payment_methods = [
  { label: "PIX", value: "PIX" },
  { label: "Dinheiro", value: "Dinheiro" },
  {
    label: "Cartão",
    value: "Cartão",
  },
];

function FormAddress(props: {
  submit: () => void;
  upsertAddress: (data: Fields) => void;
  address: Fields | null;
}) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<Fields>({
    resolver: zodResolver(FormSchema),
  });

  const registerWithMask = useHookFormMask(register);

  const handleAddress = async (fields: Fields) => {
    props.upsertAddress(fields);
    reset();
    props.submit();
  };

  useEffect(() => {
    if (props.address) reset(props.address);
    return () => {
      reset({});
    };
  }, [props.address]);

  return (
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
            {...registerWithMask("cep", "99999-999")}
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
  );
}

function Body(props: IProps) {
  const {
    bg_primary,
    sizes,
    items: itemsData,
    bg_secondary,
  } = useContext(DataMenuContext);
  const { address, upsertAddress } = useAddressStore();
  const [isAddress, setIsAddress] = useState(false);

  const { items, incrementQnt, removeItem, payment_method, setPaymentMethod } =
    useContext(CartContext);

  useEffect(() => {
    return () => {
      setIsAddress(false);
    };
  }, []);

  return (
    <DialogBody px={4} className="flex flex-col gap-y-2 -my-4 h-full -mt-6">
      {!isAddress && (
        <div className="relative h-full">
          <GridWithShadows
            listClassName="grid w-full grid-cols-1 !relative justify-start"
            items={items}
            renderItem={(item) => {
              const size = sizes.find((s) => s.uuid === item.uuid);
              const price = { after: 0, before: 0 };

              if (item.type === "drink") {
                const get = itemsData.find((s) => s.uuid === item.uuid);
                price.before = get?.beforePrice || 0;
                price.after = get?.afterPrice || 0;
              } else {
                const get = sizes.find((s) => s.uuid === item.uuid);
                price.after = get?.price || 0;
              }

              return (
                <div className={clsx("py-1")}>
                  <article
                    key={item.key}
                    className="w-full grid p-2 pr-0 grid-cols-[1fr_60px] min-[450px]:grid-cols-[1fr_minmax(50px,80px)] items-start"
                    onClick={() => {}}
                  >
                    <div>
                      {item.type === "pizza" && (
                        <div className="flex flex-col items-baseline">
                          <div className="relative">
                            <span
                              className={`font-medium text-lg`}
                              style={{ color: `${bg_primary || "#111111"}` }}
                            >
                              Pizza tamanho {size?.name || ""}
                            </span>
                            {!!size?.flavors && (
                              <span className="absolute -right-4 -top-3 font-semibold text-black/40">
                                {size.flavors > 1
                                  ? `Até ${size.flavors} sabores`
                                  : "1 sabor"}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col -mt-1.5">
                            <ul className="list-disc ml-5 -space-y-1.5 text-zinc-600">
                              {item.flavors.map((f) => {
                                const flavor = itemsData.find(
                                  (d) => d.uuid === f.uuid
                                );
                                return (
                                  <li key={f.uuid}>
                                    {f.qnt} {flavor?.name}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      )}
                      {item.type === "drink" && (
                        <div className="flex flex-col">
                          <span
                            className={`font-medium text-lg`}
                            style={{ color: `${bg_primary || "#111111"}` }}
                          >
                            {itemsData.find((i) => i.uuid === item.uuid)?.name}
                          </span>
                          <span className="block -mt-1.5 text-zinc-600">
                            {itemsData.find((i) => i.uuid === item.uuid)?.desc}
                          </span>
                        </div>
                      )}
                      <div className="flex gap-x-1 mt-1 -ml-2">
                        <span className="bg-white border border-zinc-300 py-1 text-sm w-10 flex items-center justify-center rounded-md">
                          {item.qnt}
                        </span>
                        <a
                          onClick={() => incrementQnt(item.key, +1)}
                          className={
                            "bg-green-200 text-green-600 hover:bg-green-300 duration-200 cursor-pointer py-1 text-lg leading-0 w-7 flex items-center justify-center rounded-md"
                          }
                        >
                          +
                        </a>
                        <a
                          onClick={() => incrementQnt(item.key, -1)}
                          className="bg-red-200 hover:bg-red-300 cursor-pointer text-red-600 duration-200 py-1 w-7 text-lg leading-0 flex items-center justify-center rounded-md"
                        >
                          -
                        </a>
                        {item.type === "pizza" && (
                          <a
                            onClick={async () => {
                              props.onReturnEdit({
                                flavors: item.flavors,
                                uuid: item.uuid,
                              });
                              await new Promise((s) => setTimeout(s, 120));
                              removeItem(item.key);
                              props.close();
                            }}
                            className="bg-blue-200 hover:bg-blue-300 cursor-pointer text-blue-600 duration-200 py-1 px-3 leading-0 flex items-center justify-center rounded-md"
                          >
                            Editar
                          </a>
                        )}
                        <div className="flex flex-col justify-end -space-y-1.5 ml-0.5">
                          {(price.before || 0) > 0 && (
                            <span className="text-zinc-400 font-medium line-through text-sm">
                              {formatToBRL(price.before! * item.qnt)}
                            </span>
                          )}
                          <span
                            className={`font-semibold text-[17px]`}
                            style={{ color: `${bg_primary || "#111111"}` }}
                          >
                            {formatToBRL(price.after * item.qnt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <AspectRatio ratio={1 / 1} w={"100%"}>
                      <img
                        src={
                          item.type === "pizza"
                            ? "/pizza-img.png"
                            : itemsData.find((i) => i.uuid === item.uuid)?.img
                        }
                        alt=""
                        className="p-1 pointer-events-none"
                        draggable={false}
                      />
                    </AspectRatio>
                  </article>
                </div>
              );
            }}
          />
        </div>
      )}

      {address && !isAddress && (
        <div className="flex items-center justify-between mb-1">
          <div className="flex flex-col w-full">
            <span className="font-semibold">Endereço de entrega</span>
            <div className="flex flex-col">
              <span>
                {address.address} | {address.cep}
              </span>
              <span>
                {address.complement} - Recebedor: {address.persona}
              </span>
            </div>
          </div>
          <a
            className="p-2 px-3 bg-blue-200 hover:bg-blue-300 cursor-pointer text-blue-600 duration-200 rounded-md border border-blue-300"
            onClick={() => setIsAddress(true)}
          >
            Editar endereço
          </a>
        </div>
      )}
      {!address && !isAddress && (
        <a
          className="p-2 px-3 border text-center border-zinc-200"
          onClick={() => setIsAddress(true)}
        >
          Adicionar endereço de entrega
        </a>
      )}
      {isAddress && (
        <FormAddress
          address={address}
          upsertAddress={upsertAddress}
          submit={() => setIsAddress(false)}
        />
      )}

      {!isAddress && (
        <div className="font-medium -mt-1">
          {/* <span className="block text-end pr-[60px] text-sm font-semibold">
            Cartão
          </span> */}

          <SegmentGroup.Root
            bg={"#f7f7f7"}
            className="w-full py-2 px-2"
            value={payment_method}
            onValueChange={(v) => setPaymentMethod(v.value || "PIX")}
          >
            <SegmentGroup.Indicator className="py-2" bg={"#d4d4d4"} />
            <SegmentGroup.Items className="w-full" items={payment_methods} />
          </SegmentGroup.Root>

          <span className="text-center block font-medium text-zinc-600">
            Forma de pagamento
          </span>
        </div>
      )}
    </DialogBody>
  );
}

export const ModalCarrinho: React.FC<IProps> = (props): JSX.Element => {
  const {
    bg_primary,
    items: itemsData,
    sizes,
    uuid,
  } = useContext(DataMenuContext);
  const { items, payment_method } = useContext(CartContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { address } = useAddressStore();

  const totalValues = useMemo(() => {
    if (!items.length) return { after: 0, before: 0 };
    return items.reduce(
      (prev, curr) => {
        if (curr.type === "pizza") {
          const { price } = sizes.find((d) => d.uuid === curr.uuid) || {};
          prev.after += price || 0;
        } else {
          const { afterPrice, beforePrice } =
            itemsData.find((d) => d.uuid === curr.uuid) || {};
          prev.after += afterPrice || 0;
          prev.before += beforePrice || 0;
        }
        return prev;
      },
      { after: 0, before: 0 }
    );
  }, [items]);

  const create = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      await createOrder({
        uuid: uuid,
        items: items.map((item) => {
          if (item.type === "drink") {
            return {
              id: item.uuid,
              type: item.type,
              qnt: item.qnt,
            };
          } else {
            return {
              id: item.uuid,
              type: item.type,
              qnt: item.qnt,
              flavors: item.flavors.map((f) => ({ qnt: f.qnt, id: f.uuid })),
              obs: item.obs,
            };
          }
        }),
        delivery_address: address?.address,
        delivery_cep: address?.cep,
        delivery_complement: address?.complement,
        who_receives: address?.persona,
        payment_method,
      });

      // resetCart();
      // fazer o redirect para a pagina do whatsapp com o codigo do pedido. no whatsapp terá uma ia pronta já sabendo do pedido do cliente;w
      setIsLoading(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        setIsError(true);
        setIsLoading(false);
        if (error.response?.status === 400) {
          const dataError = error.response?.data as ErrorResponse_I;
          if (dataError.toast.length) dataError.toast.forEach(toaster.create);
        }
      }
    }
  }, [items, itemsData, address, payment_method]);

  return (
    <DialogContent backdrop w={"100%"} className="!h-[calc(100svh-100px)]">
      <DialogHeader
        zIndex={9}
        position={"relative"}
        p={4}
        flexDirection={"column"}
        gap={0}
      >
        <DialogTitle className="text-black/70">Meu carrinho</DialogTitle>
        <DialogCloseTrigger color={"red"} />
      </DialogHeader>
      <Body {...props} />
      <DialogFooter justifyContent={"space-between"} p={4} pt={0.5} gap={2}>
        <div className="flex flex-col -space-y-1.5">
          {totalValues.before > 0 && (
            <span className="text-zinc-400 font-medium line-through text-sm sm:text-lg">
              {formatToBRL(totalValues.before)}
            </span>
          )}
          <div className="flex items-center gap-x-2">
            <span>Valor a pagar:</span>
            <span
              className={`text-xl font-bold`}
              style={{ color: `${bg_primary || "#111111"}` }}
            >
              {formatToBRL(totalValues.after)}
            </span>
          </div>
        </div>
        <Button
          colorPalette={"green"}
          color={"green"}
          bg={"#b3e793"}
          rounded={"full"}
          loading={isLoading}
          onClick={() => create()}
        >
          Fazer pedido
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
