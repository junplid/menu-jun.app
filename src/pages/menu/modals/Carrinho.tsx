import { DialogContent, DialogBody, DialogRoot } from "@components/ui/dialog";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  Collapsible,
  Input,
  Presence,
  Spinner,
} from "@chakra-ui/react";
import { formatToBRL, parseToNumber } from "brazilian-values";
import GridWithShadows from "../GridRender";
import { Field } from "@components/ui/field";
import { useHookFormMask, withMask } from "use-mask-input";
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
import axios, { AxiosError } from "axios";
import { ErrorResponse_I } from "../../../services/api/ErrorResponse";
import { toaster } from "@components/ui/toaster";
import { BsDoorClosed } from "react-icons/bs";
import { MdModeEdit } from "react-icons/md";
import { createOrder } from "../../../services/api/MenuOnline";
import { PiChecksBold } from "react-icons/pi";
import { useSearchParams } from "react-router-dom";
import { IoLogoWhatsapp } from "react-icons/io";
import { isWithinDeliveryArea, MapComponent } from "./map";
import moment from "moment-timezone";

// --- Tipagens e Constantes ---
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
        number?: string;
        cep: string;
        persona: string;
        complement?: string | undefined;
        reference_point: string;
        lat: number;
        lng: number;
      }
    | "retirar"
    | null;
}

const PAYMENT_OPTIONS: Record<string, { label: string; value: string }> = {
  Pix: { label: "PIX", value: "PIX" },
  Dinheiro: { label: "Dinheiro", value: "Dinheiro" },
  Cartao_Credito: { label: "Crédito", value: "Crédito" },
  Cartao_Debito: { label: "Débito", value: "Débito" },
};

function formatHour(hhmm: string) {
  const [h, m] = hhmm.split(":");

  const hour = Number(h); // remove zero à esquerda

  if (m === "00") {
    return `${hour}h`;
  }

  return `${hour}:${m}`;
}

function getDeliveryMessage(deliveryTime?: string | null) {
  if (!deliveryTime) return null;

  const agora = moment.tz("America/Sao_Paulo");

  const [h, m] = deliveryTime.split(":").map(Number);

  const inicio = agora.clone().hour(h).minute(m).second(0);

  if (agora.isBefore(inicio)) {
    return `Pedidos Delivery começam a sair às ${formatHour(deliveryTime)}`;
  }

  return null;
}

