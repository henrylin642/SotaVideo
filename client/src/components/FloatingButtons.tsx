/*
 * Design: Cyberpunk Neon - 浮動按鈕
 * Discord 按鈕、免費積分提示、回到頂部
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Gift, MessageCircle, X } from "lucide-react";
import { Link } from "wouter";

export default function FloatingButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showPromo, setShowPromo] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Discord Button */}
      <div className="fixed right-6 bottom-32 z-40">
        <motion.a
          href="https://discord.gg/"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1 }}
          className="w-12 h-12 rounded-full bg-[#5865F2] flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all"
          title="Join Discord"
        >
          <MessageCircle className="w-5 h-5 text-white" />
        </motion.a>
      </div>




      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={scrollToTop}
            className="fixed right-6 bottom-16 z-40 w-10 h-10 rounded-full glass-card flex items-center justify-center hover:neon-glow transition-all"
          >
            <ArrowUp className="w-4 h-4 text-neon-purple" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
