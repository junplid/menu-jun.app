import { createContext } from "react";

interface IDataMenuProps {
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
    uuid: string;
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
}

export const DataMenuContext = createContext({} as IDataMenuProps);
