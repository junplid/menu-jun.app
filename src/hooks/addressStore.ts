import { useState, useEffect, useCallback } from "react";
import { z } from "zod";

export const FormSchema = z
  .object({
    address: z
      .string()
      .min(1, { message: "Endereço de entrega é obrigatório" }),
    number: z.string().optional(),
    cep: z.string().length(9, { message: "CEP incompleto" }),
    persona: z.string().min(1, { message: "Quem recebe é obrigatório" }),
    reference_point: z.string().min(1, { message: "Campo obrigatório" }),
    complement: z.string().optional(),
    lat: z.number(),
    lng: z.number(),
  })
  .refine(
    (state) => {
      const cleaned = state.cep.replace(/_/g, "");
      return cleaned.length === 9;
    },
    { message: "CEP incompleto", path: ["cep"] },
  );
export type Fields = z.infer<typeof FormSchema>;

const STORAGE_KEY = "address_jun";

export function useAddressStore() {
  const [address, setAddress] = useState<Fields | "retirar" | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setAddress(JSON.parse(raw));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (address) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(address));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [address]);

  const upsertAddress = useCallback((data: Fields | "retirar") => {
    if (data !== "retirar") {
      const parsed = FormSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error(parsed.error.format()._errors.join("; "));
      }
      setAddress(parsed.data);
    }
    setAddress(data);
  }, []);

  const deleteAddress = useCallback(() => {
    setAddress(null);
  }, []);

  return {
    address,
    upsertAddress,
    deleteAddress,
  };
}
