"use client";

import { useLayoutEffect, useRef, useState } from "react";

/** Measures an element's content width for charts that need numeric `width` (recharts). */
export function useElementWidth<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const apply = () => {
      const next = Math.floor(el.getBoundingClientRect().width);
      setWidth(next > 0 ? next : 0);
    };

    apply();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(apply) : null;
    ro?.observe(el);
    window.addEventListener("resize", apply);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, []);

  return { ref, width };
}
