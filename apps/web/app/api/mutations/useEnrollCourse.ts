import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../api-client";

type EnrollCourseOptions = {
  id: string;
};

export function useEnrollCourse() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (options: EnrollCourseOptions) => {
      const response = await ApiClient.instance.post(`/api/course/${options.id}/enroll`);
      return response.data;
    },
    onSuccess: () => {
      toast({
        variant: "default",
        description: t("landing.courseDetail.enrolledSuccess"),
      });
      queryClient.invalidateQueries({ queryKey: ["course"] });
      queryClient.invalidateQueries({ queryKey: ["get-student-courses"] });
      queryClient.invalidateQueries({ queryKey: ["available-courses"] });
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
