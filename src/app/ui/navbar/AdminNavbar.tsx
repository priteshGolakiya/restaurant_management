"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  X,
  User,
  LogOut,
  Coffee,
  Utensils,
  Calendar,
  Users,
  ChefHat,
  LucideIcon,
} from "lucide-react";
import Cookies from "js-cookie";
import { useAppSelector } from "@/lib/redux/hooks/hooks";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon: LucideIcon;
}

interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

interface UserPayload {
  userid: string;
  isactive: boolean;
  user_name: string;
  role: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, icon: Icon }) => (
  <Link
    href={href}
    className="group flex flex-col items-center text-amber-800 hover:text-amber-600 transition-colors duration-300"
  >
    <div className="bg-amber-100 p-2 rounded-full group-hover:bg-amber-200 transition-colors duration-300">
      <Icon className="h-5 w-5 md:h-6 md:w-6" />
    </div>
    <span className="mt-1 text-xs font-medium hidden md:inline">
      {children}
    </span>
  </Link>
);

const MobileNavLink: React.FC<MobileNavLinkProps> = ({
  href,
  children,
  icon: Icon,
  onClick,
}) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex items-center space-x-3 text-amber-800 hover:bg-amber-100 px-4 py-3 rounded-lg transition-colors duration-300"
  >
    <Icon className="h-5 w-5" />
    <span className="text-sm font-medium">{children}</span>
  </Link>
);

export default function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserPayload | null>(null);
  const router = useRouter();

  const userDetails = useAppSelector((state) => state.user.items);

  useEffect(() => {
    setUser(userDetails);
  }, [userDetails]);

  const handleLogout = async () => {
    try {
      Cookies.remove("token");
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gradient-to-r from-amber-50 to-orange-50 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 md:h-20">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex-shrink-0 flex items-center space-x-2"
            >
              <div className="bg-amber-400 p-2 rounded-full">
                <ChefHat className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <span className="text-xl md:text-2xl font-serif font-bold text-amber-800">
                Restro<span className="text-emerald-700">Flex</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            <NavLink href="/admin/" icon={Coffee}>
              Dashboard
            </NavLink>
            <NavLink href="/admin/menu" icon={Utensils}>
              Menu
            </NavLink>
            <NavLink href="/admin/reservations" icon={Calendar}>
              Reservations
            </NavLink>
            <NavLink href="/admin/staff" icon={Users}>
              Staff
            </NavLink>
            {user?.user_name ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-amber-700 hidden lg:inline">
                  Welcome, <strong>{user.user_name}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-amber-800 hover:text-amber-600 transition-colors duration-300"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center text-amber-800 hover:text-amber-600 transition-colors duration-300"
              >
                <User className="h-5 w-5 mr-1" />
                <span className="hidden lg:inline">Login</span>
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-amber-800 hover:text-amber-600 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 transition-colors duration-300"
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
        <div className="md:hidden bg-white shadow-lg absolute w-full">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <MobileNavLink
              href="/admin/dashboard"
              icon={Coffee}
              onClick={toggleMenu}
            >
              Dashboard
            </MobileNavLink>
            <MobileNavLink
              href="/admin/menu"
              icon={Utensils}
              onClick={toggleMenu}
            >
              Menu
            </MobileNavLink>
            <MobileNavLink
              href="/admin/reservations"
              icon={Calendar}
              onClick={toggleMenu}
            >
              Reservations
            </MobileNavLink>
            <MobileNavLink
              href="/admin/staff"
              icon={Users}
              onClick={toggleMenu}
            >
              Staff
            </MobileNavLink>
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="w-full text-left text-amber-800 hover:bg-amber-100 px-4 py-3 rounded-lg transition-colors duration-300 flex items-center space-x-3"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            ) : (
              <MobileNavLink href="/login" icon={User} onClick={toggleMenu}>
                Login
              </MobileNavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
