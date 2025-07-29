import { createContext } from "react";

export type ItemCart =
  | {
      qnt: number;
      key: string;
      type: "pizza";
      size: string;
      flavors: { qnt: number; name: string }[];
      obs?: string;
      priceBefore?: number;
      priceAfter: number;
    }
  | {
      qnt: number;
      key: string;
      type: "drink";
      name: string;
      desc?: string;
      priceBefore?: number;
      priceAfter: number;
      img: string;
    };

interface ICartContext {
  addItem: (item: ItemCart) => void;
  removeItem: (key: string) => void;
  items: ItemCart[];
  incrementQnt: (key: string, value: number) => void;
}

export const CartContext = createContext({} as ICartContext);
