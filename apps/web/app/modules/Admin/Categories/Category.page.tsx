import { useParams } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useUpdateCategory } from "~/api/mutations/admin/useUpdateCategory";
import { useUploadFile } from "~/api/mutations/admin/useUploadFile";
import { categoryByIdQueryOptions, useCategoryById } from "~/api/queries/admin/useCategoryById";
import { queryClient } from "~/api/queryClient";
import ImageUploadInput from "~/components/FileUploadInput/ImageUploadInput";
import { PageWrapper } from "~/components/PageWrapper";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import Loader from "~/modules/common/Loader/Loader";
import { setPageTitle } from "~/utils/setPageTitle";

import type { MetaFunction } from "@remix-run/react";

type CategoryFormValues = {
  title_en: string;
  title_es: string;
  slug: string;
  archived: boolean;
  showInMenu: boolean;
  displayOrder: number | null;
  heroTitle_en: string;
  heroTitle_es: string;
  heroSubtitle_en: string;
  heroSubtitle_es: string;
  heroCtaText_en: string;
  heroCtaText_es: string;
  heroCtaUrl: string;
  heroOverlayColor: string;
};

export const meta: MetaFunction = ({ matches }) => setPageTitle(matches, "pages.categoryDetails");

const Category = () => {
  const { id = "" } = useParams();
  const { t } = useTranslation();

  if (!id) throw new Error(t("adminCategoryView.error.categoryIdNotFound"));

  const { data: category, isLoading } = useCategoryById(id);
  const { mutateAsync: updateCategory } = useUpdateCategory();
  const { mutateAsync: uploadFile } = useUploadFile();

  const [heroImageS3Key, setHeroImageS3Key] = useState<string | null>(null);
  const [heroImagePreviewUrl, setHeroImagePreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
  } = useForm<CategoryFormValues>({
    defaultValues: {
      title_en: "",
      title_es: "",
      slug: "",
      archived: false,
      showInMenu: false,
      displayOrder: null,
      heroTitle_en: "",
      heroTitle_es: "",
      heroSubtitle_en: "",
      heroSubtitle_es: "",
      heroCtaText_en: "",
      heroCtaText_es: "",
      heroCtaUrl: "",
      heroOverlayColor: "",
    },
  });

  const heroOverlayColor = watch("heroOverlayColor");

  useEffect(() => {
    if (category) {
      const title = category.title as string | Record<string, string>;
      const heroTitle = category.heroTitle as Record<string, string> | null;
      const heroSubtitle = category.heroSubtitle as Record<string, string> | null;
      const heroCtaText = category.heroCtaText as Record<string, string> | null;

      reset({
        title_en: typeof title === "string" ? title : (title?.en ?? ""),
        title_es: typeof title === "string" ? "" : (title?.es ?? ""),
        slug: category.slug ?? "",
        archived: category.archived ?? false,
        showInMenu: category.showInMenu ?? false,
        displayOrder: category.displayOrder ?? null,
        heroTitle_en: heroTitle?.en ?? "",
        heroTitle_es: heroTitle?.es ?? "",
        heroSubtitle_en: heroSubtitle?.en ?? "",
        heroSubtitle_es: heroSubtitle?.es ?? "",
        heroCtaText_en: heroCtaText?.en ?? "",
        heroCtaText_es: heroCtaText?.es ?? "",
        heroCtaUrl: category.heroCtaUrl ?? "",
        heroOverlayColor: category.heroOverlayColor ?? "",
      });

      setHeroImageS3Key(category.heroImageS3Key ?? null);
      setHeroImagePreviewUrl(category.heroImageUrl ?? null);
    }
  }, [category, reset]);

  const handleHeroImageUpload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      try {
        const result = await uploadFile({ file, resource: "category" });
        setHeroImageS3Key(result.fileKey ?? null);
        setHeroImagePreviewUrl(result.fileUrl ?? null);
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsUploading(false);
      }
    },
    [uploadFile],
  );

  if (isLoading)
    return (
      <div className="flex h-full items-center justify-center">
        <Loader />
      </div>
    );

  if (!category) throw new Error(t("adminCategoryView.error.categoryNotFound"));

  const hasHeroContent = !!(heroImageS3Key && (watch("heroTitle_en") || watch("heroTitle_es")));

  const onSubmit = (data: CategoryFormValues) => {
    const heroTitle =
      data.heroTitle_en || data.heroTitle_es
        ? { en: data.heroTitle_en, es: data.heroTitle_es }
        : null;
    const heroSubtitle =
      data.heroSubtitle_en || data.heroSubtitle_es
        ? { en: data.heroSubtitle_en, es: data.heroSubtitle_es }
        : null;
    const heroCtaText =
      data.heroCtaText_en || data.heroCtaText_es
        ? { en: data.heroCtaText_en, es: data.heroCtaText_es }
        : null;

    updateCategory({
      data: {
        title: { en: data.title_en, es: data.title_es },
        slug: data.slug,
        archived: data.archived,
        showInMenu: data.showInMenu,
        displayOrder: data.displayOrder,
        heroImageS3Key: heroImageS3Key,
        heroTitle,
        heroSubtitle,
        heroCtaText,
        heroCtaUrl: data.heroCtaUrl || null,
        heroOverlayColor: data.heroOverlayColor || null,
      },
      categoryId: id,
    }).then(() => {
      queryClient.invalidateQueries(categoryByIdQueryOptions(id));
    });
  };

  const breadcrumbs = [
    { title: t("adminCategoryView.breadcrumbs.categories"), href: "/admin/categories" },
    { title: t("adminCategoryView.breadcrumbs.categoryDetails"), href: `/admin/categories/${id}` },
  ];

  return (
    <PageWrapper breadcrumbs={breadcrumbs}>
      <div className="flex flex-col">
        <form onSubmit={handleSubmit(onSubmit)} className="h-full rounded-lg">
          <div className="flex items-center justify-between">
            <h2 className="mb-4 text-2xl font-semibold text-neutral-950">
              {t("adminCategoryView.editCategoryHeader")}
            </h2>
            <Button type="submit" disabled={!isDirty && !heroImageS3Key} className="mr-2">
              {t("common.button.save")}
            </Button>
          </div>

          {/* Section 1: Basic Info */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-medium text-neutral-800">
              {t("adminCategoryView.section.basicInfo", "Basic Information")}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-y-2">
                <Label className="font-normal text-neutral-600">
                  {t("adminCategoryView.field.titleEn", "Title (English)")}
                </Label>
                <Controller
                  name="title_en"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="w-full rounded-md border border-neutral-300 px-2 py-1"
                    />
                  )}
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label className="font-normal text-neutral-600">
                  {t("adminCategoryView.field.titleEs", "Title (Spanish)")}
                </Label>
                <Controller
                  name="title_es"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="w-full rounded-md border border-neutral-300 px-2 py-1"
                    />
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-y-2">
                <Label className="font-normal text-neutral-600">
                  {t("adminCategoryView.field.slug", "Slug")}
                </Label>
                <Controller
                  name="slug"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="w-full rounded-md border border-neutral-300 px-2 py-1"
                    />
                  )}
                />
              </div>
              <div className="flex flex-col justify-end gap-y-2">
                <Controller
                  name="archived"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="archived"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                      <label htmlFor="archived" className="text-sm font-medium leading-none">
                        {t("common.other.archived")}
                      </label>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Menu Config */}
          <div className="mt-8 space-y-4 border-t pt-6">
            <h3 className="text-lg font-medium text-neutral-800">
              {t("adminCategoryView.section.menuConfig", "Menu Configuration")}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-y-2">
                <Controller
                  name="showInMenu"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="showInMenu"
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked)}
                          disabled={!hasHeroContent}
                        />
                        <label htmlFor="showInMenu" className="text-sm font-medium leading-none">
                          {t("adminCategoryView.field.showInMenu", "Show in Menu")}
                        </label>
                      </div>
                      {!hasHeroContent && (
                        <p className="text-xs text-neutral-500">
                          {t(
                            "adminCategoryView.field.showInMenuDisabledHint",
                            "Configure hero image and title first",
                          )}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label className="font-normal text-neutral-600">
                  {t("adminCategoryView.field.displayOrder", "Display Order")}
                </Label>
                <Controller
                  name="displayOrder"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(e.target.value ? Number(e.target.value) : null)
                      }
                      className="w-full rounded-md border border-neutral-300 px-2 py-1"
                      placeholder="1"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Hero Config */}
          <div className="mt-8 space-y-4 border-t pt-6">
            <h3 className="text-lg font-medium text-neutral-800">
              {t("adminCategoryView.section.heroConfig", "Hero Section")}
            </h3>

            <div className="flex flex-col gap-y-2">
              <Label className="font-normal text-neutral-600">
                {t("adminCategoryView.field.heroImage", "Hero Image")}
              </Label>
              <ImageUploadInput
                field={{ value: heroImageS3Key ?? undefined }}
                handleImageUpload={handleHeroImageUpload}
                isUploading={isUploading}
                imageUrl={heroImagePreviewUrl}
                variant="video"
              />
              {heroImageS3Key && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-1 w-fit"
                  onClick={() => {
                    setHeroImageS3Key(null);
                    setHeroImagePreviewUrl(null);
                  }}
                >
                  {t("adminCategoryView.field.removeHeroImage", "Remove Image")}
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-y-2">
                <Label className="font-normal text-neutral-600">
                  {t("adminCategoryView.field.heroTitleEn", "Hero Title (English)")}
                </Label>
                <Controller
                  name="heroTitle_en"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="w-full rounded-md border border-neutral-300 px-2 py-1"
                    />
                  )}
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label className="font-normal text-neutral-600">
                  {t("adminCategoryView.field.heroTitleEs", "Hero Title (Spanish)")}
                </Label>
                <Controller
                  name="heroTitle_es"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="w-full rounded-md border border-neutral-300 px-2 py-1"
                    />
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-y-2">
                <Label className="font-normal text-neutral-600">
                  {t("adminCategoryView.field.heroSubtitleEn", "Hero Subtitle (English)")}
                </Label>
                <Controller
                  name="heroSubtitle_en"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="w-full rounded-md border border-neutral-300 px-2 py-1"
                    />
                  )}
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label className="font-normal text-neutral-600">
                  {t("adminCategoryView.field.heroSubtitleEs", "Hero Subtitle (Spanish)")}
                </Label>
                <Controller
                  name="heroSubtitle_es"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="w-full rounded-md border border-neutral-300 px-2 py-1"
                    />
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-y-2">
                <Label className="font-normal text-neutral-600">
                  {t("adminCategoryView.field.heroCtaTextEn", "CTA Text (English)")}
                </Label>
                <Controller
                  name="heroCtaText_en"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="w-full rounded-md border border-neutral-300 px-2 py-1"
                      placeholder="Explore courses"
                    />
                  )}
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label className="font-normal text-neutral-600">
                  {t("adminCategoryView.field.heroCtaTextEs", "CTA Text (Spanish)")}
                </Label>
                <Controller
                  name="heroCtaText_es"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="w-full rounded-md border border-neutral-300 px-2 py-1"
                      placeholder="Explorar cursos"
                    />
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-y-2">
                <Label className="font-normal text-neutral-600">
                  {t("adminCategoryView.field.heroCtaUrl", "CTA URL")}
                </Label>
                <Controller
                  name="heroCtaUrl"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="w-full rounded-md border border-neutral-300 px-2 py-1"
                      placeholder="/courses"
                    />
                  )}
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label className="font-normal text-neutral-600">
                  {t("adminCategoryView.field.heroOverlayColor", "Overlay Color")}
                </Label>
                <div className="flex items-center gap-2">
                  <Controller
                    name="heroOverlayColor"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="w-full rounded-md border border-neutral-300 px-2 py-1"
                        placeholder="#00000080"
                      />
                    )}
                  />
                  {heroOverlayColor && (
                    <div
                      className="h-8 w-8 shrink-0 rounded border border-neutral-300"
                      style={{ backgroundColor: heroOverlayColor }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
};

export default Category;
