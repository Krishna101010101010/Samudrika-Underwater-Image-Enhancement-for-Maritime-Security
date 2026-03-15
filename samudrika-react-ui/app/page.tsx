'use client';

import { motion } from 'framer-motion';
import { Header } from "@/components/ui/header-1";
import { Terminal, Database, ShieldAlert } from "lucide-react";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { 
  TRUSTED_PARTNERS, 
  BENTO_FEATURES, 
  PERFORMANCE_METRICS, 
  FOOTER_LINKS,
  SITE_CONFIG 
} from "@/lib/constants";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black font-sans selection:bg-[#0044ff]/30 text-white">
      <Header />

      <main className="w-full">
        {/* HERO SECTION */}
        <AnimatedHero />

        {/* TRUST SCROLLER */}
        <section className="py-8 border-y border-[#111] bg-[#050505] overflow-hidden whitespace-nowrap">
           <div className="flex gap-16 items-center animate-infinite-scroll w-max px-4 opacity-50 font-mono text-xs uppercase tracking-[0.2em] text-white">
              {[...TRUSTED_PARTNERS, ...TRUSTED_PARTNERS].map((partner, i) => (
                <div key={i} className="flex items-center gap-16">
                  <span>{partner}</span>
                  <div className="w-1 h-1 rounded-full bg-[#333]" />
                </div>
              ))}
           </div>
        </section>

        {/* FEATURES BENTO GRID */}
        <section className="py-32 max-w-[90rem] mx-auto px-6 md:px-16">
           <motion.h2 
             className="text-4xl md:text-5xl font-bold tracking-tighter mb-16"
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
           >
             Intelligence at the Edge.
           </motion.h2>
           
           <div className="grid md:grid-cols-3 gap-6">
             {BENTO_FEATURES.map((feature, i) => (
               <motion.div
                 key={i}
                 className={`liquid-card p-10 flex flex-col justify-between min-h-[350px] ${feature.type === 'large' ? 'md:col-span-2' : ''}`}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1 }}
               >
                 <div>
                   {feature.icon === 'terminal' && <Terminal className="text-[#0044ff] size-6 mb-6" />}
                   {feature.icon === 'database' && <Database className="text-white size-6 mb-6" />}
                   {feature.icon === 'shield' && <ShieldAlert className="text-white size-6 mb-6" />}
                   
                   <h3 className="text-2xl font-bold mb-4 tracking-tight">{feature.title}</h3>
                   <p className="text-[#888] text-base leading-relaxed max-w-sm">{feature.description}</p>
                 </div>

                 {feature.codeSnippet && (
                   <div className="mt-8 bg-black border border-[#111] rounded-xl p-5 font-mono text-[13px] text-[#0044ff] leading-relaxed">
                     {feature.codeSnippet.split('\n').map((line, idx) => (
                       <div key={idx}>{line}</div>
                     ))}
                     <span className="text-[#555] mt-2 block border-t border-[#111] pt-2">{feature.status}</span>
                   </div>
                 )}

                 {feature.stat && (
                   <div className="mt-8">
                     <span className="text-6xl font-bold tracking-tighter text-white">{feature.stat}</span>
                     <span className="block text-xs text-[#555] font-normal uppercase tracking-widest mt-2">{feature.statLabel}</span>
                   </div>
                 )}
               </motion.div>
             ))}
           </div>
        </section>

        {/* PERFORMANCE SECTION */}
        <section className="py-32 border-t border-[#111] bg-[#020202]">
          <div className="max-w-[90rem] mx-auto px-6 md:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Performance Benchmarks.</h2>
              <p className="text-xl text-[#888] mb-16 max-w-2xl font-light">
                Samudrika outperforms standard convolutional approaches in visibility gain and edge efficiency across UIQM datasets.
              </p>
            </motion.div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#111] text-[#555] text-sm uppercase tracking-widest font-medium">
                    <th className="pb-8 font-medium w-1/3">Metric</th>
                    <th className="pb-8 font-medium">Standard CLAHE</th>
                    <th className="pb-8 font-medium">Water-Net</th>
                    <th className="pb-8 font-medium text-white">Samudrika Edge</th>
                  </tr>
                </thead>
                <tbody className="text-lg">
                  {PERFORMANCE_METRICS.map((row, i) => (
                    <tr key={i} className="border-b border-[#111] group transition-colors hover:bg-white/[0.02]">
                      <td className="py-8 font-medium">{row.metric}</td>
                      <td className="py-8 text-[#555] font-mono text-base">{row.clahe}</td>
                      <td className="py-8 text-[#555] font-mono text-base">{row.waternet}</td>
                      <td className={`py-8 font-mono text-base ${row.isPrimary ? 'text-[#0044ff] font-bold' : 'text-white'}`}>
                        {row.samudrika}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* PROPRIETARY SECTION (Extracted to separate block for clarity) */}
        <section className="py-32 max-w-[90rem] mx-auto px-6 md:px-16">
           <div className="liquid-card border border-[#111] p-12 flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1">
                <span className="text-[#0044ff] font-mono text-xs uppercase tracking-[0.3em] mb-4 block">Engine Architecture</span>
                <h3 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Proprietary Vision Foundation Models</h3>
                <p className="text-[#888] text-lg leading-relaxed mb-0">
                  Built on liquid architecture, our neural networks are trained from the ground up on millions of hours of deep-sea telemetry. Samudrika's models dynamically adjust processing power based on local turbidity, enabling 100x efficiency in murky conditions.
                </p>
              </div>
              <div className="w-full lg:w-96 bg-black border border-[#111] rounded-2xl p-8 space-y-4">
                <div className="flex justify-between items-center"><span className="text-[#555] text-sm uppercase font-mono">Parameters</span><span className="text-white font-mono">3.5B (Edge)</span></div>
                <div className="flex justify-between items-center"><span className="text-[#555] text-sm uppercase font-mono">Context</span><span className="text-white font-mono">Dynamic</span></div>
                <div className="flex justify-between items-center"><span className="text-[#555] text-sm uppercase font-mono">Latency</span><span className="text-white font-mono">~22ms on T4</span></div>
                <div className="flex justify-between items-center pt-4 border-t border-[#111]"><span className="text-[#555] text-sm uppercase font-mono">Precision</span><span className="text-[#0044ff] font-mono font-bold">INT8 Quantized</span></div>
              </div>
           </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-[#111] bg-black pt-32 pb-16 px-6 md:px-16">
          <div className="max-w-[90rem] mx-auto">
            <div className="flex flex-col md:flex-row justify-between gap-16 pb-20 border-b border-[#111]">
              <div className="md:max-w-xs">
                <h2 className="text-3xl font-bold tracking-tighter text-white mb-4">{SITE_CONFIG.name}.</h2>
                <p className="text-[#555] text-base leading-relaxed">{SITE_CONFIG.tagline}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
                {Object.entries(FOOTER_LINKS).map(([category, links]) => (
                  <div key={category} className="space-y-6">
                    <h4 className="text-white font-bold text-xs uppercase tracking-widest">{category}</h4>
                    <ul className="space-y-4">
                      {links.map((link, j) => (
                        <li key={j}><a href={link.href} className="text-[#555] hover:text-[#0044ff] transition-all text-sm">{link.label}</a></li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center pt-10 text-xs font-mono text-[#333] uppercase tracking-widest">
              <p>&copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.</p>
              <div className="flex gap-8 mt-6 sm:mt-0">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
