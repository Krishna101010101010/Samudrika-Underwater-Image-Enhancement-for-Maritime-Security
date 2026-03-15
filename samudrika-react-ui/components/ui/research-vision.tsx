import { Button } from "@/components/ui/button";
import { ArrowRight, FileText } from "lucide-react";

export function ResearchVision() {
  return (
    <>
      <section className="py-32 bg-slate-900" id="research">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex py-1 px-3 rounded-full border border-purple-500/20 bg-purple-500/10 text-xs font-mono text-purple-400 tracking-wider">ACADEMIC FOUNDATION</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Research-Driven <span className="text-gradient">Ocean AI</span></h2>
            <p className="text-xl text-slate-400 leading-relaxed">
              Samudrika builds on the latest advances in underwater computer vision and generative enhancement models. Our methodology is entirely backed by rigorous academic studies and state-of-the-art synthetic networking logic.
            </p>
            <Button size="lg" className="bg-white text-black hover:bg-slate-200 mt-4 font-semibold">
              Read Research Paper <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
          
          <div className="relative w-full h-[400px] glass rounded-3xl p-6 perspective-[1000px]">
             {/* Abstract paper cards simulation */}
             <div className="absolute inset-x-12 top-12 bottom-12 bg-slate-900 border border-slate-700/50 rounded-xl shadow-2xl transform rotate-y-[-10deg] rotate-x-[5deg] p-6 z-20 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-1/3 h-2 bg-slate-800 rounded"></div>
                  <div className="w-2/3 h-4 bg-slate-700 rounded"></div>
                  <div className="w-full h-32 mt-4 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 border-2 border-dashed border-slate-600 rounded flex items-center justify-center opacity-50"><FileText className="text-slate-500 size-8" /></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-full h-2 bg-slate-800 rounded"></div>
                  <div className="w-1/2 h-2 bg-slate-800 rounded"></div>
                </div>
             </div>

             <div className="absolute inset-x-16 top-16 bottom-8 bg-slate-950 border border-slate-800 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] transform rotate-y-[-10deg] rotate-x-[5deg] translate-z-[-50px] translate-x-[20px] opacity-70 z-10 p-6 blur-[1px]"></div>
          </div>
        </div>
      </section>

      <section className="relative py-48 overflow-hidden bg-background flex items-center justify-center text-center">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(6,182,212,0.15),_transparent_70%)] z-0 mix-blend-screen"></div>
         {/* Glowing AI Grid Overlay */}
         <div className="absolute inset-0 z-0" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', perspective: '1000px', transform: 'rotateX(60deg) scale(2.5) translateY(-50px)', opacity: 0.6 }}></div>
         
         <div className="relative z-10 max-w-4xl px-6 space-y-8">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-2xl">The Future of <br/>Ocean Intelligence</h2>
            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              More than 80% of the ocean remains unexplored. Samudrika is building the AI infrastructure required to dynamically observe, understand, and protect the underwater world.
            </p>
         </div>
      </section>
    </>
  );
}
