import { create } from "zustand";

type Size = {
  name: string;
  qntFlavors: number;
};

type Flavor = {
  name: string;
  qnt: number;
};

interface PizzaState {
  sizeSelected: Size | null;
  setSizeSelected: (size: Size | null) => void;

  flavorsSelected: Flavor[];
  setFlavorsSelected: (flavors: Flavor[]) => void;
  addFlavor: (flavor: Flavor) => void;
  removeFlavor: (name: string) => void;
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
  removeFlavor: (name: string) => {
    set((state) => ({
      flavorsSelected: state.flavorsSelected.filter((s) => s.name !== name),
    }));
  },

  reset: () =>
    set({
      sizeSelected: null,
      flavorsSelected: [],
    }),
}));
