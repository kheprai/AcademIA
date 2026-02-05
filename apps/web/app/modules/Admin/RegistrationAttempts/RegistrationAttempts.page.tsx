import {
  type ColumnDef,
  type SortingState,
  type ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { ChevronDown, ChevronRight } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  useRegistrationAttempts,
  type RegistrationAttempt,
  type RegistrationAttemptsParams,
} from "~/api/queries/useRegistrationAttempts";
import { useRegistrationAttemptsStats } from "~/api/queries/useRegistrationAttemptsStats";
import { PageWrapper } from "~/components/PageWrapper";
import { Pagination } from "~/components/Pagination/Pagination";
import SortButton from "~/components/TableSortButton/TableSortButton";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  type FilterConfig,
  type FilterValue,
  SearchFilter,
} from "~/modules/common/SearchFilter/SearchFilter";
import { setPageTitle } from "~/utils/setPageTitle";
import { tanstackSortingToParam } from "~/utils/tanstackSortingToParam";

import { DailyAttemptsChart } from "./components/DailyAttemptsChart";
import { StatsCards } from "./components/StatsCards";

import type { MetaFunction } from "@remix-run/react";
import type { ITEMS_PER_PAGE_OPTIONS } from "~/components/Pagination/Pagination";

type CartItem = {
  courseId: string;
  title: string;
  priceInCents: number;
  mercadopagoPriceInCents?: number;
  currency: string;
};

