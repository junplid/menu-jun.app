import {
  DialogContent,
  DialogBody,
  DialogFooter,
  DialogRoot,
} from "@components/ui/dialog";
import { JSX, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  AspectRatio,
  Button,
  Input,
  Presence,
  SegmentGroup,
  Spinner,
} from "@chakra-ui/react";
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
import { AxiosError } from "axios";
import { ErrorResponse_I } from "../../../services/api/ErrorResponse";
import { toaster } from "@components/ui/toaster";
import { BsShop } from "react-icons/bs";
import { MdModeEdit } from "react-icons/md";
import { createOrder } from "../../../services/api/MenuOnline";
import { PiChecksBold, PiMapPin } from "react-icons/pi";
import { useSearchParams } from "react-router-dom";
import { IoLogoWhatsapp } from "react-icons/io";

interface IProps {
  onReturnEdit(props: {
    uuid: string;
    ref: {
      sections: Record<string, Record<string, number>>;
      length: number;
      key: string;
    };
  }): void;
  upsertAddress: (data: Fields | "retirar") => void;
  address:
    | {
        address: string;
        cep: string;
        persona: string;
        complement?: string | undefined;
      }
    | "retirar"
    | null;
}

const PAYMENT_OPTIONS = {
  Pix: { label: "PIX", value: "PIX" },
  Dinheiro: { label: "Dinheiro", value: "Dinheiro" },
  Cartao_Credito: { label: "Crédito", value: "Crédito" },
  Cartao_Debito: { label: "Débito", value: "Débito" },
};

function FormAddress(props: {
  submit: () => void;
  upsertAddress: (data: Fields | "retirar") => void;
  address: Fields | null;
}) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<Fields>({
    resolver: zodResolver(FormSchema),
    defaultValues: props.address || undefined,
  });

  const registerWithMask = useHookFormMask(register);

  const handleAddress = async (fields: Fields) => {
    props.upsertAddress(fields);
    reset();
    props.submit();
  };

  return (
    <form
      onSubmit={handleSubmit(handleAddress)}
      className="flex flex-col gap-y-1.5 px-2"
      style={{ marginTop: 10 }}
    >
      <Field
        label={
          <span>
            Endereço completo <span className="text-red-400">*</span>
          </span>
        }
        errorText={errors.address?.message}
        invalid={!!errors.address}
      >
        <Input
          {...register("address")}
          placeholder="Digite o endereço"
          size={"sm"}
          autoComplete="off"
          bg={"white"}
        />
      </Field>
      <div className="grid grid-cols-[100px_1fr] justify-between gap-x-1.5 mb-2">
        <Field
          label={
            <span>
              CEP <span className="text-red-400">*</span>
            </span>
          }
          invalid={!!errors.cep}
        >
          <Input
            {...registerWithMask("cep", "99999-999")}
            placeholder="00000-000"
            size={"sm"}
            autoComplete="off"
            bg={"white"}
          />
        </Field>
        <Field
          label={
            <span>
              Quem vai receber? <span className="text-red-400">*</span>
            </span>
          }
          invalid={!!errors.persona}
        >
          <Input
            {...register("persona")}
            size={"sm"}
            autoComplete="off"
            bg={"white"}
          />
        </Field>
      </div>
      <div className="-mt-2.5">
        {errors.cep?.message && (
          <span className="block font-medium text-xs text-red-400">
            {errors.cep?.message}
          </span>
        )}
        {errors.persona?.message && (
          <span className="font-medium text-xs block text-red-400">
            {errors.persona?.message}
          </span>
        )}
      </div>
      <Field label="Complemento" invalid={!!errors.complement}>
        <Input
          size={"sm"}
          {...register("complement")}
          placeholder="Ao lado da ..."
          autoComplete="off"
          bg={"white"}
        />
      </Field>
      <div className="grid grid-cols-2 gap-x-2 w-full mt-4">
        <Button
          onClick={() => {
            props.upsertAddress("retirar");
            reset();
            props.submit();
          }}
          type={"button"}
          variant={"outline"}
          className="w-full"
          size={"sm"}
          bg={"white"}
        >
          Retirar na loja
        </Button>
        <Button
          type={"submit"}
          colorPalette={"blackAlpha"}
          className="w-full"
          size={"sm"}
        >
          Salvar endereço
        </Button>
      </div>
    </form>
  );
}

