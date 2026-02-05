import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "~/components/ui/button";

type RemoveItemConfirmProps = {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  timeout?: number;
  compact?: boolean;
};

export function RemoveItemConfirm({
  title,
  onConfirm,
  onCancel,
  timeout = 20,
  compact = false,
}: RemoveItemConfirmProps) {
  const { t } = useTranslation();
  const [seconds, setSeconds] = useState(timeout);

  const stableCancel = useCallback(onCancel, [onCancel]);

  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (seconds <= 0) stableCancel();
  }, [seconds, stableCancel]);

  const progressPct = (seconds / timeout) * 100;

  if (compact) {
    return (
      <div className="flex flex-col gap-2 rounded-md border border-red-200 bg-red-50 p-3">
        <p className="line-clamp-2 text-sm leading-tight text-red-700">
          {t("cart.removeConfirm.message", '¿Eliminar "{{title}}"?', { title })}
        </p>
        <div className="h-1 w-full overflow-hidden rounded-full bg-red-200">
          <div
            className="h-full rounded-full bg-red-500 transition-all duration-1000 ease-linear"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="destructive" size="sm" className="flex-1" onClick={onConfirm}>
            {t("cart.removeConfirm.confirm", "Sí")} ({seconds}s)
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={onCancel}>
            {t("cart.removeConfirm.cancel", "No")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-md border border-red-200 bg-red-50 p-4">
      <p className="text-sm text-red-700">
        {t("cart.removeConfirm.message", '¿Eliminar "{{title}}"?', { title })}
      </p>
      <div className="h-1 w-full overflow-hidden rounded-full bg-red-200">
        <div
          className="h-full rounded-full bg-red-500 transition-all duration-1000 ease-linear"
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <div className="flex gap-2">
        <Button variant="destructive" size="sm" onClick={onConfirm}>
          {t("cart.removeConfirm.confirm", "Sí")} ({seconds}s)
        </Button>
        <Button variant="outline" size="sm" onClick={onCancel}>
          {t("cart.removeConfirm.cancel", "No")}
        </Button>
      </div>
    </div>
  );
}
