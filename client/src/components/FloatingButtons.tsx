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

      {/* Free Credits Promo */}
      <AnimatePresence>
        {showPromo && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ delay: 2 }}
            className="fixed right-6 bottom-48 z-40"
          >
            <div className="relative glass-card rounded-xl p-4 neon-glow max-w-[200px]">
              <button
                onClick={() => setShowPromo(false)}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center"
              >
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-neon-yellow" />
                <span className="font-display font-semibold text-sm text-foreground">20 Free Credits</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                註冊即可獲得免費積分！
              </p>
              <Link href="/ai-video-generator"
                className="block w-full py-1.5 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink text-white text-xs font-medium text-center hover:opacity-90 transition-all">
                立即體驗
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
