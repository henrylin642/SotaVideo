/*
 * Design: Cyberpunk Neon - 定價頁面
 * 玻璃態卡片，霓虹漸層強調，深色背景
 * 只保留 SotaVideo 方案
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Shield, HeadphonesIcon, CreditCard, Eye, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { useAuth } from "@/contexts/AuthContext";
import { useCredits } from "@/contexts/CreditsContext";
import { toast } from "sonner";

const litvideoPlans = [
  {
    name: "Monthly",
    badge: "Plus",
    badgeColor: "from-neon-purple to-neon-pink",
    planKey: "plus" as const,
    creditsAmount: 600,
    price: "$14.99",
    period: "/月",
    billed: "每月計費 $14.99",
    originalPrice: "$27.98",
    credits: "600 Credits / 月",
    videos: "30 部影片 / 月",
    images: "85 張圖片 / 月",
    popular: false,
    discount: null,
  },
  {
    name: "Lifetime",
    badge: "Full",
    badgeColor: "from-yellow-500 to-orange-500",
    planKey: "full" as const,
    creditsAmount: 2000,
    price: "<$0.01",
    period: "/月",
    billed: "一次性付款 $125.97",
    originalPrice: "$378.92",
    credits: "無限 | 2000 Credits / 月",
    videos: "100 部影片 / 月",
    images: "285 張圖片 / 月",
    popular: true,
    discount: "65% OFF",
  },
  {
    name: "Yearly",
    badge: "Pro",
    badgeColor: "from-neon-cyan to-neon-purple",
    planKey: "pro" as const,
    creditsAmount: 1000,
    price: "$7.50",
    period: "/月",
    billed: "年付 $89.99",
    originalPrice: "$179.99",
    credits: "1000 Credits / 月",
    videos: "50 部影片 / 月",
    images: "142 張圖片 / 月",
    popular: false,
    discount: "50% OFF",
  },
];

const videoModels = ["Seedance 2.0"];
const imageModels = ["Nano Banana", "Flux"];
const features = ["Image to Video", "Text to Video", "Image Generate"];

const faqs = [
  { q: "可以免費試用 SotaVideo 嗎？", a: "可以！我們提供免費試用，讓你體驗我們的 AI 工具。部分功能可能有限制，但你可以充分感受我們的服務。" },
  { q: "可以隨時取消訂閱嗎？", a: "可以，你可以隨時在帳號設定中取消訂閱。你的方案將在當前計費週期結束前保持有效，不會產生額外費用。" },
  { q: "提供退款嗎？", a: "是的，我們提供 30 天退款保證。如果你不滿意，可以在 30 天內申請退款。" },
  { q: "我的資料安全嗎？", a: "絕對安全！我們使用先進的加密和防詐保護來保障你的個人和付款資訊。" },
  { q: "需要安裝軟體嗎？", a: "不需要！SotaVideo 是雲端平台，你可以直接從瀏覽器使用，無需下載。" },
  { q: "如何獲得客服支援？", a: "我們的客服團隊 24/7 全天候提供即時聊天和電子郵件支援，將在 24 小時內回覆你的問題。" },
];

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [buyingPlan, setBuyingPlan] = useState<string | null>(null);
  const { user, signInWithGoogle } = useAuth();
  const { plan: currentPlan, purchasePlan } = useCredits();

  const handleBuy = async (planKey: 'plus' | 'pro' | 'full', creditsAmount: number, planName: string) => {
    if (!user) {
      toast.info("請先登入再購買方案");
      signInWithGoogle();
      return;
    }
    if (currentPlan === 'full') {
      toast.info("你已擁有終身方案，無需再購買");
      return;
    }
    if (currentPlan === planKey) {
      toast.info(`你已經是 ${planName} 方案用戶`);
      return;
    }
    setBuyingPlan(planKey);
    const success = await purchasePlan(planKey, creditsAmount);
    setBuyingPlan(null);
    if (success) {
      toast.success(`🎉 成功購買 ${planName} 方案！已獲得 ${creditsAmount} Credits`);
    } else {
      toast.error("購買失敗，請稍後再試");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-36 pb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-purple/10 to-transparent" />
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="container relative text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="font-display font-bold text-4xl md:text-5xl text-foreground mb-4">
            SotaVideo <span className="gradient-text">Store Center</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto">
            選擇你的方案，無限創作！以靈活的定價方案解鎖 AI 工具的全部潛力。
          </motion.p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24">
        <div className="container">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-center text-foreground mb-12">
            選擇最適合你的 <span className="gradient-text">SotaVideo</span> 方案
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {litvideoPlans.map((plan, i) => (
              <motion.div key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? "glass-card neon-glow border-neon-purple/50"
                    : "glass-card"
                }`}
              >
                {plan.discount && (
                  <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink text-white text-xs font-bold">
                    {plan.discount}
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <h3 className="font-display font-semibold text-lg text-foreground">{plan.name}</h3>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full text-white bg-gradient-to-r ${plan.badgeColor}`}>
                      {plan.badge}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-display font-bold text-4xl text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {plan.billed} <span className="line-through text-muted-foreground/50">{plan.originalPrice}</span>
                  </p>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-neon-cyan shrink-0" />
                    <span className="text-neon-cyan">{plan.credits}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-neon-cyan shrink-0" />
                    <span className="text-foreground/80">最多 <span className="text-neon-cyan">{plan.videos.split(" ")[0]}</span> 部影片 / 月</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-neon-cyan shrink-0" />
                    <span className="text-foreground/80">最多 <span className="text-neon-cyan">{plan.images.split(" ")[0]}</span> 張圖片 / 月</span>
                  </div>
                </div>

                <button
                  onClick={() => handleBuy(plan.planKey, plan.creditsAmount, plan.badge)}
                  disabled={buyingPlan === plan.planKey || currentPlan === plan.planKey || currentPlan === 'full'}
                  className={`w-full py-3 rounded-full font-medium text-sm transition-all ${
                  currentPlan === plan.planKey || (currentPlan === 'full' && plan.planKey !== 'full')
                    ? "bg-white/10 text-foreground/50 cursor-default"
                    : plan.popular
                    ? "bg-gradient-to-r from-neon-purple to-neon-pink text-white neon-glow hover:opacity-90"
                    : "border border-neon-purple/50 text-neon-purple hover:bg-neon-purple/10"
                }`}>
                  {currentPlan === plan.planKey
                    ? "當前方案"
                    : currentPlan === 'full'
                    ? "終身方案"
                    : buyingPlan === plan.planKey
                    ? "處理中..."
                    : "Buy Now"}
                </button>

                {/* Model & Feature details */}
                <div className="mt-6 pt-6 border-t border-border/30">
                  <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-400" /> 解鎖熱門影片模型
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {videoModels.map((m) => (
                      <span key={m} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground">{m}</span>
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-400" /> 解鎖熱門圖片模型
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {imageModels.map((m) => (
                      <span key={m} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground">{m}</span>
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-400" /> 使用所有功能
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {features.map((f) => (
                      <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground">{f}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16">
        <div className="container">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-center text-foreground mb-12">
            我們支援多種<span className="gradient-text">付款方式</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: <CreditCard className="w-6 h-6" />, title: "無憂退款", desc: "享受 30 天退款保證，無需任何理由。" },
              { icon: <Shield className="w-6 h-6" />, title: "頂級安全", desc: "先進加密和防詐保護，保障你的資料和交易安全。" },
              { icon: <HeadphonesIcon className="w-6 h-6" />, title: "24/7 客服", desc: "專業客服團隊全天候提供即時聊天和郵件支援。" },
              { icon: <Eye className="w-6 h-6" />, title: "無隱藏費用", desc: "無額外收費，無意外。定價透明且直接。" },
            ].map((item, i) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-neon-purple/10 flex items-center justify-center mx-auto mb-4 text-neon-purple">
                  {item.icon}
                </div>
                <h4 className="font-display font-semibold text-foreground mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="container max-w-3xl">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-center text-foreground mb-12">
            常見問題
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
                  <span className="font-display font-medium text-foreground pr-4">
                    {i + 1}. {faq.q}
                  </span>
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

      <Footer />
      <FloatingButtons />
    </div>
  );
}
