"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function ClientWrapper() {
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    // allow /login and /register through
    if (path === "/login" || path === "/register") return;

    // otherwise, if no token, redirect
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, [path, router]);

  return null;
}