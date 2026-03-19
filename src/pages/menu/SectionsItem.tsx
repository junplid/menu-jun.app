import {
  RefObject,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "react-spring-bottom-sheet/dist/style.css";
import { BottomSheet, BottomSheetRef } from "react-spring-bottom-sheet";
import { MdDeleteOutline, MdOutlineCheckBoxOutlineBlank, MdRadioButtonChecked, MdRadioButtonUnchecked } from "react-icons/md";
import { Button, IconButton } from "@chakra-ui/react";
import clsx from "clsx";
import { DataMenuContext } from "@contexts/data-menu.context";
import { formatToBRL } from "brazilian-values";
import { AiFillCheckCircle } from "react-icons/ai";
import { CartContext } from "@contexts/cart.context";
import { useSearchParams } from "react-router-dom";
import opacity from "hex-color-opacity";
import { IoMdCheckbox, IoMdClose } from "react-icons/io";
import { LuClipboardCheck } from "react-icons/lu";

interface Props {
  defaultStateSection?: RefObject<{
    sections: Record<string, Record<string, number>>;
    length: number;
    key: string;
  } | null>;
}

export function SectionsItems({ defaultStateSection }: Props) {
  const [searchParams] = useSearchParams();
  const isOpen = searchParams.get("s");

  const { items, bg_capa } = useContext(DataMenuContext);
  const sheetRef = useRef<BottomSheetRef>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [isEdit, setIsEdit] = useState(false);
  const [length, setLength] = useState(1);
  const [sectionError, setSectionError] = useState("");

  const { addItem: addCartItem, replaceItem } = useContext(CartContext);

  const [stateSection, setStateSection] = useState<{
    [uuid: string]: { [subItem: string]: number };
  } | null>(null);

  useEffect(() => {
    if (!!isOpen) {
      if (defaultStateSection?.current) {
        setIsEdit(true);
      }
      setStateSection(defaultStateSection?.current?.sections || null);
      setLength(defaultStateSection?.current?.length || 1);
    } else {
      setIsEdit(false);
      setLength(1);
      setStateSection(null);
      if (defaultStateSection?.current) {
        defaultStateSection.current = null;
      }
    }
  }, [!!isOpen]);

  const totalSection = useMemo(() => {
    const Item = items.find((item) => item.uuid === isOpen);
    if (Item?.sections) {
      const totalInSection = Object.entries(stateSection || {}).reduce(
        (ac, [sectionUuid, subItems]) => {
          const section = Item.sections.find((s) => s.uuid === sectionUuid);
          if (section) {
            ac += Object.entries(subItems).reduce(
              (subAc, [subUuuid, subLength]) => {
                const priceSubitem =
                  section.subItems.find((item) => item.uuid === subUuuid)
                    ?.after_additional_price || 0;
                subAc += priceSubitem * subLength;
                return subAc;
              },
              0,
            );
          }
          return ac;
        },
        0,
      );

      const total = totalInSection;
      return total;
    }
    return 0;
  }, [stateSection]);

  const scrollToSection = (uuid: string) => {
    const el = sectionRefs.current[uuid];
    const container = document.querySelector("[data-rsbs-scroll]");

    if (!el || !container) return;

    const elRect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const offset = elRect.top - containerRect.top + container.scrollTop;

    container.scrollTo({
      top: offset,
      behavior: "smooth",
    });
  };

  const handleVerifyStateSection = () =>
    new Promise((res, rej) => {
      for (const section of items.find((s) => s.uuid === isOpen)?.sections ||
        []) {
        const total = Object.entries(stateSection?.[section.uuid] || {}).reduce(
          (ac, [_, value]) => {
            ac += value;
            return ac;
          },
          0,
        );
        if (total < section.minOptions) {
          setSectionError(section.uuid);
          setTimeout(() => {
            setSectionError("");
          }, 2000);
          scrollToSection(section.uuid);
          return rej();
        }
      }
      return res(undefined);
    });

  return (
    <BottomSheet
      open={!!isOpen}
      snapPoints={({ maxHeight }) => [maxHeight]}
      ref={sheetRef}
      scrollLocking={false}
      blocking={false}
      expandOnContentDrag
      header={
        <div className="flex sticky max-w-lg mx-auto top-0 w-full items-start gap-x-2 justify-between">
          <div className={clsx("flex gap-x-2 items-center")}>
            {!isEdit && (
              <IconButton
                size={"xs"}
                colorPalette={"red"}
                variant={"subtle"}
                onClick={() => {
                  window.history.back()
                }}
                className="duration-100 active:scale-95 transition-all"
              >
                <MdDeleteOutline />
              </IconButton>
            )}
            <span className="font-bold text-neutral-700">
              {items.find((s) => s.uuid === isOpen)?.name}
            </span>
          </div>
        </div>
      }
      footer={
        <div className="flex max-w-lg mx-auto justify-between bg-white items-center">
          <div className="flex gap-x-1">
            <a
              className={clsx(
                "bg-green-200 duration-100 active:scale-95 transition-all text-green-600 text-lg leading-0 w-8 h-8 flex items-center justify-center rounded-md",
                "hover:bg-green-300 duration-200 cursor-pointer",
              )}
              onClick={() => setLength(length + 1)}
            >
              +
            </a>
            <span className="bg-white text-neutral-800 border border-zinc-100 text-sm w-8 h-8 flex items-center justify-center rounded-md">
              {length}
            </span>
            <a
              onClick={() => length > 1 && setLength(length - 1)}
              className={clsx(
                "bg-red-200 duration-100 active:scale-95 transition-all text-red-600 w-8 h-8 text-lg leading-0 flex items-center justify-center rounded-md",
                length == 1
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-red-300 cursor-pointer",
              )}
            >
              -
            </a>
          </div>
          {!isEdit && (
            <Button
              size={"md"}
              colorPalette={"green"}
              variant={"subtle"}
              onClick={async () => {
                const item = items.find((item) => item.uuid === isOpen);
                if (item) {
                  await handleVerifyStateSection()
                    .then(() => {
                      const carttotal =
                        (items.find((item) => item.uuid === isOpen)
                          ?.afterPrice || 0) + totalSection;
                      addCartItem({
                        qnt: length,
                        total: carttotal,
                        uuid: item.uuid,
                        sections: stateSection || undefined,
                      });
                      window.history.back();
                    })
                    .catch(() => undefined);
                }
              }}
            // disabled={
            //   sizes.find((s) => s.uuid === sizeSelected)?.flavors ===
            //   qntFlavorsMissing
            // }
            >
              <span>
                Adicionar{" "}
                {formatToBRL(
                  ((items.find((item) => item.uuid === isOpen)?.afterPrice ||
                    0) +
                    totalSection) *
                  length,
                )}
              </span>
            </Button>
          )}
          {isEdit && (
            <div className="flex gap-x-2">
              <Button
                size={"md"}
                colorPalette={"red"}
                variant={"ghost"}
                onClick={() => {
                  window.history.back();
                }}
                className="duration-100 active:scale-95 transition-all"
              >
                <IoMdClose />
              </Button>
              <Button
                size={"md"}
                colorPalette={"teal"}
                variant={"subtle"}
                onClick={async () => {
                  await handleVerifyStateSection()
                    .then(() => {
                      const item = items.find((item) => item.uuid === isOpen);
                      if (item) {
                        if (defaultStateSection?.current?.key) {
                          const carttotal =
                            (items.find((item) => item.uuid === isOpen)
                              ?.afterPrice || 0) + totalSection;
                          replaceItem(defaultStateSection.current.key, {
                            qnt: length,
                            total: carttotal,
                            sections: stateSection || undefined,
                          });
                          window.history.back();
                        }
                      }
                    })
                    .catch(() => undefined);
                }}
                className="duration-100 active:scale-95 transition-all"
              // disabled={
              //   sizes.find((s) => s.uuid === sizeSelected)?.flavors ===
              //   qntFlavorsMissing
              // }
              >
                <span className="flex items-center gap-x-1.5">
                  <LuClipboardCheck />
                  {formatToBRL(
                    ((items.find((item) => item.uuid === isOpen)?.afterPrice ||
                      0) +
                      totalSection) *
                    length,
                  )}
                </span>
              </Button>
            </div>
          )}
        </div>
      }
    >
      {items
        .find((s) => s.uuid === isOpen)
        ?.sections.map((section) => {
          const total = Object.entries(
            stateSection?.[section.uuid] || {},
          ).reduce((ac, [_, value]) => {
            ac += value;
            return ac;
          }, 0);

          return (
            <div
              key={section.uuid}
              className="max-w-lg mx-auto scroll-auto gap-y-2"
              ref={(el) => {
                sectionRefs.current[section.uuid] = el;
              }}
            >
              <div
                className={clsx(
                  "sticky px-3 top-0 z-20 border-b gap-x-2 bg-white border-neutral-100",
                  !section.helpText ? "items-center flex py-4" : "py-2",
                )}
              >
                <span className="font-semibold line-clamp-2 text-start w-full text-neutral-700">
                  {section.title}
                </span>
                {(section.helpText ||
                  section.minOptions ||
                  section.maxOptions) && (
                    <div className="flex justify-between items-start">
                      <p className="line-clamp-2 text-neutral-500 font-light text-start">
                        {section.helpText}
                      </p>
                      {(section.minOptions || section.maxOptions) && (
                        <div className="flex gap-x-1 items-center">
                          <span
                            className={clsx(
                              `px-1 py-0.5 text-xs text-nowrap rounded-sm font-medium`,
                              total >= (section.minOptions || 0)
                                ? "bg-green-600 text-green-100"
                                : "bg-neutral-700 text-neutral-100",
                            )}
                          >
                            {section.maxOptions ? (
                              `${total}/${section.maxOptions}`
                            ) : (
                              `${total} (mín. ${section.minOptions})`
                            )}
                          </span>
                          {section.minOptions > 0 ? (
                            <div className="flex">
                              {total < (section.minOptions || Infinity) && (
                                <span
                                  className={clsx(
                                    "text-neutral-100 text-xs font-medium px-1 py-0.5 rounded-sm",
                                    sectionError === section.uuid
                                      ? "animate-error"
                                      : "bg-neutral-700",
                                  )}
                                >
                                  OBRIGATÓRIO
                                </span>
                              )}
                              {total >= (section.minOptions || Infinity) && (
                                <span className="bg-green-600 text-xs text-green-100 font-medium px-1 py-0.5 block rounded-sm">
                                  <AiFillCheckCircle size={16} />
                                </span>
                              )}
                            </div>
                          ) : (
                            <div>
                              {total === (section.maxOptions || Infinity) && (
                                <span className="bg-green-600 text-xs text-green-100 font-medium px-1 py-0.5 block rounded-sm">
                                  <AiFillCheckCircle size={16} />
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
              </div>
              <div className="space-y-2 my-2">
                {section.subItems.map((sub) => {
                  const value = stateSection?.[section.uuid]?.[sub.uuid] || 0;
                  let background = "";
                  let border = "";
                  let color = "";

                  if (bg_capa) {
                    background = opacity(!!value ? bg_capa : "#f4f4f5", !!value ? 0.2 : 1)
                    border = opacity(bg_capa, !!value ? 0.3 : 0);
                    color = !!value ? bg_capa : "#525252"
                  } else {
                    background = opacity(!!value ? "#dcfce7" : "#f4f4f5", !!value ? 0.6 : 1);
                    border = opacity("#00c951", !!value ? 1 : 0);
                    color = !!value ? "#008236" : "#525252"
                  }

                  return (
                    <div
                      key={sub.uuid}
                      className={clsx(
                        "select-none w-full relative flex-1 px-2",
                        (section.maxOptions === null ||
                          section.maxOptions >= 1) &&
                        sub.maxLength === 1 &&
                        "",
                      )}
                      onClick={() => {
                        if (!sub.status) return;
                        setStateSection((state) => {
                          let newState = { ...(state ?? {}) };
                          const v =
                            stateSection?.[section.uuid]?.[sub.uuid] || 0;

                          if (!newState[section.uuid]) {
                            newState[section.uuid] = {};
                          }

                          // pode selecionar varias opções
                          if (section.maxOptions === null || section.maxOptions > 1) {
                            if (sub.maxLength === 0) {
                              // mas o item não pode ser escolhido;
                            } else if (sub.maxLength === null || sub.maxLength > 1) {
                              // o item pode ser escolhido +1 vez; 
                              if (total < (section.maxOptions || Infinity)) {
                                const next = Math.min(
                                  v + 1,
                                  sub.maxLength || Infinity,
                                  section.maxOptions || Infinity,
                                );
                                newState[section.uuid][sub.uuid] = next;
                              }
                            } else if (sub.maxLength === 1) {
                              // o item pode ser escolhido 1 vez;
                              if (v === 1) {
                                const { [sub.uuid]: _, ...rest } = newState[section.uuid];
                                if (Object.keys(rest).length) {
                                  newState[section.uuid] = rest;
                                } else {
                                  const { [section.uuid]: _, ...restState } = newState;
                                  newState = restState
                                }
                              } else {
                                if (total < (section.maxOptions || Infinity)) {
                                  newState[section.uuid][sub.uuid] = 1;
                                }
                              }
                            }
                          } else {
                            // pode apenas 1 item por vez
                            if (sub.maxLength === 0) {
                              // o item não pode ser escolhido;
                            } else {
                              if (v === 1) {
                                const { [section.uuid]: _, ...rest } = newState;
                                newState = rest;
                              } else {
                                // pegar todos os items da seção e tornar zero.
                                // atulizar o atual para 1
                                newState[section.uuid] = {};
                                newState[section.uuid][sub.uuid] = 1;
                                // manda para a proxima section
                                // const sections = items.find(
                                //   (s) => s.uuid === openSectionItem,
                                // )?.sections;
                                // if (sections) {
                                //   if (sections[sectionIndex + 1]?.uuid) {
                                //     scrollToSection(
                                //       sections[sectionIndex + 1].uuid,
                                //     );
                                //   }
                                // }
                              }
                            }
                          }

                          return newState;
                        });
                      }}
                    >
                      <div
                        className={clsx(
                          "flex flex-col p-3 gap-y-1.5 rounded-md border-2 justify-between",
                          (!sub.status || sub.maxLength === 0) && "opacity-40"
                        )}
                        style={{ background, borderColor: border }}

                      >
                        <div className="flex px-1 w-full items-center justify-between">
                          <div
                            className={clsx(
                              "flex gap-x-2",
                              !sub.desc ? "items-center" : "items-start",
                            )}
                          >
                            {sub.image55x55png && (
                              <img
                                src={sub.image55x55png}
                                className="rounded-sm"
                                alt="img"
                                width={"55px"}
                                height={"55px"}
                              />
                            )}
                            <div className="flex flex-col -space-y-1">
                              <span style={{ color }}>
                                {sub.name} {(!sub.status || sub.maxLength === 0) && <span className="bg-neutral-400 text-sm px-1 py-0.5 rounded-sm text-white">Indisponível</span>}
                              </span>
                              {sub.desc && (
                                <span
                                  className={clsx(
                                    !!value
                                      ? "text-green-600"
                                      : "text-neutral-500",
                                    "font-light",
                                  )}
                                  style={{ color: opacity(color, 0.6) }}
                                >
                                  {sub.desc}
                                </span>
                              )}
                              <div className="flex mt-1 items-center gap-x-2">
                                {sub.after_additional_price && (
                                  <span
                                    className={"font-medium"}
                                    style={{ color }}                                  >
                                    {formatToBRL(sub.after_additional_price)}
                                  </span>
                                )}
                                {sub.before_additional_price && (
                                  <span className="text-neutral-600 line-through text-xs font-light">
                                    {formatToBRL(sub.before_additional_price)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          {((section.maxOptions === null && sub.maxLength === null) || (section.maxOptions && section.maxOptions > 1 && (sub.maxLength === null || sub.maxLength > 1)) || (section.maxOptions === null && sub.maxLength > 1)) && (
                            <div className="flex gap-x-1">
                              <a
                                className={clsx(
                                  "bg-green-200 z-10 duration-100 scale-100 active:scale-95 text-green-600 text-lg leading-0 w-6 h-6 flex items-center justify-center rounded-md",
                                  (sub.maxLength || section.maxOptions) ===
                                    value || total === section.maxOptions
                                    ? "opacity-40 cursor-not-allowed"
                                    : "hover:bg-green-300 duration-200 cursor-pointer",
                                )}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!sub.status) return;
                                  setStateSection((state) => {
                                    const newState = { ...(state ?? {}) };
                                    const v =
                                      stateSection?.[section.uuid]?.[
                                      sub.uuid
                                      ] || 0;

                                    if (!newState[section.uuid]) {
                                      newState[section.uuid] = {};
                                    }
                                    if (
                                      total < (section.maxOptions || Infinity)
                                    ) {
                                      const next = Math.min(
                                        v + 1,
                                        sub.maxLength || Infinity,
                                        section.maxOptions || Infinity,
                                      );
                                      newState[section.uuid][sub.uuid] = next;
                                    }
                                    return newState;
                                  });
                                }}
                              >
                                +
                              </a>
                              <span className="bg-white text-neutral-800 border border-zinc-100 text-sm w-6 h-6 flex items-center justify-center rounded-md">
                                {value}
                              </span>
                              <a
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!sub.status) return;
                                  setStateSection((state) => {
                                    let newState = { ...(state ?? {}) };
                                    const v =
                                      stateSection?.[section.uuid]?.[
                                      sub.uuid
                                      ] || 0;

                                    if (!newState[section.uuid]) {
                                      newState[section.uuid] = {};
                                    }
                                    const next = Math.max(v - 1, 0);
                                    if (!next) {
                                      const { [sub.uuid]: _, ...rest } = newState[section.uuid];
                                      if (Object.keys(rest).length) {
                                        newState[section.uuid] = rest;
                                      } else {
                                        const { [section.uuid]: _, ...restState } = newState;
                                        newState = restState
                                      }
                                    } else {
                                      newState[section.uuid][sub.uuid] = next;
                                    }
                                    return newState;
                                  });
                                }}
                                className={clsx(
                                  "bg-red-200 duration-100 active:scale-95 transition-all text-red-600 w-6 h-6 text-lg leading-0 flex items-center justify-center rounded-md",
                                  value == 0
                                    ? "opacity-40 cursor-not-allowed"
                                    : "hover:bg-red-300 cursor-pointer",
                                )}
                              >
                                -
                              </a>
                            </div>
                          )}
                          {((section.maxOptions === null && sub.maxLength === 1) || (section.maxOptions && section.maxOptions > 1 && sub.maxLength === 1)) && (
                            <button
                              type="button"
                              style={{ color: color }}
                              className="flex items-center justify-center"
                            >
                              {value ? (
                                <IoMdCheckbox size={22} />
                              ) : (
                                <MdOutlineCheckBoxOutlineBlank size={22} />
                              )}
                            </button>
                          )}
                          {((section.maxOptions === 1 && sub.maxLength === null) || (section.maxOptions === 1 && sub.maxLength >= 1)) && (
                            <button
                              type="button"
                              style={{ color: color }}
                              className="flex items-center justify-center"
                            >
                              {value ? (
                                <MdRadioButtonChecked size={22} />
                              ) : (
                                <MdRadioButtonUnchecked size={22} />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
    </BottomSheet>
  );
}
