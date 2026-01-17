"use client";

import { useEffect, useState } from "react";

export default function AutoRefresh({
  children,
  interval = 300000, // 5 minutes
}: {
  children: React.ReactNode;
  interval?: number;
}) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => t + 1);
    }, interval);

    return () => clearInterval(id);
  }, [interval]);

  return <>{children}</>;
}
