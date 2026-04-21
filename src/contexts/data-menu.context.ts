import { createContext } from "react";

export type TypePaymentMethods =
  | "Dinheiro"
  | "Pix"
  | "Cartao_Credito"
  | "Cartao_Debito";

interface IDataMenuProps {
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
    lat?: number | null;
    lng?: number | null;
    address?: string | null;
    state_uf?: string | null;
    phone_contact?: string | null;
    whatsapp_contact?: string | null;
    city?: string | null;
    links?: string[];
    delivery_fee?: number;
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
}

export const DataMenuContext = createContext({} as IDataMenuProps);
