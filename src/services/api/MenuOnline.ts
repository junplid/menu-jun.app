import { api } from "./index";

export async function createBusiness(body: {
  name: string;
  description?: string;
}): Promise<{
  id: number;
  createAt: Date;
  updateAt: Date;
}> {
  const { data } = await api.post("/private/businesses", body);
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