// --- Componente de Formulário de Endereço ---
function FormAddress(props: {
  submit: () => void;
  upsertAddress: (data: Fields | "retirar") => void;
  address: Fields | null;
  deliveryArea: {
    distanceKm: number;
    isInside: boolean;
  } | null;
}) {
  const { info } = useContext(DataMenuContext);
  const [loadRoad, setLoadRoad] = useState(false);
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Fields>({
    resolver: zodResolver(FormSchema),
    defaultValues: props.address || undefined,
  });
  const deliveryMessage = getDeliveryMessage(info?.deliveries_begin_at);
  const registerWithMask = useHookFormMask(register);

  const handleAddress = async (fields: Fields) => {
    props.upsertAddress(fields);
    props.submit(); // Avança para o próximo passo
  };

  async function getAddress(lat: number, lng: number) {
    try {
      setLoadRoad(true);
      const { data } = await axios(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      );
      if (data.address.road) {
        setValue("address", data.address.road);
      }
      setLoadRoad(false);
    } catch (error) {
      setLoadRoad(false);
    }
  }

  return (
    // Passamos um ID para o form para podermos submetê-lo a partir do botão no footer
    <form
      id="address-form"
      onSubmit={handleSubmit(handleAddress, (err) => console.log(err))}
      className="flex flex-col gap-y-0 px-3"
    >
      <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg border border-green-100 mb-2">
        <span className="text-sm text-green-800 font-medium">
          Prefere buscar o pedido?
        </span>
        <Button
          onClick={() => {
            props.upsertAddress("retirar");
            reset();
            props.submit();
          }}
          type="button"
          size="sm"
          className="bg-white! border border-green-300! text-green-700! hover:bg-green-100!"
        >
          Retirar na loja
        </Button>
      </div>

      {deliveryMessage && (
        <div className="mb-2 px-3 py-2 rounded-lg bg-yellow-50 border border-yellow-200 flex items-center gap-2">
          <span className="text-yellow-800 text-sm font-medium">
            ⏰ {deliveryMessage}
          </span>
        </div>
      )}

      <div className="flex flex-col w-full gap-y-4 pb-16 overflow-y-auto h-[calc(100vh-350px)]">
        <MapComponent
          isEdit={false}
          defaultPosition={
            props.address
              ? { lat: props.address.lat, lng: props.address.lng }
              : undefined
          }
          onSetPosition={({ lat, lng }) => {
            if (info && info.lat && info.lng) {
              const area = isWithinDeliveryArea(
                {
                  lat: info.lat,
                  lng: info.lng,
                  max_distance_km: info.max_distance_km,
                },
                { lat, lng },
              );
              if (area.isInside) {
                setValue("lat", lat, { shouldDirty: true });
                setValue("lng", lng, { shouldDirty: true });
                getAddress(lat, lng);
              }
              return;
            }

            if (!info?.max_distance_km) {
              setValue("lat", lat, { shouldDirty: true });
              setValue("lng", lng, { shouldDirty: true });
              getAddress(lat, lng);
            }
          }}
        />

        {(errors.lat?.message || errors.lng?.message) && (
          <span className="text-red-500 font-medium block -mt-2">
            Defina corretamente o local de entrega movendo o pin no mapa.
          </span>
        )}

        {props.deliveryArea && !props.deliveryArea.isInside && (
          <span className="text-red-500 font-medium block -mt-2">
            Ops! Ainda não entregamos nessa região 😕
          </span>
        )}

        <div className="grid px-2 grid-cols-[1fr_100px] justify-between gap-x-2">
          <Field
            label={
              <div className="flex items-center gap-x-2">
                <span>
                  Endereço <span className="text-red-400">*</span>
                </span>
                {loadRoad && <Spinner size="sm" />}
              </div>
            }
            invalid={!!errors.address}
          >
            <Input
              {...register("address")}
              placeholder="Digite o endereço"
              size="sm"
              autoComplete="off"
              bg="white"
              maxLength={120}
              minLength={5}
            />
          </Field>
          <Field
            label={<span>Número</span>}
            errorText={errors.number?.message}
            invalid={!!errors.number}
          >
            <Input
              {...register("number")}
              size="sm"
              autoComplete="off"
              bg="white"
              minLength={1}
              maxLength={10}
            />
          </Field>
        </div>

        <div className="grid px-2 grid-cols-[100px_1fr] justify-between gap-x-2">
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
              size="sm"
              autoComplete="off"
              bg="white"
            />
          </Field>
          <Field
            label={
              <span>
                Quem vai receber <span className="text-red-400">*</span>
              </span>
            }
            invalid={!!errors.persona}
          >
            <Input
              {...register("persona")}
              size="sm"
              autoComplete="off"
              bg="white"
              minLength={2}
              maxLength={35}
            />
          </Field>
        </div>

        <Field
          label={
            <span>
              Ponto de referência <span className="text-red-400">*</span>
            </span>
          }
          invalid={!!errors.reference_point}
          className="px-2"
        >
          <Input
            size="sm"
            {...register("reference_point")}
            autoComplete="off"
            bg="white"
            minLength={4}
            maxLength={120}
          />
        </Field>

        <Field
          label="Complemento"
          invalid={!!errors.complement}
          errorText={errors.complement?.message}
          className=" px-2"
        >
          <Input
            size="sm"
            {...register("complement")}
            placeholder="Apto, Bloco..."
            autoComplete="off"
            bg="white"
            maxLength={60}
          />
        </Field>
      </div>
    </form>
  );
}

// --- Componente Principal ---
export const ModalCarrinho: React.FC<
  Omit<IProps, "upsertAddress" | "address">
