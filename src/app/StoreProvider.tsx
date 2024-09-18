

"use client";

import { AppStore, makeStore } from "@/lib/redux/store";
import { useRef, useEffect, useState } from "react";
import { Provider } from "react-redux";
import Cookies from "js-cookie";
import { jwtVerify } from "jose";
import { setUserDetails } from "@/lib/redux/slice/userSlice";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  const [isLoading, setIsLoading] = useState(true);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    const verifyToken = async () => {
      const token = Cookies.get("token");
      if (token) {
        try {
          const secret = process.env.NEXT_PUBLIC_JWT_SECRET;
          if (!secret) throw new Error("JWT secret is not defined");

          const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(secret)
          );

          storeRef.current?.dispatch(
            setUserDetails({
              userid: payload.userid as string,
              isactive: payload.isactive as boolean,
              user_name: payload.user_name as string,
              role: payload.role as string,
            })
          );
        } catch (error) {
          console.error("Error verifying token:", error);
          storeRef.current?.dispatch(
            setUserDetails({
              userid: "",
              isactive: false,
              user_name: "",
              role: "",
            })
          );
        }
      }
      setIsLoading(false);
    };

    verifyToken();
  }, []);

  if (isLoading) {
    return null; // or a loading spinner
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
