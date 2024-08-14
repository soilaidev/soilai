"use client";
import { useEffect } from "react";
import { initializeSoilAi } from "../dom/init";

export function useSoilAi() {
  useEffect(() => {
    if (location.hostname.includes("localhost")) {
      const remove = initializeSoilAi();

      return () => {
        remove();
      };
    }
  }, []);
}

export function SoilAi() {
  useSoilAi();

  return null;
}
