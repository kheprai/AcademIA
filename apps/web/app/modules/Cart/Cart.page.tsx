import { Link } from "@remix-run/react";
import { ArrowLeft, Info, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "~/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { formatPrice } from "~/lib/formatters/priceFormatter";
import { useCartCurrency } from "~/lib/hooks/useCartCurrency";
import { useCartStore } from "~/lib/stores/cartStore";
import { getCurrencyLocale } from "~/utils/getCurrencyLocale";

import { CartItemCard } from "./CartItemCard";
import { CurrencyToggle } from "./CurrencyToggle";
import { EmptyCartState } from "./EmptyCartState";

export default function CartPage() {
  const { t } = useTranslation();
  const items = useCartStore((state) => state.items);
  const buyItems = useCartStore((state) => state.buyItems);
  const setBuyItem = useCartStore((state) => state.setBuyItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const { defaultMethod, currency } = useCartCurrency();

  const isFreeItem = (item: (typeof items)[number]) =>
    item.priceInCents === 0 && !item.stripePriceId && !item.mercadopagoProductId;

  const isBuyForced = (item: (typeof items)[number]) => !isFreeItem(item) && !item.hasFreeChapters;

  const isItemBuy = (item: (typeof items)[number]) =>
    isFreeItem(item) || isBuyForced(item) || buyItems[item.courseId] !== false;

  const purchaseItems = items.filter((i) => !isFreeItem(i) && isItemBuy(i));

  const subtotal =
    defaultMethod === "mercadopago"
      ? purchaseItems.reduce((sum, item) => sum + item.mercadopagoPriceInCents, 0)
      : purchaseItems.reduce((sum, item) => sum + item.priceInCents, 0);

  const allFree = items.length > 0 && items.every(isFreeItem);
  const allEnrollOnly = !allFree && purchaseItems.length === 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {t("cart.page.title")} ({items.length})
        </h1>
        {items.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearCart}>
            <Trash2 className="mr-1 size-4" />
            {t("cart.page.clearCart")}
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyCartState />
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1 space-y-3">
            {items.map((item) => (
              <CartItemCard
                key={item.courseId}
                item={item}
                variant="page"
                buyMode={isFreeItem(item) ? undefined : buyItems[item.courseId] !== false}
                onBuyModeChange={
                  isFreeItem(item) ? undefined : (buy) => setBuyItem(item.courseId, buy)
                }
                isBuyForced={isBuyForced(item)}
              />
            ))}
          </div>

          <div className="lg:w-96">
            <div className="sticky top-4 rounded-lg border p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">{t("cart.checkout.orderSummary")}</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="text-neutral-400 hover:text-neutral-600">
                        <Info className="size-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs">
                      <p className="text-xs">
                        <strong>{t("cart.checkout.enrollLabel", "Inscribirme")}:</strong>{" "}
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

              {!allFree && !allEnrollOnly && <CurrencyToggle className="mb-3 justify-end" />}

              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">
                    {t("cart.sidebar.itemCount", { count: items.length })}
                  </span>
                  <span>
                    {allFree || allEnrollOnly
                      ? t("landing.courses.card.free")
                      : formatPrice(subtotal, currency, getCurrencyLocale(currency))}
                  </span>
                </div>
              </div>

              <div className="mb-4 border-t pt-3">
                <div className="flex justify-between font-semibold">
                  <span>{t("cart.checkout.total")}</span>
                  <span>
                    {allFree || allEnrollOnly
                      ? t("landing.courses.card.free")
                      : formatPrice(subtotal, currency, getCurrencyLocale(currency))}
                  </span>
                </div>
                {!allFree &&
                  !allEnrollOnly &&
                  purchaseItems.length < items.filter((i) => !isFreeItem(i)).length && (
                    <p className="mt-1 text-xs text-neutral-500">
                      {t(
                        "cart.checkout.enrollOnlyNote",
                        "{{count}} curso(s) solo inscripción (gratis)",
                        {
                          count: items.filter((i) => !isFreeItem(i) && !isItemBuy(i)).length,
                        },
                      )}
                    </p>
                  )}
              </div>

              <Button variant="primary" className="w-full" asChild>
                <Link to="/checkout">
                  {allFree || allEnrollOnly
                    ? t("cart.button.acquireFree", "Adquirir Gratis")
                    : t("cart.page.proceedToCheckout")}
                </Link>
              </Button>

              <Button variant="ghost" className="mt-2 w-full" asChild>
                <Link to="/courses">
                  <ArrowLeft className="mr-1 size-4" />
                  {t("cart.page.continueShopping")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
