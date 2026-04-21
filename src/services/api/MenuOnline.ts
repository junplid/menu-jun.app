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
  delivery_lat?: number;
  delivery_lng?: number;
  delivery_number?: string;
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
  capaImg: string | null;
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
}> {
  const { data } = await api.get(`/public/menu/${identifier}`);
  if (data.csrfToken) {
    api.defaults.headers.common["X-XSRF-TOKEN"] = data.csrfToken;
  }

  return data.menu;
}
