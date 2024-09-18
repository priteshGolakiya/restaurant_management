import type { Metadata } from "next";
import ManagerNavbar from "../ui/ManagerNavbar";

export const metadata: Metadata = {
  title: "Restaurant Management Manager",
  description: "Manager Panel",
};

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ManagerNavbar />
      {children}
    </>
  );
}