function formatCents(cents: number): string {
  return (cents / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export const meta: MetaFunction = ({ matches }) =>
  setPageTitle(matches, "pages.registrationAttempts");

const RegistrationAttempts = () => {
  const { t } = useTranslation();

  const [sorting, setSorting] = React.useState<SortingState>([{ id: "createdAt", desc: true }]);

  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const [searchParams, setSearchParams] = React.useState<{
    keyword?: string;
    source?: string;
    registered?: string;
  }>({});

  const [pagination, setPagination] = React.useState<{
    page?: number;
    perPage?: number;
  }>({});

  const [dateRange, setDateRange] = React.useState<{
    dateFrom?: string;
    dateTo?: string;
  }>({});

  const [isPending, startTransition] = React.useTransition();

  const queryParams: RegistrationAttemptsParams = useMemo(() => {
    const sort = tanstackSortingToParam(sorting);
    return {
      ...searchParams,
      ...pagination,
      ...dateRange,
      sort: sort || undefined,
    };
  }, [searchParams, pagination, dateRange, sorting]);

  const { data: attemptsData, isLoading: isLoadingAttempts } = useRegistrationAttempts(queryParams);
  const { data: statsData, isLoading: isLoadingStats } = useRegistrationAttemptsStats(dateRange);

  const filterConfig: FilterConfig[] = [
    {
      name: "keyword",
      type: "text",
      placeholder: t("registrationAttemptsView.filters.searchByPhone"),
    },
    {
      name: "source",
      type: "select",
      placeholder: t("registrationAttemptsView.filters.source"),
      options: [
        { value: "register", label: "Register" },
        { value: "checkout", label: "Checkout" },
      ],
    },
    {
      name: "registered",
      type: "select",
      placeholder: t("registrationAttemptsView.filters.registered"),
      options: [
        { value: "true", label: t("registrationAttemptsView.badge.yes") },
        { value: "false", label: t("registrationAttemptsView.badge.no") },
      ],
    },
  ];

  const handleFilterChange = (name: string, value: FilterValue) => {
    startTransition(() => {
      setSearchParams((prev) => ({
        ...prev,
        [name]: value,
      }));
    });
  };

  const resetPage = useCallback(() => setPagination((prev) => ({ ...prev, page: 1 })), []);

  const handleSortingChange = useCallback(
    (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
      setSorting(updaterOrValue);
      resetPage();
    },
    [resetPage],
  );

  const columns: ColumnDef<RegistrationAttempt>[] = [
    {
      id: "expand",
      header: "",
      enableSorting: false,
      cell: ({ row }) => {
        const cart = row.original.cartSnapshot as CartItem[] | null;
        if (!cart || !Array.isArray(cart) || cart.length === 0) return null;
        return (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              row.toggleExpanded();
            }}
            className="p-1 hover:bg-neutral-200 rounded"
          >
            {row.getIsExpanded() ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        );
      },
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <SortButton<RegistrationAttempt> column={column}>
          {t("registrationAttemptsView.columns.phone")}
        </SortButton>
      ),
    },
    {
      accessorKey: "source",
      header: ({ column }) => (
        <SortButton<RegistrationAttempt> column={column}>
          {t("registrationAttemptsView.columns.source")}
        </SortButton>
      ),
      cell: ({ row }) => <Badge variant="secondary">{row.original.source}</Badge>,
    },
    {
      id: "name",
      header: t("registrationAttemptsView.columns.name"),
      enableSorting: false,
      cell: ({ row }) => {
        const { firstName, lastName } = row.original;
        if (!firstName && !lastName) return "-";
        return `${firstName ?? ""} ${lastName ?? ""}`.trim();
      },
    },
    {
      id: "totalUsd",
      header: t("registrationAttemptsView.columns.totalUsd"),
      enableSorting: false,
      cell: ({ row }) => {
        const cart = row.original.cartSnapshot as CartItem[] | null;
        if (!cart || !Array.isArray(cart) || cart.length === 0) return "-";
        const total = cart.reduce((sum, item) => sum + item.priceInCents, 0);
        return `$${formatCents(total)}`;
      },
    },
    {
      id: "totalArs",
      header: t("registrationAttemptsView.columns.totalArs"),
      enableSorting: false,
      cell: ({ row }) => {
        const cart = row.original.cartSnapshot as CartItem[] | null;
        if (!cart || !Array.isArray(cart) || cart.length === 0) return "-";
        const total = cart.reduce((sum, item) => sum + (item.mercadopagoPriceInCents ?? 0), 0);
        if (total === 0) return "-";
        return `$${formatCents(total)}`;
      },
    },
    {
      id: "cartTotal",
      header: t("registrationAttemptsView.columns.cartTotal"),
      enableSorting: false,
      cell: ({ row }) => {
        const cart = row.original.cartSnapshot as CartItem[] | null;
        if (!cart || !Array.isArray(cart)) return "-";
        return cart.length;
      },
    },
    {
      id: "cartFree",
      header: t("registrationAttemptsView.columns.cartFree"),
      enableSorting: false,
      cell: ({ row }) => {
        const cart = row.original.cartSnapshot as CartItem[] | null;
        if (!cart || !Array.isArray(cart)) return "-";
        return cart.filter((item) => item.priceInCents === 0).length;
      },
    },
    {
      id: "cartPaid",
      header: t("registrationAttemptsView.columns.cartPaid"),
      enableSorting: false,
      cell: ({ row }) => {
        const cart = row.original.cartSnapshot as CartItem[] | null;
        if (!cart || !Array.isArray(cart)) return "-";
        return cart.filter((item) => item.priceInCents > 0).length;
      },
    },
    {
      accessorKey: "termsAccepted",
      header: t("registrationAttemptsView.columns.terms"),
      enableSorting: false,
      cell: ({ row }) => (
        <Badge variant={row.original.termsAccepted ? "secondary" : "outline"}>
          {row.original.termsAccepted
            ? t("registrationAttemptsView.badge.yes")
            : t("registrationAttemptsView.badge.no")}
        </Badge>
      ),
    },
    {
      accessorKey: "registered",
      header: ({ column }) => (
        <SortButton<RegistrationAttempt> column={column}>
          {t("registrationAttemptsView.columns.registered")}
        </SortButton>
      ),
      cell: ({ row }) => (
        <Badge variant={row.original.registered ? "secondary" : "outline"}>
          {row.original.registered
            ? t("registrationAttemptsView.badge.yes")
            : t("registrationAttemptsView.badge.no")}
        </Badge>
      ),
    },
    {
      accessorKey: "registeredAt",
      header: t("registrationAttemptsView.columns.registeredAt"),
      enableSorting: false,
      cell: ({ row }) =>
        row.original.registeredAt ? format(new Date(row.original.registeredAt), "PPpp") : "-",
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <SortButton<RegistrationAttempt> column={column}>
          {t("registrationAttemptsView.columns.createdAt")}
        </SortButton>
      ),
      cell: ({ row }) =>
        row.original.createdAt ? format(new Date(row.original.createdAt), "PPpp") : "-",
    },
  ];

  const table = useReactTable({
    getRowId: (row) => row.id,
    data: attemptsData?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange: handleSortingChange,
    onExpandedChange: setExpanded,
    manualSorting: true,
    state: {
      sorting,
      expanded,
    },
    getRowCanExpand: (row) => {
      const cart = row.original.cartSnapshot as CartItem[] | null;
      return Array.isArray(cart) && cart.length > 0;
    },
  });

  const { totalItems, perPage, page } = attemptsData?.pagination || {};

  return (
    <PageWrapper
      breadcrumbs={[
        {
          title: t("registrationAttemptsView.header"),
          href: "/admin/registration-attempts",
        },
      ]}
    >
      <div className="flex flex-col gap-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h4 className="h4">{t("registrationAttemptsView.header")}</h4>
          <div className="flex items-center gap-3">
            <Input
              type="date"
              value={dateRange.dateFrom || ""}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, dateFrom: e.target.value || undefined }))
              }
              className="w-40"
            />
            <span className="text-neutral-500">-</span>
            <Input
              type="date"
              value={dateRange.dateTo || ""}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, dateTo: e.target.value || undefined }))
              }
              className="w-40"
            />
            {(dateRange.dateFrom || dateRange.dateTo) && (
              <Button variant="outline" size="sm" onClick={() => setDateRange({})}>
                {t("registrationAttemptsView.filters.clearDates")}
              </Button>
            )}
          </div>
        </div>

        <StatsCards stats={statsData} isLoading={isLoadingStats} />

        <DailyAttemptsChart daily={statsData?.daily} isLoading={isLoadingStats} />

        <SearchFilter
          filters={filterConfig}
          values={searchParams}
          onChange={(key, value) => {
            resetPage();
            handleFilterChange(key, value);
          }}
          isLoading={isPending}
        />

        <Table className="border bg-neutral-50">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoadingAttempts ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8">
                  {t("registrationAttemptsView.loading")}
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-neutral-500">
                  {t("registrationAttemptsView.noData")}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    className={`hover:bg-neutral-100 ${row.getCanExpand() ? "cursor-pointer" : ""}`}
                    onClick={() => row.getCanExpand() && row.toggleExpanded()}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="bg-neutral-100 p-4">
                        <CartDetail cart={row.original.cartSnapshot as CartItem[]} t={t} />
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>

        <Pagination
          className="border-b border-x bg-neutral-50 rounded-b-lg"
          emptyDataClassName="border-b border-x bg-neutral-50 rounded-b-lg"
          totalItems={totalItems}
          itemsPerPage={perPage as (typeof ITEMS_PER_PAGE_OPTIONS)[number]}
          currentPage={page}
          onPageChange={(newPage) => setPagination((prev) => ({ ...prev, page: newPage }))}
          onItemsPerPageChange={(newPerPage) => {
            setPagination({ page: 1, perPage: Number(newPerPage) });
          }}
        />
      </div>
    </PageWrapper>
  );
};

function CartDetail({ cart, t }: { cart: CartItem[]; t: (key: string) => string }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-neutral-500 border-b">
          <th className="pb-2 font-medium">{t("registrationAttemptsView.cart.title")}</th>
          <th className="pb-2 font-medium text-right">
            {t("registrationAttemptsView.cart.priceUsd")}
          </th>
          <th className="pb-2 font-medium text-right">
            {t("registrationAttemptsView.cart.priceArs")}
          </th>
        </tr>
      </thead>
      <tbody>
        {cart.map((item) => (
          <tr key={item.courseId} className="border-b last:border-0">
            <td className="py-2">{item.title}</td>
            <td className="py-2 text-right">${formatCents(item.priceInCents)}</td>
            <td className="py-2 text-right">
              {item.mercadopagoPriceInCents != null
                ? `$${formatCents(item.mercadopagoPriceInCents)}`
                : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default RegistrationAttempts;
