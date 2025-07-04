"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }) {
  const router = useRouter();

  useEffect(() => {
    // Check for the token cookie
    if (!document.cookie.split("; ").find((row) => row.startsWith("token="))) {
      router.replace("/admin-login");
    }
  }, [router]);

  return children;
}
