import { Link } from "wouter";
import { Home, Video, Image, Music, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative">
      <div className="absolute inset-0 grid-bg opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-neon-purple/5 via-transparent to-neon-pink/5" />
      <div className="container relative text-center py-20">
        <div className="text-8xl font-display font-bold gradient-text mb-4">404</div>
        <h1 className="font-display font-bold text-3xl text-foreground mb-3">
          Oops! 找不到頁面
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          抱歉，我們找不到你要找的頁面。它可能已被移動、刪除或從未存在。
        </p>
        <Link href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink text-white font-medium neon-glow hover:opacity-90 transition-all mb-8">
          <Home className="w-4 h-4" />
          回到首頁
        </Link>
        <div className="mt-8">
          <p className="text-sm text-muted-foreground mb-4">熱門工具：</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/ai-video-generator" className="flex items-center gap-1.5 px-4 py-2 rounded-full glass-card text-sm text-neon-purple hover:border-neon-purple/50 transition-all">
              <Video className="w-4 h-4" /> AI Video Generator
            </Link>
            <Link href="/ai-video-generator" className="flex items-center gap-1.5 px-4 py-2 rounded-full glass-card text-sm text-neon-cyan hover:border-neon-cyan/50 transition-all">
              <Image className="w-4 h-4" /> AI Image Generator
            </Link>
            <Link href="/ai-video-generator" className="flex items-center gap-1.5 px-4 py-2 rounded-full glass-card text-sm text-neon-pink hover:border-neon-pink/50 transition-all">
              <Sparkles className="w-4 h-4" /> AI Dance Generator
            </Link>
            <Link href="/ai-video-generator" className="flex items-center gap-1.5 px-4 py-2 rounded-full glass-card text-sm text-neon-yellow hover:border-neon-yellow/50 transition-all">
              <Music className="w-4 h-4" /> AI Music Generator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
