// components/LoadingOverlay.tsx
"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";

interface LoadingOverlayProps {
  loading: boolean;
  showPercenttage?: boolean;
  onComplete?: () => void;
}

export default function LoadingOverlay({
  loading,
  showPercenttage = false,
  onComplete,
}: LoadingOverlayProps) {
  const [visible, setVisible] = useState(false);

  // 1. Motion values live OUTSIDE React's render cycle
  const rawProgress = useMotionValue(0);

  // 2. Spring smoothes out the jumps (tight spring = snappy, not bouncy)
  const smoothProgress = useSpring(rawProgress, {
    stiffness: 200,
    damping: 25,
  });

  const widthPercent = useTransform(smoothProgress, (v) => `${v}%`);

  // 3. Transform the raw number into a formatted string for the label
  const percentageText = useTransform(
    smoothProgress,
    (latest) => `${Math.round(latest)}%`,
  );

  useEffect(() => {
    let animationId: number | null = null;
    let hideTimer: NodeJS.Timeout | null = null;

    if (loading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);

      // Reset progress instantly to 0 (no animation)
      rawProgress.set(0);

      const startTime = performance.now();
      const duration = 2000; // 2 seconds to reach 90%
      const target = 90;

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const newProgress = Math.min((elapsed / duration) * target, target);

        // 4. Update the MotionValue directly – NO REACT RE-RENDER!
        rawProgress.set(newProgress);

        if (newProgress < target) {
          animationId = requestAnimationFrame(animate);
        }
      };

      animationId = requestAnimationFrame(animate);
    } else {
      // 5. Loading finished: jump to 100% instantly (spring handles the interpolation)
      rawProgress.set(100);

      // Hide after a tiny delay so the user sees the completion
      hideTimer = setTimeout(() => {
        setVisible(false);
        rawProgress.set(0); // Reset for next time
        onComplete?.();
      }, 350);
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [loading, rawProgress, onComplete]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm"
      role="status"
      aria-label="Loading"
    >
      <div className="w-64 md:w-[342px] max-w-[80%] bg-white/90 p-4 rounded-lg shadow-">
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          {/* 6. The width is tied to the SPRING, not React state */}
          <motion.div
            className="h-full bg-primary rounded-full"
            style={{ width: widthPercent }}
          />
        </div>
        {/* 7. The text updates via useTransform, also without React re-renders */}
        {showPercenttage && (
          <motion.p className="text-center text-sm text-gray-600 mt-2">
            {percentageText}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
