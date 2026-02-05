import { Link } from "@remix-run/react";

import { Button } from "~/components/ui/button";

function getCategoryTitle(
  title: string | Record<string, string> | object,
  language: string,
): string {
  if (typeof title === "string") return title;
  const record = title as Record<string, string>;
  return record?.[language] || record?.en || Object.values(record || {})[0] || "";
}

interface CategoryHeroProps {
  heroImageUrl?: string | null;
  heroTitle?: string | Record<string, string> | object | null;
  heroSubtitle?: string | Record<string, string> | object | null;
  heroCtaText?: string | Record<string, string> | object | null;
  heroCtaUrl?: string | null;
  heroOverlayColor?: string | null;
  language: string;
}

export function CategoryHero({
  heroImageUrl,
  heroTitle,
  heroSubtitle,
  heroCtaText,
  heroCtaUrl,
  heroOverlayColor,
  language,
}: CategoryHeroProps) {
  const title = heroTitle ? getCategoryTitle(heroTitle, language) : "";
  const subtitle = heroSubtitle ? getCategoryTitle(heroSubtitle, language) : "";
  const ctaText = heroCtaText ? getCategoryTitle(heroCtaText, language) : "";

  const overlayColor = heroOverlayColor
    ? heroOverlayColor.length <= 7
      ? `${heroOverlayColor}80`
      : heroOverlayColor
    : "rgba(0, 0, 0, 0.5)";

  return (
    <section className="relative min-h-[360px] overflow-hidden md:min-h-[480px]">
      {heroImageUrl ? (
        <img
          src={heroImageUrl}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700 to-primary-900" />
      )}

      <div className="absolute inset-0" style={{ backgroundColor: overlayColor }} />

      <div className="relative flex min-h-[360px] items-center justify-center md:min-h-[480px]">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          {title && (
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90 sm:text-xl">{subtitle}</p>
          )}
          {ctaText && heroCtaUrl && (
            <div className="mt-10">
              <Button size="lg" variant="secondary" asChild>
                <Link to={heroCtaUrl}>{ctaText}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
