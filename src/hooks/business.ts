import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as BusinessService from "../services/api/Business";
import { toaster } from "@components/ui/toaster";
import { AxiosError } from "axios";
import { ErrorResponse_I } from "../services/api/ErrorResponse";
import { UseFormSetError } from "react-hook-form";

export function useGetBusinessDetails(id: number) {
  return useQuery({
    queryKey: ["business-details", id],
    queryFn: async () => {
      try {
        return await BusinessService.getBusinessDetails(id);
      } catch (error) {
        if (error instanceof AxiosError) {
          // if (error.response?.status === 401) logout();
          if (error.response?.status === 400) {
            const dataError = error.response?.data as ErrorResponse_I;
            if (dataError.toast.length) dataError.toast.forEach(toaster.create);
          }
        }
        throw error;
      }
    },
  });
}

export function useGetBusiness(id: number) {
  return useQuery({
    queryKey: ["business", id],
    queryFn: async () => {
      try {
        return await BusinessService.getBusiness(id);
      } catch (error) {
        if (error instanceof AxiosError) {
          // if (error.response?.status === 401) logout();
          if (error.response?.status === 400) {
            const dataError = error.response?.data as ErrorResponse_I;
            if (dataError.toast.length) dataError.toast.forEach(toaster.create);
          }
        }
        throw error;
      }
    },
  });
}

export function useGetBusinesses(params?: { name?: string; page?: number }) {
  return useQuery({
    queryKey: ["businesses", params],
    queryFn: async () => {
      try {
        return await BusinessService.getBusinesses(params || {});
      } catch (error) {
        if (error instanceof AxiosError) {
          // if (error.response?.status === 401) logout();
          if (error.response?.status === 400) {
            const dataError = error.response?.data as ErrorResponse_I;
            if (dataError.toast.length) dataError.toast.forEach(toaster.create);
          }
        }
        throw error;
      }
    },
  });
}

export function useGetBusinessesOptions(params?: {
  name?: string;
  filterIds?: number[];
}) {
  return useQuery({
    queryKey: ["businesses-options", params],
    queryFn: async () => {
      try {
        return await BusinessService.getOptionsBusinesses(params || {});
      } catch (error) {
        if (error instanceof AxiosError) {
          // if (error.response?.status === 401) logout();
          if (error.response?.status === 400) {
            const dataError = error.response?.data as ErrorResponse_I;
            if (dataError.toast.length) dataError.toast.forEach(toaster.create);
          }
        }
        throw error;
      }
    },
  });
}

export function useCreateBusiness(props?: {
  setError?: UseFormSetError<{ name: string; description?: string }>;
  onSuccess?: () => Promise<void>;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; description?: string }) =>
      BusinessService.createBusiness(body),
    async onSuccess(data, { name, description }) {
      if (props?.onSuccess) await props.onSuccess();
      await queryClient.setQueryData(["business", data.id], () => ({
        name,
        description,
      }));

      if (queryClient.getQueryData<any>(["businesses", null])) {
        queryClient.setQueryData(["businesses", null], (old: any) => {
          if (!old) return old;
          return [{ ...data, name }, ...old];
        });
      }

      if (queryClient.getQueryData<any>(["businesses-options", null])) {
        queryClient.setQueryData(["businesses-options", null], (old: any) => [
          ...(old || []),
          { id: data.id, name },
        ]);
      }
    },
    onError(error: unknown) {
      if (error instanceof AxiosError) {
        // if (error.response?.status === 401) logout();
        if (error.response?.status === 400) {
          const dataError = error.response?.data as ErrorResponse_I;
          if (dataError.toast.length) dataError.toast.forEach(toaster.create);
          if (dataError.input.length) {
            dataError.input.forEach(({ text, path }) =>
              // @ts-expect-error
              props?.setError?.(path, { message: text })
            );
          }
        }
      }
    },
  });
}

export function useUpdateBusiness(props?: {
  setError?: UseFormSetError<{ name?: string; description?: string }>;
  onSuccess?: () => Promise<void>;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: { name?: string; description?: string | null };
    }) => BusinessService.updateBusiness(id, body),
    async onSuccess({ updateAt }, { id, body }) {
      if (props?.onSuccess) await props.onSuccess();
      queryClient.setQueryData(["business-details", id], (old: any) => {
        if (!old) return old;
        return { ...old, ...body, updateAt };
      });
      queryClient.setQueryData(["business", id], (old: any) => ({
        ...old,
        ...body,
      }));

      if (queryClient.getQueryData<any>(["businesses", null])) {
        queryClient.setQueryData(["businesses", null], (old: any) =>
          old?.map((b: any) => {
            if (b.id === id) b = { ...b, ...body };
            return b;
          })
        );
      }
      if (queryClient.getQueryData<any>(["businesses-options", null])) {
        queryClient.setQueryData(["businesses-options", null], (old: any) =>
          old?.map((b: any) => {
            if (b.id === id) b = { ...b, name: body.name || b.name };
            return b;
          })
        );
      }
    },
    onError(error: unknown) {
      if (error instanceof AxiosError) {
        // if (error.response?.status === 401) logout();
        if (error.response?.status === 400) {
          const dataError = error.response?.data as ErrorResponse_I;
          if (dataError.toast.length) dataError.toast.forEach(toaster.create);
          if (dataError.input.length) {
            dataError.input.forEach(({ text, path }) =>
              // @ts-expect-error
              props?.setError?.(path, { message: text })
            );
          }
        }
      }
    },
  });
}

export function useDeleteBusiness(props?: { onSuccess?: () => Promise<void> }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => BusinessService.deleteBusiness(id),
    async onSuccess(_, id) {
      if (props?.onSuccess) await props.onSuccess();
      queryClient.removeQueries({ queryKey: ["business-details", id] });
      queryClient.removeQueries({ queryKey: ["business", id] });
      queryClient.setQueryData(["businesses", null], (old: any) =>
        old?.filter((b: any) => b.id !== id)
      );
      queryClient.setQueryData(["businesses-options", null], (old: any) =>
        old?.filter((b: any) => b.id !== id)
      );
    },
    onError(error: unknown) {
      if (error instanceof AxiosError) {
        // if (error.response?.status === 401) logout();
        if (error.response?.status === 400) {
          const dataError = error.response?.data as ErrorResponse_I;
          if (dataError.toast.length) dataError.toast.forEach(toaster.create);
        }
      }
    },
  });
}
