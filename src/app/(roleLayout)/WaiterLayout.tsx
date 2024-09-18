import type { Metadata } from "next";
import WaiterNavbar from "../ui/WaiterNavbar";

export const metadata: Metadata = {
  title: "Restaurant Management Waiter",
  description: "Waiter Panel",
};

export default function WaiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <WaiterNavbar />
      {children}
    </>
  );
}
