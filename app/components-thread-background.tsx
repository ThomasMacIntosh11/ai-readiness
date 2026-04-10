"use client";

import { motion, useReducedMotion } from "framer-motion";
import { transitionForReducedMotion } from "@/lib/motion";

type ThreadBackgroundProps = {
  variant: 1 | 2;
};

export default function ThreadBackground({ variant }: ThreadBackgroundProps) {
  const reducedMotion = useReducedMotion();
  const image = variant === 1 ? "/Innovation%20Thread_Style%201%20White.png" : "/Innovation%20Thread_Style%202%20White.png";
  const size = variant === 1 ? "1850px auto" : "1450px auto";
  const position = variant === 1 ? "center center" : "center center";

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 right-0 top-0 h-screen opacity-24 no-print"
      initial={reducedMotion ? false : { y: 0, scale: 1 }}
      animate={reducedMotion ? undefined : { y: -6, scale: 1.01 }}
      transition={
        reducedMotion
          ? transitionForReducedMotion(true)
          : {
              ...transitionForReducedMotion(false, 8),
              repeat: Infinity,
              repeatType: "reverse",
            }
      }
      style={{
        backgroundImage: `url("${image}")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: position,
        backgroundSize: size,
      }}
    />
  );
}
