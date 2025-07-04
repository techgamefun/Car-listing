"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/util/axios"; // Make sure this is your axios instance with withCredentials: true

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/auth/me")
      .then(() => setLoading(false))
      .catch(() => router.replace("/admin-login"));
  }, [router]);

  if (loading) return <div>Loading...</div>;
  return children;
}
