// --- Splash persistence ---

export function markSplashComplete(): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("symmetra-splash-seen", "true");
  }
  markPageReady();
}

// --- Page readiness (controls when entrance animations play) ---
// Fires after splash exits (initial load) or after transition overlay
// lifts (client-side navigation). Reset on each navigation.

let _pageReady = false;

export function markPageReady(): void {
  if (_pageReady) return;
  _pageReady = true;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("page-ready"));
  }
}

export function resetPageReady(): void {
  _pageReady = false;
}

/**
 * Calls `callback` immediately if the page is already ready,
 * otherwise waits for the "page-ready" event.
 * Returns a cleanup function to remove the listener.
 */
export function onPageReady(callback: () => void): () => void {
  if (_pageReady) {
    callback();
    return () => {};
  }
  const handler = (): void => callback();
  window.addEventListener("page-ready", handler, { once: true });
  return () => window.removeEventListener("page-ready", handler);
}
