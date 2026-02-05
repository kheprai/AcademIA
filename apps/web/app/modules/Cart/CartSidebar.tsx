import { Link } from "@remix-run/react";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { formatPrice } from "~/lib/formatters/priceFormatter";
import { useCartCurrency } from "~/lib/hooks/useCartCurrency";
import { useCartStore } from "~/lib/stores/cartStore";
import { getCurrencyLocale } from "~/utils/getCurrencyLocale";

import { CartItemCard } from "./CartItemCard";
import { CurrencyToggle } from "./CurrencyToggle";
import { EmptyCartState } from "./EmptyCartState";

export function CartSidebar() {
  const { t } = useTranslation();
  const items = useCartStore((state) => state.items);
  const buyItems = useCartStore((state) => state.buyItems);
  const setBuyItem = useCartStore((state) => state.setBuyItem);
  const isOpen = useCartStore((state) => state.isCartSidebarOpen);
  const setOpen = useCartStore((state) => state.setCartSidebarOpen);
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
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {t("cart.sidebar.title")} ({items.length})
          </SheetTitle>
          <SheetDescription className="sr-only">{t("cart.sidebar.title")}</SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <EmptyCartState />
        ) : (
          <>
            <div className="-mx-2 flex-1 overflow-y-auto px-2">
              <div className="divide-y">
                {items.map((item) => (
                  <CartItemCard
                    key={item.courseId}
                    item={item}
                    variant="sidebar"
                    buyMode={isFreeItem(item) ? undefined : buyItems[item.courseId] !== false}
                    onBuyModeChange={
                      isFreeItem(item) ? undefined : (buy) => setBuyItem(item.courseId, buy)
                    }
                    isBuyForced={isBuyForced(item)}
                  />
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              {!allFree && !allEnrollOnly && <CurrencyToggle className="mb-2 justify-end" />}
              <div className="flex items-center justify-between pb-3">
                <span className="text-sm font-medium text-neutral-600">
                  {t("cart.sidebar.subtotal")}
                </span>
                <span className="text-lg font-bold">
                  {allFree || allEnrollOnly
                    ? t("landing.courses.card.free")
                    : formatPrice(subtotal, currency, getCurrencyLocale(currency))}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <Button variant="primary" className="w-full" asChild>
                  <Link to="/checkout" onClick={() => setOpen(false)}>
                    {allFree || allEnrollOnly
                      ? t("cart.button.acquireFree", "Adquirir Gratis")
                      : t("cart.sidebar.checkout")}
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/cart" onClick={() => setOpen(false)}>
                    {t("cart.sidebar.viewCart")}
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full" asChild>
                  <Link to="/courses" onClick={() => setOpen(false)}>
                    <ArrowLeft className="mr-1 size-4" />
                    {t("cart.page.continueShopping")}
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
