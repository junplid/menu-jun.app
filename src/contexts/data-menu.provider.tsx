import { ReactNode, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { JSX } from "@emotion/react/jsx-runtime";
import { AxiosError } from "axios";
import { ErrorResponse_I } from "../services/api/ErrorResponse";
import { toaster } from "@components/ui/toaster";
import { getMenuOnline } from "../services/api/MenuOnline";
import { DataMenuContext, TypePaymentMethods } from "./data-menu.context";
import { Image as ImageUI, Spinner } from "@chakra-ui/react";
import { api } from "../services/api";

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve();
    img.onerror = () => reject();
  });
}

interface IData {
  status: boolean;
  uuid: string;
  logoImg: string;
  capaImg: string | null;
  bg_primary: string | null;
  bg_secondary: string | null;
  bg_tertiary: string | null;
  titlePage: string | null;
  bg_capa: string | null;
  isChatbot: boolean;
  info: {
    address: string | null;
    state_uf: string | null;
    phone_contact: string | null;
    whatsapp_contact: string | null;
    city: string | null;
    delivery_fee?: number;
    links: string[];
    payment_methods: TypePaymentMethods[];
    max_distance_km: number | null;
    price_per_km: number | undefined;

    deliveries_begin_at: string | null;
    average_delivery_time: string | null;
    minimum_value_per_order: number | null;
  } | null;
  helperTextOpening: string;
  operatingDays: { day: string; time: string }[];
  categories: {
    items: {
      qnt: number;
      afterPrice: number | undefined;
      beforePrice: number | undefined;
      send_to_category_uuid: string | null;
      sections: {
        subItems: {
          after_additional_price: number | undefined;
          before_additional_price: number | undefined;
          uuid: string;
          desc: string | null;
          status: boolean | null;
          name: string;
          image55x55png: string | null;
          maxLength: number | null;
        }[];
        id: number;
        uuid: string;
        title: string | null;
        helpText: string | null;
        required: boolean;
        minOptions: number;
        maxOptions: number | null;
      }[];
      uuid: string;
      desc: string | null;
      name: string;
      img: string;
    }[];
    id: number;
    uuid: string;
    name: string;
    image45x45png: string | null;
  }[];
  items: {
    qnt: number;
    afterPrice: number | undefined;
    beforePrice: number | undefined;
    send_to_category_uuid: string | null;
    sections: {
      subItems: {
        after_additional_price: number | undefined;
        before_additional_price: number | undefined;
        uuid: string;
        desc: string | null;
        status: boolean | null;
        name: string;
        image55x55png: string | null;
        maxLength: number | null;
      }[];
      id: number;
      uuid: string;
      title: string | null;
      helpText: string | null;
      required: boolean;
      minOptions: number;
      maxOptions: number | null;
    }[];
    uuid: string;
    desc: string | null;
    name: string;
    img: string;
  }[];
}

export function DataMenuProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const documentDefined = typeof document !== "undefined";
  const params = useParams<{ identifier: string }>();

  const [isFetching, setIsFetching] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState<IData>({} as IData);

  useEffect(() => {
    (async () => {
      try {
        setIsFetching(true);
        const result = await getMenuOnline(params.identifier!);

        if (result.titlePage) {
          if (!documentDefined) return;
          if (document.title !== result.titlePage)
            document.title = result.titlePage + " | Cardápio digital";
        }
        const src = api.getUri() + "/public/images/";
        try {
          await preloadImage(src + result.logoImg);
          result.logoImg = src + result.logoImg;
        } catch (error) {
          result.logoImg = "";
        }
        try {
          await preloadImage(src + result.capaImg);
          result.capaImg = src + result.capaImg;
        } catch (error) {
          result.capaImg = "";
        }

        const categories = await Promise.all(
          result.categories.map(async (item) => {
            try {
              if (item.image45x45png) {
                await preloadImage(src + item.image45x45png);
                item.image45x45png = src + item.image45x45png;
              }

              item.items = await Promise.all(
                item.items.map(async (sec) => {
                  if (sec.img) {
                    sec.img = src + sec.img;
                  }

                  sec.sections = await Promise.all(
                    sec.sections.map(async (sub) => {
                      sub.subItems = await Promise.all(
                        sub.subItems.map(async (sub2) => {
                          if (sub2.image55x55png) {
                            sub2.image55x55png = src + sub2.image55x55png;
                          }
                          return sub2;
                        }),
                      );
                      return sub;
                    }),
                  );
                  return sec;
                }),
              );
              return item;
            } catch (error) {
              return item;
            }
          }),
        );
        const items = Array.from(
          new Map(
            categories
              .flatMap((c) => c.items) // 👈 flatten
              .map((item) => [item.uuid, item]), // 👈 chave única
          ).values(),
        );
        setData({ ...result, categories, items });
        setIsFetching(false);
      } catch (error) {
        setIsError(true);
        setIsFetching(false);
        if (error instanceof AxiosError) {
          if (error.response?.status === 400) {
            const dataError = error.response?.data as ErrorResponse_I;
            if (dataError.toast.length) dataError.toast.forEach(toaster.create);
          }
        }
        throw error;
      }
    })();
  }, [params.identifier]);

  const dataValue = useMemo(() => data, [data]);

  if (isFetching) {
    return (
      <div className="h-svh overflow-y-hidden flex gap-y-2 flex-col justify-center items-center">
        <Spinner size={"lg"} />
        <span className="text-black/40">Buscando cardápio</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-svh overflow-y-hidden flex gap-y-5 flex-col justify-center items-center">
        <ImageUI
          src="/undraw_page-not-found.svg"
          style={{ width: "100%", maxWidth: "250px", height: "auto" }}
        />
        <span className="text-black/80">Cardápio não encontrado 😢</span>
      </div>
    );
  }

  return (
    <DataMenuContext.Provider value={dataValue}>
      {children}
    </DataMenuContext.Provider>
  );
}
