/*
 * Design: Cyberpunk Neon - SotaVideo 首頁
 * 深色沉浸式背景，霓虹光暈效果，網格紋理
 * 字體：Space Grotesk (標題), DM Sans (正文)
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Play, Zap, Palette, Layers, Smile,
  ArrowRight, CheckCircle, Video, Sparkles
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import HowItWorks from "@/components/HowItWorks";
import ModelShowcase from "@/components/ModelShowcase";
import StatsCounter from "@/components/StatsCounter";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/84842417/NrLFTuBVgcSvSqAoxUSkPi/hero-bg-nsxVDubvgg2KSKYFNV7uvJ.webp";
const AI_VIDEO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/84842417/NrLFTuBVgcSvSqAoxUSkPi/ai-video-section-bQ5f7LVTS94Ujyr43RTcMT.webp";



const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6 }
  })
};

const models = [
  "Seedance 2.0"
];

const whyCards = [
  { icon: <Zap className="w-6 h-6" />, title: "AI 驅動創新", desc: "體驗最前沿的 AI 媒體創作技術，輕鬆產出驚人成果。", bgClass: "bg-neon-purple/10", textClass: "text-neon-purple" },
  { icon: <Palette className="w-6 h-6" />, title: "輕鬆創作", desc: "無需技術背景，友善的介面讓每個人都能輕鬆創作，只需 3 個步驟。", bgClass: "bg-neon-cyan/10", textClass: "text-neon-cyan" },
  { icon: <Layers className="w-6 h-6" />, title: "多元工具集", desc: "從 AI 音樂生成到影片特效，提供全方位的創作工具滿足所有需求。", bgClass: "bg-neon-pink/10", textClass: "text-neon-pink" },
  { icon: <Smile className="w-6 h-6" />, title: "趣味體驗", desc: "探索你的想像力，享受創作過程。SotaVideo 讓創作變得有趣且充滿靈感。", bgClass: "bg-neon-yellow/10", textClass: "text-neon-yellow" },
];




export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-28 pb-20">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
          <div className="absolute inset-0 grid-bg opacity-20" />
        </div>

        <div className="container relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" className="max-w-4xl mx-auto">
            <motion.div variants={fadeUp} custom={0}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-sm text-neon-cyan mb-6">
              <Sparkles className="w-4 h-4" />
              <span>多模型 AI 影片生成平台</span>
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1}
              className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">
              <span className="text-foreground">一站式 AI 創作平台</span>
              <br />
              <span className="gradient-text">社群媒體與品牌</span>
              <span className="text-foreground">的最佳選擇</span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              在幾分鐘內生成影片、圖片、音樂和虛擬角色 — 全部由 AI 驅動的一站式平台。
            </motion.p>

            <motion.div variants={fadeUp} custom={3}
              className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/ai-video-generator"
                className="group px-8 py-3.5 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink text-white font-medium neon-glow hover:opacity-90 transition-all flex items-center gap-2">
                <Video className="w-5 h-5" />
                AI Video Generator
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/ai-video-generator"
                className="group px-8 py-3.5 rounded-full border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10 transition-all flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI Image Generator
                <span className="text-xs px-2 py-0.5 rounded-full bg-neon-yellow/20 text-neon-yellow">New</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Model logos marquee */}
          <motion.div variants={fadeUp} custom={4} initial="hidden" animate="visible"
            className="mt-16 overflow-hidden">
            <p className="text-sm text-muted-foreground mb-4">Powered by World-Class AI Models</p>
            <div className="flex items-center gap-8 animate-marquee">
              {[...models, ...models].map((model, i) => (
                <span key={i} className="text-sm font-mono text-muted-foreground/60 whitespace-nowrap hover:text-neon-purple transition-colors">
                  {model}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <HowItWorks />

      {/* Tools Section Title */}
      <section className="py-20">
        <div className="container">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-center mb-20 text-foreground">
            AI 內容創作的<span className="gradient-text">全方位工具</span>
          </motion.h2>

          {/* AI Video Generator */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-28">
            <div className="relative rounded-2xl overflow-hidden neon-glow">
              <img src={AI_VIDEO_IMG} alt="AI Video Generator" className="w-full aspect-[3/2] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
            <div>
              <span className="text-neon-purple font-display font-semibold text-sm uppercase tracking-wider">AI Video Generator</span>
              <h3 className="font-display font-bold text-3xl md:text-4xl text-foreground mt-2 mb-4">
                專業影片<br />數秒內完成
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                用 SotaVideo 將你的想法瞬間轉化為精彩影片！只需幾個提示詞，就能將你的創意願景變為現實。
              </p>
              <ul className="space-y-3 mb-8">
                {["文字轉影片 & 圖片轉影片", "影片轉動畫 & AI 動畫生成器", "支援 Seedance 2.0 頂級模型"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-foreground/80">
                    <CheckCircle className="w-5 h-5 text-neon-cyan shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/ai-video-generator"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-neon-purple/50 text-neon-purple hover:bg-neon-purple/10 transition-all font-medium">
                了解更多 SotaVideo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>


        </div>
      </section>

      {/* Why SotaVideo Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-purple/5 via-deep-card to-neon-purple/5" />
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center mb-6 neon-glow">
                <Play className="w-7 h-7 text-white fill-white" />
              </div>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3">
                為什麼選擇<br /><span className="gradient-text">SotaVideo?</span>
              </h2>
              <p className="text-muted-foreground">
                體驗 AI 科技的樂趣
              </p>
            </motion.div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {whyCards.map((card, i) => (
                <motion.div key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="glass-card rounded-xl p-6 hover:border-neon-purple/30 transition-all group"
                >
                  <div className={`w-10 h-10 rounded-lg ${card.bgClass} flex items-center justify-center mb-4 ${card.textClass}`}>
                    {card.icon}
                  </div>
                  <h4 className="font-display font-semibold text-foreground mb-2">{card.title}</h4>
                  <p className="text-sm text-muted-foreground">{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ModelShowcase />





      {/* Target Audience */}
      <section className="py-24">
        <div className="container">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="font-display font-bold text-3xl md:text-4xl text-center mb-4 text-foreground">
            SotaVideo AI：<span className="gradient-text">誰能受益？</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-center text-muted-foreground mb-12">
            用更少的時間完成更多工作，無需複雜設備。
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "內容創作者", desc: "透過 AI 打造個人化品牌聲音", icon: "🎬" },
              { title: "行銷人員", desc: "製作引人注目的行銷影片", icon: "📈" },
              { title: "教育工作者", desc: "輕鬆創建互動教學內容", icon: "📚" },
              { title: "遊戲開發者", desc: "以動態音訊設計增強玩家沉浸感", icon: "🎮" },
            ].map((audience, i) => (
              <motion.div key={audience.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card rounded-xl p-6 text-center hover:border-neon-purple/30 transition-all"
              >
                <div className="text-4xl mb-4">{audience.icon}</div>
                <h4 className="font-display font-semibold text-foreground mb-2">{audience.title}</h4>
                <p className="text-sm text-muted-foreground">{audience.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <StatsCounter />



      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 via-neon-cyan/10 to-neon-pink/10" />
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="container relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
              用 AI，讓每一次創作都<span className="gradient-text">充滿靈感</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              踏入創新的未來，體驗 SotaVideo AI 創作的力量。
            </p>
            <Link href="/ai-video-generator"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink text-white font-medium text-lg neon-glow hover:opacity-90 transition-all">
              加入 SotaVideo，立即開始
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-16">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 neon-glow">
            <div>
              <h3 className="font-display font-bold text-2xl text-foreground mb-2">
                🎁 20 Free Credits
              </h3>
              <p className="text-muted-foreground">
                註冊即可獲得 20 個免費積分，立即體驗所有功能。
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/pricing"
                className="px-6 py-3 rounded-full border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10 transition-all font-medium whitespace-nowrap">
                查看方案
              </Link>
              <Link href="/ai-video-generator"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink text-white font-medium whitespace-nowrap neon-glow hover:opacity-90 transition-all">
                免費體驗
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <FloatingButtons />

      {/* Marquee animation style */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          width: max-content;
        }
      `}</style>
    </div>
  );
}
