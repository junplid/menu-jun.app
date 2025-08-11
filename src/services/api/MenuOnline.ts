import { api } from "./index";

export async function createOrder({
  uuid,
  ...body
}: {
  uuid: string;
  delivery_complement?: string;
  delivery_cep?: string;
  who_receives?: string;
  delivery_address?: string;
  payment_method?: string;
  items: {
    qnt: number;
    obs?: string;
    flavors?: { qnt: number; id: string }[];
    type: "pizza" | "drink";
    id: string;
  }[];
}): Promise<{
  redirect: string;
}> {
  const { data } = await api.post(`/public/menu/${uuid}/order`, body);
  return data.business;
}

export async function getMenuOnline(identifier: string): Promise<{
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
}> {
  const { data } = await api.get(`/public/menu/${identifier}`);
  return data.menu;
}
