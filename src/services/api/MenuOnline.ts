import { TypePaymentMethods } from "@contexts/data-menu.context";
import { api } from "./index";

export async function createOrder({
  uuid,
  ...body
}: {
  type_delivery: "enviar" | "retirar";
  uuid: string;
  delivery_complement?: string;
  delivery_cep?: string;
  who_receives?: string;
  delivery_address?: string;
  payment_method?: string;
  payment_change_to: null | string;
  items: {
    qnt: number;
    obs?: string;
    uuid: string;
    sections?: Record<string, Record<string, number>>;
  }[];
}): Promise<{
  redirectTo: string;
}> {
  const { data } = await api.post(`/public/menu/${uuid}/order`, body);
  return { redirectTo: data.redirectTo };
}

export async function getMenuOnline(identifier: string): Promise<{
  status: boolean;
  uuid: string;
  logoImg: string;
  bg_primary: string | null;
  bg_secondary: string | null;
  bg_tertiary: string | null;
  bg_capa: string | null;
  titlePage: string | null;
  isChatbot: boolean;
  info: {
    address: string | null;
    state_uf: string | null;
    phone_contact: string | null;
    whatsapp_contact: string | null;
    city: string | null;
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
}> {
  const { data } = await api.get(`/public/menu/${identifier}`);
  if (data.csrfToken) {
    api.defaults.headers.common["X-XSRF-TOKEN"] = data.csrfToken;
  }

  return data.menu;
}
