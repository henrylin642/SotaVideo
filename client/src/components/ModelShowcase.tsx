/*
 * Design: Cyberpunk Neon - AI 模型展示
 */
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const videoModels = [
  { name: "Seedance 2.0", desc: "頂級 AI 影片生成模型，支援舞蹈、動作、場景生成", tag: "Recommended" },
];

const imageModels = [
  { name: "Nano Banana 2", desc: "高品質圖片生成模型", tag: "New" },
  { name: "Flux", desc: "Black Forest Labs 圖片模型", tag: "" },
  { name: "Seedream", desc: "字節跳動圖片生成模型", tag: "" },
];

export default function ModelShowcase() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-deep-card to-transparent" />
      <div className="absolute inset-0 grid-bg opacity-5" />
      <div className="container relative">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="font-display font-bold text-3xl md:text-4xl text-center mb-4 text-foreground">
          採用頂級 <span className="gradient-text">AI 模型</span>
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          精選最強 AI 模型，為你提供卓越的影片與圖片生成品質。
        </motion.p>

        {/* Video Models */}
        <div className="mb-10">
          <h3 className="font-display font-semibold text-lg text-neon-purple mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-purple" />
            影片生成模型
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {videoModels.map((model, i) => (
              <motion.div key={model.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href="/ai-video-generator"
                  className="block glass-card rounded-lg p-4 hover:border-neon-purple/30 transition-all group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display font-medium text-sm text-foreground group-hover:text-neon-purple transition-colors">
                      {model.name}
                    </span>
                    {model.tag && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        model.tag === "New" ? "bg-neon-pink/20 text-neon-pink"
                        : model.tag === "Premium" ? "bg-neon-yellow/20 text-neon-yellow"
                        : model.tag === "Hot" ? "bg-red-500/20 text-red-400"
                        : "bg-neon-cyan/20 text-neon-cyan"
                      }`}>
                        {model.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{model.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Image Models */}
        <div className="mb-10">
          <h3 className="font-display font-semibold text-lg text-neon-cyan mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-cyan" />
            圖片生成模型
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {imageModels.map((model, i) => (
              <motion.div key={model.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href="/ai-video-generator"
                  className="block glass-card rounded-lg p-4 hover:border-neon-cyan/30 transition-all group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display font-medium text-sm text-foreground group-hover:text-neon-cyan transition-colors">
                      {model.name}
                    </span>
                    {model.tag && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neon-pink/20 text-neon-pink">
                        {model.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{model.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link href="/ai-video-generator"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-neon-purple/50 text-neon-purple hover:bg-neon-purple/10 transition-all font-medium">
            開始生成
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
