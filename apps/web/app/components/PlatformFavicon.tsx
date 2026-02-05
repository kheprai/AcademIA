import { useEffect } from "react";

import { usePlatformSimpleLogo } from "../api/queries/usePlatformSimpleLogo";
import appSignetSvg from "../assets/svgs/app-signet.svg";

export function PlatformFavicon() {
  const { data: platformSimpleLogoUrl, isLoading } = usePlatformSimpleLogo();

  useEffect(() => {
    if (isLoading) return;

    const finalUrl = platformSimpleLogoUrl || appSignetSvg;

    // Update existing favicon href instead of removing/re-creating DOM nodes.
    // Removing React-managed <link> elements corrupts the fiber tree and causes
    // "Node.insertBefore" crashes when navigating between routes.
    const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
    existingFavicons.forEach((link) => {
      (link as HTMLLinkElement).href = finalUrl;
    });
  }, [platformSimpleLogoUrl, isLoading]);

  return null;
}
