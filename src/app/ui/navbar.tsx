"use client";
import { useState, ReactNode } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

export default function RestaurantNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-amber-50 border-b border-amber-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-3xl mr-2">🍽️</span>
              <span className="text-2xl font-serif font-bold text-amber-800">
                Gourmet<span className="text-emerald-700">Hub</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/menu">Menu</NavLink>
            <NavLink href="/reservations">Reservations</NavLink>
            <NavLink href="/staff">Staff</NavLink>
            <NavLink href="/reports">Reports</NavLink>
            <NavLink
              href="/login"
              // className="bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Login
            </NavLink>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-amber-800 hover:text-amber-900 hover:bg-amber-100 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-amber-50">
            <MobileNavLink href="/dashboard">Dashboard</MobileNavLink>
            <MobileNavLink href="/menu">Menu</MobileNavLink>
            <MobileNavLink href="/reservations">Reservations</MobileNavLink>
            <MobileNavLink href="/staff">Staff</MobileNavLink>
            <MobileNavLink href="/reports">Reports</MobileNavLink>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="text-amber-800 hover:text-amber-900 hover:bg-amber-100 px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="block text-amber-800 hover:text-amber-900 hover:bg-amber-100 px-3 py-2 rounded-md text-base font-medium"
    >
      {children}
    </Link>
  );
}
