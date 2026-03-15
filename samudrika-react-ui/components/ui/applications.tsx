import { Anchor, ShieldAlert, Cpu, Route } from "lucide-react";

export function Applications() {
  const cards = [
    {
      title: "Marine Research",
      desc: "Observe ecosystems previously hidden by low underwater visibility. Samudrika unlocks unprecedented clarity for biologists and oceanographers.",
      icon: Anchor,
      color: "text-blue-400",
      bgImg: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80"
    },
    {
      title: "Autonomous Submersibles",
      desc: "Improve perception systems in underwater drones and AUVs. Enable robots to 'see' and target missions natively with edge-optimized inferences.",
      icon: Route,
      color: "text-cyan-400",
      bgImg: "https://images.unsplash.com/photo-1682687982501-1e58f813f228?q=80"
    },
    {
      title: "Ocean Infrastructure",
      desc: "Monitor pipelines, cables, and offshore structures with flawless visibility. Identify anomalies instantly before catastrophic failures.",
      icon: Cpu,
      color: "text-purple-400",
      bgImg: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80"
    },
    {
      title: "Defense and Security",
      desc: "Enable complete structural underwater situational awareness for naval and military operations in zero-visibility conditions.",
      icon: ShieldAlert,
      color: "text-red-400",
      bgImg: "https://images.unsplash.com/photo-1682687982501-1e58f813f228?q=80"
    }
  ];

  return (
    <section className="py-32 relative bg-background" id="applications">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">Where Samudrika Operates</h2>
          <p className="text-slate-400 text-lg">Cross-domain deployments beneath the surface.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {cards.map((card, i) => (
            <div key={i} className="group relative h-[350px] rounded-2xl overflow-hidden glass border-slate-800">
               {/* Background Image that reveals on hover */}
               <div className="absolute inset-0 bg-slate-900 transition-opacity duration-700 z-0"></div>
               <div className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-40 transition-opacity duration-700 blur-[2px] group-hover:blur-none mix-blend-luminosity z-0" style={{ backgroundImage: `url(${card.bgImg})` }}></div>
               <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10"></div>
               
               {/* Content */}
               <div className="relative z-20 p-8 h-full flex flex-col justify-end transform transition-transform duration-500">
                 <div className={`p-3 rounded-xl bg-slate-900 border border-slate-800 w-fit mb-4 group-hover:-translate-y-2 transition-transform duration-500 shadow-xl ${card.color}`}>
                   <card.icon className="size-6" />
                 </div>
                 <h3 className="text-2xl font-bold mb-3">{card.title}</h3>
                 <p className="text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">{card.desc}</p>
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
