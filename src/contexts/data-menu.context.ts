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
  bg_primary: string | null;
  bg_secondary: string | null;
  bg_tertiary: string | null;
  titlePage: string | null;
  bg_capa: string | null;
  isChatbot: boolean;
  info: {
    address?: string | null;
    state_uf?: string | null;
    phone_contact?: string | null;
    whatsapp_contact?: string | null;
    city?: string | null;
    links?: string[];
    delivery_fee?: number;
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
    uuid: string;
    desc: string | null;
    categories: { id: number; uuid: string }[];
    name: string;
    img: string;
    qnt: number;
    sections: {
      subItems: {
        after_additional_price?: number;
        before_additional_price?: number;
        uuid: string;
        desc: string | null;
        name: string;
        status: boolean | null;
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
  }[];
}

export const DataMenuContext = createContext({} as IDataMenuProps);
