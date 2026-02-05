import { useNavigate } from "@remix-run/react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "~/components/ui/use-toast";
import { useCartStore } from "~/lib/stores/cartStore";
import { useNavigationHistoryStore } from "~/lib/stores/navigationHistory";
import { useAuthStore } from "~/modules/Auth/authStore";
import { useCurrentUserStore } from "~/modules/common/store/useCurrentUserStore";
import { useAnnouncementsPopupStore } from "~/modules/Dashboard/store/useAnnouncementsPopupStore";

import { ApiClient } from "../api-client";
import { queryClient } from "../queryClient";

const PROTECTED_PREFIXES = [
  "/library",
  "/course/",
  "/admin",
  "/progress",
  "/settings",
  "/provider-information",
  "/announcements",
  "/profile/",
  "/qa/",
  "/articles/",
];

export function useLogoutUser() {
  const { toast } = useToast();
  const { setLoggedIn } = useAuthStore();
  const setCurrentUser = useCurrentUserStore((state) => state.setCurrentUser);
  const setIsVisible = useAnnouncementsPopupStore((state) => state.setIsVisible);
  const clearHistory = useNavigationHistoryStore((state) => state.clearHistory);

  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const response = await ApiClient.api.authControllerLogout();

      setCurrentUser(undefined);
      setLoggedIn(false);
      setIsVisible(true);
      useCartStore.getState().clearCart();
      queryClient.setQueryData(["currentUser"], null);

      return response.data;
    },
    onSuccess: async () => {
      await queryClient.cancelQueries();
      queryClient.clear();

      clearHistory();

      const pathname = window.location.pathname;
      const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

      if (isProtectedRoute) {
        navigate("/");
      }
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        return toast({
          variant: "destructive",
          description: error.response?.data.message,
        });
      }
      toast({
        variant: "destructive",
        description: error.message,
      });
    },
  });
}
