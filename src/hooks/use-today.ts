import { useEffect, useState } from "react";
import { AppState } from "react-native";

/**
 * Returns the current local date as YYYY-MM-DD string.
 * Updates when the day changes (midnight local time) or when app returns from background.
 */
export function useToday(): string {
  const [today, setToday] = useState(() => getLocalDateString());

  useEffect(() => {
    // Calculate milliseconds until next midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setHours(24, 0, 0, 0);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const timeoutId = setTimeout(() => {
      setToday(getLocalDateString());
    }, msUntilMidnight);

    // Also listen for app foreground to catch day changes while backgrounded
    const onAppStateChange = (state: string) => {
      if (state === "active") {
        setToday(getLocalDateString());
      }
    };

    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => {
      clearTimeout(timeoutId);
      subscription.remove();
    };
  }, []);

  return today;
}

function getLocalDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}