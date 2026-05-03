const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

async function medusaFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${MEDUSA_BACKEND_URL}/store${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  return res.json();
}

export const medusa = {
  products: {
    list: (params?: Record<string, string>) => {
      const query = params ? "?" + new URLSearchParams(params).toString() : "";
      return medusaFetch<{ products: Product[]; count: number; offset: number; limit: number }>(
        `/products${query}`
      );
    },
    retrieve: (id: string) =>
      medusaFetch<{ product: Product }>(`/products/${id}`),
  },

  carts: {
    create: () =>
      medusaFetch<{ cart: Cart }>("/carts", { method: "POST", body: JSON.stringify({}) }),
    retrieve: (id: string) =>
      medusaFetch<{ cart: Cart }>(`/carts/${id}`),
    addItem: (cartId: string, variantId: string, quantity: number) =>
      medusaFetch<{ cart: Cart }>(`/carts/${cartId}/line-items`, {
        method: "POST",
        body: JSON.stringify({ variant_id: variantId, quantity }),
      }),
    updateItem: (cartId: string, lineId: string, quantity: number) =>
      medusaFetch<{ cart: Cart }>(`/carts/${cartId}/line-items/${lineId}`, {
        method: "POST",
        body: JSON.stringify({ quantity }),
      }),
    deleteItem: (cartId: string, lineId: string) =>
      medusaFetch<{ cart: Cart }>(`/carts/${cartId}/line-items/${lineId}`, {
        method: "DELETE",
      }),
    complete: (cartId: string) =>
      medusaFetch<{ type: string; data: Order }>(`/carts/${cartId}/complete`, {
        method: "POST",
      }),
  },

  customers: {
    create: (data: { email: string; password: string; first_name: string; last_name: string }) =>
      medusaFetch<{ customer: Customer }>("/customers", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    login: (email: string, password: string) =>
      medusaFetch<{ customer: Customer }>("/auth", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    logout: () => medusaFetch("/auth", { method: "DELETE" }),
    retrieve: () => medusaFetch<{ customer: Customer }>("/customers/me"),
    listOrders: () =>
      medusaFetch<{ orders: Order[] }>("/customers/me/orders"),
  },

  orders: {
    retrieveByCartId: (cartId: string) =>
      medusaFetch<{ order: Order }>(`/orders/cart/${cartId}`),
    lookupByEmail: (email: string, displayId: number) =>
      medusaFetch<{ order: Order }>(`/orders?display_id=${displayId}&email=${email}`),
  },
};

export type Product = {
  id: string;
  title: string;
  description: string;
  handle: string;
  thumbnail: string | null;
  variants: ProductVariant[];
  options: ProductOption[];
  images: { url: string }[];
  collection?: { title: string };
  tags?: { value: string }[];
};

export type ProductVariant = {
  id: string;
  title: string;
  prices: Price[];
  inventory_quantity: number;
  options: { value: string }[];
};

export type ProductOption = {
  id: string;
  title: string;
  values: { value: string }[];
};

export type Price = {
  amount: number;
  currency_code: string;
};

export type LineItem = {
  id: string;
  title: string;
  quantity: number;
  thumbnail: string | null;
  variant: ProductVariant;
  unit_price: number;
  subtotal: number;
};

export type Cart = {
  id: string;
  items: LineItem[];
  total: number;
  subtotal: number;
  shipping_total: number;
  tax_total: number;
  region: { currency_code: string };
};

export type Customer = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
};

export type Order = {
  id: string;
  display_id: number;
  status: string;
  fulfillment_status: string;
  payment_status: string;
  email: string;
  created_at: string;
  items: LineItem[];
  total: number;
  subtotal: number;
  shipping_total: number;
  shipping_address?: {
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    postal_code: string;
    country_code: string;
  };
};

export function formatPrice(amount: number, currencyCode = "eur"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(amount / 100);
}
