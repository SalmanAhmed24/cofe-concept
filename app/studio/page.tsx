import { notFound } from "next/navigation";
import StudioClient from "./StudioClient";

export const metadata = { robots: { index: false, follow: false } };

export default function StudioPage() {
  // Asset-rendering tool only — never shipped to production visitors.
  if (process.env.NODE_ENV === "production" && !process.env.ENABLE_STUDIO) notFound();
  return <StudioClient />;
}