function Body(props: IProps & { isErrorAddress: boolean }) {
  const { bg_primary, items: itemsData, info } = useContext(DataMenuContext);
  const refIsRenderBody = useRef(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const isAddress = searchParams.get("adr");

  const { items, incrementQnt, changeObs, payment_method, setPaymentMethod } =
    useContext(CartContext);

  useEffect(() => {
    if (!refIsRenderBody.current) return;
    if (!items.length && refIsRenderBody.current) {
      setTimeout(() => {
        window.history.back();
      }, 100);
    }
  }, [items.length]);

  const payment_methods_items = (info?.payment_methods || [])
    .map((m) => PAYMENT_OPTIONS[m])
    .filter(Boolean)
    .filter((v, i, arr) => arr.findIndex((s) => s.value === v.value) === i);

  return (
    <DialogBody px={2} className="flex flex-col gap-y-2 -my-4 mt-0 h-full">
      {!isAddress && (
        <div className="relative h-full">
          <GridWithShadows
            grid={false}
            listClassName="flex flex-col w-full !relative justify-start"
            items={items}
            renderItem={(item) => {
              const product = itemsData.find((s) => s.uuid === item.uuid);
              if (!product) return null;

              return (
                <div key={item.key} className={clsx("py-1")}>
                  <article className="w-full gap-x-2 text-base grid rounded-md p-3 border border-neutral-400 bg-white grid-cols-[1fr_50px] min-[450px]:grid-cols-[1fr_minmax(50px,80px)] items-start">
                    <div>
                      <div className="flex flex-col mb-2 items-baseline">
                        <div className="flex flex-col -space-y-0.5">
                          <span
                            className={`font-normal text-lg`}
                            style={{ color: `${bg_primary || "#111111"}` }}
                          >
                            {item.qnt}x {product.name}
                          </span>
                          <div className="flex items-center gap-x-1">
                            {product.beforePrice && (
                              <span className="text-zinc-400 tracking-tight font-medium line-through text-xs">
                                {formatToBRL(product.beforePrice)}
                              </span>
                            )}
                            {product.afterPrice && (
                              <span
                                className={`font-semibold text-[13px]`}
                                style={{ color: `${bg_primary || "#111111"}` }}
                              >
                                {formatToBRL(product.afterPrice)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col w-full">
                          {item.sections && (
                            <ul className="list-disc ml-1 mt-2 text-neutral-600">
                              {Object.entries(item.sections).map(
                                ([sectionUuid, objSub]) => {
                                  if (!objSub) return null;
                                  const section = product.sections.find(
                                    (sec) => sec.uuid === sectionUuid,
                                  );
                                  if (!section) return null;
                                  return (
                                    <li
                                      className="flex flex-col"
                                      key={sectionUuid}
                                    >
                                      <span className="font-normal">
                                        • {section.title}
                                      </span>
                                      <div className="pl-2 -mt-1.5 flex flex-col -space-y-1">
                                        {Object.entries(objSub).map(
                                          ([subUuid, value]) => {
                                            if (!value) return null;
                                            const subItem =
                                              section.subItems.find(
                                                (subitem) =>
                                                  subitem.uuid === subUuid,
                                              );
                                            if (!subItem) return null;

                                            return (
                                              <span
                                                key={subUuid}
                                                className="text-neutral-400 gap-x-2 flex font-light items-center"
                                              >
                                                {subItem.name}{" "}
                                                {value > 1
                                                  ? `(${value})`
                                                  : null}{" "}
                                                <span className="text-[13px] text-neutral-500">
                                                  {subItem.after_additional_price &&
                                                    `+${formatToBRL(
                                                      subItem.after_additional_price *
                                                        value,
                                                    )}`}
                                                </span>
                                              </span>
                                            );
                                          },
                                        )}
                                      </div>
                                    </li>
                                  );
                                },
                              )}
                            </ul>
                          )}
                        </div>
                        <Input
                          value={item.obs}
                          onChange={({ target }) =>
                            changeObs(item.key, target.value)
                          }
                          placeholder="Observações..."
                          size={"sm"}
                          className={"bg-white! mt-1.5"}
                        />
                      </div>

                      <div className="flex gap-x-1 mt-1 ">
                        <span className="bg-white border border-zinc-300 py-1 text-sm w-10 flex items-center justify-center rounded-md">
                          {item.qnt}
                        </span>
                        <a
                          onClick={() => incrementQnt(item.key, +1)}
                          className={
                            "bg-green-200 text-green-600 hover:bg-green-300 cursor-pointer py-1 text-lg leading-0 w-7 flex items-center justify-center rounded-md"
                          }
                        >
                          +
                        </a>
                        <a
                          onClick={() => {
                            incrementQnt(item.key, -1);
                          }}
                          className="bg-red-200 hover:bg-red-300 cursor-pointer text-red-600 py-1 w-7 text-lg leading-0 flex items-center justify-center rounded-md"
                        >
                          -
                        </a>
                        {item.sections && (
                          <a
                            onClick={async () => {
                              props.onReturnEdit({
                                uuid: item.uuid,
                                ref: {
                                  sections: item.sections!,
                                  length: item.qnt,
                                  key: item.key,
                                },
                              });
                            }}
                            className="bg-blue-200 hover:bg-blue-300 cursor-pointer text-blue-500 duration-200 py-1 px-2 leading-0 flex items-center justify-center rounded-md"
                          >
                            <MdModeEdit />
                          </a>
                        )}
                        {(product.afterPrice || product.beforePrice) && (
                          <div className="flex flex-col justify-end -space-y-1.5 ml-1">
                            {/* {product.beforePrice && (
                              <span className="text-zinc-400 font-medium line-through text-sm">
                                {formatToBRL(product.beforePrice! * item.qnt)}
                              </span>
                            )} */}
                            {product.afterPrice && (
                              <span
                                className={`font-semibold text-[17px]`}
                                style={{ color: `${bg_primary || "#111111"}` }}
                              >
                                {formatToBRL(item.total * item.qnt)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <AspectRatio ratio={1 / 1} w={"100%"}>
                      <img
                        src={itemsData.find((i) => i.uuid === item.uuid)?.img}
                        className="p-0 rounded-md pointer-events-none"
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

      {props.address && !isAddress && (
        <div className="flex items-center justify-between mb-1">
          {props.address !== "retirar" && (
            <div
              onClick={() => {
                const next = new URLSearchParams(searchParams);
                next.set("adr", "true");
                setSearchParams(next);
              }}
              className="flex cursor-pointer items-center w-full p-1.5 px-3 gap-x-2 shadow-sm justify-between bg-white rounded-lg"
            >
              <div className="flex flex-col -space-y-0.5 items-baseline">
                <div className="flex w-full gap-x-2 items-center">
                  <PiMapPin size={18} />
                  <span className="text-lg">Endereço de entrega</span>
                </div>
                <span className="text-base font-light leading-5.5 text-neutral-500">
                  {props.address.complement} - Recebedor:{" "}
                  {props.address.persona}
                </span>
              </div>
              <a className="text-blue-300 tracking-wide underline underline-offset-2">
                Editar
              </a>
            </div>
          )}
          {props.address === "retirar" && (
            <div
              onClick={() => {
                const next = new URLSearchParams(searchParams);
                next.set("adr", "true");
                setSearchParams(next);
              }}
              className="flex cursor-pointer items-center w-full p-1.5 px-3 gap-x-2 shadow-sm justify-between bg-white rounded-lg"
            >
              <div className="flex flex-col -space-y-0.5 items-baseline">
                <div className="flex w-full gap-x-2 items-center">
                  <BsShop size={18} />
                  <span className="text-lg">Retirada na loja</span>
                </div>
                <span className="text-base font-light text-neutral-500">
                  {info?.address}
                </span>
              </div>
              <a className="text-blue-300 tracking-wide underline underline-offset-2">
                Editar
              </a>
            </div>
          )}
        </div>
      )}

      {!props.address && !isAddress && (
        <a
          className={clsx(
            "p-3.5 px-3 border text-center ",
            props.isErrorAddress
              ? "animate-error border-red-200 text-white"
              : "bg-white border-zinc-200",
          )}
          onClick={() => {
            const next = new URLSearchParams(searchParams);
            next.set("adr", "true");
            setSearchParams(next);
          }}
        >
          Definir endereço ou Retirada{" "}
          <span
            className={clsx(
              "text-red-400 font-semibold text-lg leading-0",
              props.isErrorAddress ? "text-white" : "text-red-400",
            )}
          >
            *
          </span>
        </a>
      )}
      {isAddress && (
        <FormAddress
          address={props.address !== "retirar" ? props.address : null}
          upsertAddress={props.upsertAddress}
          submit={() => {
            window.history.back();
          }}
        />
      )}

      {!isAddress && (
        <div className="font-medium -mt-1">
          {/* <span className="block text-end pr-[60px] text-sm font-semibold">
            Cartão
          </span> */}

          <SegmentGroup.Root
            bg={"#fdfdfd"}
            className="w-full py-2 px-2 font-light"
            value={payment_method}
            onValueChange={(v) => setPaymentMethod(v.value || "PIX")}
          >
            <SegmentGroup.Indicator className="py-2" bg={"#f4f4f4"} />
            <SegmentGroup.Items
              className="w-full"
              items={payment_methods_items}
            />
          </SegmentGroup.Root>
        </div>
      )}
    </DialogBody>
  );
}

export const ModalCarrinho: React.FC<
  Omit<IProps, "upsertAddress" | "address">
> = (props): JSX.Element => {
  const { bg_primary, uuid, info, status } = useContext(DataMenuContext);
  const { items, payment_method, resetCart } = useContext(CartContext);
  const [isLoading, setIsLoading] = useState(false);
  const [_isError, setIsError] = useState(false);
  const [isErrorAddress, setIsErrorAddress] = useState(false);
  const { address, upsertAddress } = useAddressStore();

  const [redirectTo, setRedirectTo] = useState("");

  const [searchParams, _setSearchParams] = useSearchParams();
  const isOpen = searchParams.get("c");
  const isAddress = searchParams.get("adr");

  const totalValues = useMemo(() => {
    // if (!items.length) return { after: 0, before: 0 };
    // return items.reduce(
    //   (prev, curr) => {
    //     if (curr.type === "pizza") {
    //       const { price } = sizes.find((d) => d.uuid === curr.uuid) || {};
    //       prev.after += price || 0;
    //     } else {
    //       const { afterPrice, beforePrice } =
    //         itemsData.find((d) => d.uuid === curr.uuid) || {};
    //       prev.after += afterPrice || 0;
    //       prev.before += beforePrice || 0;
    //     }
    //     return prev;
    //   },
    //   { after: 0, before: 0 },
    // );
    if (!items.length) return 0;

    return items.reduce((prev, curr) => {
      prev += curr.total * curr.qnt;
      return prev;
    }, 0);
  }, [items]);

  const create = async () => {
    try {
      setIsError(false);
      if (!address) {
        setIsErrorAddress(true);
        setTimeout(() => {
          setIsErrorAddress(false);
          setIsLoading(false);
        }, 1100);
        return;
      }
      setIsLoading(true);
      const data = await createOrder({
        uuid: uuid,
        items: items.map((item) => ({
          uuid: item.uuid,
          qnt: item.qnt,
          obs: item.obs,
          sections: item.sections,
        })),
        ...(address === "retirar"
          ? { type_delivery: "retirar" }
          : {
              type_delivery: "enviar",
              delivery_address: address?.address,
              delivery_cep: address?.cep,
              delivery_complement: address?.complement,
              who_receives: address?.persona,
            }),
        payment_method,
      });

      //  resetCart();
      // setIsLoading(false);
      setRedirectTo(data.redirectTo);
      // window.open(redirectTo, "_blank");
      // fazer o redirect para a pagina do whatsapp com o codigo do pedido. no whatsapp terá uma ia pronta já sabendo do pedido do cliente;w
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
  };

  return (
    <DialogRoot
      defaultOpen={false}
      open={!!isOpen}
      onOpenChange={(change) => {
        if (!change.open) window.history.back();
      }}
      placement={"center"}
      motionPreset={"slide-in-top"}
      lazyMount={false}
      unmountOnExit={false}
    >
      <DialogContent
        bg={"#f3f3f3"}
        w={"500px"}
        className="h-[calc(100svh-30px)]!"
        mx={-2.5}
        px={0}
      >
        {/* <DialogHeader
        zIndex={9}
        position={"relative"}
        p={4}
        flexDirection={"column"}
        gap={0}
        mb={2}
      >
        <DialogTitle className="text-neutral-500 flex gap-x-3 items-center">
          <div className="relative">
            <Float offset={1} placement={"bottom-end"}>
              <Circle
                size="5"
                fontSize={"11px"}
                fontWeight={"black"}
                bg="white"
                color="black"
                border={"1px solid #acacac"}
              >
                {items.reduce((prev, curr) => {
                  prev = prev + curr.qnt;
                  return prev;
                }, 0)}
              </Circle>
            </Float>
            <HiOutlineShoppingBag size={30} />
          </div>

          <span className="font-medium">{titlePage}</span>
        </DialogTitle>
        <DialogCloseTrigger />
      </DialogHeader> */}
        {isLoading && (
          <div className="flex relative flex-col w-full h-full items-center justify-center">
            <Presence
              animationName={{
                _open: "slide-from-bottom, fade-in",
                _closed: "slide-to-top, fade-out",
              }}
              animationDuration="moderate"
              present={!redirectTo}
              className="top-1/5 absolute flex items-center justify-center"
            >
              <div className="flex flex-col gap-y-0.5 items-center">
                <span className="font-light text-lg text-neutral-500">
                  Criando pedido
                </span>
                <Spinner size={"md"} />
              </div>
            </Presence>

            <Presence
              animationName={{
                _open: "slide-from-bottom, fade-in",
                _closed: "slide-to-top, fade-out",
              }}
              animationDuration="moderate"
              present={!!redirectTo}
              lazyMount
              className="flex flex-col w-full items-center justify-center"
            >
              <div className="flex flex-col gap-y-0.5 items-center mb-3">
                <span className="font-semibold text-lg uppercase text-green-600">
                  Pedido criado.
                </span>
                <p className="text-neutral-500 text-center">
                  Para confirmar, envie o código do pedido para o nosso
                  WhatsApp.
                </p>
              </div>
              <Presence
                animationName={{
                  _open: "slide-from-bottom, fade-in",
                  _closed: "slide-to-top, fade-out",
                }}
                animationDuration="moderate"
                present
                className="flex items-center w-full justify-center"
              >
                <div
                  className="w-full max-w-2xs p-4 bg-[#e5ddd5] rounded-lg"
                  style={{ boxShadow: "inset 0px 0px 8px 1px #d7cbbed3" }}
                >
                  <div className="flex justify-end">
                    <div className="relative bg-[#d9fdd3] text-gray-900 px-4 py-2 pb-1 rounded-lg rounded-tr-none max-w-[82%] shadow-sm">
                      <p className="text-sm">
                        {
                          decodeURIComponent(redirectTo).match(
                            /text=(.*)$/,
                          )?.[1]
                        }
                      </p>

                      <div className="text-xs text-gray-500 text-right mt-1 translate-x-2 flex items-center justify-end gap-1">
                        <span>12:41</span>
                        <PiChecksBold size={16} className="text-blue-500" />
                      </div>

                      {/* pontinha do balão */}
                      <span className="absolute -right-1.5 top-0 w-0 h-0 border-b-10 border-l-[6px] border-t-transparent border-b-transparent border-l-[#d9fdd3]" />
                    </div>
                  </div>
                </div>
              </Presence>
              <Button
                color={"#3f8118"}
                bg={"#cdf0b7"}
                onClick={() => {
                  window.open(redirectTo, "_blank");
                  resetCart();
                  setIsLoading(false);
                  setRedirectTo("");
                  window.history.back();
                }}
                size={"lg"}
                fontWeight={"light"}
                className="mt-4 outline-none!"
              >
                <IoLogoWhatsapp />
                Enviar mensagem
              </Button>
            </Presence>
          </div>
        )}
        {!isLoading && (
          <Body
            {...props}
            isErrorAddress={isErrorAddress}
            upsertAddress={upsertAddress}
            address={address}
          />
        )}
        {!isAddress && !isLoading && (
          <DialogFooter justifyContent={"space-between"} p={4} pt={0.5} gap={2}>
            <div className="flex flex-col -space-y-0.5">
              {/* {totalValues.before > 0 && (
              <span className="text-zinc-400 font-medium line-through text-sm sm:text-lg">
                {formatToBRL(totalValues.before)}
              </span>
            )} */}
              {!!info?.delivery_fee &&
                address !== null &&
                address !== "retirar" && (
                  <span className="text-sm text-neutral-500">
                    Taxa de entrega: {formatToBRL(10)}
                  </span>
                )}
              <div className="flex items-center gap-x-1">
                <span className="text-neutral-600">Valor total</span>
                <span
                  className={`text-lg font-bold`}
                  style={{ color: `${bg_primary || "#111111"}` }}
                >
                  {formatToBRL(totalValues + (info?.delivery_fee || 0))}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center -space-y-2">
              <Button
                color={"#3f8118"}
                bg={"#cdf0b7"}
                loading={isLoading}
                // disabled={!status || !items.length}
                onClick={() => create()}
                size={"lg"}
                fontWeight={"light"}
              >
                FAZER PEDIDO
              </Button>
              {!status && (
                <span className="text-red-500 text-[11px] font-semibold z-10 bg-red-200 leading-2 p-1 rounded-sm">
                  Fechado
                </span>
              )}
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </DialogRoot>
  );
};
