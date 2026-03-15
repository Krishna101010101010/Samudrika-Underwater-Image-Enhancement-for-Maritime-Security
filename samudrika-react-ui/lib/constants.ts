export const SITE_CONFIG = {
  name: "Samudrika",
  tagline: "Synthesizing clarity from the abyss.",
  hero: {
    welcome: "Welcome to Samudrika — AI for Maritime Vision.",
    headline: "See the ocean as it truly is.",
    subtitle: "Transform underwater imagery into high-fidelity visual intelligence using edge-native generative vision models.",
    cta: {
      primary: "Launch Live Demo",
      secondary: "Explore Documentation",
    },
    operationalTag: "Real-time inference. Edge deployed. Defense grade.",
  },
};

export const TRUSTED_PARTNERS = [
  "Indian Navy",
  "Ocean Vision Lab",
  "NIOT India",
  "Blue Robotics",
  "OceanX",
];

export const BENTO_FEATURES = [
  {
    title: "On-Device Inference",
    description: "Samudrika runs autonomously on embedded GPU clusters. No cloud uplink required. Perfect for deep sea AUVs.",
    type: "large",
    icon: "terminal",
    codeSnippet: "> initializing samudrika-edge_v2.4\n> loading FUnIE-GAN weights... [OK]\n> stream live --port=8080",
    status: "Status: Real-time inference running at 22ms latency.",
  },
  {
    title: "Zero-Shot Restoration",
    description: "Instantly recover color profiles and structural contrast destroyed by oceanic light scattering.",
    type: "stat",
    stat: "+312%",
    statLabel: "Vis-Gain",
    icon: "database",
  },
  {
    title: "Defense Grade",
    description: "Built for operational situational awareness. Identify structures and targets safely in extreme low-visibility zones.",
    type: "standard",
    icon: "shield",
  },
];

export const PERFORMANCE_METRICS = [
  {
    metric: "Color Enhancement Score (UICM)",
    clahe: "0.842",
    waternet: "1.104",
    samudrika: "2.441",
    isPrimary: false,
  },
  {
    metric: "Sharpness Score (UISM)",
    clahe: "1.120",
    waternet: "1.821",
    samudrika: "3.092",
    isPrimary: false,
  },
  {
    metric: "Inference Latency (Nvidia Jetson)",
    clahe: "8ms (CPU)",
    waternet: "145ms",
    samudrika: "18ms",
    isPrimary: true,
  },
];

export const FOOTER_LINKS = {
  models: [
    { label: "Edge Inference", href: "#" },
    { label: "Cloud Pipelines", href: "#" },
    { label: "UIEB Datasets", href: "#" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Research", href: "#" },
    { label: "Careers", href: "#" },
  ],
  connect: [
    { label: "Twitter", href: "#" },
    { label: "GitHub", href: "#" },
    { label: "LinkedIn", href: "#" },
  ],
};
