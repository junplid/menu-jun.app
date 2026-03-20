"use client";

import { FC, ReactNode } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

export const TextGradientComponent: FC<{
  children: ReactNode;
  backgroundImage?: string // "linear-gradient(70deg, #00ff62, #77ffab, #00ff62)",
  className?: string;
}> = ({ children, className, backgroundImage = "linear-gradient(0deg, #00ff62, #77ffab, #00ff62)" }) => {
  return (
    <motion.span
      className={twMerge(clsx("bg-clip-text text-transparent", className))}
      style={{
        backgroundImage,
        backgroundSize: "600% 400%",
      }}
      animate={{
        backgroundPositionX: ["0%", "110%"],
      }}
      transition={{
        duration: 3,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
      }}
    >
      {children}
    </motion.span>
  );
};
