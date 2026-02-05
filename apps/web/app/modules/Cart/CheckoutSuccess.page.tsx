import { Link } from "@remix-run/react";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "~/components/ui/button";
import { formatPrice } from "~/lib/formatters/priceFormatter";
import { useCartStore, type CartItem } from "~/lib/stores/cartStore";
import { getCurrencyLocale } from "~/utils/getCurrencyLocale";

export default function CheckoutSuccessPage() {
  const { t } = useTranslation();
  const lastCheckoutItems = useCartStore((state) => state.lastCheckoutItems);
  const lastCheckoutBuyItems = useCartStore((state) => state.lastCheckoutBuyItems);
  const clearLastCheckout = useCartStore((state) => state.clearLastCheckout);

  const items = lastCheckoutItems ?? [];
  const hasItems = items.length > 0;
  const singleItem = items.length === 1 ? items[0] : null;

  // Clear lastCheckout data on unmount
  useEffect(() => {
    return () => {
      clearLastCheckout();
    };
  }, [clearLastCheckout]);

  const isFreeItem = (item: CartItem) =>
    item.priceInCents === 0 && !item.stripePriceId && !item.mercadopagoProductId;

  const wasPurchased = (item: CartItem) =>
    !isFreeItem(item) && lastCheckoutBuyItems[item.courseId] !== false;

  const getCourseUrl = (item: CartItem) =>
    item.slug ? `/courses/${item.slug}` : `/course/${item.courseId}`;

  const getItemPrice = (item: CartItem) => {
    if (isFreeItem(item)) return t("landing.courses.card.free");
    if (!wasPurchased(item)) return t("landing.courses.card.free");
    if (item.mercadopagoPriceInCents > 0) {
      return formatPrice(item.mercadopagoPriceInCents, "ARS", getCurrencyLocale("ARS"));
    }
    return formatPrice(item.priceInCents, "USD", getCurrencyLocale("USD"));
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <CheckCircle className="mx-auto mb-4 size-16 text-green-500" />
        <h1 className="text-2xl font-bold">
          {hasItems ? t("cart.success.title") : t("cart.success.genericTitle")}
        </h1>
        <p className="mt-2 text-neutral-500">
          {hasItems ? t("cart.success.subtitle") : t("cart.success.genericSubtitle")}
        </p>
      </div>

      {hasItems && (
        <div className="rounded-lg border p-6">
          <h3 className="mb-3 font-semibold">{t("cart.success.enrolledCourses")}</h3>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.courseId} className="flex items-center gap-3 rounded-md border p-3">
                {item.thumbnailUrl && (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="size-12 rounded object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-500">{getItemPrice(item)}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        wasPurchased(item)
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {wasPurchased(item)
                        ? t("cart.success.purchased")
                        : t("cart.success.enrolled")}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to={getCourseUrl(item)}>{t("cart.success.goToCourse")}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col items-center gap-3">
        <Button variant="primary" className="w-full max-w-xs" asChild>
          {singleItem ? (
            <Link to={getCourseUrl(singleItem)}>{t("cart.success.startLearning")}</Link>
          ) : (
            <Link to="/library">{t("cart.success.goToLibrary")}</Link>
          )}
        </Button>
        <Button variant="outline" className="w-full max-w-xs" asChild>
          <Link to="/courses">{t("cart.success.browseMore")}</Link>
        </Button>
      </div>
    </div>
  );
}
