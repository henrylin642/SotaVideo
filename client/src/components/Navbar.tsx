/*
 * Design: Cyberpunk Neon - 固定頂部導航列
 * 深色玻璃態背景，霓虹邊框底線
 * 字體：Space Grotesk (Logo), DM Sans (選單)
 */
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Play, Image, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const videoTools = [
  { name: "Seedance 2.0", href: "/ai-video-generator" },
];

const imageTools = [
  { name: "Nano Banana Pro", href: "/ai-image-generator" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const userAvatar = user?.user_metadata?.avatar_url;
  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const userEmail = user?.email || "";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/30"
      style={{ background: "oklch(0.12 0.02 260 / 0.85)", backdropFilter: "blur(20px)" }}>
      {/* Top announcement banner */}
      <div className="bg-gradient-to-r from-neon-purple/20 via-neon-cyan/20 to-neon-pink/20 py-1.5 px-4 text-center text-sm">
        <span className="text-foreground/80">
          ✨ 多模型 AI 影片生成 — 支援 Seedance 2.0 頂級模型
        </span>
        <Link href="/ai-video-generator" className="ml-2 text-neon-cyan hover:text-neon-cyan/80 font-medium transition-colors">
          立即體驗 🎬
        </Link>
      </div>

      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center neon-glow">
            <Play className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">
            <span className="text-foreground">Sota</span>
            <span className="gradient-text">Video</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          <NavDropdown
            label="Video AI"
            icon={<Play className="w-3.5 h-3.5" />}
            items={videoTools}
            active={activeDropdown === "video"}
            onToggle={() => setActiveDropdown(activeDropdown === "video" ? null : "video")}
            onClose={() => setActiveDropdown(null)}
          />
          <NavDropdown
            label="Image AI"
            icon={<Image className="w-3.5 h-3.5" />}
            items={imageTools}
            active={activeDropdown === "image"}
            onToggle={() => setActiveDropdown(activeDropdown === "image" ? null : "image")}
            onClose={() => setActiveDropdown(null)}
          />
          <Link href="/pricing"
            className={`px-3 py-2 text-sm transition-colors flex items-center gap-1.5 ${location === "/pricing" ? "text-neon-purple" : "text-foreground/70 hover:text-foreground"}`}>
            Pricing
          </Link>
        </div>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-3">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-foreground/10 animate-pulse" />
          ) : user ? (
            /* Logged in: avatar + dropdown */
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-white/5 transition-colors"
              >
                {userAvatar ? (
                  <img src={userAvatar} alt={userName} className="w-8 h-8 rounded-full border border-neon-purple/50" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center text-white text-sm font-medium">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
                <ChevronDown className={`w-3 h-3 text-foreground/60 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-64 rounded-xl glass-card neon-glow p-3 shadow-2xl"
                  >
                    <div className="px-3 py-2 mb-2 border-b border-border/30">
                      <p className="text-sm font-medium text-foreground truncate">{userName}</p>
                      <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                    </div>
                    <button
                      onClick={() => { signOut(); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      登出
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* Logged out: Login button */
            <button
              onClick={signInWithGoogle}
              className="px-4 py-2 text-sm text-foreground/70 hover:text-foreground transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Login
            </button>
          )}
          <Link href="/ai-video-generator"
            className="px-5 py-2.5 text-sm font-medium rounded-full bg-gradient-to-r from-neon-purple to-neon-pink text-white neon-glow hover:opacity-90 transition-opacity">
            Try For Free
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden p-2 text-foreground/70" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border/30 overflow-hidden"
            style={{ background: "oklch(0.12 0.02 260 / 0.95)" }}
          >
            <div className="container py-4 space-y-2">
              <Link href="/ai-video-generator" className="block px-3 py-2 text-sm text-foreground/70 hover:text-foreground" onClick={() => setMobileOpen(false)}>
                Video AI
              </Link>
              <Link href="/ai-image-generator" className="block px-3 py-2 text-sm text-foreground/70 hover:text-foreground" onClick={() => setMobileOpen(false)}>
                Image AI
              </Link>
              <Link href="/pricing" className="block px-3 py-2 text-sm text-foreground/70 hover:text-foreground" onClick={() => setMobileOpen(false)}>
                Pricing
              </Link>
              <div className="pt-2 border-t border-border/30 flex flex-col gap-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2">
                      {userAvatar ? (
                        <img src={userAvatar} alt={userName} className="w-8 h-8 rounded-full border border-neon-purple/50" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center text-white text-sm font-medium">
                          {userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-foreground">{userName}</p>
                        <p className="text-xs text-muted-foreground">{userEmail}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { signOut(); setMobileOpen(false); }}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-foreground/70"
                    >
                      <LogOut className="w-4 h-4" />
                      登出
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { signInWithGoogle(); setMobileOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-foreground/70"
                  >
                    <User className="w-4 h-4" />
                    Login with Google
                  </button>
                )}
                <Link href="/ai-video-generator"
                  className="px-5 py-2.5 text-sm font-medium rounded-full bg-gradient-to-r from-neon-purple to-neon-pink text-white text-center neon-glow"
                  onClick={() => setMobileOpen(false)}>
                  Try For Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavDropdown({ label, icon, items, active, onToggle, onClose }: {
  label: string;
  icon: React.ReactNode;
  items: { name: string; href: string }[];
  active: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  return (
    <div className="relative"
      onMouseEnter={onToggle}
      onMouseLeave={onClose}>
      <button className={`px-3 py-2 text-sm transition-colors flex items-center gap-1.5 ${active ? "text-neon-purple" : "text-foreground/70 hover:text-foreground"}`}>
        {icon}
        {label}
        <ChevronDown className={`w-3 h-3 transition-transform ${active ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1 w-56 rounded-xl glass-card neon-glow p-2 shadow-2xl"
          >
            {items.map((item) => (
              <Link key={item.name} href={item.href}
                className="block px-3 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
                onClick={onClose}>
                {item.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

