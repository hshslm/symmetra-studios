"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export default function NavLogo(): React.ReactElement {
  return (
    <Link
      href="/"
      className="fixed top-6 left-6 z-[52] block h-6 w-auto md:top-8 md:left-10"
      aria-label="Symmetra Studios - Home"
    >
      <img
        src="/logo.svg"
        alt=""
        className="h-full w-auto"
        aria-hidden="true"
      />
    </Link>
  );
}
