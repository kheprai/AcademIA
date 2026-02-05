import { useTranslation } from "react-i18next";

import { Skeleton } from "~/components/ui/skeleton";

import type { RegistrationAttemptsStats } from "~/api/queries/useRegistrationAttemptsStats";

type StatsCardsProps = {
  stats?: RegistrationAttemptsStats;
  isLoading: boolean;
};

export const StatsCards = ({ stats, isLoading }: StatsCardsProps) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg bg-white p-6 drop-shadow-card">
            <Skeleton className="mb-2 h-4 w-24 rounded-lg" />
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const sourceBreakdown = stats.bySource.map((s) => `${s.source}: ${s.count}`).join(", ");

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <StatCard
        title={t("registrationAttemptsView.stats.totalAttempts")}
        value={stats.totalAttempts}
      />
      <StatCard
        title={t("registrationAttemptsView.stats.totalRegistered")}
        value={stats.totalRegistered}
      />
      <StatCard
        title={t("registrationAttemptsView.stats.conversionRate")}
        value={`${stats.conversionRate}%`}
      />
      <StatCard
        title={t("registrationAttemptsView.stats.bySource")}
        value={sourceBreakdown || "-"}
      />
    </div>
  );
};

const StatCard = ({ title, value }: { title: string; value: string | number }) => (
  <div className="rounded-lg bg-white p-6 drop-shadow-card">
    <p className="body-sm-md text-neutral-600">{title}</p>
    <p className="h5 mt-1">{value}</p>
  </div>
);
