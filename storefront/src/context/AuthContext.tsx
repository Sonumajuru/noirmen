"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { medusa, Customer } from "@/lib/medusa";

type AuthContextType = {
  customer: Customer | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    medusa.customers
      .retrieve()
      .then(({ customer }) => setCustomer(customer))
      .catch(() => setCustomer(null))
      .finally(() => setIsLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const { customer } = await medusa.customers.login(email, password);
    setCustomer(customer);
  }

  async function logout() {
    await medusa.customers.logout();
    setCustomer(null);
  }

  async function register(data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) {
    const { customer } = await medusa.customers.create(data);
    setCustomer(customer);
  }

  return (
    <AuthContext.Provider value={{ customer, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
