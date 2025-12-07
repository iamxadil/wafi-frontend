import { useEffect, useState } from "react";

export default function useCounter(target, duration = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const startTime = performance.now();

    function animate(t) {
      const elapsed = t - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress * (2 - progress); // easeOutQuad

      setValue(Math.floor(start + eased * (target - start)));

      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [target, duration]);

  return value;
}
