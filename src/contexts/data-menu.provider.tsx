import { ReactNode, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { JSX } from "@emotion/react/jsx-runtime";
import { AxiosError } from "axios";
import { ErrorResponse_I } from "../services/api/ErrorResponse";
import { toaster } from "@components/ui/toaster";
import { getMenuOnline } from "../services/api/MenuOnline";
import { DataMenuContext } from "./data-menu.context";
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
  uuid: string;
  logoImg: string;
  bg_primary: string | null;
  bg_secondary: string | null;
  bg_tertiary: string | null;
  label1: string | null;
  label: string | null;
  titlePage: string | null;
  status: boolean;
  sizes: {
    id: number;
    uuid: string;
    name: string;
    price: number;
    flavors: number;
    slices: number | null;
  }[];
  items: {
    uuid: string;
    desc: string | null;
    name: string;
    category: "pizzas" | "drinks";
    img: string;
    qnt: number;
    beforePrice: number | null;
    afterPrice: number | null;
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
    if (data.titlePage) {
      if (!documentDefined) return;
      if (document.title !== data.titlePage)
        document.title = data.titlePage + " | Junplid Cardápio on-line";
    }
  }, [data]);

  useEffect(() => {
    (async () => {
      try {
        setIsFetching(true);
        const result = await getMenuOnline(params.identifier!);
        const src = api.getUri() + "/public/storage/";
        try {
          await preloadImage(src + result.logoImg);
          result.logoImg = src + result.logoImg;
        } catch (error) {
          result.logoImg = "";
        }
        const nextList = await Promise.all(
          result.items.map(async (item) => {
            try {
              await preloadImage(src + item.img);
              item.img = src + item.img;
              return item;
            } catch (error) {
              return item;
            }
          })
        );
        setData({ ...result, items: nextList });
        setIsFetching(false);
      } catch (error) {
        console.log(error);
        setIsError(true);
        if (error instanceof AxiosError) {
          // if (error.response?.status === 401) logout();
          if (error.response?.status === 400) {
            const dataError = error.response?.data as ErrorResponse_I;
            if (dataError.toast.length) dataError.toast.forEach(toaster.create);
          }
        }
        throw error;
      }
    })();
  }, [params.identifier]);

  const dataValue = useMemo(() => data!, [data]);

  if (isFetching) {
    return (
      <div className="h-svh overflow-y-hidden flex gap-y-5 flex-col justify-center items-center">
        <Spinner />
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
