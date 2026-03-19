/*
 * Design: Cyberpunk Neon - How It Works 步驟說明
 */
import { motion } from "framer-motion";
import { Type, Wand2, Download } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: <Type className="w-7 h-7" />,
    title: "輸入你的創意",
    desc: "輸入文字描述、上傳圖片或影片作為素材。選擇你喜歡的 AI 模型。",
    color: "text-neon-purple",
    borderColor: "border-neon-purple/30",
    glowClass: "neon-glow",
  },
  {
    step: "02",
    icon: <Wand2 className="w-7 h-7" />,
    title: "AI 施展魔法",
    desc: "我們的 AI 引擎將在幾秒鐘內處理你的請求，生成專業級的影片內容。",
    color: "text-neon-cyan",
    borderColor: "border-neon-cyan/30",
    glowClass: "neon-glow-cyan",
  },
  {
    step: "03",
    icon: <Download className="w-7 h-7" />,
    title: "下載 & 分享",
    desc: "預覽你的作品，滿意後即可下載高品質影片，直接分享到社群媒體。",
    color: "text-neon-pink",
    borderColor: "border-neon-pink/30",
    glowClass: "neon-glow-pink",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-purple/3 to-transparent" />
      <div className="container relative">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="font-display font-bold text-3xl md:text-4xl text-center mb-4 text-foreground">
          只需 <span className="gradient-text">3 個步驟</span>
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center text-muted-foreground mb-16 max-w-xl mx-auto">
          從創意到成品，簡單快速的 AI 影片創作流程
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-px bg-gradient-to-r from-neon-purple/30 via-neon-cyan/30 to-neon-pink/30" />

          {steps.map((step, i) => (
            <motion.div key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative text-center"
            >
              <div className={`w-16 h-16 rounded-2xl glass-card ${step.borderColor} flex items-center justify-center mx-auto mb-6 ${step.color} ${step.glowClass}`}>
                {step.icon}
              </div>
              <div className={`font-mono text-xs ${step.color} mb-2`}>STEP {step.step}</div>
              <h3 className="font-display font-semibold text-xl text-foreground mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
