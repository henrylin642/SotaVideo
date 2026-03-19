/*
 * Design: Cyberpunk Neon - Footer
 * 深色背景，網格紋理，霓虹強調色
 */
import { Link } from "wouter";
import { Play, Mail } from "lucide-react";

const videoTools = [
  "AI Video Generator",
];

const allModels = [
  "Seedance 2.0",
];

export default function Footer() {
  return (
    <footer className="relative border-t border-border/30 grid-bg">
      <div className="absolute inset-0 bg-gradient-to-t from-deep-bg to-transparent pointer-events-none" />
      <div className="container relative py-16">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center">
                <Play className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-display font-bold text-xl">
                <span className="text-foreground">Sota</span>
                <span className="gradient-text">Video</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              一站式 AI 影片創作平台，整合頂級 AI 模型。
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>support@sotavideo.ai</span>
            </div>
          </div>

          {/* Video Tools */}
          <div>
            <h4 className="font-display font-semibold text-sm text-foreground mb-4">Video Tools</h4>
            <ul className="space-y-2">
              {videoTools.map((tool) => (
                <li key={tool}>
                  <Link href="/ai-video-generator" className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors">
                    {tool}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* All Models */}
          <div>
            <h4 className="font-display font-semibold text-sm text-foreground mb-4">AI Models</h4>
            <ul className="space-y-2">
              {allModels.map((model) => (
                <li key={model}>
                  <Link href="/ai-video-generator" className="text-sm text-muted-foreground hover:text-neon-purple transition-colors">
                    {model}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 SotaVideo. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/" className="hover:text-foreground transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
