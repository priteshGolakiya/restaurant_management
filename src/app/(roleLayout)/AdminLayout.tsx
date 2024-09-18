import type { Metadata } from "next";
import AdminNavbar from "../ui/AdminNavbar";

export const metadata: Metadata = {
  title: "Restaurant Management Admin",
  description: "Admin Panel",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminNavbar />
      {children}
    </>
  );
}
