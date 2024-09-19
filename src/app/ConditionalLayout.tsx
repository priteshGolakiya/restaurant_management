"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AdminNavbar from "./ui/navbar/AdminNavbar";
import ManagerNavbar from "./ui/navbar/ManagerNavbar";
import WaiterNavbar from "./ui/navbar/WaiterNavbar";

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
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }

    if (!user.userid && pathname !== "/login") {
      router.push("/login");
    } else if (user.userid && user.isactive) {
      const allowedPaths = getAllowedPaths(user.role);

      if (!isAllowedPath(pathname, allowedPaths) && pathname !== "/login") {
        console.log("User role not allowed for this path. Redirecting...");
        router.push(allowedPaths[0]);
      }
    }
  }, [user, pathname, router, isInitialLoad]);

  if (isInitialLoad) {
    return null;
  }

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
  const commonPaths = ["/reserve"];
  switch (role) {
    case "admin":
      return ["/admin", ...commonPaths];
    case "waiter":
      return ["/waiter", ...commonPaths];
    case "manager":
      return ["/manager", ...commonPaths];
    default:
      return commonPaths;
  }
}

function isAllowedPath(pathname: string, allowedPaths: string[]): boolean {
  return allowedPaths.some((path) => pathname.startsWith(path));
}
