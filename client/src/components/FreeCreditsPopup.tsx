/*
 * FreeCreditsPopup: 免費積分彈窗
 * 註冊即可獲得 60 free credits
 * 點擊「立即體驗」→ 觸發 Google 登入
 * 登入成功後自動領取，彈窗不再出現
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift } from "lucide-react";
import { useCredits } from "@/contexts/CreditsContext";
import { useAuth } from "@/contexts/AuthContext";

export default function FreeCreditsPopup() {
  const { freeClaimed, claimFreeCredits } = useCredits();
  const { user, signInWithGoogle } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show popup after 2 seconds if not claimed yet
    if (!freeClaimed) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [freeClaimed]);

  // Auto-claim when user logs in and hasn't claimed yet
  useEffect(() => {
    if (user && !freeClaimed) {
      claimFreeCredits();
      setVisible(false);
    }
  }, [user, freeClaimed]);

  const handleClick = () => {
    if (user) {
      // Already logged in, claim directly
      claimFreeCredits();
      setVisible(false);
    } else {
      // Not logged in, trigger Google login
      signInWithGoogle();
    }
  };

  if (freeClaimed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 80, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="relative glass-card rounded-xl p-3 neon-glow max-w-[180px]">
            <button onClick={() => setVisible(false)}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center hover:bg-white/10 transition-colors">
              <X className="w-2.5 h-2.5 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-2 mb-1.5">
              <Gift className="w-4 h-4 text-neon-yellow" />
              <span className="font-display font-semibold text-xs text-foreground">60 Free Credits</span>
            </div>
            <p className="text-[10px] text-muted-foreground mb-2">
              註冊即可獲得免費積分！
            </p>
            <button
              onClick={handleClick}
              className="w-full py-1.5 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink text-white text-xs font-medium text-center hover:opacity-90 transition-all"
            >
              立即體驗
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
