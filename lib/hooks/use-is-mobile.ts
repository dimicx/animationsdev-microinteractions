"use client";

import { useMemo } from "react";
import { useMediaQuery } from "usehooks-ts";

/**
 * Hook for detecting if the user is on a mobile device.
 * Uses media query to check if the viewport width is below 768px,
 * combined with user agent detection for more accurate results.
 *
 * @returns Whether the device is mobile
 */
export const useIsMobile = (): boolean => {
  const isNarrowViewport = useMediaQuery("(max-width: 768px)");

  const isMobileUserAgent = useMemo(() => {
    if (typeof navigator === "undefined") return false;

    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = [
      "android",
      "webos",
      "iphone",
      "ipad",
      "ipod",
      "blackberry",
      "windows phone",
      "mobile",
    ];

    return mobileKeywords.some((keyword) => userAgent.includes(keyword));
  }, []);

  return isNarrowViewport || isMobileUserAgent;
};
