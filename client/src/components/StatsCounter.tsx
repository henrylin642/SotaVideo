/*
 * Design: Cyberpunk Neon - 統計數據展示
 */
import { motion } from "framer-motion";

const stats = [
  { value: "100K+", label: "活躍用戶", color: "text-neon-purple" },
  { value: "4+", label: "AI 模型", color: "text-neon-cyan" },
  { value: "1M+", label: "影片生成", color: "text-neon-pink" },
  { value: "99.9%", label: "服務可用率", color: "text-neon-yellow" },
];

export default function StatsCounter() {
  return (
    <section className="py-16 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/5 via-neon-cyan/5 to-neon-pink/5" />
      <div className="container relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className={`font-display font-bold text-3xl md:text-4xl ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
