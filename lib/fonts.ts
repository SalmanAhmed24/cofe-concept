import localFont from "next/font/local";

export const display = localFont({
  src: "../app/fonts/SixCaps.woff2",
  weight: "400",
  display: "swap",
  variable: "--font-display",
  fallback: ["Impact", "Arial Narrow", "sans-serif"],
  adjustFontFallback: false,
});

export const body = localFont({
  src: "../app/fonts/Manrope.woff2",
  weight: "200 800",
  display: "swap",
  variable: "--font-body",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});
