import { motion, useScroll, useTransform } from 'motion/react';

// Ported from code-park — stripped next-intl
export default function ScrollIndicator() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

  return (
    <motion.div
      style={{ opacity }}
      className="flex flex-col items-center gap-3"
      aria-label="Scroll down to explore"
    >
      <motion.svg
        width="28"
        height="40"
        viewBox="0 0 28 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ y: [0, 12, 0, 12, 0] }}
        transition={{ duration: 4, times: [0, 0.25, 0.5, 0.75, 1], ease: [0.34, 1.56, 0.64, 1], repeat: 0 }}
      >
        <rect x="1" y="1" width="26" height="38" rx="13" stroke="black" strokeWidth="1.5" fill="none" />
        <motion.line
          x1="14" y1="10" x2="14" y2="16"
          stroke="black" strokeWidth="1.5" strokeLinecap="round"
          animate={{ opacity: [0.3, 1, 0.3, 1, 0.3] }}
          transition={{ duration: 4, times: [0, 0.25, 0.5, 0.75, 1], ease: 'easeInOut', repeat: 0 }}
        />
      </motion.svg>
      <motion.p
        className="text-xs text-stone-500 font-light tracking-widest"
        animate={{ opacity: [0.5, 1, 0.5, 1, 0.5] }}
        transition={{ duration: 4, times: [0, 0.25, 0.5, 0.75, 1], ease: 'easeInOut', repeat: 0 }}
      >
        Scroll
      </motion.p>
    </motion.div>
  );
}
