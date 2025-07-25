import { useState, useEffect, useCallback } from "react";
import { z } from "zod";

export const FormSchema = z.object({
  address: z.string().min(1),
  cep: z.string().length(9),
  persona: z.string().min(1),
  complement: z.string().optional(),
});
export type Fields = z.infer<typeof FormSchema>;

const STORAGE_KEY = "address_jun";

export function useAddressStore() {
  const [address, setAddress] = useState<Fields | null>(null);

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

  const upsertAddress = useCallback((data: Fields) => {
    const parsed = FormSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.format()._errors.join("; "));
    }
    setAddress(parsed.data);
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
