"use client";

import { useEffect } from "react";

export default function GSAPProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  useEffect(() => {
    import("@/lib/gsap").then(({ gsap }) => {
      console.log("GSAP registered:", gsap.version);
    });
  }, []);

  return <>{children}</>;
}
