'use client';
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Image as ImageIcon, RotateCcw, ActivitySquare, Maximize } from "lucide-react";

export function DemoLab() {
  return (
    <section className="py-32 bg-slate-950/50 border-y border-slate-800 relative z-10" id="demo">
      <div className="max-w-[90rem] mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Interactive Ocean <span className="text-gradient">Vision Lab</span></h2>
          <p className="text-slate-400 text-lg">Experience Samudrika’s marine enhancement models in action.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Column 1: Controls panel */}
          <div className="lg:col-span-3 glass rounded-2xl p-6 space-y-8 flex flex-col h-full border-slate-800/80">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4"><SlidersHorizontal className="size-4 text-cyan-400" /> Controls</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start border-slate-700 bg-slate-900 hover:bg-slate-800 text-white"><ImageIcon className="mr-2 size-4" /> Upload Sample</Button>
                <Button variant="outline" className="w-full justify-start border-slate-700 bg-slate-900 hover:bg-slate-800 text-white"><ImageIcon className="mr-2 size-4 text-slate-500" /> Upload Image</Button>
                <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white"><RotateCcw className="mr-2 size-4" /> Reset Demo</Button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-slate-300">Enhancement Strength</span><span className="text-cyan-400">85%</span></div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-cyan-500 w-[85%]"></div></div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-slate-300">Color Restoration</span><span className="text-cyan-400">92%</span></div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-cyan-500 w-[92%]"></div></div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-slate-300">Contrast Recovery</span><span className="text-cyan-400">100%</span></div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-cyan-500 w-full"></div></div>
              </div>
            </div>

            <div className="space-y-3 mt-auto pt-8">
              <div className="flex items-center justify-between p-3 rounded-lg bg-cyan-900/10 border border-cyan-500/20">
                <span className="text-sm font-medium text-cyan-100">Deep Water Mode</span>
                <div className="w-8 h-4 rounded-full bg-cyan-500 flex items-center px-0.5 justify-end"><div className="size-3 rounded-full bg-white shadow-sm"></div></div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-sm font-medium text-slate-400">Low Light Mode</span>
                <div className="w-8 h-4 rounded-full bg-slate-700 flex items-center px-0.5"><div className="size-3 rounded-full bg-slate-400 shadow-sm"></div></div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-cyan-900/10 border border-cyan-500/20">
                <span className="text-sm font-medium text-cyan-100">Marine Mode</span>
                <div className="w-8 h-4 rounded-full bg-cyan-500 flex items-center px-0.5 justify-end"><div className="size-3 rounded-full bg-white shadow-sm"></div></div>
              </div>
            </div>
          </div>

          {/* Column 2: Large Visual panel */}
          <div className="lg:col-span-6 glass rounded-2xl h-[600px] flex flex-col overflow-hidden group relative border-slate-800/80 p-2">
            <div className="w-full flex justify-between items-center px-4 py-3 bg-slate-900/50 rounded-t-xl absolute top-2 left-2 right-2 z-20 border-b border-white/5 backdrop-blur-md">
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" className="bg-slate-800 hover:bg-slate-700 text-xs px-3 h-7 rounded-sm text-cyan-500">Split View</Button>
                <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white text-xs px-3 h-7 rounded-sm">Overlay</Button>
              </div>
              <Button size="icon" variant="ghost" className="size-7 text-slate-400"><Maximize className="size-4" /></Button>
            </div>
            
            <div className="relative w-full h-full rounded-xl overflow-hidden cursor-ew-resize bg-black mt-12">
               {/* Before */}
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1682687982501-1e58f813f228?q=80')] bg-cover bg-center filter sepia opacity-80 blur-[1px]"></div>
               {/* After */}
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1682687982501-1e58f813f228?q=80')] bg-cover bg-center saturate-[1.3] contrast-[1.2]" style={{ clipPath: 'polygon(65% 0, 100% 0, 100% 100%, 65% 100%)' }}></div>
               
               {/* Slider Line */}
               <div className="absolute top-0 bottom-0 left-[65%] w-0.5 bg-cyan-500 shadow-[0_0_15px_3px_rgba(6,182,212,0.6)] z-10 box-border">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-8 bg-cyan-950 border-2 border-cyan-400 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-4 h-0.5 bg-cyan-400 rotate-90 rounded"></div>
                  </div>
               </div>

               {/* Hover Bounding Box Simulation */}
               <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 bottom-24 right-[15%] w-32 h-24 border-2 border-purple-500 bg-purple-500/10 rounded-sm">
                 <div className="absolute -top-6 left-[-2px] bg-purple-500 text-white text-[10px] font-mono px-2 py-0.5 rounded-t-sm uppercase tracking-wider">Reef Shark 99%</div>
               </div>
            </div>
          </div>

          {/* Column 3: Metrics dashboard */}
          <div className="lg:col-span-3 glass rounded-2xl p-6 border-slate-800/80 space-y-4">
             <h3 className="text-lg font-semibold flex items-center gap-2 mb-6"><ActivitySquare className="size-4 text-cyan-400" /> Live Metrics</h3>
             
             <div className="grid gap-3">
               <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-bl-full filter blur-[10px]"></div>
                 <span className="text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">UIQM Score</span>
                 <div className="flex items-baseline gap-2">
                   <span className="text-slate-500 line-through text-sm font-mono">2.1</span>
                   <span className="text-cyan-400 text-xl md:text-2xl font-bold font-mono">→ 5.8</span>
                 </div>
               </div>

               <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-bl-full filter blur-[10px]"></div>
                 <span className="text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">SSIM</span>
                 <div className="flex items-baseline gap-2">
                   <span className="text-slate-500 line-through text-sm font-mono">0.41</span>
                   <span className="text-blue-400 text-xl md:text-2xl font-bold font-mono">→ 0.91</span>
                 </div>
               </div>

               <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-bl-full filter blur-[10px]"></div>
                 <span className="text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">Color Recovery</span>
                 <span className="text-purple-400 text-xl md:text-2xl font-bold font-mono">+420%</span>
               </div>

               <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-bl-full filter blur-[10px]"></div>
                 <span className="text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">Inference Time</span>
                 <span className="text-green-400 text-xl md:text-2xl font-bold font-mono">21ms</span>
               </div>
             </div>

             <div className="pt-4 mt-4 border-t border-slate-800/50">
                <span className="text-slate-400 text-xs font-mono uppercase tracking-wider mb-4 block">Improvement Delta</span>
                <div className="flex items-end gap-1 h-20">
                  {[30, 45, 25, 60, 85, 55, 75, 90, 100, 85, 95].map((h, i) => (
                    <div key={i} className="flex-1 bg-cyan-500/80 rounded-t-sm" style={{ height: `${h}%`, opacity: 0.3 + (i/15) }}></div>
                  ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
