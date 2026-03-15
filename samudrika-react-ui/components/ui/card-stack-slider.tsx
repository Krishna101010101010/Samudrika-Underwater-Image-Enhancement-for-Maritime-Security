'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, Zap, Cpu } from 'lucide-react';

export function CardStackSlider() {
  const [activeTab, setActiveTab] = useState('raw');
  const [sliderPos, setSliderPos] = useState(60);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDrag = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (!containerRef.current) return;
    
    let clientX = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent | MouseEvent).clientX;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPos(percentage);
  };

  useEffect(() => {
    const handleMouseUp = () => document.removeEventListener('mousemove', handleDrag);
    const handleTouchEnd = () => document.removeEventListener('touchmove', handleDrag);

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const tabs = [
    { id: 'raw', label: '01 Raw' },
    { id: 'enhancement', label: '02 Enhancement' },
    { id: 'metrics', label: '03 Metrics' }
  ];

  // Auto-cycle logic
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        const currentIndex = tabs.findIndex(tab => tab.id === prev);
        const nextIndex = (currentIndex + 1) % tabs.length;
        return tabs[nextIndex].id;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [activeTab]); // Reset interval whenever activeTab changes to ensure 4s gap between swaps

  return (
    <div className="relative h-[480px] w-full max-w-xl mx-auto perspective-[1000px] mt-12 lg:mt-0">
      {/* Tab Navigation */}
      <div className="flex gap-8 mb-6 px-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-sm font-semibold transition-all duration-300 relative pb-1 ${
              activeTab === tab.id ? 'text-white' : 'text-[#555] hover:text-[#888]'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTabLine"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.6)]"
              />
            )}
          </button>
        ))}
      </div>
      
      <div className="relative w-full h-[400px]">
        {/* Decorative Background Cards */}
        <div className="absolute inset-0 bg-[#0a0a0a] border border-[#222]/50 rounded-3xl translate-y-10 scale-[0.9] opacity-40"></div>
        <div className="absolute inset-0 bg-[#0c0c0c] border border-[#222]/50 rounded-3xl translate-y-5 scale-[0.95] opacity-70"></div>
        
        {/* Main Card */}
        <div className="absolute inset-0 bg-[#050505] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col z-10 overflow-hidden backdrop-blur-sm">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
            <div className="flex gap-2">
              <div className="size-2.5 rounded-full bg-[#222] border border-white/10"></div>
              <div className="size-2.5 rounded-full bg-[#222] border border-white/10"></div>
              <div className="size-2.5 rounded-full bg-[#222] border border-white/10"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-[10px] font-mono text-[#666] uppercase tracking-[0.2em]">Real-time Inference</span>
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            {activeTab === 'raw' && (
              <motion.div 
                key="raw"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative flex-1 rounded-xl overflow-hidden"
              >
                <div 
                  ref={containerRef}
                  className="relative w-full h-full bg-black cursor-ew-resize border border-white/5 group"
                  onMouseDown={(e) => {
                    handleDrag(e);
                    document.addEventListener('mousemove', handleDrag);
                  }}
                  onTouchStart={(e) => {
                    handleDrag(e);
                    document.addEventListener('touchmove', handleDrag, { passive: false });
                  }}
                >
                  {/* Before Img */}
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80')] bg-cover bg-center filter grayscale opacity-60"></div>
                  
                  {/* After Img */}
                  <div 
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80')] bg-cover bg-center brightness-110 saturate-[1.5] contrast-125" 
                    style={{ clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)` }}
                  ></div>
                  
                  {/* Slider Handle */}
                  <div 
                    className="absolute top-0 bottom-0 w-px bg-blue-500/50 shadow-[0_0_15px_rgba(0,68,255,0.8)] z-10"
                    style={{ left: `${sliderPos}%` }}
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-4 bg-blue-600 rounded-full border-2 border-white shadow-[0_0_20px_rgba(0,68,255,1)] group-hover:scale-125 transition-transform" />
                  </div>
                  
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded border border-white/10 text-[10px] font-mono uppercase tracking-wider">Deep Sea Distortions</div>
                  <div className="absolute bottom-4 right-4 bg-blue-600/80 backdrop-blur-md px-3 py-1.5 rounded border border-white/20 text-[10px] font-mono uppercase tracking-wider text-white">Samudrika Enhanced</div>
                </div>
              </motion.div>
            )}

            {activeTab === 'enhancement' && (
              <motion.div 
                key="enhancement"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative flex-1 bg-black rounded-xl overflow-hidden border border-white/5"
              >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80')] bg-cover bg-center brightness-110 saturate-[1.2] opacity-90"></div>
                
                {/* AI Overlay Layer */}
                <div className="absolute inset-0 pointer-events-none">
                  <motion.div 
                    className="absolute top-1/4 left-1/4 w-32 h-32 border border-blue-500/50 rounded-lg"
                    initial={{ opacity: 0 }} animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <div className="absolute top-0 left-0 size-2 border-t border-l border-blue-400" />
                    <div className="text-[8px] font-mono text-blue-400 mt-2 ml-2">OBJECT_IDENTIFIED [98.4%]</div>
                  </motion.div>
                  
                  {/* Scanning Scanner Effect */}
                  <motion.div 
                    className="absolute left-0 right-0 h-2 bg-gradient-to-b from-blue-500/20 to-transparent border-t border-blue-400/50"
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'metrics' && (
              <motion.div 
                key="metrics"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative flex-1 bg-[#020202] rounded-xl overflow-hidden border border-white/5 p-4 grid grid-cols-2 gap-4"
              >
                {[
                  { label: 'Inference Speed', value: '12ms', icon: Zap, color: 'text-yellow-400' },
                  { label: 'Restoration Conf', value: '99.2%', icon: ShieldCheck, color: 'text-green-400' },
                  { label: 'Edge FPS', value: '120.4', icon: Activity, color: 'text-blue-400' },
                  { label: 'Neural Load', value: '14.2%', icon: Cpu, color: 'text-purple-400' }
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 rounded-lg p-3 flex flex-col justify-between">
                    <item.icon className={`size-4 ${item.color} mb-2`} />
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[#666] font-mono">{item.label}</div>
                      <div className="text-xl font-mono text-white mt-1">{item.value}</div>
                    </div>
                  </div>
                ))}
                
                {/* Small Graph Mockup */}
                <div className="col-span-2 bg-white/5 border border-white/5 rounded-lg p-3 mt-auto h-20">
                  <div className="text-[10px] uppercase tracking-wider text-[#666] font-mono mb-2">Confidence Delta</div>
                  <div className="flex items-end gap-1 h-8">
                    {[40, 70, 45, 90, 65, 80, 50, 95, 85, 99].map((h, i) => (
                      <motion.div 
                        key={i} 
                        className="flex-1 bg-blue-600/40 rounded-t-sm" 
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

