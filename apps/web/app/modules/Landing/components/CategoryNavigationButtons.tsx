import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";

import { Button } from "~/components/ui/button";

interface CategoryNavigationButtonsProps {
  categoryTitle: string;
  categorySlug: string;
}

export function CategoryNavigationButtons({
  categoryTitle,
  categorySlug: _categorySlug,
}: CategoryNavigationButtonsProps) {
  const { t } = useTranslation();

  return (
    <section className="py-12">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 px-4 sm:px-6 lg:px-8">
        <Button variant="outline" size="lg" asChild>
          <Link to="/courses">{t("landing.categoryPage.viewAllCourses")}</Link>
        </Button>
        <Button size="lg" asChild>
          <Link to={`/courses?category=${encodeURIComponent(categoryTitle)}`}>
            {t("landing.categoryPage.viewCategoryCourses", { category: categoryTitle })}
          </Link>
        </Button>
      </div>
    </section>
  );
}
