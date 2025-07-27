import { createContext } from "react";

export type ItemCart =
  | {
      key: string;
      type: "pizza";
      size: string;
      flavors: string[];
      obs?: string;
      price: number;
    }
  | {
      key: string;
      type: "drink";
      name: string;
      desc?: string;
      price: number;
    };

interface ICartContext {
  addItem: (item: Omit<ItemCart, "key">) => void;
  removeItem: (key: string) => void;
  items: ItemCart[];
}

export const CartContext = createContext({} as ICartContext);
