import { Link } from "@remix-run/react";
import { Info, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "~/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { formatPrice } from "~/lib/formatters/priceFormatter";
import { useCartCurrency } from "~/lib/hooks/useCartCurrency";
import { useCartStore } from "~/lib/stores/cartStore";
import { cn } from "~/lib/utils";
import { getCurrencyLocale } from "~/utils/getCurrencyLocale";

import { RemoveItemConfirm } from "./RemoveItemConfirm";

import type { CartItem } from "~/lib/stores/cartStore";

type CartItemCardProps = {
  item: CartItem;
  variant?: "sidebar" | "page";
  onRemove?: () => void;
  buyMode?: boolean;
  onBuyModeChange?: (buy: boolean) => void;
  isBuyForced?: boolean;
};

export function CartItemCard({
  item,
  variant = "sidebar",
  onRemove,
  buyMode,
  onBuyModeChange,
  isBuyForced,
}: CartItemCardProps) {
  const { t } = useTranslation();
  const removeItem = useCartStore((state) => state.removeItem);
  const { defaultMethod } = useCartCurrency();
  const [confirmingRemove, setConfirmingRemove] = useState(false);

  const handleRemove = () => {
    removeItem(item.courseId);
    onRemove?.();
  };

  const cancelRemove = useCallback(() => setConfirmingRemove(false), []);

  const isFree = item.priceInCents === 0 && !item.stripePriceId && !item.mercadopagoProductId;

  const displayPrice = isFree
    ? t("landing.courses.card.free")
    : defaultMethod === "mercadopago" && item.mercadopagoPriceInCents > 0
      ? formatPrice(item.mercadopagoPriceInCents, "ARS", getCurrencyLocale("ARS"))
      : formatPrice(item.priceInCents, "USD", getCurrencyLocale("USD"));

  const courseUrl = item.slug ? `/courses/${item.slug}` : `/courses/${item.courseId}`;

  const showSidebarBuyOptions =
    variant === "sidebar" && !isFree && !isBuyForced && onBuyModeChange !== undefined;

  if (variant === "sidebar") {
    if (confirmingRemove) {
      return (
        <div className="py-3">
          <RemoveItemConfirm
            title={item.title}
            onConfirm={handleRemove}
            onCancel={cancelRemove}
            compact
          />
        </div>
      );
    }

    return (
      <div className="py-3">
        <div className="flex gap-3">
          {item.thumbnailUrl && (
            <Link to={courseUrl} className="shrink-0">
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                className="h-16 w-24 rounded-md object-cover"
              />
            </Link>
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex items-start justify-between gap-1">
              <Link
                to={courseUrl}
                className="line-clamp-2 text-sm font-medium leading-tight hover:underline"
              >
                {item.title}
              </Link>
              <Button
                variant="ghost"
                size="xs"
                className="mt-[-2px] shrink-0"
                onClick={() => setConfirmingRemove(true)}
                aria-label={t("cart.page.removeItem")}
              >
                <Trash2 className="size-3.5 text-neutral-500" />
              </Button>
            </div>
            {item.categoryName && (
              <p className="truncate text-xs text-neutral-400">{item.categoryName}</p>
            )}
            <span className="text-sm font-semibold text-primary-700">
              {buyMode === false && !isFree ? t("landing.courses.card.free") : displayPrice}
            </span>
          </div>
        </div>
        {showSidebarBuyOptions && (
          <div className="mt-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="mb-1 flex items-center gap-1 text-[11px] text-neutral-400 hover:text-neutral-600"
                  >
                    <Info className="size-3" />
                    <span>{t("cart.checkout.enrollInfo", "Opciones de inscripción")}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-xs">
                    <strong>{t("cart.checkout.enrollLabel", "Solo inscribirme")}:</strong>{" "}
                    {t(
                      "cart.checkout.enrollTooltip",
                      "Acceso gratuito al contenido libre del curso.",
                    )}
                  </p>
                  <p className="mt-1 text-xs">
                    <strong>
                      {t("cart.checkout.enrollAndBuyLabel", "Inscribirme y comprar")}:
                    </strong>{" "}
                    {t(
                      "cart.checkout.enrollAndBuyTooltip",
                      "Acceso completo a todo el contenido del curso.",
                    )}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex gap-1.5">
              <label
                className={cn(
                  "flex flex-1 items-center gap-1.5 rounded border px-2 py-1 text-[11px] cursor-pointer transition-colors",
                  buyMode === false
                    ? "border-primary-300 bg-primary-50 text-primary-700"
                    : "border-neutral-200 hover:bg-neutral-50",
                )}
              >
                <input
                  type="radio"
                  name={`sidebar-buy-${item.courseId}`}
                  checked={buyMode === false}
                  onChange={() => onBuyModeChange(false)}
                  className="accent-primary-600 size-3"
                />
                <span className="whitespace-nowrap">
                  {t("cart.checkout.enrollLabel", "Solo inscribirme")}
                </span>
              </label>
              <label
                className={cn(
                  "flex flex-1 items-center gap-1.5 rounded border px-2 py-1 text-[11px] cursor-pointer transition-colors",
                  buyMode !== false
                    ? "border-primary-300 bg-primary-50 text-primary-700"
                    : "border-neutral-200 hover:bg-neutral-50",
                )}
              >
                <input
                  type="radio"
                  name={`sidebar-buy-${item.courseId}`}
                  checked={buyMode !== false}
                  onChange={() => onBuyModeChange(true)}
                  className="accent-primary-600 size-3"
                />
                <span className="whitespace-nowrap">
                  {t("cart.checkout.enrollAndBuyLabel", "Inscribirme y comprar")}
                </span>
              </label>
            </div>
          </div>
        )}
      </div>
    );
  }

  const showBuyOptions = !isFree && !isBuyForced && onBuyModeChange !== undefined;

  if (confirmingRemove) {
    return (
      <div className="rounded-lg border p-4">
        <RemoveItemConfirm title={item.title} onConfirm={handleRemove} onCancel={cancelRemove} />
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="flex gap-4">
        {item.thumbnailUrl && (
          <Link to={courseUrl} className="shrink-0">
            <img
              src={item.thumbnailUrl}
              alt={item.title}
              className="h-24 w-36 rounded-md object-cover"
            />
          </Link>
        )}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <Link to={courseUrl} className="text-base font-medium hover:underline">
              {item.title}
            </Link>
            {item.categoryName && (
              <p className="mt-0.5 text-xs text-neutral-400">{item.categoryName}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-primary-700">
              {buyMode === false && !isFree ? t("landing.courses.card.free") : displayPrice}
            </span>
            <Button variant="outline" size="sm" onClick={() => setConfirmingRemove(true)}>
              <Trash2 className="mr-1 size-3.5" />
              {t("cart.page.removeItem")}
            </Button>
          </div>
        </div>
      </div>

      {showBuyOptions && (
        <div className="mt-3 border-t pt-3">
          <div className="mb-2 flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600"
                  >
                    <Info className="size-3" />
                    <span>{t("cart.checkout.enrollInfo", "Opciones de inscripción")}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-xs">
                    <strong>{t("cart.checkout.enrollLabel", "Solo inscribirme")}:</strong>{" "}
                    {t(
                      "cart.checkout.enrollTooltip",
                      "Acceso gratuito al contenido libre del curso.",
                    )}
                  </p>
                  <p className="mt-1 text-xs">
                    <strong>
                      {t("cart.checkout.enrollAndBuyLabel", "Inscribirme y comprar")}:
                    </strong>{" "}
                    {t(
                      "cart.checkout.enrollAndBuyTooltip",
                      "Acceso completo a todo el contenido del curso.",
                    )}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex gap-2">
            <label
              className={cn(
                "flex flex-1 items-center gap-2 rounded-md border px-3 py-2 text-xs cursor-pointer transition-colors",
                buyMode === false
                  ? "border-primary-300 bg-primary-50 text-primary-700"
                  : "border-neutral-200 hover:bg-neutral-50",
              )}
            >
              <input
                type="radio"
                name={`cart-buy-${item.courseId}`}
                checked={buyMode === false}
                onChange={() => onBuyModeChange(false)}
                className="accent-primary-600"
              />
              <span className="whitespace-nowrap">
                {t("cart.checkout.enrollLabel", "Solo inscribirme")}
              </span>
              <span className="ml-auto whitespace-nowrap text-neutral-400">
                {t("landing.courses.card.free")}
              </span>
            </label>
            <label
              className={cn(
                "flex flex-1 items-center gap-2 rounded-md border px-3 py-2 text-xs cursor-pointer transition-colors",
                buyMode !== false
                  ? "border-primary-300 bg-primary-50 text-primary-700"
                  : "border-neutral-200 hover:bg-neutral-50",
              )}
            >
              <input
                type="radio"
                name={`cart-buy-${item.courseId}`}
                checked={buyMode !== false}
                onChange={() => onBuyModeChange(true)}
                className="accent-primary-600"
              />
              <span className="whitespace-nowrap">
                {t("cart.checkout.enrollAndBuyLabel", "Inscribirme y comprar")}
              </span>
              <span className="ml-auto whitespace-nowrap font-medium">{displayPrice}</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
