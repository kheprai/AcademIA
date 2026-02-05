import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../api-client";

export function useSendOTP() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (params: {
      phone: string;
      context?: "login" | "register";
      source?: "register" | "checkout";
      cartSnapshot?: Array<{
        courseId: string;
        title: string;
        priceInCents: number;
        mercadopagoPriceInCents?: number;
        currency: string;
      }>;
      termsAccepted?: boolean;
    }) => {
      const response = await ApiClient.instance.post("/api/auth/send-otp", params);
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.data?.debugUserNotFound) {
        toast({
          title: "Debug OTP",
          description: `El usuario con el numero ${data.data.debugUserNotFound} no existe`,
        });
        return;
      }
      if (data?.data?.debugCode) {
        toast({
          title: "Debug OTP",
          description: `Codigo: ${data.data.debugCode}`,
        });
      }
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        return toast({
          variant: "destructive",
          description: error.response?.data?.message ?? "Error enviando codigo",
        });
      }
      toast({
        variant: "destructive",
        description: error.message,
      });
    },
  });
}
