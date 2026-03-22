import { Metadata } from "next";
import StudioPage from "@/components/studio/StudioPage";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "AI-powered video production studio. Two directors. One pipeline. Unlimited output.",
};

export default function Studio(): React.ReactElement {
  return <StudioPage />;
}
