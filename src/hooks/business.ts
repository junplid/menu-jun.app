import { useQuery } from "@tanstack/react-query";
import * as MenuOnlineService from "../services/api/MenuOnline";
import { toaster } from "@components/ui/toaster";
import { AxiosError } from "axios";
import { ErrorResponse_I } from "../services/api/ErrorResponse";

export function useGetMenuOnline(identifier: string) {
  return useQuery({
    queryKey: ["menu", identifier],
    queryFn: async () => {
      try {
        return await MenuOnlineService.getMenuOnline(identifier);
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

// export function useCreateBusiness(props?: {
//   setError?: UseFormSetError<{ name: string; description?: string }>;
//   onSuccess?: () => Promise<void>;
// }) {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (body: { name: string; description?: string }) =>
//       BusinessService.createBusiness(body),
//     async onSuccess(data, { name, description }) {
//       if (props?.onSuccess) await props.onSuccess();
//       await queryClient.setQueryData(["business", data.id], () => ({
//         name,
//         description,
//       }));

//       if (queryClient.getQueryData<any>(["businesses", null])) {
//         queryClient.setQueryData(["businesses", null], (old: any) => {
//           if (!old) return old;
//           return [{ ...data, name }, ...old];
//         });
//       }

//       if (queryClient.getQueryData<any>(["businesses-options", null])) {
//         queryClient.setQueryData(["businesses-options", null], (old: any) => [
//           ...(old || []),
//           { id: data.id, name },
//         ]);
//       }
//     },
//     onError(error: unknown) {
//       if (error instanceof AxiosError) {
//         // if (error.response?.status === 401) logout();
//         if (error.response?.status === 400) {
//           const dataError = error.response?.data as ErrorResponse_I;
//           if (dataError.toast.length) dataError.toast.forEach(toaster.create);
//           if (dataError.input.length) {
//             dataError.input.forEach(({ text, path }) =>
//               // @ts-expect-error
//               props?.setError?.(path, { message: text })
//             );
//           }
//         }
//       }
//     },
//   });
// }
