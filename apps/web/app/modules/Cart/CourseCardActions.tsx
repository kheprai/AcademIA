import { Link, useNavigate } from "@remix-run/react";
import { ArrowRight, CheckCircle, Lock, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useAddToServerCart } from "~/api/mutations/useAddToCart";
import { useRemoveFromServerCart } from "~/api/mutations/useRemoveFromCart";
import { useCurrentUser } from "~/api/queries/useCurrentUser";
import { Button } from "~/components/ui/button";
import { useCartStore } from "~/lib/stores/cartStore";

import type { CartItem } from "~/lib/stores/cartStore";

export type CourseCardActionsProps = {
  course: {
    id: string;
    slug?: string | null;
    title: string;
    thumbnailUrl?: string | null;
    authorName?: string;
    categoryName?: string | null;
    priceInCents: number;
    mercadopagoPriceInCents?: number;
    currency: string;
    stripePriceId?: string | null;
    mercadopagoProductId?: string | null;
    hasFreeChapters?: boolean;
  };
  isEnrolled: boolean;
  isPurchased: boolean;
  variant?: "card" | "detail";
};

export function CourseCardActions({
  course,
  isEnrolled,
  isPurchased,
  variant = "card",
}: CourseCardActionsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: currentUser } = useCurrentUser();
  const isLoggedIn = !!currentUser;
  const [expandedAction, setExpandedAction] = useState<"cta" | "cart" | null>(null);

  const addItemToStore = useCartStore((state) => state.addItem);
  const removeItemFromStore = useCartStore((state) => state.removeItem);
  const setBuyItem = useCartStore((state) => state.setBuyItem);
  const isInCart = useCartStore((state) => state.isInCart(course.id));
  const openCartSidebar = useCartStore((state) => state.setCartSidebarOpen);
  const { mutateAsync: addToServer } = useAddToServerCart();
  const { mutateAsync: removeFromServer } = useRemoveFromServerCart();

  const isFree = course.priceInCents === 0 && !course.stripePriceId && !course.mercadopagoProductId;

  const isPaid = !isFree;
  const hasPreview = !!course.hasFreeChapters;

  const courseUrl = course.slug ? `/course/${course.slug}` : `/course/${course.id}`;

  const buildCartItem = (): CartItem => ({
    courseId: course.id,
    slug: course.slug ?? null,
    title: course.title,
    thumbnailUrl: course.thumbnailUrl ?? null,
    authorName: course.authorName ?? "",
    categoryName: course.categoryName ?? null,
    priceInCents: course.priceInCents,
    mercadopagoPriceInCents: course.mercadopagoPriceInCents ?? 0,
    currency: course.currency,
    stripePriceId: course.stripePriceId ?? null,
    mercadopagoProductId: course.mercadopagoProductId ?? null,
    hasFreeChapters: course.hasFreeChapters ?? false,
    addedAt: new Date().toISOString(),
  });

  const handleAddAndCheckout = async (buy?: boolean) => {
    if (buy !== undefined) {
      setBuyItem(course.id, buy);
    }
    if (!isInCart) {
      addItemToStore(buildCartItem());
      if (isLoggedIn) {
        try {
          await addToServer(course.id);
        } catch {
          /* local cart updated */
        }
      }
    }
    navigate("/checkout");
  };

  const handleAddToCart = async (buy?: boolean) => {
    if (buy !== undefined) {
      setBuyItem(course.id, buy);
    }
    addItemToStore(buildCartItem());
    if (isLoggedIn) {
      try {
        await addToServer(course.id);
      } catch {
        /* local cart updated */
      }
    }
  };

  const handleRemoveFromCart = async () => {
    removeItemFromStore(course.id);
    if (isLoggedIn) {
      try {
        await removeFromServer(course.id);
      } catch {
        /* local cart updated */
      }
    }
  };

  // Green CTA colors for both variants
  const ctaGreen =
    variant === "card"
      ? "bg-success-600 hover:bg-success-500 text-white hover:opacity-100"
      : "bg-success-600 hover:bg-success-700 hover:opacity-100 text-white";
  const outlineCart =
    variant === "card"
      ? "hover:bg-primary-700 hover:text-contrast hover:border-primary-700 hover:opacity-100"
      : "";

  // === STATE: Purchased → "Continuar Aprendiendo" ===
  if (isPurchased) {
    if (variant === "detail") {
      return (
        <Button size="lg" variant="primary" className={`w-full ${ctaGreen}`} asChild>
          <Link to={courseUrl}>
            <ArrowRight className="mr-2 size-4" />
            {t("landing.courseDetail.continueLearning")}
          </Link>
        </Button>
      );
    }

    return (
      <Button variant="primary" className={`w-full ${ctaGreen}`} size="sm" asChild>
        <Link to={courseUrl}>
          <ArrowRight className="mr-2 size-3.5" />
          {t("landing.courses.card.continue")}
        </Link>
      </Button>
    );
  }

  // === STATE: Enrolled but NOT purchased (paid course) ===
  if (isEnrolled && !isPurchased) {
    if (isInCart) {
      // Enrolled + in cart → checkout / remove / view cart
      if (variant === "detail") {
        return (
          <div className="flex flex-col gap-2">
            <Button size="lg" variant="primary" className={`w-full ${ctaGreen}`} asChild>
              <Link to="/checkout">{t("cart.button.goToCheckout")}</Link>
            </Button>
            <Button
              size="lg"
              variant="destructive"
              className="w-full"
              onClick={handleRemoveFromCart}
            >
              <Trash2 className="mr-2 size-4" />
              {t("cart.button.removeFromCart")}
            </Button>
          </div>
        );
      }

      return (
        <div className="flex flex-col gap-2">
          <Button variant="primary" className={`w-full ${ctaGreen}`} size="sm" asChild>
            <Link to="/checkout">{t("cart.button.goToCheckout")}</Link>
          </Button>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRemoveFromCart}
              aria-label={t("cart.button.removeFromCart")}
            >
              <Trash2 className="size-3.5" />
            </Button>
            <Button
              variant="outline"
              className={`flex-1 ${outlineCart}`}
              size="sm"
              onClick={() => openCartSidebar(true)}
            >
              <ShoppingCart className="mr-1 size-3.5" />
              {t("cart.button.viewCart")}
            </Button>
          </div>
        </div>
      );
    }

    // Enrolled, not in cart → buy course + add to cart
    if (variant === "detail") {
      return (
        <div className="flex flex-col gap-2">
          <Button
            size="lg"
            variant="primary"
            className={`w-full ${ctaGreen}`}
            onClick={() => handleAddAndCheckout(true)}
          >
            <Lock className="mr-2 size-4" />
            {t("landing.courseDetail.buyCourse")}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className={`w-full ${outlineCart}`}
            onClick={() => handleAddToCart(true)}
          >
            <ShoppingCart className="mr-2 size-4" />
            {t("cart.button.addToCartFull")}
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        <Button
          variant="primary"
          className={`w-full ${ctaGreen}`}
          size="sm"
          onClick={() => handleAddAndCheckout(true)}
        >
          <Lock className="mr-1 size-3.5" />
          {t("cart.button.buyCourse")}
        </Button>
        <Button
          variant="outline"
          className={`w-full ${outlineCart}`}
          size="sm"
          onClick={() => handleAddToCart(true)}
        >
          <ShoppingCart className="mr-1 size-3.5" />
          {t("cart.button.addToCartFull")}
        </Button>
      </div>
    );
  }

  // === STATE: Free course, not enrolled → "Inscribirme Gratis" ===
  if (isFree && !isInCart) {
    if (variant === "detail") {
      return (
        <div className="flex flex-col gap-2">
          <Button
            size="lg"
            variant="primary"
            className={`w-full ${ctaGreen}`}
            onClick={() => handleAddAndCheckout()}
          >
            <CheckCircle className="mr-2 size-4" />
            {t("landing.courseDetail.enrollFree")}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className={`w-full ${outlineCart}`}
            onClick={() => handleAddToCart()}
          >
            <ShoppingCart className="mr-2 size-4" />
            {t("cart.button.addToCartFull")}
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        <Button
          variant="primary"
          className={`w-full ${ctaGreen}`}
          size="sm"
          onClick={() => handleAddAndCheckout()}
        >
          {t("cart.button.enrollFreeShort")}
        </Button>
        <Button
          variant="outline"
          className={`w-full ${outlineCart}`}
          size="sm"
          onClick={() => handleAddToCart()}
        >
          <ShoppingCart className="mr-1 size-3.5" />
          {t("cart.button.addToCartFull")}
        </Button>
      </div>
    );
  }

  // === STATE: In cart (any course type) ===
  if (isInCart) {
    if (variant === "detail") {
      return (
        <div className="flex flex-col gap-2">
          <Button size="lg" variant="primary" className={`w-full ${ctaGreen}`} asChild>
            <Link to="/checkout">{t("cart.button.goToCheckout")}</Link>
          </Button>
          <Button size="lg" variant="destructive" className="w-full" onClick={handleRemoveFromCart}>
            <Trash2 className="mr-2 size-4" />
            {t("cart.button.removeFromCart")}
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        <Button variant="primary" className={`w-full ${ctaGreen}`} size="sm" asChild>
          <Link to="/checkout">{t("cart.button.goToCheckout")}</Link>
        </Button>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleRemoveFromCart}
            aria-label={t("cart.button.removeFromCart")}
          >
            <Trash2 className="size-3.5" />
          </Button>
          <Button
            variant="outline"
            className={`flex-1 ${outlineCart}`}
            size="sm"
            onClick={() => openCartSidebar(true)}
          >
            <ShoppingCart className="mr-1 size-3.5" />
            {t("cart.button.viewCart")}
          </Button>
        </div>
      </div>
    );
  }

  // === STATE: Paid course with preview, not enrolled, not in cart ===
  if (isPaid && hasPreview) {
    if (variant === "detail") {
      return (
        <div className="flex flex-col gap-2">
          <Button
            size="lg"
            variant="primary"
            className={`w-full ${ctaGreen}`}
            onClick={() => handleAddAndCheckout(false)}
          >
            {t("cart.button.enrollPreview")}
          </Button>
          <Button
            size="lg"
            variant="primary"
            className="w-full bg-success-800 hover:bg-success-700 hover:opacity-100 text-white"
            onClick={() => handleAddAndCheckout(true)}
          >
            {t("cart.button.buyNow")}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full"
            onClick={() => handleAddToCart(false)}
          >
            <ShoppingCart className="mr-2 size-4" />
            {t("cart.button.preview")}
          </Button>
          <Button
            size="lg"
            variant="primary"
            className="w-full"
            onClick={() => handleAddToCart(true)}
          >
            <ShoppingCart className="mr-2 size-4" />
            {t("cart.button.buy")}
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        {expandedAction === "cta" ? (
          <div className="flex h-9 overflow-hidden rounded-lg">
            <button
              className="flex flex-1 items-center justify-center bg-success-700 text-sm font-medium text-white transition hover:bg-success-600"
              onClick={() => handleAddAndCheckout(false)}
            >
              {t("cart.button.preview")}
            </button>
            <div className="w-px bg-white" />
            <button
              className="flex flex-1 items-center justify-center bg-success-500 text-sm font-medium text-white transition hover:bg-success-400"
              onClick={() => handleAddAndCheckout(true)}
            >
              {t("cart.button.buy")}
            </button>
          </div>
        ) : (
          <Button
            variant="primary"
            className={`w-full ${ctaGreen}`}
            size="sm"
            onClick={() => setExpandedAction("cta")}
          >
            {t("cart.button.enroll")}
          </Button>
        )}

        {expandedAction === "cart" ? (
          <div className="flex h-9 overflow-hidden rounded-lg border border-neutral-200">
            <button
              className="flex flex-1 items-center justify-center gap-1 bg-white text-sm font-medium text-primary-700 transition hover:bg-primary-700 hover:text-contrast"
              onClick={() => handleAddToCart(false)}
            >
              <ShoppingCart className="size-3.5" />
              {t("cart.button.preview")}
            </button>
            <div className="w-px bg-neutral-200" />
            <button
              className="flex flex-1 items-center justify-center gap-1 bg-primary-700 text-sm font-medium text-contrast transition hover:bg-primary-600"
              onClick={() => handleAddToCart(true)}
            >
              <ShoppingCart className="size-3.5" />
              {t("cart.button.buy")}
            </button>
          </div>
        ) : (
          <Button
            variant="outline"
            className={`w-full ${outlineCart}`}
            size="sm"
            onClick={() => setExpandedAction("cart")}
          >
            <ShoppingCart className="mr-1 size-3.5" />
            {t("cart.button.addToCartFull")}
          </Button>
        )}
      </div>
    );
  }

  // === STATE: Paid course without preview, not enrolled, not in cart ===
  if (variant === "detail") {
    return (
      <div className="flex flex-col gap-2">
        <Button
          size="lg"
          variant="primary"
          className={`w-full ${ctaGreen}`}
          onClick={() => handleAddAndCheckout(true)}
        >
          {t("cart.button.buyNow")}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className={`w-full ${outlineCart}`}
          onClick={() => handleAddToCart(true)}
        >
          <ShoppingCart className="mr-2 size-4" />
          {t("cart.button.addToCartFull")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="primary"
        className={`w-full ${ctaGreen}`}
        size="sm"
        onClick={() => handleAddAndCheckout(true)}
      >
        {t("cart.button.buy")}
      </Button>
      <Button
        variant="outline"
        className={`w-full ${outlineCart}`}
        size="sm"
        onClick={() => handleAddToCart(true)}
      >
        <ShoppingCart className="mr-1 size-3.5" />
        {t("cart.button.addToCartFull")}
      </Button>
    </div>
  );
}
