import { useTranslation } from "react-i18next";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "~/components/ui/chart";
import { Skeleton } from "~/components/ui/skeleton";
import { ChartLegendBadge } from "~/modules/Statistics/Client/components/ChartLegendBadge";

import type { RegistrationAttemptsStats } from "~/api/queries/useRegistrationAttemptsStats";
import type { ChartConfig } from "~/components/ui/chart";

type DailyAttemptsChartProps = {
  daily?: RegistrationAttemptsStats["daily"];
  isLoading: boolean;
};

const chartConfig = {
  registered: {
    label: "Registered",
    color: "var(--primary-700)",
  },
  notRegistered: {
    label: "Not Registered",
    color: "var(--primary-300)",
  },
} satisfies ChartConfig;

export const DailyAttemptsChart = ({ daily, isLoading }: DailyAttemptsChartProps) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-4 rounded-lg bg-white p-8 drop-shadow-card">
        <Skeleton className="mx-auto h-6 w-[240px] rounded-lg" />
        <Skeleton className="h-[224px] w-full rounded-lg" />
      </div>
    );
  }

  const parsedData = (daily || []).map((d) => ({
    date: d.date,
    registered: d.registered,
    notRegistered: d.attempts - d.registered,
  }));

  if (parsedData.length === 0) {
    return (
      <div className="flex w-full flex-col items-center gap-4 rounded-lg bg-white p-8 drop-shadow-card">
        <h2 className="body-lg-md text-neutral-950">{t("registrationAttemptsView.chart.title")}</h2>
        <p className="body-sm text-neutral-500">{t("registrationAttemptsView.chart.noData")}</p>
      </div>
    );
  }

  const dataMax = Math.max(...parsedData.map((d) => d.registered + d.notRegistered));
  const step = Math.max(1, Math.ceil(dataMax / 5));
  const ticks = Array.from({ length: Math.ceil(dataMax / step) + 1 }, (_, i) => i * step);

  return (
    <div className="flex w-full flex-col gap-y-6 rounded-lg bg-white p-8 drop-shadow-card">
      <h2 className="body-lg-md text-center text-neutral-950">
        {t("registrationAttemptsView.chart.title")}
      </h2>
      <div className="mt-2 grid h-full place-items-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-[2/1] h-full max-h-[224px] w-full"
        >
          <BarChart accessibilityLayer data={parsedData} margin={{ left: -28 }} barCategoryGap={8}>
            <CartesianGrid horizontal vertical={false} />
            <YAxis ticks={ticks} tickLine={false} axisLine={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                const d = new Date(value);
                return `${d.getDate()}/${d.getMonth() + 1}`;
              }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="registered" stackId="a" fill="var(--primary-700)" />
            <Bar dataKey="notRegistered" stackId="a" fill="var(--primary-300)" />
          </BarChart>
        </ChartContainer>
      </div>
      <div className="flex justify-center gap-2">
        <ChartLegendBadge
          label={t("registrationAttemptsView.chart.registered")}
          dotColor="var(--primary-700)"
        />
        <ChartLegendBadge
          label={t("registrationAttemptsView.chart.notRegistered")}
          dotColor="var(--primary-300)"
        />
      </div>
    </div>
  );
};
