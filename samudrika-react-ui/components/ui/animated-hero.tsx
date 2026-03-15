'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { CardStackSlider } from '@/components/ui/card-stack-slider';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { GLSLHills } from '@/components/ui/glsl-hills';
import { SITE_CONFIG } from '@/lib/constants';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const AnimatedWord = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  return (
    <motion.span
      variants={wordVariants}
      className="inline-block hover:text-white transition-colors duration-300"
      style={{ textShadow: "0 0 20px transparent" }}
      whileHover={{ textShadow: "0 0 20px rgba(255, 255, 255, 0.3)" }}
    >
      {text}&nbsp;
    </motion.span>
  );
};

export function AnimatedHero() {
  const { welcome, headline, subtitle, cta, operationalTag } = SITE_CONFIG.hero;

  return (
    <section className="relative overflow-hidden w-full bg-black">
      {/* GLSL Hills — Background layer */}
      <GLSLHills />

      <div className="relative z-10 max-w-[90rem] mx-auto px-6 md:px-16 pt-24 pb-10 grid lg:grid-cols-2 gap-12 items-start">
        {/* LEFT: Content */}
        <motion.div 
          className="flex flex-col justify-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Top tagline */}
          <div className="mb-10">
            <p className="text-xs md:text-sm font-mono font-light uppercase tracking-[0.2em] text-[#c8b4a0]/80">
              {welcome.split(" ").map((word, i) => (
                <AnimatedWord key={i} text={word} />
              ))}
            </p>
            <motion.div
              className="mt-4 w-16 h-px bg-gradient-to-right from-[#c8b4a0]/30 to-transparent"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 1 }}
            />
          </div>

          {/* Headline */}
          <div className="text-left max-w-2xl mb-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extralight leading-tight tracking-tight text-white">
              {headline.split(" ").map((word, i) => (
                <AnimatedWord key={i} text={word} />
              ))}
            </h1>
          </div>

          {/* Subtitle */}
          <div className="text-left max-w-2xl">
            <p className="text-xl md:text-2xl lg:text-3xl font-thin leading-relaxed tracking-tight text-[#c8b4a0]">
              {subtitle.split(" ").map((word, i) => (
                <AnimatedWord key={i} text={word} />
              ))}
            </p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.5 }}
          >
            <Button size="lg" className="bg-white text-black hover:bg-gray-200 rounded-full h-14 px-8 text-base font-bold transition-all hover:scale-105 active:scale-95">
              {cta.primary} <Play className="ml-2 size-4 fill-black" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full h-14 px-8 border-[#333] hover:bg-[#111] bg-transparent text-white hover:text-white text-base transition-all hover:border-white/50">
              {cta.secondary}
            </Button>
          </motion.div>

          {/* Bottom Tagline */}
          <div className="mt-12">
            <motion.div
              className="mb-3 w-16 h-px bg-gradient-to-right from-[#c8b4a0]/30 to-transparent"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 3 }}
            />
            <p className="text-xs md:text-sm font-mono font-light uppercase tracking-[0.2em] text-[#c8b4a0]/60">
              {operationalTag.split(" ").map((word, i) => (
                <AnimatedWord key={i} text={word} />
              ))}
            </p>
          </div>
        </motion.div>

        {/* RIGHT: Visual */}
        <motion.div 
          className="flex items-center justify-center lg:sticky lg:top-32"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <CardStackSlider />
        </motion.div>
      </div>
    </section>
  );
}
