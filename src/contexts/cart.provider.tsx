import { ReactNode, useMemo, useState } from "react";
import { CartContext, ItemCart } from "./cart.context";
import { nanoid } from "nanoid";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ItemCart[]>([]);
  const [payment_method, setPaymentMethod] = useState<string>("PIX");

  const addItem = ({ qnt = 1, ...item }: Omit<ItemCart, "key" | "obs">) => {
    setItems([...items, { ...item, key: nanoid(), obs: "", qnt }]);
  };

  const removeItem = (key: string) => {
    setItems((itemsstate) => itemsstate.filter((s) => s.key !== key));
  };

  const replaceItem = (
    itemKey: string,
    { qnt = 1, ...item }: Omit<ItemCart, "obs" | "key" | "uuid">,
  ) => {
    setItems((itemsState) => {
      const index = itemsState.findIndex((s) => s.key === itemKey);
      if (index < 0) return itemsState;
      const newItems = [...itemsState];
      newItems[index] = { ...newItems[index], ...item, qnt };

      return newItems;
    });
  };

  const incrementQnt = (key: string, value: number) => {
    const itemIndex = items.findIndex((i) => i.key === key || i.uuid === key);
    if (itemIndex >= 0) {
      const total = items[itemIndex].qnt + value;
      console.log({ total });
      if (total === 0) {
        setItems((prev) =>
          prev.filter((item) => item.key !== key || item.uuid === key),
        );
      } else {
        setItems((prev) =>
          prev.map((i) => {
            if (i.key === key || i.uuid === key) i.qnt = total;
            return i;
          }),
        );
      }
    }
  };

  const changeObs = (key: string, value: string) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.key === key) i.obs = value;
        return i;
      }),
    );
  };

  const data_value = useMemo(() => {
    return {
      items,
      removeItem,
      addItem,
      incrementQnt,
      setPaymentMethod,
      changeObs,
      replaceItem,
      payment_method,
    };
  }, [items, payment_method]);

  return (
    <CartContext.Provider value={data_value}>{children}</CartContext.Provider>
  );
};
