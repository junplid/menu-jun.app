import { create } from "zustand";

type Flavor = {
  uuid: string;
  qnt: number;
};

interface PizzaState {
  sizeSelected: string | null;
  setSizeSelected: (size: string | null) => void;

  flavorsSelected: Flavor[];
  setFlavorsSelected: (flavors: Flavor[]) => void;
  addFlavor: (flavor: Flavor) => void;
  removeFlavor: (uuid: string) => void;
  reset: () => void;
}

export const usePizzaStore = create<PizzaState>((set) => ({
  sizeSelected: null,
  setSizeSelected: (size) => set({ sizeSelected: size }),

  flavorsSelected: [],
  setFlavorsSelected: (flavors) => set({ flavorsSelected: flavors }),
  addFlavor: (flavor) =>
    set((state) => ({
      flavorsSelected: [...state.flavorsSelected, flavor],
    })),
  removeFlavor: (uuid: string) => {
    set((state) => ({
      flavorsSelected: state.flavorsSelected.filter((s) => s.uuid !== uuid),
    }));
  },

  reset: () =>
    set({
      sizeSelected: null,
      flavorsSelected: [],
    }),
}));