> = (props) => {
  const {
    bg_primary,
    uuid,
    info,
    status,
    items: itemsData,
  } = useContext(DataMenuContext);
  const {
    items,
    incrementQnt,
    changeObs,
    payment_method,
    payment_change_to,
    setPaymentChangeTo,
    setPaymentMethod,
    resetCart,
    setError,
    error,
  } = useContext(CartContext);

  const [deliveryArea, setDeliveryArea] = useState<{
    distanceKm: number;
    isInside: boolean;
  } | null>(null);

  const { address, upsertAddress } = useAddressStore();
  const [searchParams] = useSearchParams();
  const isOpen = searchParams.get("c");

  // Controle de Fluxo (Stepped Checkout)
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [redirectTo, setRedirectTo] = useState("");

  const totalValues = useMemo(() => {
    if (!items.length) return 0;
    return items.reduce((prev, curr) => prev + curr.total * curr.qnt, 0);
  }, [items]);

  const subtotal = totalValues;
  const taxaEntrega =
    address !== null && address !== "retirar" && deliveryArea?.isInside
      ? (info?.delivery_fee || 0) +
        deliveryArea.distanceKm * 1.3 * (info?.price_per_km || 0)
      : 0;

  const valorTotal = subtotal + taxaEntrega;

  useEffect(() => {
    if (!items.length && isOpen) {
      setTimeout(() => window.history.back(), 100);
    }
  }, [items.length, isOpen]);

  const handleCreateOrder = async () => {
    if (!payment_method) {
      setError("forma-de-pagamento");
      setTimeout(() => setError(null), 1500);
      return;
    }
    if (payment_method === "Dinheiro") {
      if (!payment_change_to) {
        setError("dinheiro");
        setTimeout(() => setError(null), 1500);
        return;
      }
      if (payment_change_to !== "Não") {
        const troco = parseToNumber(payment_change_to);
        if (valorTotal > troco) {
          alert("O valor para troco não pode ser menor que o total do pedido.");
          return;
        }
      }
    }

    try {
      setIsLoading(true);
      const payload = {
        uuid,
        items: items.map((item) => ({
          uuid: item.uuid,
          qnt: item.qnt,
          obs: item.obs,
          sections: item.sections,
        })),
        payment_change_to,
        payment_method,
        ...(address === "retirar"
          ? { type_delivery: "retirar" }
          : {
              type_delivery: "enviar",
              delivery_address: address?.address,
              delivery_cep: address?.cep,
              delivery_complement: address?.complement,
              delivery_lat: address?.lat,
              delivery_lng: address?.lng,
              delivery_number: address?.number,
              who_receives: address?.persona,
              delivery_reference_point: address?.reference_point,
            }),
      };

      // @ts-expect-error
      const data = await createOrder(payload);
      setRedirectTo(data.redirectTo);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      if (err instanceof AxiosError && err.response?.status === 400) {
        const dataError = err.response?.data as ErrorResponse_I;
        if (dataError.toast.length) dataError.toast.forEach(toaster.create);
      }
    }
  };

  useEffect(() => {
    if (info && info.lat && info.lng && address && address !== "retirar") {
      const area = isWithinDeliveryArea(
        {
          lat: info.lat,
          lng: info.lng,
          max_distance_km: info.max_distance_km,
        },
        { lat: address.lat, lng: address.lng },
      );

      if (area.distanceKm) setDeliveryArea(area);
    }
  }, [address]);

  const payment_methods_items = (info?.payment_methods || [])
    .map((m) => PAYMENT_OPTIONS[m])
    .filter(Boolean)
    .filter((v, i, arr) => arr.findIndex((s) => s.value === v.value) === i);

  const minimo = info?.minimum_value_per_order || 0;

  const falta = minimo - subtotal;
  const atingiuMinimo = subtotal >= minimo;

  const progresso = minimo > 0 ? Math.min((subtotal / minimo) * 100, 100) : 100;

  return (
    <DialogRoot
      open={!!isOpen}
      onOpenChange={(change) => {
        if (!change.open) window.history.back();
      }}
      preventScroll
      modal
      size={"full"}
      motionPreset={"slide-in-bottom"}
      placement={"top"}
    >
      <DialogContent
        bg="#f9f9fb"
        w="100%"
        maxW="500px"
        className="h-[calc(100svh-80px)] overflow-hidden sm:rounded-2xl flex flex-col"
        p={0}
      >
        {/* HEADER DE PROGRESSO */}
        {!isLoading && !redirectTo && (
          <div className="bg-white px-4 py-3 shadow-sm z-10 sm:rounded-t-2xl shrink-0">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-800">Seu Pedido</h2>
              <span className="text-sm font-medium text-gray-400">
                Passo {step} de 3
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 flex overflow-hidden">
              <div
                className="bg-green-500 h-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* CORPO DO MODAL */}
        <DialogBody className="flex flex-col px-0! py-2! pb-0! overflow-y-hidden overflow-x-hidden relative flex-1">
          {isLoading && (
            <div className="flex flex-col w-full h-full items-center justify-center pt-20">
              <Presence
                present={!redirectTo}
                animationName={{ _open: "fade-in", _closed: "fade-out" }}
              >
                <div className="flex flex-col gap-y-2 items-center">
                  <span className="font-light text-lg text-neutral-500">
                    Criando pedido...
                  </span>
                  <Spinner size="xl" color="green.500" />
                </div>
              </Presence>
            </div>
          )}

          {redirectTo && !isLoading && (
            <div className="flex flex-col w-full h-full items-center justify-center px-4 pt-10">
              <Presence
                present={!!redirectTo}
                animationName={{ _open: "slide-from-bottom, fade-in" }}
              >
                <div className="flex flex-col gap-y-1 items-center mb-6">
                  <span className="font-semibold text-2xl uppercase text-green-600">
                    Pedido Criado!
                  </span>
                  <p className="text-neutral-500 text-center text-sm">
                    Confirme seu pedido enviando o código para o nosso WhatsApp.
                  </p>
                </div>

                <div className="w-full max-w-sm p-4 bg-[#e5ddd5] rounded-xl mb-6 shadow-inner">
                  <div className="flex justify-end">
                    <div className="relative bg-[#d9fdd3] text-gray-900 px-4 py-2 pb-1 rounded-lg rounded-tr-none shadow-sm max-w-[85%]">
                      <p className="text-sm whitespace-pre-wrap">
                        {
                          decodeURIComponent(redirectTo).match(
                            /text=(.*)$/,
                          )?.[1]
                        }
                      </p>
                      <div className="text-xs text-gray-500 text-right mt-1 flex items-center justify-end gap-1">
                        <span>Agora</span>
                        <PiChecksBold size={16} className="text-blue-500" />
                      </div>
                      <span className="absolute -right-1.5 top-0 w-0 h-0 border-b-10 border-l-[6px] border-t-transparent border-b-transparent border-l-[#d9fdd3]" />
                    </div>
                  </div>
                </div>

                <Button
                  color="white"
                  bg="#25D366"
                  _hover={{ bg: "#128C7E" }}
                  onClick={() => {
                    window.open(redirectTo, "_blank");
                    resetCart();
                    setRedirectTo("");
                    setStep(1);
                    // window.history.back();
                  }}
                  size="xl"
                  className="w-full max-w-sm h-14 rounded-xl font-bold text-lg shadow-md"
                >
                  <IoLogoWhatsapp size={24} className="mr-2" />
                  Enviar mensagem
                </Button>
              </Presence>
            </div>
          )}

          {!isLoading && !redirectTo && (
            <>
              {/* === PASSO 1: MEUS ITENS === */}
              {step === 1 && (
                <div className="relative h-full">
                  <GridWithShadows
                    grid={false}
                    listClassName="flex flex-col w-full !relative justify-start"
                    items={items}
                    renderItem={(item) => {
                      const product = itemsData.find(
                        (s) => s.uuid === item.uuid,
                      );
                      if (!product) return null;
                      return (
                        <div
                          key={item.key}
                          className="flex flex-col bg-white p-3 mx-4 my-1 rounded-xl shadow-md border border-gray-100"
                        >
                          <div className="flex gap-3">
                            <div className="w-14 h-14 shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                              <img
                                src={product.img}
                                className="w-full h-full object-cover"
                                alt={product.name}
                              />
                            </div>

                            <div className="flex flex-col w-full justify-between">
                              <div>
                                <div className="flex justify-between items-start gap-2">
                                  <h3 className="font-semibold text-gray-800 text-[15px] leading-tight">
                                    {product.name}
                                  </h3>
                                  <span
                                    className="font-bold text-gray-900 shrink-0 text-base"
                                    style={{ color: bg_primary || "#111" }}
                                  >
                                    {formatToBRL(item.total * item.qnt)}
                                  </span>
                                </div>

                                {item.sections && (
                                  <p className="text-sm text-gray-400 line-clamp-1">
                                    {Object.values(item.sections)
                                      .map((sub) =>
                                        Object.keys(sub || {}).length > 0
                                          ? "Opções selecionadas"
                                          : "",
                                      )
                                      .find(Boolean)}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-1">
                                  <button
                                    onClick={() => incrementQnt(item.key, -1)}
                                    className="w-7 h-7 flex items-center justify-center text-red-600 font-bold active:bg-gray-200 rounded-md"
                                  >
                                    -
                                  </button>
                                  <span className="font-medium text-sm w-4 text-center">
                                    {item.qnt}
                                  </span>
                                  <button
                                    onClick={() => incrementQnt(item.key, +1)}
                                    className="w-7 h-7 flex items-center justify-center text-green-600 font-bold active:bg-green-100 rounded-md"
                                  >
                                    +
                                  </button>
                                </div>
                                {item.sections && (
                                  <button
                                    onClick={() =>
                                      props.onReturnEdit({
                                        uuid: item.uuid,
                                        ref: {
                                          sections: item.sections!,
                                          length: item.qnt,
                                          key: item.key,
                                        },
                                      })
                                    }
                                    className="text-blue-500 bg-blue-50 p-1.5 rounded-md"
                                  >
                                    <MdModeEdit size={22} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                          <Input
                            value={item.obs}
                            onChange={({ target }) =>
                              changeObs(item.key, target.value)
                            }
                            placeholder="Observações..."
                            className={"bg-white! mt-1.5"}
                            maxLength={130}
                          />
                        </div>
                      );
                    }}
                  />
                </div>
              )}

              {/* === PASSO 2: ENDEREÇO === */}
              {step === 2 && (
                <div>
                  <FormAddress
                    address={address !== "retirar" ? address : null}
                    upsertAddress={upsertAddress}
                    submit={() => setStep(3)}
                    deliveryArea={deliveryArea}
                  />
                </div>
              )}

              {/* === PASSO 3: PAGAMENTO === */}
              {step === 3 && (
                <div className="flex flex-col gap-4 overflow-y-auto pb-16 h-[calc(100vh-290px)]">
                  <div className="bg-white p-4 mx-4 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide flex justify-between">
                      Resumo do Pedido
                      <button
                        onClick={() => setStep(1)}
                        className="text-blue-500 font-normal normal-case text-sm underline"
                      >
                        Editar itens
                      </button>
                    </h3>
                    <div className="flex justify-between text-gray-600 text-base mb-1">
                      <span>Subtotal</span>
                      <span>{formatToBRL(subtotal)}</span>
                    </div>
                    {taxaEntrega > 0 && address !== "retirar" && (
                      <div className="flex justify-between text-gray-600 text-base mb-2">
                        <span>Taxa de Entrega</span>
                        <span>{formatToBRL(taxaEntrega)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-gray-900 text-lg border-t border-gray-100 pt-2 mt-2">
                      <span>Total</span>
                      <span style={{ color: bg_primary || "#111" }}>
                        {formatToBRL(valorTotal)}
                      </span>
                    </div>
                  </div>

                  <div className="px-4">
                    <h3
                      className={clsx(
                        "font-semibold text-sm uppercase tracking-wide mb-2 transition-colors",
                        error === "forma-de-pagamento"
                          ? "text-red-500"
                          : "text-gray-800",
                      )}
                    >
                      Forma de Pagamento
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {payment_methods_items.map((method) => (
                        <button
                          key={method.value}
                          onClick={() => setPaymentMethod(method.value)}
                          className={clsx(
                            "py-3 px-2 rounded-xl border-2 text-sm font-medium transition-all",
                            payment_method === method.value
                              ? "border-green-500 bg-green-50 text-green-700"
                              : error === "forma-de-pagamento"
                                ? "border-red-300 bg-red-50 text-red-600"
                                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300",
                          )}
                        >
                          {method.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Collapsible.Root open={payment_method === "Dinheiro"}>
                    <Collapsible.Content>
                      <div
                        className={clsx(
                          "bg-white p-4 mx-4 rounded-xl border mt-1 flex flex-col gap-3",
                          error == "dinheiro"
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200",
                        )}
                      >
                        <label
                          className={clsx(
                            "text-sm font-medium",
                            error === "dinheiro"
                              ? "animate-error text-red-600 bg-red-100! px-2 transition-all"
                              : "text-gray-700",
                          )}
                        >
                          Troco para quanto{error === "dinheiro" ? " ???" : "?"}
                        </label>
                        <Input
                          value={payment_change_to || ""}
                          onChange={({ target }) =>
                            setPaymentChangeTo(target.value)
                          }
                          disabled={payment_change_to === "Não"}
                          placeholder="R$ 0,00"
                          size="lg"
                          bg="white"
                          className="border-gray-300"
                          ref={withMask("brl-currency")}
                        />
                        <Checkbox.Root
                          checked={payment_change_to === "Não"}
                          onCheckedChange={() =>
                            setPaymentChangeTo(
                              payment_change_to === "Não" ? null : "Não",
                            )
                          }
                          colorPalette="green"
                        >
                          <Checkbox.HiddenInput />
                          <Checkbox.Control />
                          <Checkbox.Label className="text-sm font-medium text-gray-700">
                            Não preciso de troco
                          </Checkbox.Label>
                        </Checkbox.Root>
                      </div>
                    </Collapsible.Content>
                  </Collapsible.Root>
                </div>
              )}
            </>
          )}
        </DialogBody>

        {/* RODAPÉ FIXO DE AÇÕES */}
        {!isLoading && !redirectTo && (
          <div className="w-full bg-white border-t border-gray-200 p-4 shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
            {step === 1 && (
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  className="flex-[0.7]! border-gray-300! text-gray-700! h-12! rounded-xl!"
                  onClick={() => window.history.back()}
                >
                  Voltar
                </Button>
                <Button
                  className="flex-[1.3]! bg-gray-900! text-white! hover:bg-black! h-12! rounded-xl! font-semibold!"
                  style={{ backgroundColor: bg_primary || "#111" }}
                  onClick={() => setStep(2)}
                  disabled={!status || !items.length}
                >
                  Ir para Endereço
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  className="flex-[0.7]! border-gray-300! text-gray-700! h-12! rounded-xl!"
                  onClick={() => setStep(1)}
                >
                  Voltar
                </Button>
                {/* O botão abaixo engatilha o formulário de endereço usando o ID "address-form" */}
                <Button
                  form="address-form"
                  type="submit"
                  className="flex-[1.3]! bg-gray-900! text-white! hover:bg-black! h-12! rounded-xl! font-semibold!"
                  style={{ backgroundColor: bg_primary || "#111" }}
                  disabled={deliveryArea !== null && !deliveryArea.isInside}
                >
                  Ir para Pagamento
                </Button>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-2 w-full">
                {minimo > 0 && !atingiuMinimo && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                    <div className="flex justify-between text-sm font-medium text-yellow-800 mb-1">
                      <span>Pedido mínimo</span>
                      <span>{formatToBRL(minimo)}</span>
                    </div>

                    <div className="w-full bg-yellow-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 transition-all"
                        style={{ width: `${progresso}%` }}
                      />
                    </div>

                    <p className="text-xs text-yellow-700 mt-2">
                      Faltam <strong>{formatToBRL(falta)}</strong> para atingir
                      o pedido mínimo
                    </p>
                  </div>
                )}
                {atingiuMinimo && (
                  <Button
                    className="w-full bg-[#25D366]! text-white! hover:bg-[#128C7E]! h-14! rounded-xl! text-lg! font-bold! shadow-md!"
                    onClick={handleCreateOrder}
                    disabled={
                      !status ||
                      (deliveryArea !== null && !deliveryArea.isInside)
                    }
                  >
                    Finalizar Pedido • {formatToBRL(valorTotal)}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="w-full! text-gray-500! h-10! font-medium!"
                  onClick={() => window.history.back()}
                >
                  Continuar comprando
                </Button>
              </div>
            )}

            {!status && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-red-100 border border-red-200 text-red-600 px-3 py-1 rounded-full shadow-sm">
                <BsDoorClosed size={14} />
                <span className="text-xs font-semibold">Fechado agora</span>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </DialogRoot>
  );
};
