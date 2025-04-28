import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ScrollProgressBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = (currentScroll / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 h-1 z-[9999] overflow-hidden"
      initial={{ width: 0 }}
      animate={{ width: `${scrollProgress}%` }}
      transition={{ ease: "easeOut", duration: 0.2 }}
    >
      <div className="h-full w-full bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-500 animate-gradient-x pulse-glow"></div>
    </motion.div>
  );
};

export default ScrollProgressBar;