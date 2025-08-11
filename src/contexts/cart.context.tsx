import { createContext } from "react";

export type ItemCart =
  | {
      key: string;
      type: "pizza";
      uuid: string;
      qnt: number;
      flavors: { qnt: number; uuid: string }[];
      obs?: string;
    }
  | {
      key: string;
      type: "drink";
      uuid: string;
      qnt: number;
    };

interface ICartContext {
  addItem: (item: ItemCart) => void;
  removeItem: (key: string) => void;
  items: ItemCart[];
  payment_method: string;
  setPaymentMethod: (v: string) => void;
  incrementQnt: (key: string, value: number) => void;
}

export const CartContext = createContext({} as ICartContext);
