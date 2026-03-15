import { useContext, useEffect, useMemo, useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import { JSX } from "@emotion/react/jsx-runtime";
import { LayoutPrivateContext } from "./layout-private.context";
import clsx from "clsx";
import { Image } from "@chakra-ui/react";
import { DataMenuContext, TypePaymentMethods } from "./data-menu.context";
import { PiMapPinFill } from "react-icons/pi";
import { DialogBody, DialogContent, DialogRoot } from "@components/ui/dialog";
import { RiWhatsappLine } from "react-icons/ri";
import { LuPhone, LuBanknote, LuCreditCard, LuWallet } from "react-icons/lu";
import moment from "moment-timezone";
import { SiPix } from "react-icons/si";

const weekDays = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

function OperatingDaysList({ data }: any) {
  const todayName = weekDays[moment().day()];

  return (
    <div className="flex flex-col gap-1 w-full">
      {data.map((item: any, i: number) => {
        const isToday = item.day === todayName;

        return (
          <div
            key={i}
            className={`flex text-base justify-between px-3 py-2 rounded-md ${isToday
              ? "bg-gray-200 font-semibold text-neutral-900"
              : "text-neutral-600"
              }`}
          >
            <span className="font-light">{item.day}</span>
            <span className="font-normal">{item.time}</span>
          </div>
        );
      })}
    </div>
  );
}

export function LayoutPrivateProvider(): JSX.Element {
  const {
    bg_primary,
    logoImg,
    titlePage,
    bg_capa,
    status,
    helperTextOpening,
    info,
  } = useContext(DataMenuContext);
  const [headerOpen, setHeaderOpen] = useState(true);
  const [headerOpenDelay, setHeaderOpenDelay] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!headerOpen) {
      setTimeout(() => {
        setHeaderOpenDelay(false);
      }, 700);
    }
  }, [headerOpen]);

  const dataValue = useMemo(
    () => ({
      headerOpen,
      setHeaderOpen,
    }),
    [headerOpen],
  );

  return (
    <LayoutPrivateContext.Provider value={dataValue}>
      <div
        className={"min-h-svh overflow-y-hidden grid grid-rows-[auto_1fr_2px]"}
        style={{
          // background: bg_capa ? opacity(bg_capa, 0.12) : "#f5f5f5"
        }}
      >
        <header className="">
          <div
            className={clsx(
              "w-full transition-all duration-300",
              headerOpenDelay ? "h-28" : "h-20",
            )}
            style={{
              background: bg_capa || "#e5e5e5",
            }}
          />

          <div className="px-3">
            <div
              className={clsx(
                "duration-100 border mb-1 active:scale-95 mx-auto transition-all w-full max-w-lg px-3 rounded-2xl pb-2 border-neutral-100",
                headerOpenDelay ? "-mt-14" : "-mt-12",
              )}
              style={{ background: bg_primary || "#fff" }}
              onClick={() => {
                const next = new URLSearchParams(searchParams);
                next.set("p", "true");
                setSearchParams(next);
              }}
            >
              <div className={"flex flex-col"}>
                <div className="flex flex-col items-center mx-auto">
                  <Image
                    src={logoImg}
                    style={{
                      minWidth: headerOpenDelay ? 85 : 55,
                      maxWidth: headerOpenDelay ? 85 : 55,
                      height: headerOpenDelay ? 85 : 55,
                    }}
                    className={clsx(
                      "border-4 border-white duration-500 shadow-sm transition-all rounded-full bg-red-700",
                      headerOpenDelay ? "-mt-[42.5px]" : "-mt-[22.5px]",
                    )}
                  />
                  <div
                    className={clsx(
                      "flex flex-col -mt-1 items-center -space-y-0.5 transition-all",
                      headerOpenDelay ? "pt-1" : "",
                    )}
                  >
                    <span className="text-neutral-900 font-normal text-xl sm:text-2xl">
                      {titlePage}
                    </span>
                    {(info?.state_uf || info?.city) && (
                      <span className="text-neutral-400 flex gap-x-2 items-center text-sm sm:text-lg">
                        <PiMapPinFill />
                        {info.city} {info.city && info.state_uf ? " - " : " "}
                        {info?.state_uf} • Mais informações
                      </span>
                    )}
                    {status ? (
                      <span className="text-green-600 font-extrabold flex items-center text-sm sm:text-lg">
                        Aberto
                      </span>
                    ) : (
                      <div className="flex gap-x-1 items-center">
                        <span className="text-red-600 font-extrabold flex text-sm sm:text-lg">
                          Fechado
                        </span>
                        {helperTextOpening && (
                          <span className="text-neutral-500 flex text-sm">
                            {helperTextOpening}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <ModalInfo />

        <Outlet />
        {/* <footer className="w-full max-w-lg mx-auto px-3 text-xs text-center text-black/50">
          © 2026 - Developed by Junplid
        </footer> */}
      </div>
    </LayoutPrivateContext.Provider>
  );
}

const paymentMap = {
  Dinheiro: {
    label: "Dinheiro",
    icon: LuBanknote,
  },
  Pix: {
    label: "Pix",
    icon: SiPix,
  },
  Cartao_Credito: {
    label: "Crédito",
    icon: LuCreditCard,
  },
  Cartao_Debito: {
    label: "Débito",
    icon: LuWallet,
  },
};

function PaymentMethods({
  payment_methods,
}: {
  payment_methods: TypePaymentMethods[];
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {payment_methods.map((method) => {
        const Item = paymentMap[method];
        const Icon = Item.icon;

        return (
          <div
            key={method}
            className="flex items-center font-light gap-2 px-3 py-1.5 rounded-lg border bg-neutral-50 border-neutral-200 text-sm"
          >
            <Icon size={18} className="text-neutral-600" />
            {Item.label}
          </div>
        );
      })}
    </div>
  );
}

function ModalInfo() {
  const { logoImg, titlePage, status, operatingDays, helperTextOpening, info } =
    useContext(DataMenuContext);
  const [searchParams, _setSearchParams] = useSearchParams();
  const isOpen = searchParams.get("p");

  return (
    <DialogRoot
      defaultOpen={false}
      open={!!isOpen}
      onOpenChange={(change) => {
        if (!change.open) window.history.back()
      }}
      placement={"center"}
      motionPreset={"slide-in-top"}
      lazyMount={false}
      unmountOnExit={false}
    >
      <DialogContent bg={"#f3f3f3"} backdrop w={"100%"}>
        <DialogBody p={2} className="flex flex-col gap-y-4 h-full">
          <div className="flex flex-col items-center mx-auto">
            <Image
              src={logoImg}
              style={{
                minWidth: 85,
                maxWidth: 85,
                height: 85,
              }}
              className={clsx(
                "border-4 border-white duration-500 shadow-sm transition-all rounded-full bg-red-700 -mt-[42.5px]",
              )}
            />
            <div
              className={clsx(
                "flex flex-col -mt-1 items-center -space-y-0.5 transition-all pt-1",
              )}
            >
              <span className="text-neutral-900 font-normal text-lg sm:text-2xl">
                {titlePage}
              </span>
              {status ? (
                <span className="text-green-600 font-extrabold flex items-center text-sm sm:text-lg">
                  Aberto
                </span>
              ) : (
                <div className="flex gap-x-1 items-center">
                  <span className="text-red-600 font-extrabold flex text-sm sm:text-lg">
                    Fechado
                  </span>
                  {helperTextOpening && (
                    <span className="text-neutral-700 flex text-sm">
                      {helperTextOpening}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <section className="flex flex-col items-center">
            <h2 className="text-lg">Contato</h2>
            <div className="mt-2 flex flex-col items-start gap-y-2">
              {info?.whatsapp_contact && (
                <a
                  href={`https://api.whatsapp.com/send?phone=${info?.whatsapp_contact.replace(/\D/g, "")}`}
                  target="_blank"
                  className="p-2 border-neutral-500 bg-white text-neutral-700 border rounded-lg flex items-center gap-x-1.5"
                >
                  <RiWhatsappLine size={20} /> {info?.whatsapp_contact}
                </a>
              )}
              {info?.phone_contact && (
                <a
                  href={`tel:${info?.phone_contact.replace(/\D/g, "")}`}
                  className="p-2 border-neutral-500  bg-white font-semibold text-neutral-700 border-2 rounded-lg flex items-center gap-x-1.5"
                >
                  <LuPhone size={20} /> {info?.phone_contact}
                </a>
              )}
            </div>
          </section>

          {(info?.city || info?.state_uf || info?.address) && (
            <section className="flex flex-col items-center">
              <h2 className="text-lg">Endereço</h2>
              <div className="mt-2 flex flex-col items-center">
                <a className="font-light text-base text-neutral-700 items-center">
                  {info.city} {info.city && info.state_uf ? " - " : " "}
                  {info?.state_uf}
                </a>
                <a className="font-light text-base text-neutral-700 items-center">
                  {info?.address}
                </a>
              </div>
            </section>
          )}

          {!!operatingDays.length && (
            <section className="flex flex-col items-center">
              <h2 className="text-lg">Horário</h2>
              <OperatingDaysList data={operatingDays} />
            </section>
          )}

          {!!info?.payment_methods.length && (
            <section className="flex flex-col items-center">
              <h2 className="text-lg">Pagamento</h2>
              <PaymentMethods payment_methods={info.payment_methods} />
            </section>
          )}

          <div className="flex flex-col flex-1 justify-end px-2 text-xs text-center text-neutral-500 mt-7 font-light">
            {/* <span>
              © 2026 - Developed by <a className="font-normal">Rian Carlos</a>.
            </span> */}
            <span>
              © Todos os direitos do software reservados. Marcas, imagens e
              conteúdos exibidos pertencem aos seus respectivos proprietários.
            </span>
          </div>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}
