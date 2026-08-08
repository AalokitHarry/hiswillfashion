"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { getProductBySlug } from "@/data/products";
import { SITE } from "@/lib/site";
import type { CartLine } from "@/lib/types";

const STORAGE_KEY = "hwfc_cart_v1";

const listeners = new Set<() => void>();
let cachedLines: CartLine[] = [];
let cachedRaw: string | null = null;

function parseLines(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readFromStorage(): CartLine[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedLines = parseLines(raw);
  }
  return cachedLines;
}

function writeLines(next: CartLine[]) {
  cachedLines = next;
  cachedRaw = JSON.stringify(next);
  window.localStorage.setItem(STORAGE_KEY, cachedRaw);
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): CartLine[] {
  return readFromStorage();
}

function getServerSnapshot(): CartLine[] {
  return cachedLines;
}

function isReadySnapshot() {
  return true;
}

function isReadyServerSnapshot() {
  return false;
}

const noopSubscribe = () => () => {};

interface ResolvedLine extends CartLine {
  name: string;
  price: number;
  lineTotal: number;
}

export function useCart() {
  const lines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isReady = useSyncExternalStore(noopSubscribe, isReadySnapshot, isReadyServerSnapshot);

  const addItem = useCallback((slug: string, size: string, quantity = 1) => {
    const current = readFromStorage();
    const existing = current.find((l) => l.slug === slug && l.size === size);
    const next = existing
      ? current.map((l) =>
          l.slug === slug && l.size === size
            ? { ...l, quantity: l.quantity + quantity }
            : l
        )
      : [...current, { slug, size, quantity }];
    writeLines(next);
  }, []);

  const removeItem = useCallback((slug: string, size: string) => {
    const current = readFromStorage();
    writeLines(current.filter((l) => !(l.slug === slug && l.size === size)));
  }, []);

  const updateQuantity = useCallback((slug: string, size: string, quantity: number) => {
    const current = readFromStorage();
    if (quantity <= 0) {
      writeLines(current.filter((l) => !(l.slug === slug && l.size === size)));
      return;
    }
    writeLines(
      current.map((l) => (l.slug === slug && l.size === size ? { ...l, quantity } : l))
    );
  }, []);

  const clear = useCallback(() => writeLines([]), []);

  const resolvedLines = useMemo<ResolvedLine[]>(() => {
    return lines
      .map((line) => {
        const product = getProductBySlug(line.slug);
        if (!product) return null;
        return {
          ...line,
          name: product.name,
          price: product.price,
          lineTotal: product.price * line.quantity,
        };
      })
      .filter((l): l is ResolvedLine => l !== null);
  }, [lines]);

  const count = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);
  const subtotal = useMemo(
    () => resolvedLines.reduce((sum, l) => sum + l.lineTotal, 0),
    [resolvedLines]
  );
  const shipping = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= SITE.freeShippingThreshold ? 0 : SITE.shippingFee;
  }, [subtotal]);
  const total = subtotal + shipping;

  return {
    lines,
    resolvedLines,
    isReady,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    count,
    subtotal,
    shipping,
    total,
  };
}
