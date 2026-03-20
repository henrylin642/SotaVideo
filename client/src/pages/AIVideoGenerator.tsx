/*
 * Design: Cyberpunk Neon - AI Video Generator 頁面
 * 模型選擇、兩種生成模式介面
 */
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Play, Upload, Wand2, Sparkles, X, AtSign,
  ArrowRight, Check, ChevronDown, ChevronUp, Zap, Clock, Shield,
  Monitor, Smartphone, Square, RectangleHorizontal, RectangleVertical,
  HelpCircle, Film
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { useCredits } from "@/contexts/CreditsContext";
import { toast } from "sonner";

const AI_VIDEO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/84842417/NrLFTuBVgcSvSqAoxUSkPi/ai-video-section-bQ5f7LVTS94Ujyr43RTcMT.webp";

const models = [
  { name: "Seedance 2.0", desc: "生成更精細的內容", hasAudio: true },
  { name: "Seedance 2.0 Fast", desc: "極速生成，高性價比", hasAudio: true },
];

type GenerationMode = "keyframe" | "smart";

interface UploadedFile {
  file: File;
  preview: string;
  type: "image" | "video";
}

const aspectRatios = [
  { value: "16:9", icon: <RectangleHorizontal className="w-5 h-5" /> },
  { value: "9:16", icon: <RectangleVertical className="w-5 h-5" /> },
  { value: "1:1", icon: <Square className="w-4 h-4" /> },
  { value: "4:3", icon: <Monitor className="w-5 h-5" /> },
  { value: "3:4", icon: <Smartphone className="w-5 h-5" /> },
];

const durations = ["5s", "10s", "15s"];

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
  { q: "我的資料安全嗎？", a: "是的！我們非常重視你的隱私。我們使用業界標準的安全措施來保護你的資料。" },
];

