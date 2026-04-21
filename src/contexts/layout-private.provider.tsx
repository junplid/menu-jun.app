import { useContext, useEffect, useMemo, useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import { JSX } from "@emotion/react/jsx-runtime";
import { LayoutPrivateContext } from "./layout-private.context";
import clsx from "clsx";
import { IconButton, Image, Presence } from "@chakra-ui/react";
import { DataMenuContext, TypePaymentMethods } from "./data-menu.context";
import { DialogBody, DialogContent, DialogRoot } from "@components/ui/dialog";
import {
  RiMapPin2Line,
  RiTimeLine,
  RiWallet3Line,
  RiWhatsappLine,
} from "react-icons/ri";
import {
  LuPhone,
  LuBanknote,
  LuCreditCard,
  LuWallet,
  LuChevronRight,
  LuX,
} from "react-icons/lu";
import moment from "moment-timezone";
import { SiPix } from "react-icons/si";
import { TiFlashOutline } from "react-icons/ti";
import { FaRegClock, FaMotorcycle } from "react-icons/fa";
import { TbPointFilled } from "react-icons/tb";
import opacity from "hex-color-opacity";
import { TextGradientComponent } from "@components/TextGradient";
import { MdOutlineAttachMoney } from "react-icons/md";

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
            className={`flex text-base justify-between px-3 py-2 rounded-md ${
              isToday
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
    logoImg,
    titlePage,
    capaImg,
    bg_capa,
    status,
    info,
    // helperTextOpening,
  } = useContext(DataMenuContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [dispence, setDispence] = useState(false);

  const dataValue = useMemo(() => ({}), []);

  useEffect(() => {
    setTimeout(() => {
      setDispence(true);
    }, 1200);
  }, []);

  return (
    <LayoutPrivateContext.Provider value={dataValue}>
      <div className={"grid bg-neutral-100 grid-rows-[auto_1fr_2px]"}>
        <header className="pb-2 bg-neutral-100">
          {/* Capa de Fundo - Aumentei levemente a altura para dar respiro à logo */}
          <div
            className="w-full h-24 transition-all duration-300 bg-center bg-cover bg-no-repeat"
            style={
              capaImg
                ? { backgroundImage: `url(${capaImg})` }
                : { backgroundColor: bg_capa || "#e5e5e5" }
            }
          />

          <div className="px-3">
            {/* Card Principal Flutuante */}
            <div
              className={clsx(
                "-mt-16 duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border active:scale-[0.99] mx-auto transition-all w-full max-w-lg max-[390px]:px-1.5 px-4 rounded-2xl pb-3 border-neutral-100 cursor-pointer relative",
              )}
              style={{ background: "#fff" }}
              onClick={() => {
                const next = new URLSearchParams(searchParams);
                next.set("p", "true");
                setSearchParams(next);
              }}
            >
              {/* Topo do Card: Badge (Esq), Logo (Centro) e Botão Info (Dir) */}
              <div className="flex gap-x-2 justify-between items-start pt-3 h-12">
                <div className="flex items-center gap-x-2">
                  <div className="flex justify-start">
                    <Presence
                      animationName={{
                        _open: "slide-from-top, fade-in",
                        _closed: "slide-to-bottom, fade-out",
                      }}
                      animationDuration="moderate"
                      present={dispence}
                    >
                      <div
                        className="flex px-2 py-0.5 items-center rounded-lg border bg-white/60 backdrop-blur-sm shadow-sm"
                        style={{
                          borderColor: opacity(bg_capa || "#e5e5e5", 0.3),
                        }}
                      >
                        <TiFlashOutline
                          color={bg_capa || "#e5e5e5"}
                          size={16}
                        />
                        <div className="flex text-sm gap-x-1 ml-0.5">
                          <span className="text-neutral-600">Delivery</span>
                          <TextGradientComponent
                            backgroundImage={`linear-gradient(70deg, ${bg_capa || "#e5e5e5"}, ${opacity(bg_capa || "#e5e5e5", 0.3)}, ${bg_capa || "#e5e5e5"})`}
                            className="font-extrabold uppercase tracking-wide"
                          >
                            Rápido
                          </TextGradientComponent>
                        </div>
                      </div>
                    </Presence>
                  </div>

                  <div className="flex justify-end">
                    <div className="text-neutral-400 font-medium hover:text-neutral-600 hover:bg-neutral-100 transition-colors text-sm flex items-center gap-x-0.5 py-1 px-2.5 rounded-full bg-neutral-50 border border-neutral-100 shadow-sm">
                      Info <LuChevronRight size={14} className="-mr-0.5" />
                    </div>
                  </div>
                </div>

                {/* Logo Centralizada e Flutuante */}
                <div className="flex justify-center relative">
                  <Image
                    src={logoImg}
                    style={{
                      minWidth: 80,
                      maxWidth: 80,
                      height: 80,
                      backgroundColor: "#fff",
                    }}
                    className={clsx(
                      "border-[3px] border-white absolute duration-300 shadow-md transition-all rounded-full object-cover -top-8 right-0 scale-90",
                    )}
                  />
                </div>
              </div>

              {/* Meio do Card: Título e Categoria */}
              <div className="flex flex-col items-center mt-2 text-center">
                <h1
                  className={
                    "text-neutral-900 leading-tight font-bold text-2xl tracking-tight"
                  }
                >
                  {titlePage}
                </h1>
                {/* MOCK: Categoria da loja */}
              </div>

              {/* Base do Card: Status e Informações Extras */}
              <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 max-[390px]:text-[13px] text-[14px]">
                {/* Pílula de Status (Aberto/Fechado) */}
                <div
                  className={clsx(
                    "flex items-center gap-x-1 px-2 py-1.5 rounded-md font-semibold border shadow-sm",
                    status
                      ? "bg-[#f0fdf4] text-green-700 border-green-200"
                      : "bg-[#fef2f2] text-red-600 border-red-200",
                  )}
                >
                  {status ? (
                    <>
                      <TbPointFilled
                        size={16}
                        className="text-green-500 animate-pulse"
                      />
                      <span>Aberto</span>
                    </>
                  ) : (
                    <>
                      <FaRegClock size={13} className="text-red-500" />
                      <span>Fechado</span>
                      {/* {helperTextOpening && (
                        <span className="font-medium text-red-400 ml-1 opacity-90">
                          • {helperTextOpening}
                        </span>
                      )} */}
                    </>
                  )}
                </div>

                {/* MOCK: Avaliação */}
                {/* <div className="flex items-center gap-x-1 text-yellow-500 font-bold bg-yellow-50/50 px-2 py-1 rounded-md border border-yellow-100/50">
                  <FaStar size={13} className="-mt-0.5" />
                  <span>4.9</span>
                  <span className="text-neutral-400 font-medium text-[11px] ml-0.5">
                    (+100)
                  </span>
                </div> */}

                {/* <span className="text-neutral-200 hidden sm:block">|</span> */}

                {/* MOCK: Tempo de Entrega */}
                <div className="flex items-center gap-x-1.5 text-neutral-500 font-medium px-1">
                  <FaMotorcycle size={16} className="text-neutral-400" />
                  <span>{info?.average_delivery_time ?? "30-45 min"}</span>
                </div>

                {/* MOCK: Pedido Mínimo */}
                <div className="flex items-center gap-x-0.5 text-neutral-500 font-medium px-1">
                  <MdOutlineAttachMoney
                    size={18}
                    className="text-neutral-400 -mr-0.5"
                  />
                  <span>
                    Mín.{" "}
                    {info?.minimum_value_per_order
                      ? `R$ ${info?.minimum_value_per_order}`
                      : `R$ 5`}
                  </span>
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
  const {
    logoImg,
    titlePage,
    status,
    operatingDays,
    helperTextOpening,
    info,
    bg_capa,
  } = useContext(DataMenuContext);
  const [searchParams] = useSearchParams();
  const isOpen = searchParams.get("p");

  // Função auxiliar para simplificar os títulos das seções
  const SectionHeader = ({
    icon: Icon,
    title,
  }: {
    icon: any;
    title: string;
  }) => (
    <div className="flex items-center gap-x-2 w-full mb-3 border-b border-neutral-200 pb-1">
      <Icon className="text-neutral-400" size={18} />
      <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
        {title}
      </h2>
    </div>
  );

  return (
    <DialogRoot
      open={!!isOpen}
      onOpenChange={(change) => {
        if (!change.open) window.history.back();
      }}
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <DialogContent
        bg="#f8f9fa"
        className="rounded-3xl overflow-hidden max-w-[95%] sm:max-w-lg"
      >
        {/* Botão de fechar flutuante */}
        <div className="absolute top-4 right-4 z-10">
          <IconButton
            onClick={() => window.history.back()}
            variant="ghost"
            rounded="full"
            bg="white/80"
            backdropFilter="blur(4px)"
          >
            <LuX />
          </IconButton>
        </div>

        <DialogBody p={0} className="flex flex-col h-full">
          {/* Header do Modal com Cover sutil */}
          <div
            className="h-20 w-full"
            style={{ background: bg_capa || "#111" }}
          />

          <div className="px-6 pb-8">
            {/* Foto e Título */}
            <div className="flex flex-col items-center -mt-10 mb-8">
              <Image
                src={logoImg}
                className="w-24 h-24 border-4 border-white shadow-lg rounded-full bg-white object-cover"
              />
              <h1 className="text-2xl font-black text-neutral-800 mt-2">
                {titlePage}
              </h1>

              <div className="mt-1">
                {status ? (
                  <div className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-0.5 rounded-full border border-green-100">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-sm font-bold uppercase">
                      Aberto Agora
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-0.5 rounded-full border border-red-100">
                    <span className="text-sm font-bold uppercase">Fechado</span>
                    {helperTextOpening && (
                      <span className="text-xs font-medium opacity-80">
                        • {helperTextOpening}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-8">
              {/* Seção: Contato */}
              <section>
                <SectionHeader icon={RiWhatsappLine} title="Contato" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {info?.whatsapp_contact && (
                    <a
                      href={`https://api.whatsapp.com/send?phone=${info?.whatsapp_contact.replace(/\D/g, "")}`}
                      target="_blank"
                      className="flex items-center gap-3 p-3 bg-white rounded-xl border border-neutral-200 shadow-sm hover:border-green-400 transition-colors"
                    >
                      <div className="bg-green-100 p-2 rounded-lg text-green-600">
                        <RiWhatsappLine size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-neutral-400 uppercase font-bold">
                          WhatsApp
                        </span>
                        <span className="text-sm font-semibold text-neutral-700">
                          {info?.whatsapp_contact}
                        </span>
                      </div>
                    </a>
                  )}
                  {info?.phone_contact && (
                    <a
                      href={`tel:${info?.phone_contact.replace(/\D/g, "")}`}
                      className="flex items-center gap-3 p-3 bg-white rounded-xl border border-neutral-200 shadow-sm hover:border-blue-400 transition-colors"
                    >
                      <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                        <LuPhone size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-neutral-400 uppercase font-bold">
                          Telefone
                        </span>
                        <span className="text-sm font-semibold text-neutral-700">
                          {info?.phone_contact}
                        </span>
                      </div>
                    </a>
                  )}
                </div>
              </section>

              {/* Seção: Endereço */}
              {(info?.city || info?.address) && (
                <section>
                  <SectionHeader icon={RiMapPin2Line} title="Endereço" />
                  <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                    {/* Informações de texto */}
                    <div className="p-4">
                      <p className="text-neutral-800 font-semibold leading-tight">
                        {info?.address}
                      </p>
                      <p className="text-sm text-neutral-500 mt-1">
                        {info.city}
                        {info.city && info.state_uf && ", "}
                        {info?.state_uf}
                      </p>
                    </div>

                    {/* Iframe do Google Maps */}
                    {info.lat && info.lng && (
                      <div className="w-full h-52 border-t border-neutral-100 relative">
                        <iframe
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          loading="lazy"
                          title="Localização da Loja"
                          src={`https://maps.google.com/maps?q=${info.lat},${info.lng}&z=16&output=embed`}
                        />
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Seção: Horários */}
              {!!operatingDays.length && (
                <section>
                  <SectionHeader
                    icon={RiTimeLine}
                    title="Horários de Funcionamento"
                  />
                  <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                    <OperatingDaysList data={operatingDays} />
                  </div>
                </section>
              )}

              {/* Seção: Pagamento */}
              {!!info?.payment_methods.length && (
                <section>
                  <SectionHeader
                    icon={RiWallet3Line}
                    title="Formas de Pagamento"
                  />
                  <div className="p-1">
                    <PaymentMethods payment_methods={info.payment_methods} />
                  </div>
                </section>
              )}
            </div>

            {/* Footer / Copyright */}
            <div className="mt-12 pt-6 border-t border-neutral-200 text-center">
              <p className="text-sm leading-relaxed text-neutral-400 px-4">
                © {new Date().getFullYear()} {titlePage}. Todos os direitos
                reservados. <br />
                Marcas e conteúdos exibidos pertencem aos seus respectivos
                proprietários.
              </p>
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}
