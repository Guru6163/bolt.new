"use client";

import { useEffect, useState } from "react";
import { WebContainer } from "@webcontainer/api";

let instance: WebContainer | null = null;
let instancePromise: Promise<WebContainer> | null = null;

export function useWebContainer(shouldInitialize: boolean = true) {
  const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);
  const [isLoading, setIsLoading] = useState(shouldInitialize);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shouldInitialize) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function bootWebContainer() {
      try {
        console.log('Booting WebContainer...');
        console.log('WebContainer API available:', typeof WebContainer);
        
        // Check if crossOriginIsolated is available
        if (!window.crossOriginIsolated) {
          throw new Error('WebContainer requires crossOriginIsolated to be true. Please ensure the proper headers are set.');
        }
        
        if (instance) {
          console.log('Using existing WebContainer instance');
          setWebcontainer(instance);
          setIsLoading(false);
          return;
        }

        if (!instancePromise) {
          console.log('Creating new WebContainer instance...');
          instancePromise = WebContainer.boot();
        }

        console.log('Waiting for WebContainer to boot...');
        const container = await instancePromise;
        console.log('WebContainer booted successfully:', container);

        if (!cancelled) {
          instance = container;
          setWebcontainer(container);
          setIsLoading(false);
          console.log('WebContainer set in state');
        }
      } catch (e) {
        console.error("Failed to boot WebContainer", e);
        setError(e instanceof Error ? e.message : 'Unknown error');
        setIsLoading(false);
      }
    }

    bootWebContainer();

    return () => {
      cancelled = true;
    };
  }, [shouldInitialize]);

  return { webcontainer, isLoading, error };
}
