"use client";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import AdminNavbar from "./ui/AdminNavbar";
import WaiterNavbar from "./ui/WaiterNavbar";
import ManagerNavbar from "./ui/ManagerNavbar";

interface User {
  userid: string;
  role: string;
  isactive: boolean;
}

interface RootState {
  user: {
    items: User;
  };
}

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useSelector((state: RootState) => state.user.items);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user.userid && pathname !== "/login") {
      router.push("/login");
    } else if (user.userid && user.isactive) {
      const allowedPaths = getAllowedPaths(user.role);

      if (!isAllowedPath(pathname, allowedPaths) && pathname !== "/login") {
        console.log("User role not allowed for this path. Redirecting...");
        router.push(allowedPaths[0]);
      }
    }
  }, [user, pathname, router]);

  if (!user.userid && pathname !== "/login") {
    return null;
  }

  return (
    <>
      {renderNavbar(user.role)}
      {children}
    </>
  );
}

function renderNavbar(role: string) {
  switch (role) {
    case "admin":
      return <AdminNavbar />;
    case "waiter":
      return <WaiterNavbar />;
    case "manager":
      return <ManagerNavbar />;
    default:
      return null;
  }
}

function getAllowedPaths(role: string): string[] {
  switch (role) {
    case "admin":
      return ["/admin", "/admin/menu"];
    case "waiter":
      return ["/waiter"];
    case "manager":
      return ["/manager"];
    default:
      return ["/"];
  }
}

function isAllowedPath(pathname: string, allowedPaths: string[]): boolean {
  return allowedPaths.some((path) => pathname.startsWith(path));
}