export default function AIVideoGenerator() {
  const [selectedModel, setSelectedModel] = useState("Seedance 2.0");
  const [mode, setMode] = useState<GenerationMode>("keyframe");
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("5s");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Keyframe mode state
  const [firstFrame, setFirstFrame] = useState<UploadedFile | null>(null);
  const [lastFrame, setLastFrame] = useState<UploadedFile | null>(null);

  // Smart mode state
  const [smartFiles, setSmartFiles] = useState<UploadedFile[]>([]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const firstFrameRef = useRef<HTMLInputElement>(null);
  const lastFrameRef = useRef<HTMLInputElement>(null);
  const smartFileRef = useRef<HTMLInputElement>(null);

  const credits = mode === "keyframe" ? 60 : 80;

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "first" | "last" | "smart"
  ) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");
      if (!isVideo && !isImage) return;

      if (target === "smart") {
        // Check limits: max 9 images + 1 video
        const currentImages = smartFiles.filter((f) => f.type === "image").length;
        const currentVideos = smartFiles.filter((f) => f.type === "video").length;
        if (smartFiles.length >= 10) {
          toast.error("最多上傳 10 個檔案");
          return;
        }
        if (isImage && currentImages >= 9) {
          toast.error("最多上傳 9 張圖片");
          return;
        }
        if (isVideo && currentVideos >= 1) {
          toast.error("最多上傳 1 個影片");
          return;
        }
        if (isVideo && file.size > 50 * 1024 * 1024) {
          toast.error("影片限制 50MB");
          return;
        }

        const preview = URL.createObjectURL(file);
        setSmartFiles((prev) => [...prev, { file, preview, type: isVideo ? "video" : "image" }]);
      } else {
        if (!isImage) {
          toast.error("僅支援圖片格式");
          return;
        }
        const preview = URL.createObjectURL(file);
        const uploaded: UploadedFile = { file, preview, type: "image" };
        if (target === "first") setFirstFrame(uploaded);
        else setLastFrame(uploaded);
      }
    });

    e.target.value = "";
  };

  const removeSmartFile = (index: number) => {
    setSmartFiles((prev) => {
      const removed = prev[index];
      URL.revokeObjectURL(removed.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const insertTag = (index: number) => {
    const f = smartFiles[index];
    const tag = f.type === "video" ? "@video1 " : `@image${smartFiles.slice(0, index).filter(x => x.type === "image").length + 1} `;
    setPrompt((prev) => prev + tag);
  };

  const { credits: userCredits, spendCredits } = useCredits();

  const handleGenerate = async () => {
    if (mode === "keyframe" && !firstFrame) {
      toast.error("請上傳首幀圖片");
      return;
    }
    if (mode === "smart" && smartFiles.length === 0) {
      toast.error("請上傳至少一個參考資源");
      return;
    }
    if (userCredits < credits) {
      toast.error(`積分不足！需要 ${credits} Credits，目前只有 ${userCredits} Credits`);
      return;
    }
    setIsGenerating(true);
    setShowResult(false);

    const desc = mode === "keyframe" ? "Video Keyframe" : "Video Smart";
    const success = await spendCredits(credits, `${desc} - ${selectedModel}`, {
      model: selectedModel,
      mode,
      duration,
      aspectRatio,
    });
    if (!success) {
      toast.error("積分扣除失敗");
      setIsGenerating(false);
      return;
    }

    toast.info(`已消耗 ${credits} Credits，影片生成中...`);
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
              <label className="text-sm font-display font-medium text-foreground mb-3 block">模型版本</label>
              <div className="flex flex-wrap gap-3">
                {models.map((model) => (
                  <button key={model.name}
                    onClick={() => setSelectedModel(model.name)}
                    className={`relative flex items-start gap-3 px-4 py-3 rounded-xl border transition-all ${
                      selectedModel === model.name
                        ? "border-neon-purple bg-neon-purple/10"
                        : "border-border/50 bg-white/5 hover:border-border"
                    }`}
                  >
                    {model.hasAudio && (
                      <span className="flex items-center gap-1 text-[10px] text-neon-cyan bg-neon-cyan/10 px-1.5 py-0.5 rounded">
                        <span className="inline-block w-3 h-3">🔊</span> 聲音
                      </span>
                    )}
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">{model.name}</p>
                      <p className="text-xs text-muted-foreground">{model.desc}</p>
                    </div>
                    {selectedModel === model.name && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-neon-purple flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Generation Mode Selector */}
            <div className="mb-6">
              <label className="text-sm font-display font-medium text-foreground mb-3 block">生成模式</label>
              <div className="relative">
                <button
                  onClick={() => setMode(mode === "keyframe" ? "smart" : "keyframe")}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-border/50 bg-white/5 hover:border-border transition-all"
                >
                  <div className="flex items-center gap-2">
                    {mode === "keyframe" ? (
                      <Film className="w-4 h-4 text-neon-purple" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-neon-cyan" />
                    )}
                    <span className="text-sm text-foreground">
                      {mode === "keyframe" ? "首尾影格模式" : "智能模式"}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* === KEYFRAME MODE === */}
            {mode === "keyframe" && (
              <div className="mb-6">
                <label className="text-sm font-display font-medium text-foreground mb-3 block">圖片</label>
                <div className="grid grid-cols-2 gap-4">
                  {/* First Frame */}
                  <div>
                    <input ref={firstFrameRef} type="file" accept="image/*" className="hidden"
                      onChange={(e) => handleFileUpload(e, "first")} />
                    {firstFrame ? (
                      <div className="relative rounded-xl overflow-hidden aspect-square bg-black/30 group">
                        <img src={firstFrame.preview} alt="首幀" className="w-full h-full object-cover" />
                        <button onClick={() => { URL.revokeObjectURL(firstFrame.preview); setFirstFrame(null); }}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3 text-white" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-center py-1.5">
                          <span className="text-xs text-white">首幀</span>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => firstFrameRef.current?.click()}
                        className="w-full aspect-square rounded-xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center gap-2 hover:border-neon-purple/30 transition-colors bg-white/5">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">點擊上傳</span>
                        <span className="text-[10px] text-muted-foreground/60">首幀</span>
                      </button>
                    )}
                  </div>

                  {/* Last Frame (optional) */}
                  <div>
                    <input ref={lastFrameRef} type="file" accept="image/*" className="hidden"
                      onChange={(e) => handleFileUpload(e, "last")} />
                    {lastFrame ? (
                      <div className="relative rounded-xl overflow-hidden aspect-square bg-black/30 group">
                        <img src={lastFrame.preview} alt="尾幀" className="w-full h-full object-cover" />
                        <button onClick={() => { URL.revokeObjectURL(lastFrame.preview); setLastFrame(null); }}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3 text-white" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-center py-1.5">
                          <span className="text-xs text-white">尾幀 (可選)</span>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => lastFrameRef.current?.click()}
                        className="w-full aspect-square rounded-xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center gap-2 hover:border-neon-purple/30 transition-colors bg-white/5">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">點擊上傳</span>
                        <span className="text-[10px] text-muted-foreground/60">尾幀 (可選)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* === SMART MODE === */}
            {mode === "smart" && (
              <div className="mb-6">
                <label className="text-sm font-display font-medium text-foreground mb-3 block">
                  上傳（圖片/影片）
                  <span className="text-xs text-muted-foreground ml-2">最多 9 張圖片 + 1 個影片</span>
                </label>
                <input ref={smartFileRef} type="file" accept="image/*,video/*" multiple className="hidden"
                  onChange={(e) => handleFileUpload(e, "smart")} />
                <div className="flex flex-wrap gap-3">
                  {smartFiles.map((f, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden bg-black/30 group">
                      {f.type === "image" ? (
                        <img src={f.preview} alt={`ref-${i}`} className="w-full h-full object-cover" />
                      ) : (
                        <video src={f.preview} className="w-full h-full object-cover" muted />
                      )}
                      <button onClick={() => removeSmartFile(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3 text-white" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-center py-0.5">
                        <span className="text-[10px] text-white">{f.type === "video" ? "影片" : `圖${i + 1}`}</span>
                      </div>
                    </div>
                  ))}
                  {smartFiles.length < 10 && (
                    <button onClick={() => smartFileRef.current?.click()}
                      className="w-20 h-20 rounded-xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center gap-1 hover:border-neon-cyan/30 transition-colors bg-white/5">
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">上傳</span>
                    </button>
                  )}
                </div>
                {smartFiles.some((f) => f.type === "video") && (
                  <p className="text-xs text-muted-foreground/60 mt-2">影片限制 50MB，2-15.4 秒</p>
                )}
              </div>
            )}

            {/* Prompt */}
            <div className="mb-6">
              <label className="text-sm font-display font-medium text-foreground mb-3 block">提示詞</label>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={mode === "keyframe"
                    ? "描述你想要生成的影片內容... 例如：Explosion view effect: Objects are suspended..."
                    : "描述你想要生成的影片... 使用 @image1 引用上傳的圖片"
                  }
                  className="w-full h-32 p-4 rounded-xl bg-white/5 border border-border/50 text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:border-neon-purple/50 focus:ring-1 focus:ring-neon-purple/30 transition-all"
                />
                {mode === "smart" && smartFiles.length > 0 && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1">
                    <span className="text-[10px] text-muted-foreground">引用：</span>
                    {smartFiles.map((f, i) => {
                      const label = f.type === "video"
                        ? "video1"
                        : `image${smartFiles.slice(0, i).filter(x => x.type === "image").length + 1}`;
                      return (
                        <button key={i} onClick={() => insertTag(i)}
                          className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] hover:opacity-80 transition-colors ${
                            f.type === "video" ? "bg-neon-pink/10 text-neon-pink" : "bg-neon-cyan/10 text-neon-cyan"
                          }`}>
                          <AtSign className="w-2.5 h-2.5" />
                          {label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-1">
                <button className="text-xs text-neon-purple/60 hover:text-neon-purple flex items-center gap-1 transition-colors">
                  <Sparkles className="w-3 h-3" />
                  優化提示詞
                </button>
              </div>
            </div>

            {/* Duration */}
            <div className="mb-6">
              <label className="text-sm font-display font-medium text-foreground mb-3 block">時長</label>
              <div className="flex gap-2">
                {durations.map((d) => (
                  <button key={d} onClick={() => setDuration(d)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                      duration === d
                        ? "bg-white/10 text-foreground border border-foreground/30"
                        : "bg-white/5 text-muted-foreground hover:text-foreground border border-transparent"
                    }`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="mb-8">
              <label className="text-sm font-display font-medium text-foreground mb-3 block">尺寸</label>
              <div className="flex gap-2">
                {aspectRatios.map((ar) => (
                  <button key={ar.value} onClick={() => setAspectRatio(ar.value)}
                    className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl text-sm transition-all ${
                      aspectRatio === ar.value
                        ? "bg-white/10 text-foreground border border-foreground/30"
                        : "bg-white/5 text-muted-foreground hover:text-foreground border border-transparent"
                    }`}>
                    {ar.icon}
                    <span className="text-xs">{ar.value}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Credits Info */}
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-neon-purple" />
              <span className="text-sm text-foreground">
                所需積分: <span className="font-mono text-neon-yellow">{credits}</span>
              </span>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>

            {/* Generate Button */}
            <button onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-4 rounded-xl bg-gradient-to-r from-neon-purple via-neon-pink to-neon-purple text-white font-display font-semibold text-lg neon-glow transition-all flex items-center justify-center gap-2 ${isGenerating ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"}`}>
              {isGenerating ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> 生成中...</>
              ) : (
                <><Wand2 className="w-5 h-5" /> 創建</>
              )}
            </button>

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
                  <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/50 text-xs text-white">0:{duration.replace("s", "").padStart(2, "0")}</div>
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
