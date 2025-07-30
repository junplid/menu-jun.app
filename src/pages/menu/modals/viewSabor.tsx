import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@components/ui/dialog";
import { JSX, useMemo, useState } from "react";
import { Button } from "@chakra-ui/react";
import clsx from "clsx";
import { usePizzaStore } from "../../../store/useStore";

interface IProps {
  name: string;
  desc?: string;
  close: () => void;
}

export const ModalViewSabor: React.FC<IProps> = (props): JSX.Element => {
  const { sizeSelected, flavorsSelected, setFlavorsSelected, addFlavor } =
    usePizzaStore();
  const [selected, setSelected] = useState("");

  const qntFlavorsMissing = useMemo(() => {
    const totalQnt = flavorsSelected.reduce((p, c) => p + c.qnt, 0);
    return (sizeSelected?.qntFlavors || 0) - totalQnt;
  }, [sizeSelected?.qntFlavors, flavorsSelected]);

  return (
    <DialogContent backdrop w={"320px"}>
      <DialogHeader p={4} flexDirection={"column"} gap={0}>
        <DialogTitle className="text-yellow-600">{props.name}</DialogTitle>
      </DialogHeader>
      <DialogBody px={4} className="flex flex-col gap-y-2 -my-4 -mt-6">
        {props.desc && <p className="text-zinc-600">Com: {props.desc}</p>}
        <div className="flex flex-col">
          <span className="text-center">Sabores atuais da sua pizza</span>
          <span className="text-center font-medium text-zinc-400">
            Escolha um sabor para substituir
          </span>
          <div className="grid grid-cols-2 gap-2 gap-y-5 mt-5">
            {flavorsSelected.map((flavor, index) => (
              <div
                key={flavor.name}
                className="cursor-pointer"
                onClick={() =>
                  setSelected(selected === flavor.name ? "" : flavor.name)
                }
              >
                <div
                  className={clsx(
                    "flex flex-col p-2 h-[95px] rounded-md border justify-between",
                    selected === flavor.name
                      ? "border-red-400 bg-red-100/80"
                      : "border-zinc-200"
                  )}
                >
                  <span className="text-sm font-medium text-yellow-600">
                    {flavor.name}
                  </span>
                  <div className="flex gap-x-1">
                    <span className="bg-white border border-zinc-300 py-1 text-sm w-10 flex items-center justify-center rounded-md">
                      {flavor.qnt}
                    </span>
                    <a
                      className={clsx(
                        "bg-green-200 text-green-600 py-1 text-lg leading-0 w-8 flex items-center justify-center rounded-md",
                        qntFlavorsMissing
                          ? "hover:bg-green-300 duration-200 cursor-pointer"
                          : "opacity-30 cursor-not-allowed"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected("");
                        if (qntFlavorsMissing) {
                          setFlavorsSelected(
                            flavorsSelected.map((fl) => {
                              if (fl.name === flavor.name) fl.qnt += 1;
                              return fl;
                            })
                          );
                        }
                      }}
                    >
                      +
                    </a>
                    <a
                      className="bg-red-200 hover:bg-red-300 cursor-pointer text-red-600 duration-200 py-1 w-8 text-lg leading-0 flex items-center justify-center rounded-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected("");
                        const total = flavorsSelected[index].qnt - 1;
                        if (total === 0) {
                          setFlavorsSelected(
                            flavorsSelected.filter(
                              (s) => s.name !== flavor.name
                            )
                          );
                        } else {
                          setFlavorsSelected(
                            flavorsSelected.map((fl) => {
                              if (fl.name === flavor.name) fl.qnt = total;
                              return fl;
                            })
                          );
                        }
                      }}
                    >
                      -
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {!!qntFlavorsMissing && (
          <span className="text-center">
            Ainda pode escolher mais{" "}
            {qntFlavorsMissing > 1
              ? `${qntFlavorsMissing} sabores`
              : `${qntFlavorsMissing} sabor`}{" "}
          </span>
        )}
      </DialogBody>
      <DialogFooter p={4} gap={2}>
        <Button
          colorPalette={"blue"}
          disabled={!selected}
          onClick={() => {
            const index = flavorsSelected.findIndex((s) => s.name === selected);
            const nextFlavors = flavorsSelected.filter(
              (s) => s.name !== selected
            );
            nextFlavors.splice(index, 0, { name: props.name, qnt: 1 });
            setFlavorsSelected(nextFlavors);
            props.close();
          }}
        >
          Substituir
        </Button>
        <Button
          colorPalette={"green"}
          disabled={qntFlavorsMissing < 1}
          onClick={() => {
            addFlavor({ name: props.name, qnt: 1 });
            props.close();
          }}
        >
          Adicionar sabor
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
