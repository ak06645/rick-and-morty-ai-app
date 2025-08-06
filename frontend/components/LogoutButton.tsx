"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Remove the JWT
    localStorage.removeItem("token");
    // Redirect to login (replace so history doesn’t keep the protected page)
    router.replace("/login");
  };

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      Logout
    </Button>
  );
}