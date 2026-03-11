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
  bg_primary: string | null;
  bg_secondary: string | null;
  bg_tertiary: string | null;
  titlePage: string | null;
  bg_capa: string | null;
  info: {
    address: string | null;
    state_uf: string | null;
    phone_contact: string | null;
    whatsapp_contact: string | null;
    city: string | null;
    delivery_fee?: number;
    links: string[];
    payment_methods: TypePaymentMethods[];
  } | null;
  helperTextOpening: string;
  operatingDays: { day: string; time: string }[];
  categories: {
    id: number;
    uuid: string;
    name: string;
    image45x45png: string;
  }[];
  items: {
    afterPrice?: number;
    beforePrice?: number;
    sections: {
      subItems: {
        after_additional_price?: number;
        before_additional_price?: number;
        uuid: string;
        desc: string | null;
        name: string;
        image55x55png: string | null;
        maxLength: number;
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
    categories: { id: number; uuid: string }[];
    name: string;
    img: string;
    qnt: number;
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
        result.categories = await Promise.all(
          result.categories.map(async (cat) => {
            try {
              await preloadImage(src + cat.image45x45png);
              cat.image45x45png = src + cat.image45x45png;
              return cat;
            } catch (error) {
              return cat;
            }
          }),
        );
        const nextList = await Promise.all(
          result.items.map(async (item) => {
            try {
              await preloadImage(src + item.img);
              item.img = src + item.img;
              item.sections = await Promise.all(
                item.sections.map(async (sec) => {
                  sec.subItems = await Promise.all(
                    sec.subItems.map(async (sub) => {
                      try {
                        await preloadImage(src + sub.image55x55png);
                        sub.image55x55png = src + sub.image55x55png;
                        return sub;
                      } catch (error) {
                        return sub;
                      }
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
        setData({ ...result, items: nextList });
        setIsFetching(false);
      } catch (error) {
        setIsError(true);
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
