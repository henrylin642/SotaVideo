/*
 * Design: Cyberpunk Neon - AI Image Generator 頁面
 * 圖片生成介面、模型選擇、風格選擇、FAQ
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Wand2, Sparkles, Upload, Type, Image as ImageIcon,
  ArrowRight, Check, ChevronDown, ChevronUp, Zap, Clock, Shield, Palette,
  Download, RefreshCw
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { useCredits } from "@/contexts/CreditsContext";
import { toast } from "sonner";

const AI_VIDEO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/84842417/NrLFTuBVgcSvSqAoxUSkPi/ai-video-section-bQ5f7LVTS94Ujyr43RTcMT.webp";

const models = [
  { name: "Nano Banana 2", tag: "Recommended", color: "neon-purple" },
];

const styles = [
  { name: "寫實風格", icon: "📷" },
  { name: "動漫風格", icon: "🎨" },
  { name: "水彩風格", icon: "🖌️" },
  { name: "油畫風格", icon: "🖼️" },
  { name: "3D 渲染", icon: "💎" },
  { name: "像素風格", icon: "👾" },
  { name: "賽博朋克", icon: "🌃" },
  { name: "極簡風格", icon: "⬜" },
];

const useCases = [
  { icon: "🎨", title: "社群媒體素材", desc: "快速生成吸睛的社群貼文圖片，提升互動率。" },
  { icon: "📢", title: "行銷與廣告", desc: "製作專業級行銷視覺素材，無需設計師。" },
  { icon: "🎮", title: "遊戲與概念設計", desc: "生成角色、場景、道具等概念藝術圖。" },
  { icon: "📚", title: "教育與出版", desc: "為教材、文章、書籍創建精美插圖。" },
];

const faqs = [
  { q: "什麼是 SotaVideo AI Image Generator？", a: "SotaVideo AI Image Generator 是一款強大的 AI 圖片生成工具，讓你從文字描述或參考圖片生成高品質圖片。支援多種風格和模型。" },
  { q: "支援哪些圖片風格？", a: "我們支援寫實、動漫、水彩、油畫、3D 渲染、像素藝術、賽博朋克、極簡等多種風格，並持續新增更多選擇。" },
  { q: "生成的圖片解析度如何？", a: "我們支援最高 4K 解析度的圖片生成，包含 1:1、16:9、9:16、4:3 等多種比例。" },
  { q: "可以用於商業用途嗎？", a: "可以！所有透過 SotaVideo 生成的圖片都可用於商業用途，無版權顧慮。" },
  { q: "可以上傳參考圖片嗎？", a: "可以！我們支援 Image to Image 功能，上傳參考圖片後 AI 會基於你的圖片進行風格轉換或創意延伸。" },
];

type InputMode = "text" | "image";

export default function AIImageGenerator() {
  const [selectedModel, setSelectedModel] = useState("Nano Banana 2");
  const [selectedStyle, setSelectedStyle] = useState("寫實風格");
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [prompt, setPrompt] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const { credits: userCredits, spendCredits } = useCredits();
  const IMAGE_COST = 10;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("請輸入提示詞或上傳參考圖片");
      return;
    }
    if (userCredits < IMAGE_COST) {
      toast.error(`積分不足！需要 ${IMAGE_COST} Credits，目前只有 ${userCredits} Credits`);
      return;
    }
    setIsGenerating(true);
    setShowResult(false);

    const success = await spendCredits(IMAGE_COST, `Image Generate - ${selectedModel}`, {
      model: selectedModel,
      style: selectedStyle,
      inputMode,
    });
    if (!success) {
      toast.error("積分扣除失敗");
      setIsGenerating(false);
      return;
    }

    toast.info(`已消耗 ${IMAGE_COST} Credits，圖片生成中...`);
    setTimeout(() => {
      setIsGenerating(false);
      setShowResult(true);
      toast.success("圖片生成完成！（展示模式）");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-cyan/10 via-transparent to-transparent" />
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="container relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-sm text-neon-cyan mb-6">
              <Sparkles className="w-4 h-4" />
              <span>AI 圖片生成</span>
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
              SotaVideo: <span className="gradient-text">AI Image Generator</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              用文字描述你的想像，AI 為你生成精美圖片
            </p>
          </motion.div>
        </div>
      </section>

      {/* Generator Interface */}
      <section className="pb-24">
        <div className="container max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6 md:p-8 neon-glow-cyan">

            {/* Model Selection */}
            <div className="mb-6">
              <label className="text-sm font-display font-medium text-foreground mb-3 block">選擇 AI 模型</label>
              <div className="flex flex-wrap gap-2">
                {models.map((model) => (
                  <button key={model.name}
                    onClick={() => setSelectedModel(model.name)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                      selectedModel === model.name
                        ? "bg-gradient-to-r from-neon-cyan to-neon-purple text-white"
                        : "bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10"
                    }`}
                  >
                    {model.name}
                    {model.tag && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        model.tag === "New" ? "bg-neon-pink/20 text-neon-pink"
                        : "bg-neon-cyan/20 text-neon-cyan"
                      }`}>
                        {model.tag}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selection */}
            <div className="mb-6">
              <label className="text-sm font-display font-medium text-foreground mb-3 block">選擇風格</label>
              <div className="flex flex-wrap gap-2">
                {styles.map((style) => (
                  <button key={style.name}
                    onClick={() => setSelectedStyle(style.name)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                      selectedStyle === style.name
                        ? "bg-gradient-to-r from-neon-purple to-neon-pink text-white"
                        : "bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10"
                    }`}
                  >
                    <span>{style.icon}</span>
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Mode Tabs */}
            <div className="mb-4">
              <div className="flex gap-1 p-1 rounded-lg bg-white/5 w-fit">
                {[
                  { id: "text" as InputMode, label: "Text to Image", icon: <Type className="w-4 h-4" /> },
                  { id: "image" as InputMode, label: "Image to Image", icon: <ImageIcon className="w-4 h-4" /> },
                ].map((mode) => (
                  <button key={mode.id}
                    onClick={() => setInputMode(mode.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                      inputMode === mode.id
                        ? "bg-neon-cyan/20 text-neon-cyan"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {mode.icon}
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            {inputMode === "text" ? (
              <div className="mb-6">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="描述你想要生成的圖片... 例如：一隻穿著太空衣的柴犬站在月球表面，背景是地球，寫實風格，電影級光影"
                  className="w-full h-32 p-4 rounded-xl bg-white/5 border border-border/50 text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/30 transition-all"
                />
              </div>
            ) : (
              <div className="mb-6">
                <div className="border-2 border-dashed border-border/50 rounded-xl p-12 text-center hover:border-neon-cyan/30 transition-colors">
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-2">
                    拖放參考圖片或點擊上傳
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    支援 JPG, PNG, WebP（最大 10MB）
                  </p>
                  <button className="mt-4 px-4 py-2 rounded-full border border-neon-cyan/50 text-neon-cyan text-sm hover:bg-neon-cyan/10 transition-all"
                    onClick={() => toast.info("此為展示功能")}>
                    選擇檔案
                  </button>
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="（可選）添加額外的描述或風格指示..."
                  className="w-full h-20 mt-4 p-4 rounded-xl bg-white/5 border border-border/50 text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:border-neon-cyan/50 transition-all"
                />
              </div>
            )}

            {/* Settings Row */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground">比例</label>
                <select className="px-3 py-1.5 rounded-lg bg-white/5 border border-border/50 text-sm text-foreground focus:outline-none">
                  <option value="1:1">1:1</option>
                  <option value="16:9">16:9</option>
                  <option value="9:16">9:16</option>
                  <option value="4:3">4:3</option>
                  <option value="3:4">3:4</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground">品質</label>
                <select className="px-3 py-1.5 rounded-lg bg-white/5 border border-border/50 text-sm text-foreground focus:outline-none">
                  <option value="standard">Standard</option>
                  <option value="hd">HD</option>
                  <option value="4k">4K</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground">數量</label>
                <select className="px-3 py-1.5 rounded-lg bg-white/5 border border-border/50 text-sm text-foreground focus:outline-none">
                  <option value="1">1 張</option>
                  <option value="2">2 張</option>
                  <option value="4">4 張</option>
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <button onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-4 rounded-xl bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-cyan text-white font-display font-semibold text-lg neon-glow-cyan transition-all flex items-center justify-center gap-2 ${isGenerating ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"}`}>
              {isGenerating ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> 生成中...</>
              ) : (
                <><Wand2 className="w-5 h-5" /> 生成圖片</>
              )}
            </button>

            <p className="text-xs text-muted-foreground text-center mt-3">
              使用模型: <span className="text-neon-cyan">{selectedModel}</span> · 風格: <span className="text-neon-pink">{selectedStyle}</span> · 每次生成消耗 <span className="font-mono text-neon-yellow">10</span> Credits
            </p>

            {/* Generation Progress */}
            {isGenerating && (
              <div className="mt-6 p-4 rounded-xl bg-white/5 border border-neon-cyan/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-5 h-5 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-foreground">AI 正在創作你的圖片...</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple animate-pulse" style={{ width: "65%" }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">模型: {selectedModel} · 預計需要 10-30 秒</p>
              </div>
            )}

            {/* Result Preview */}
            {showResult && !isGenerating && (
              <div className="mt-6 p-4 rounded-xl bg-white/5 border border-neon-cyan/20">
                <div className="flex items-center gap-2 mb-3">
                  <Check className="w-4 h-4 text-neon-cyan" />
                  <span className="text-sm font-medium text-foreground">生成完成</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative rounded-lg overflow-hidden bg-black/30 aspect-square">
                    <img src="https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=512&h=512&fit=crop" alt="Generated Image 1" className="w-full h-full object-cover" />
                  </div>
                  <div className="relative rounded-lg overflow-hidden bg-black/30 aspect-square">
                    <img src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=512&h=512&fit=crop" alt="Generated Image 2" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <button className="flex-1 py-2 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple text-white text-sm font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    onClick={() => toast.info("下載功能需要後端 API 支援")}>
                    <Download className="w-4 h-4" />
                    下載圖片
                  </button>
                  <button className="flex-1 py-2 rounded-lg border border-neon-pink/50 text-neon-pink text-sm font-medium hover:bg-neon-pink/10 transition-all flex items-center justify-center gap-2"
                    onClick={() => { setShowResult(false); setPrompt(""); }}>
                    <RefreshCw className="w-4 h-4" />
                    重新生成
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/3 to-transparent" />
        <div className="container relative">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-center text-foreground mb-4">
            AI 圖片生成的<span className="gradient-text">多元應用</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            無論是社群媒體、行銷素材還是創意設計，AI 圖片生成都能滿足你的需求。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((uc, i) => (
              <motion.div key={uc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-6 text-center hover:border-neon-cyan/30 transition-all"
              >
                <div className="text-4xl mb-4">{uc.icon}</div>
                <h4 className="font-display font-semibold text-foreground mb-2">{uc.title}</h4>
                <p className="text-sm text-muted-foreground">{uc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden neon-glow-cyan">
              <img src={AI_VIDEO_IMG} alt="AI Image" className="w-full aspect-[3/2] object-cover" />
            </div>
            <div>
              <h2 className="font-display font-bold text-3xl text-foreground mb-6">
                為什麼選擇 <span className="neon-text-cyan text-neon-cyan">SotaVideo Image AI</span>？
              </h2>
              <div className="space-y-4">
                {[
                  { icon: <Palette className="w-5 h-5" />, title: "多風格支援", desc: "8+ 種藝術風格任你選擇，從寫實到動漫應有盡有。" },
                  { icon: <Zap className="w-5 h-5" />, title: "頂級模型", desc: "採用 Nano Banana 2 頂級圖片生成模型。" },
                  { icon: <Clock className="w-5 h-5" />, title: "秒級生成", desc: "先進的 AI 引擎，10 秒內生成高品質圖片。" },
                  { icon: <Shield className="w-5 h-5" />, title: "商業授權", desc: "所有生成的圖片都可用於商業用途，無版權顧慮。" },
                ].map((feature) => (
                  <div key={feature.title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 flex items-center justify-center text-neon-cyan shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-foreground mb-1">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="container max-w-3xl">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-center text-foreground mb-12">
            關於 AI Image Generator 的<span className="gradient-text">常見問題</span>
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="glass-card rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-display font-medium text-foreground pr-4">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-neon-cyan shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 via-neon-purple/10 to-neon-pink/10" />
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="container relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
              準備好創建<span className="gradient-text">精美圖片</span>了嗎？
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              用 AI 將你的想像力化為現實，立即開始創作！
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-medium text-lg neon-glow-cyan hover:opacity-90 transition-all flex items-center gap-2">
                開始生成圖片
                <ArrowRight className="w-5 h-5" />
              </button>
              <Link href="/pricing"
                className="px-8 py-4 rounded-full border border-neon-pink/50 text-neon-pink hover:bg-neon-pink/10 transition-all font-medium text-lg">
                查看方案
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <FloatingButtons />
    </div>
  );
}
