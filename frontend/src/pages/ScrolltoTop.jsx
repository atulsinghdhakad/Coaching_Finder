import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false); // To track the click state
  const location = useLocation();

  const hiddenRoutes = ["/login", "/register"];

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    setIsClicked(true); // Trigger the click effect
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Reset the button spin animation after it completes
    setTimeout(() => setIsClicked(false), 500); // Spin duration is 500ms
  };

  const shouldHideButton = hiddenRoutes.includes(location.pathname);

  if (shouldHideButton) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-6 right-6 flex flex-col items-center space-y-2 z-50"
        >
          {/* Tooltip */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="mb-2 bg-black text-white text-xs px-3 py-1 rounded-md shadow-md"
              >
                Back to Top
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scroll to Top Button with Hover and Spin on Click */}
          <motion.button
            onClick={scrollToTop}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.1, rotate: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition duration-300 ${
              isClicked ? "animate-spin" : ""
            }`} // Add spin class on click
          >
            <FaArrowUp />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;