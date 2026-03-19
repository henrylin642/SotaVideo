/*
 * Design: Cyberpunk Neon - AI Video Generator 頁面
 * 模型選擇、生成介面、功能展示
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Play, Upload, Type, Image, Video, Wand2, Sparkles,
  ArrowRight, Check, ChevronDown, ChevronUp, Zap, Clock, Shield
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { toast } from "sonner";

const AI_VIDEO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/84842417/NrLFTuBVgcSvSqAoxUSkPi/ai-video-section-bQ5f7LVTS94Ujyr43RTcMT.webp";

const models = [
  { name: "Seedance 2.0", tag: "Recommended", color: "neon-purple" },
];

const useCases = [
  { icon: "📢", title: "行銷與廣告", desc: "用引人注目的行銷影片提升品牌形象。" },
  { icon: "🎬", title: "內容創作", desc: "用新鮮、精彩的影片提升你的內容品質。" },
  { icon: "📱", title: "社群媒體", desc: "為所有社群平台製作吸睛的影片，提升互動率。" },
  { icon: "📚", title: "教育與電子學習", desc: "用動態教學影片讓學習變得有趣。" },
];

const faqs = [
  { q: "什麼是 SotaVideo？", a: "SotaVideo 是一款 AI 驅動的影片生成器，讓你從文字、圖片甚至現有影片創建精彩影片。輕鬆釋放你的創造力！" },
  { q: "SotaVideo 如何運作？", a: "只需選擇輸入類型（文字、圖片、影片），描述你的願景，我們的 AI 就會施展魔法！選擇風格，自訂你喜歡的效果，然後下載你的影片。" },
  { q: "SotaVideo 支援哪些影片格式？", a: "SotaVideo 支援常見的影片格式，如 MP4、MOV 等，用於輸入和輸出。" },
  { q: "我可以用 SotaVideo 創建哪些類型的影片？", a: "可能性幾乎無限！你可以創建社群媒體影片、行銷廣告、解說影片、動畫內容、動漫風格影片等。讓你的想像力自由駆駁！" },
  { q: "可以使用自己的圖片和影片嗎？", a: "可以！SotaVideo 支援圖片轉影片和影片轉動漫功能，讓你上傳自己的素材並以令人興奮的方式轉換它們。" },
  { q: "我的資料安全嗎？", a: "是的！我們非常重視你的隱私。我們使用業界標準的安全措施來保護你的資料。" },
];

type InputMode = "text" | "image" | "video";

export default function AIVideoGenerator() {
  const [selectedModel, setSelectedModel] = useState("Seedance 2.0");
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [prompt, setPrompt] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error("請輸入提示詞或上傳素材");
      return;
    }
    setIsGenerating(true);
    setShowResult(false);
    toast.info("影片生成中，請稍候...");
    setTimeout(() => {
      setIsGenerating(false);
      setShowResult(true);
      toast.success("影片生成完成！（展示模式）");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-purple/10 via-transparent to-transparent" />
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="container relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
              SotaVideo: <span className="gradient-text">AI Video Generator</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              世界級 AI 影片生成模型，盡在你的掌握之中
            </p>
          </motion.div>
        </div>
      </section>

      {/* Generator Interface */}
      <section className="pb-24">
        <div className="container max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6 md:p-8 neon-glow">

            {/* Model Selection */}
            <div className="mb-6">
              <label className="text-sm font-display font-medium text-foreground mb-3 block">選擇 AI 模型</label>
              <div className="flex flex-wrap gap-2">
                {models.map((model) => (
                  <button key={model.name}
                    onClick={() => setSelectedModel(model.name)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                      selectedModel === model.name
                        ? "bg-gradient-to-r from-neon-purple to-neon-pink text-white"
                        : "bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10"
                    }`}
                  >
                    {model.name}
                    {model.tag && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        model.tag === "New" ? "bg-neon-pink/20 text-neon-pink"
                        : model.tag === "Premium" ? "bg-neon-yellow/20 text-neon-yellow"
                        : "bg-neon-cyan/20 text-neon-cyan"
                      }`}>
                        {model.tag}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Mode Tabs */}
            <div className="mb-4">
              <div className="flex gap-1 p-1 rounded-lg bg-white/5 w-fit">
                {[
                  { id: "text" as InputMode, label: "Text to Video", icon: <Type className="w-4 h-4" /> },
                  { id: "image" as InputMode, label: "Image to Video", icon: <Image className="w-4 h-4" /> },
                  { id: "video" as InputMode, label: "Video to Animation", icon: <Video className="w-4 h-4" /> },
                ].map((mode) => (
                  <button key={mode.id}
                    onClick={() => setInputMode(mode.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                      inputMode === mode.id
                        ? "bg-neon-purple/20 text-neon-purple"
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
                  placeholder="描述你想要生成的影片內容... 例如：一位女孩揮舞長劍，正面視角，動作流暢，電影級畫質"
                  className="w-full h-32 p-4 rounded-xl bg-white/5 border border-border/50 text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:border-neon-purple/50 focus:ring-1 focus:ring-neon-purple/30 transition-all"
                />
              </div>
            ) : (
              <div className="mb-6">
                <div className="border-2 border-dashed border-border/50 rounded-xl p-12 text-center hover:border-neon-purple/30 transition-colors">
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {inputMode === "image" ? "拖放圖片或點擊上傳" : "拖放影片或點擊上傳"}
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    {inputMode === "image" ? "支援 JPG, PNG, WebP" : "支援 MP4, MOV, WebM"}
                  </p>
                  <button className="mt-4 px-4 py-2 rounded-full border border-neon-purple/50 text-neon-purple text-sm hover:bg-neon-purple/10 transition-all"
                    onClick={() => toast.info("此為展示功能")}>
                    選擇檔案
                  </button>
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="（可選）添加額外的描述或風格指示..."
                  className="w-full h-20 mt-4 p-4 rounded-xl bg-white/5 border border-border/50 text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:border-neon-purple/50 transition-all"
                />
              </div>
            )}

            {/* Settings Row */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground">比例</label>
                <select className="px-3 py-1.5 rounded-lg bg-white/5 border border-border/50 text-sm text-foreground focus:outline-none">
                  <option value="16:9">16:9</option>
                  <option value="9:16">9:16</option>
                  <option value="1:1">1:1</option>
                  <option value="4:3">4:3</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground">時長</label>
                <select className="px-3 py-1.5 rounded-lg bg-white/5 border border-border/50 text-sm text-foreground focus:outline-none">
                  <option value="5">5 秒</option>
                  <option value="10">10 秒</option>
                  <option value="15">15 秒</option>
                  <option value="30">30 秒</option>
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
            </div>

            {/* Generate Button */}
            <button onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-4 rounded-xl bg-gradient-to-r from-neon-purple via-neon-pink to-neon-purple text-white font-display font-semibold text-lg neon-glow transition-all flex items-center justify-center gap-2 ${isGenerating ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"}`}>
              {isGenerating ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> 生成中...</>
              ) : (
                <><Wand2 className="w-5 h-5" /> 生成影片</>
              )}
            </button>

            <p className="text-xs text-muted-foreground text-center mt-3">
              使用模型: <span className="text-neon-cyan">{selectedModel}</span> · 每次生成消耗 10-20 Credits
            </p>

            {/* Generation Progress */}
            {isGenerating && (
              <div className="mt-6 p-4 rounded-xl bg-white/5 border border-neon-purple/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-5 h-5 border-2 border-neon-purple border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-foreground">AI 正在生成影片...</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-neon-purple to-neon-pink rounded-full animate-pulse" style={{ width: "60%" }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">模型: {selectedModel} · 預計需要 30-60 秒</p>
              </div>
            )}

            {/* Result Preview */}
            {showResult && !isGenerating && (
              <div className="mt-6 p-4 rounded-xl bg-white/5 border border-neon-cyan/20">
                <div className="flex items-center gap-2 mb-3">
                  <Check className="w-4 h-4 text-neon-cyan" />
                  <span className="text-sm font-medium text-foreground">生成完成</span>
                </div>
                <div className="relative rounded-lg overflow-hidden bg-black/30 aspect-video flex items-center justify-center">
                  <img src={AI_VIDEO_IMG} alt="Generated Video" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/50 text-xs text-white">0:05</div>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <button className="flex-1 py-2 rounded-lg bg-gradient-to-r from-neon-purple to-neon-pink text-white text-sm font-medium hover:opacity-90 transition-all"
                    onClick={() => toast.info("下載功能需要後端 API 支援")}>
                    下載影片
                  </button>
                  <button className="flex-1 py-2 rounded-lg border border-neon-cyan/50 text-neon-cyan text-sm font-medium hover:bg-neon-cyan/10 transition-all"
                    onClick={() => { setShowResult(false); setPrompt(""); }}>
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
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-purple/3 to-transparent" />
        <div className="container relative">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-center text-foreground mb-4">
            SotaVideo: 你的 <span className="gradient-text">AI 影片工具箱</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            從行銷到教育，從社群媒體到故事敘述，影片無處不在。探索 AI 影片生成的多元應用。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((uc, i) => (
              <motion.div key={uc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-6 text-center hover:border-neon-purple/30 transition-all"
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
            <div className="relative rounded-2xl overflow-hidden neon-glow">
              <img src={AI_VIDEO_IMG} alt="AI Video" className="w-full aspect-[3/2] object-cover" />
            </div>
            <div>
              <h2 className="font-display font-bold text-3xl text-foreground mb-6">
                為什麼選擇 <span className="gradient-text">SotaVideo</span>？
              </h2>
              <div className="space-y-4">
                {[
                  { icon: <Zap className="w-5 h-5" />, title: "頂級模型", desc: "採用 Seedance 2.0 頂級 AI 模型，提供最佳影片生成品質。" },
                  { icon: <Clock className="w-5 h-5" />, title: "快速生成", desc: "先進的 AI 引擎，幾秒鐘內生成專業級影片。" },
                  { icon: <Shield className="w-5 h-5" />, title: "商業授權", desc: "所有生成的影片都可用於商業用途，無版權顧慮。" },
                  { icon: <Sparkles className="w-5 h-5" />, title: "持續更新", desc: "定期更新最新的 AI 模型和功能，保持領先。" },
                ].map((feature) => (
                  <div key={feature.title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-neon-purple/10 flex items-center justify-center text-neon-purple shrink-0">
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
            關於 SotaVideo 的<span className="gradient-text">常見問題</span>
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
                    <ChevronUp className="w-5 h-5 text-neon-purple shrink-0" />
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
        <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 via-neon-cyan/10 to-neon-pink/10" />
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="container relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
              準備好創建<span className="gradient-text">精彩影片</span>了嗎？
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              別再想像了！立即體驗最簡單、最強大的 AI 影片生成器！
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink text-white font-medium text-lg neon-glow hover:opacity-90 transition-all flex items-center gap-2">
                開始生成影片
                <ArrowRight className="w-5 h-5" />
              </button>
              <Link href="/pricing"
                className="px-8 py-4 rounded-full border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10 transition-all font-medium text-lg">
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
